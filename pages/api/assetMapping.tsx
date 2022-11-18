// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { AssetMapping, prisma, PrismaClient } from '@prisma/client'
import type { NextApiRequest, NextApiResponse } from 'next'

type Data = {
 
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const prisma = new PrismaClient();


  if(req.method==='POST'){
    const body:AssetMapping= JSON.parse(req.body);
  
    const output = await prisma.assetMapping.update({
    where: { ItemCode:body.ItemCode},
    data: {
   
      GL:body.GL,
      Desc:body.Desc,
      GLAccount:body.GLAccount,
      Part:body.Part,
      StandardCost:+body.StandardCost!},
    });
    res.status(200).json({success:true})
  }
  else{
    const assetMap = await prisma.assetMapping.findMany();
    res.status(200).json(assetMap)
  }
  
 
}
