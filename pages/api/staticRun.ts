import type { NextApiRequest, NextApiResponse } from 'next'
import { ItemModel, PrismaClient } from '@prisma/client'
import { Item } from '../../containerModel/Models/Item';
import { ExpenseDetail } from '../../containerModel/Models/ExpenseItem';


type Data = {
  items: ItemModel[],
  expenses:ExpenseDetail[]
}

const prisma = new PrismaClient()

 export default   function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>) {

//Query Current Month Models and Add to Context

async function getModels() {
 const items = await   prisma.itemModel.findMany();
 const expenses = await prisma.ExpenseDetail.findMany();

 res.status(200).send({
  items: items,
  expenses:expenses})

}
getModels();
  }
