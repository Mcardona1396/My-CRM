import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export default async function handler(req, res) {
  const deals = await prisma.deal.findMany();
  res.json(deals);
}
