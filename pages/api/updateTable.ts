
import { PrismaClient } from '@prisma/client'
import type { NextApiRequest, NextApiResponse } from 'next'


type Data = {
  name: string
}
    
const prisma = new PrismaClient()

// async function ExecuteSp<T>(procName:string):Promise<T> {

//     const rawSQL = `exec proc  sync_+${procName}`;
//     const result:T = await prisma.$executeRaw(rawSQL);

//     return new Promise((resolve,reject)=>{
//      if(result){
//         resolve(result)
//      }

//      reject();
//     });
    
// }

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
        
const prisma = new PrismaClient()
    const rawSQL = `sync_AssetMapping`;
    const result = await prisma.$executeRaw`${rawSQL}`;

const data = await prisma.assetMapping.findMany()
console.log(data)
  res.status(200).json({ name: 'John Doe' })
}