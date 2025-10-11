import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();
  const { company, title, value, closeDate } = req.body;
  const deal = await prisma.deal.create({
    data: {
      company,
      title,
      value: Number(value),
      stage: 'Lead',
      closeDate: new Date(closeDate),
    },
  });
  res.json(deal);
}
