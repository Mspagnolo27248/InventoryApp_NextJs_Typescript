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


 const items = await   prisma.itemModel.findMany();
 const expenses = await prisma.expenseDetail.findMany();

 res.status(200).send({
  items: items,
  expenses:expenses})

}
