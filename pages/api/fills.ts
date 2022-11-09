
import { PrismaClient } from '@prisma/client'
import type { NextApiRequest, NextApiResponse } from 'next'

type body = {
 
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<body>
) {
    const prisma = new PrismaClient();
   
    if (req.method === 'POST') {
        const body= JSON.parse(req.body);
       const output = await prisma.fills.update({
        where: { id:body.id},
        data: {
          
            Code:body.Code,
            ContainerProduct:body.ContainerProduct,
            ContainerDesc:body.ContainerDesc,
            GroupCode:body.GroupCode,
            Key:body.Key,
            Product:body.Product,
            ProductDesc:body.ProductDesc,
            FillBottles:+body.FillBottles,
            FillCases:+body.FillCases,
            FillQty:+body.FillQty,
            QtyOrBottle:+body.QtyOrBottle },
      });
      res.status(200).json(output)
  
      } else {
        const assetMap = await prisma.assetMapping.findMany();
        res.status(200).json(assetMap)
      }

 
}
