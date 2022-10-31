// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { PrismaClient, Receipts } from '@prisma/client'
import type { NextApiRequest, NextApiResponse } from 'next'

type Data = {
  data: Receipts[]
}|{err:string}
const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
try{
  const data = await prisma.receipts.findMany();
  res.status(200).json({data})
} catch(err){
   console.log(err);
  res.status(403).json({ err: "Error occured." }); 
}

}



// try {
//   const result = await prisma.foods.findMany();
//   res.status(200).json(result);
// } catch (err) {
//   console.log(err);
//   res.status(403).json({ err: "Error occured." });
// }
