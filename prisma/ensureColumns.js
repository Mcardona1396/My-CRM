import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function ensureColumns() {
  const cols = [
    'contact   TEXT',
    'email     TEXT',
    'accounts  TEXT',
    'phone     TEXT',
    'type      TEXT',
    'location  TEXT',
    'priority  TEXT',
    'comments  TEXT'
  ];
  for (const c of cols) {
    const [name, type] = c.split(/\s+/);
    try {
      await prisma.$executeRawUnsafe(`ALTER TABLE "Deal" ADD COLUMN IF NOT EXISTS "${name}" ${type};`);
    } catch (e) {
      // column already exists → ignore
    }
  }
  await prisma.$disconnect();
}

ensureColumns();
