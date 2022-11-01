// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { prisma, PrismaClient } from '@prisma/client'
import type { NextApiRequest, NextApiResponse } from 'next'

type Data = {
 
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {

    const prisma = new PrismaClient();
    const assetMap = await prisma.assetMapping.findMany();
     res.status(200).json(assetMap)
}
