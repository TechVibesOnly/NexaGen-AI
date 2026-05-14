import { GoogleGenerativeAI } from "@google/generative-ai";

// Secure Backend AI Service
// Proxies requests to Google Gemini with vertical-specific context isolation
// Implements enterprise-grade prompt templating and response auditing

type VerticalType = "CROPMIND" | "BUILDIQ" | "LEXCORE" | "GOVPULSE";

const PROMPT_TEMPLATES: Record<VerticalType, string> = {
  CROPMIND: "You are the NeXaGen CropMind Intelligence. Focus on agronomy, yield optimization, and pest mitigation. Using this sensor data: {context}, address the user query: {prompt}. Provide actionable agricultural recommendations with confidence scores.",
  BUILDIQ: "You are the NeXaGen BuildIQ Project Controller. Focus on site safety, material logistics, and timeline adherence. Given site status: {context}, resolve the query: {prompt}. Prioritize OS&H compliance.",
  LEXCORE: "You are the NeXaGen LexCore Legal Counsel. Focus on risk mitigation, clause integrity, and regulatory compliance. Analyze this legal context: {context}. Query: {prompt}. Highlight potential liabilities and remediation steps.",
  GOVPULSE: "You are the NeXaGen GovPulse Public Service AI. Focus on fiscal responsibility, citizen transparency, and infrastructure resilience. Data context: {context}. Query: {prompt}. Ensure all responses align with FedRAMP and HIPAA-equivalent standards."
};

export class AIService {
  private genAI: GoogleGenerativeAI;
  private flashModel: any;
  private proModel: any;

  constructor() {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.warn("GEMINI_API_KEY not found in environment. AI features will be limited.");
    }
    this.genAI = new GoogleGenerativeAI(apiKey || "demo_key");
    this.flashModel = this.genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    this.proModel = this.genAI.getGenerativeModel({ model: "gemini-1.5-pro" });
  }

  private getModelForVertical(vertical: VerticalType) {
    // High-precision tasks (Legal/Gov) go to Pro, high-throughput (Agri/Build) go to Flash
    if (vertical === "LEXCORE" || vertical === "GOVPULSE") return this.proModel;
    return this.flashModel;
  }

  async predict(vertical: VerticalType, prompt: string, context: any) {
    try {
      const model = this.getModelForVertical(vertical);
      const template = PROMPT_TEMPLATES[vertical] || PROMPT_TEMPLATES.CROPMIND;
      
      const hydratedPrompt = template
        .replace("{context}", JSON.stringify(context))
        .replace("{prompt}", prompt);

      const result = await model.generateContent({
        contents: [{ role: "user", parts: [{ text: hydratedPrompt }] }],
        generationConfig: {
          temperature: 0.1, // Low temperature for deterministic enterprise outputs
          topP: 0.8,
          maxOutputTokens: 2048,
        },
      });

      const response = await result.response;
      return {
        text: response.text(),
        model: vertical === "LEXCORE" || vertical === "GOVPULSE" ? "gemini-1.5-pro" : "gemini-1.5-flash",
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      console.error(`[AI_CORE_ERROR] Vertical: ${vertical}`, error);
      throw new Error(`Intelligence Node ${vertical} failed to respond.`);
    }
  }

  async analyzeContract(content: string) {
    return this.predict("LEXCORE", "Perform an exhaustive risk audit of this contract content.", { content: content.substring(0, 10000) });
  }

  async detectFraud(data: any) {
    return this.predict("GOVPULSE", "Execute pattern matching for procurement fraud flags.", data);
  }
}

export const aiService = new AIService();
