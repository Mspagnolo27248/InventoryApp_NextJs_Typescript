import type { NextApiRequest, NextApiResponse } from 'next'
import { ItemModel, PrismaClient } from '@prisma/client'
import { Item } from '../../containerModel/Models/Item';
import { ExpenseDetail } from '../../containerModel/Models/ExpenseItem';


type Data = {

}

const prisma = new PrismaClient()

 export default  async  function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>) {

//Query Current Month Models and Add to Context


 const itemModel = await   prisma.itemModel.findMany();
 const expenseDetail = await prisma.expenseDetail.findMany();
const itemMap = itemModel.map((data)=>{
  return  [data.ItemCode, 
    new Item(
      data.GL,
      data.ItemCode,    
      data.StandardCost,
      data.BeginInvQty,
      data.BeginInvValue,
      data.EndInvQty,
      data.EndInvValue,
      data.ReceiptQty,
      data.ReceiptValue,
      data.UsageQty,
      data.UsageValue,
      data.ImsReceiptQty,
      data.AccuralReversalQty,
      data.AccuralReversalValue,
      data.AccuralQty,
      data.AccuralValue,
      data.AdjReceiptQty,
      data.AdjReceiptValue,
      data.AllocatedExpense,
      data.UnallocatedExpense,
      data.Hurdle)]
})
const expenseMap = expenseDetail.map((data)=>{
return   [data.ProductKey,new ExpenseDetail(
  data.ProductKey,
  data.ExpenseGl||'999999-99',
  data.ImsCode,
  data.TotalPartFillsQty||0,
  data.SpecificPartUsageQty||0,
  data.AllocatedExpenseDollars||0,
  data.TotalImsUsageDollars||0 )]
})
 res.status(200).send({
  itemModel: itemMap,
  expenseDetail:expenseMap})

}
