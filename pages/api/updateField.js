import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export default async function handler(req, res) {
  if (req.method !== 'PATCH') return res.status(405).end();
  const { id, field, value } = req.body;
  await prisma.deal.update({ where: { id }, data: { [field]: value } });
  res.json({ ok: true });
}
