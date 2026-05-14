import { PrismaClient, UserRole, Vertical } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('--- Initializing NeXaGen AI Seed Data ---');

  // 1. Create Organizations
  const orgs = await Promise.all([
    prisma.organization.upsert({
      where: { id: 'org_crop' },
      update: {},
      create: { id: 'org_crop', name: 'AgroScale Systems', vertical: Vertical.CROPMIND }
    }),
    prisma.organization.upsert({
      where: { id: 'org_build' },
      update: {},
      create: { id: 'org_build', name: 'BuildStream Global', vertical: Vertical.BUILDIQ }
    }),
    prisma.organization.upsert({
      where: { id: 'org_legal' },
      update: {},
      create: { id: 'org_legal', name: 'Lexis Partners', vertical: Vertical.LEXCORE }
    }),
    prisma.organization.upsert({
      where: { id: 'org_gov' },
      update: {},
      create: { id: 'org_gov', name: 'City Infra Council', vertical: Vertical.GOVPULSE }
    })
  ]);

  // 2. Create Admin Users
  const passwordHash = await bcrypt.hash('enterprise2026', 10);

  await prisma.user.upsert({
    where: { email: 'admin@nexagen.ai' },
    update: {},
    create: {
      email: 'admin@nexagen.ai',
      passwordHash,
      firstName: 'Admin',
      lastName: 'User',
      role: UserRole.ADMIN,
      organizationId: 'org_crop'
    }
  });

  console.log('Seed completed successfully.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
