import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function ensureColumns() {
  const cols = ['contact','email','accounts','phone','type','location','priority','comments'];
  for (const c of cols) {
    try{await prisma.$executeRawUnsafe(`ALTER TABLE "Deal" ADD COLUMN IF NOT EXISTS "${c}" TEXT;`)}catch(e){}
  }
  await prisma.$disconnect();
}
ensureColumns();
