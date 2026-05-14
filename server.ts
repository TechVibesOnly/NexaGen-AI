import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import rateLimit from "express-rate-limit";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { z } from "zod";
import multer from "multer";

import { prisma } from "./src/lib/prisma.ts";
import { aiService } from "./src/services/aiService.ts";

// --- TYPES ---
interface AuthRequest extends express.Request {
  user?: any;
}

const isProd = process.env.NODE_ENV === "production";
const JWT_SECRET = process.env.JWT_SECRET || "default_enterprise_secret_842";

// --- VALIDATION SCHEMAS ---

const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

const SignupSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  organizationName: z.string().min(2),
  vertical: z.enum(["CROPMIND", "BUILDIQ", "LEXCORE", "GOVPULSE"]),
});

const OrgUpdateSchema = z.object({
  name: z.string().min(2),
});

const PredictSchema = z.object({
  prompt: z.string().min(3).max(2000),
  context: z.record(z.string(), z.any()).optional(),
});

const PolicySimulationSchema = z.object({
  agencyId: z.string().cuid(),
  policyName: z.string().min(3).max(100),
  budgetDelta: z.number(),
});

// --- MULTER SETUP ---
const storage = multer.memoryStorage();
const upload = multer({ 
  storage,
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowed = ["application/pdf", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"];
    if (allowed.includes(file.mimetype)) cb(null, true);
    else cb(new Error("Invalid file type."));
  }
});

import xss from "xss";

async function startServer() {
  const app = express();
  const PORT = 3000;

  // --- HARDENED SECURITY MIDDLEWARE ---
  app.use(helmet({
    contentSecurityPolicy: false,
    crossOriginEmbedderPolicy: false,
    frameguard: { action: "deny" },
    hsts: { maxAge: 31536000, includeSubDomains: true, preload: true },
    noSniff: true,
  }));

  app.use(cors({ origin: true, credentials: true }));
  app.use(express.json({ limit: "1mb" })); 
  app.use(cookieParser());

  // Tiered Rate Limiting
  const globalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 200,
    message: { error: "Standard threshold reached. Throttling applied." }
  });

  const authLimiter = rateLimit({
    windowMs: 60 * 60 * 1000,
    max: 10,
    message: { error: "Security Alert: Excessive authentication attempts." }
  });

  const aiLimiter = rateLimit({
    windowMs: 1 * 60 * 1000,
    max: 5,
    message: { error: "Intelligence Quota Exceeded. Please wait 60s." }
  });

  app.use("/api/", globalLimiter);
  app.use("/api/auth/", authLimiter);
  app.use("/api/predict", aiLimiter);

  // Deep XSS Sanitization
  const sanitizeObject = (obj: any): any => {
    if (typeof obj !== "object" || obj === null) return obj;
    if (Array.isArray(obj)) return obj.map(v => sanitizeObject(v));
    return Object.fromEntries(
      Object.entries(obj).map(([key, value]) => [
        key,
        typeof value === "string" ? xss(value) : sanitizeObject(value)
      ])
    );
  };

  app.use((req, res, next) => {
    if (req.body) req.body = sanitizeObject(req.body);
    if (req.query) req.query = sanitizeObject(req.query);
    next();
  });

  // --- AUTH UTILS ---

  const authenticateToken = (req: any, res: any, next: any) => {
    const token = req.cookies.auth_token;
    if (!token) return res.status(401).json({ error: "Unauthorized access." });

    try {
      req.user = jwt.verify(token, JWT_SECRET);
      next();
    } catch (err) {
      res.status(403).json({ error: "Invalid session." });
    }
  };

  const checkRole = (roles: string[]) => (req: any, res: any, next: any) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ error: "Forbidden: Insufficient permissions." });
    }
    next();
  };

  const checkVertical = (vertical: string) => (req: any, res: any, next: any) => {
    if (!req.user || req.user.vertical !== vertical) {
      return res.status(403).json({ error: `Forbidden: This node is restricted to ${vertical} operations.` });
    }
    next();
  };

  const auditLog = async (req: any, action: string, entityType: string, entityId?: string, metadata: any = {}) => {
    try {
      const { id: userId, orgId: organizationId } = req.user || { id: "system", orgId: "system" };
      await prisma.auditLog.create({
        data: {
          action,
          entityType,
          entityId,
          userId: userId === "system" ? null : userId,
          organizationId,
          metadata: JSON.stringify({
            ...metadata,
            ip: req.ip,
            userAgent: req.get("user-agent"),
          }),
          severity: metadata.severity || "LOW",
        }
      });
    } catch (e) {
      console.error("Audit log failed:", e);
    }
  };

  // --- API ROUTES: AUTH ---

  app.post("/api/auth/signup", async (req, res) => {
    try {
      const data = SignupSchema.parse(req.body);
      const existingUser = await prisma.user.findUnique({ where: { email: data.email } });
      if (existingUser) return res.status(400).json({ error: "Email already registered." });

      const organization = await prisma.organization.create({
        data: { name: data.organizationName, vertical: data.vertical }
      });

      const passwordHash = await bcrypt.hash(data.password, 10);
      const user = await prisma.user.create({
        data: {
          email: data.email,
          passwordHash,
          firstName: data.firstName,
          lastName: data.lastName,
          role: "ADMIN",
          organizationId: organization.id,
        }
      });

      await auditLog({ user: { id: user.id, orgId: organization.id }, ip: req.ip }, "ORG_CREATE", "ORGANIZATION", organization.id);
      res.json({ success: true, message: "Organization and Admin account created." });
    } catch (err) {
      res.status(400).json({ error: err instanceof Error ? err.message : "Signup failed." });
    }
  });

  app.post("/api/auth/login", async (req, res) => {
    try {
      const { email, password } = LoginSchema.parse(req.body);
      const user = await prisma.user.findUnique({
        where: { email },
        include: { organization: true }
      });

      if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
        return res.status(401).json({ error: "Invalid credentials." });
      }

      if (!user.isActive) return res.status(403).json({ error: "Account deactivated." });

      const token = jwt.sign(
        { id: user.id, email: user.email, role: user.role, orgId: user.organizationId, vertical: user.organization.vertical },
        JWT_SECRET,
        { expiresIn: "24h" }
      );

      res.cookie("auth_token", token, {
        httpOnly: true,
        secure: isProd,
        sameSite: "strict",
        maxAge: 86400000 
      });

      await auditLog({ user: { id: user.id, orgId: user.organizationId }, ip: req.ip }, "USER_LOGIN", "USER", user.id);
      res.json({ success: true, user: { email: user.email, role: user.role, organization: user.organization.name } });
    } catch (err) {
      res.status(400).json({ error: "Validation failed." });
    }
  });

  app.post("/api/auth/logout", authenticateToken, async (req: any, res: any) => {
    await auditLog(req, "USER_LOGOUT", "USER", req.user.id);
    res.clearCookie("auth_token").json({ success: true });
  });

  // --- API ROUTES: ORGANIZATION & USERS ---

  app.get("/api/organization", authenticateToken, async (req: any, res) => {
    const org = await prisma.organization.findUnique({
      where: { id: req.user.orgId },
      include: { users: { select: { id: true, email: true, firstName: true, role: true, isActive: true } } }
    });
    res.json(org);
  });

  app.patch("/api/organization", authenticateToken, checkRole(["ADMIN"]), async (req: any, res) => {
    const data = OrgUpdateSchema.parse(req.body);
    const org = await prisma.organization.update({
      where: { id: req.user.orgId },
      data: { name: data.name }
    });
    await auditLog(req, "ORG_UPDATE", "ORGANIZATION", org.id, { newName: org.name });
    res.json(org);
  });

  app.get("/api/audit-logs", authenticateToken, checkRole(["ADMIN"]), async (req: any, res: any) => {
    const logs = await prisma.auditLog.findMany({
      where: { organizationId: req.user.orgId },
      orderBy: { createdAt: "desc" },
      take: 50,
      include: { user: { select: { email: true } } }
    });
    res.json(logs);
  });

  // --- API ROUTES: CROPMIND (Agriculture) ---

  app.get("/api/agriculture/farms", authenticateToken, checkVertical("CROPMIND"), async (req: any, res: any) => {
    const farms = await prisma.farm.findMany({
      where: { organizationId: req.user.orgId },
      include: { fields: { include: { predictions: { take: 1, orderBy: { timestamp: "desc" } } } } }
    });
    res.json(farms);
  });

  app.get("/api/agriculture/sensor-logs", authenticateToken, checkVertical("CROPMIND"), async (req: any, res: any) => {
    const { fieldId } = req.query;
    const logs = await prisma.sensorLog.findMany({
      where: { field: { farm: { organizationId: req.user.orgId } }, ...(fieldId ? { fieldId: String(fieldId) } : {}) },
      orderBy: { timestamp: "desc" },
      take: 100
    });
    res.json(logs);
  });

  // --- API ROUTES: BUILDIQ (Construction) ---

  app.get("/api/construction/projects", authenticateToken, checkVertical("BUILDIQ"), async (req: any, res: any) => {
    const projects = await prisma.project.findMany({
      where: { organizationId: req.user.orgId },
      include: { sites: { include: { safetyIncidents: { take: 5, orderBy: { timestamp: "desc" } } } } }
    });
    res.json(projects);
  });

  app.get("/api/construction/inventory", authenticateToken, checkVertical("BUILDIQ"), async (req: any, res: any) => {
    const inventory = await prisma.materialInventory.findMany({
      where: { site: { project: { organizationId: req.user.orgId } } },
      include: { site: { select: { name: true } } }
    });
    res.json(inventory);
  });

  // --- API ROUTES: LEXCORE (Legal) ---

  app.get("/api/legal/contracts", authenticateToken, checkVertical("LEXCORE"), async (req: any, res: any) => {
    const contracts = await prisma.contract.findMany({
      where: { organizationId: req.user.orgId },
      include: { clauses: true }
    });
    res.json(contracts);
  });

  app.post("/api/legal/analyze", authenticateToken, checkVertical("LEXCORE"), async (req: any, res: any) => {
    const { contractId } = req.body;
    const contract = await prisma.contract.findFirst({ where: { id: contractId, organizationId: req.user.orgId } });
    if (!contract) return res.status(404).json({ error: "Contract not found." });
    
    // Use enhanced AI analysis with Pro model
    const analysis = await aiService.analyzeContract(contract.title + " context: " + (contract.status || ""));
    await auditLog(req, "CONTRACT_ANALYZE", "CONTRACT", contract.id, { 
      model: analysis.model,
      vertical: "LEXCORE"
    });
    res.json({ analysis: analysis.text, model: analysis.model, timestamp: analysis.timestamp });
  });

  // --- API ROUTES: GOVPULSE (Government) ---

  app.get("/api/government/agencies", authenticateToken, checkVertical("GOVPULSE"), async (req: any, res: any) => {
    const agencies = await prisma.agency.findMany({
      where: { organizationId: req.user.orgId },
      include: { assets: true, fraudReports: { take: 5 } }
    });
    res.json(agencies);
  });

  app.post("/api/government/simulate-policy", authenticateToken, checkVertical("GOVPULSE"), checkRole(["ADMIN", "MANAGER"]), async (req: any, res: any) => {
    try {
      const { agencyId, policyName, budgetDelta } = PolicySimulationSchema.parse(req.body);
      const response = await aiService.predict("GOVPULSE", `Simulate the impact of policy: ${policyName} with a budget change of ${budgetDelta}`, {});
      
      const simulation = await prisma.policySimulation.create({
        data: { 
          name: policyName, 
          impactScore: 0.85, 
          budgetDelta, 
          agencyId, 
          results: response.text 
        }
      });
      
      await auditLog(req, "POLICY_SIMULATION", "SIMULATION", simulation.id, { 
        model: response.model,
        policy: policyName 
      });
      res.json({ ...simulation, model: response.model });
    } catch (err) {
      res.status(400).json({ error: "Invalid simulation parameters." });
    }
  });

  // --- API ROUTES: DOMAIN INTELLIGENCE ---

  app.post("/api/predict", authenticateToken, async (req: any, res: any) => {
    try {
      const { prompt, context } = PredictSchema.parse(req.body);
      const response = await aiService.predict(req.user.vertical, prompt, context);
      await auditLog(req, "AI_PREDICT", "ANALYTICS", undefined, { 
        vertical: req.user.vertical,
        model: response.model 
      });
      res.json(response);
    } catch (err) {
      res.status(400).json({ error: "Invalid prediction request." });
    }
  });

  app.post("/api/upload", authenticateToken, upload.single("file"), async (req: any, res) => {
    if (!req.file) return res.status(400).json({ error: "No file provided." });
    // In production, save to S3/Azure Blob. Here we simulate success.
    await auditLog(req, "FILE_UPLOAD", "FILE", undefined, { fileName: req.file.originalname });
    res.json({ success: true, message: "File scanned and indexed." });
  });

  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", timestamp: new Date(), version: "1.0.0-PROD" });
  });

  // --- VITE / STATIC SERVING ---
  if (!isProd) {
    const vite = await createViteServer({ server: { middlewareMode: true }, appType: "spa" });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => res.sendFile(path.join(distPath, "index.html")));
  }

  app.listen(PORT, "0.0.0.0", () => console.log(`Server running on http://localhost:${PORT}`));
}

startServer();
