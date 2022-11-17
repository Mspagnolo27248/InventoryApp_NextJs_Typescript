// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { PrismaClient, Receipts } from '@prisma/client'
import type { NextApiRequest, NextApiResponse } from 'next'
import { requestToBodyStream } from 'next/dist/server/body-streams';

type Data = {
}


export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {

const prisma = new PrismaClient();

if(req.method==='POST'){
  const body= JSON.parse(req.body);
  const output= await prisma.receipts.update({
    where:{id:body.id},
    data:{
     
      GlAccount :body.GlAccount,   
      Journal : body.Journal, 
      CD :body.CD,
      Amount:+body.Amount,     
      Date :+body.Date,       
      ReceiptValue : +body.ReceiptValue,
      TGDesc  :body.TGDesc,
      QtyClean :+body.QtyClean,  
      ReceiptQty : +body.ReceiptQty 
    },
  });
  res.status(200).json(output)
}else{
  try{
    const data = await prisma.receipts.findMany();
    res.status(200).json(data)
  } catch(err){
     console.log(err);
    res.status(403).json({ err: "Error occured." }); 
  }
  
}

}



// try {
//   const result = await prisma.foods.findMany();
//   res.status(200).json(result);
// } catch (err) {
//   console.log(err);
//   res.status(403).json({ err: "Error occured." });
// }
