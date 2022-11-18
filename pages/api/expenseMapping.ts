// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { PrismaClient } from '@prisma/client'
import type { NextApiRequest, NextApiResponse } from 'next'

type Data = {

}
const prisma = new PrismaClient();
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {

if(req.method==='POST'){
  const body= JSON.parse(req.body);

  const output = await prisma.expenseMapping.update({
  where: { ProductKey:body.ProductKey},
  data: { ExpenseGl: body.ExpenseGl },
  });
  res.status(200).json({success:true})
}
else{
   const expenseMappings = await   prisma.expenseMapping.findMany();
   res.status(200).json(expenseMappings)
}


    
}
