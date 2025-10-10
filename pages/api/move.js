import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();
  const { id, stage } = req.body;
  await prisma.deal.update({ where: { id }, data: { stage } });
  res.json({ ok: true });
}
