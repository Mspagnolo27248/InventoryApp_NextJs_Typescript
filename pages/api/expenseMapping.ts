// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { PrismaClient } from '@prisma/client'
import type { NextApiRequest, NextApiResponse } from 'next'

type Data = {
  success: boolean
}
const prisma = new PrismaClient();
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const body= JSON.parse(req.body);

   const output = await prisma.expenseMapping.update({
        where: { ProductKey:body.ProductKey},
        data: { ExpenseGl: body.ExpenseGl },
      });
  
    res.status(200).json({success:true})
}
