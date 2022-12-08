// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import {
  BOM,

  ExpenseMapping,
  Fills,
  ItemModel,
  Prisma,
  PrismaClient,
} from "@prisma/client";
import { writeFileSync } from "fs";
import path  from "path";
import type { NextApiRequest, NextApiResponse } from "next";
import { ExpenseCollection } from "../../containerModel/Models/ExpenseCollection";
import { Item } from "../../containerModel/Models/Item";
import { ExpenseDetail } from "../../containerModel/Models/ExpenseItem";
import { ItemCollection } from "../../containerModel/Models/ItemCollection";
import { AggregateToUniqueDictionary } from "../../containerModel/utils/Utils";

type Data = {};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const prisma = new PrismaClient();

  //ETL truncate and load tables from sources.
  // const rawSQL = `Run_All_Syncs`;
  // const result = await prisma.$executeRaw`${rawSQL}`;


  //Guard 
  
  //Read In Data
  const assetMapping = await prisma.assetMapping.findMany();
  const receipts = await prisma.receipts.findMany();
  const beginInventory = await prisma.beginInventory.findMany();
  const endInventory = await prisma.endingInventory.findMany();
  const imsActivity = await prisma.imsActivity.findMany();
  const accuralReversals = await prisma.accuralReversals.findMany();

  // //Guard 
  // if(assetMapping.length!>1&&
  //   receipts.length!>1&&
  //   imsActivity.length!>1
  //   ){ 
  //     return res.status(500).json({success:false});}
  // Aggreate
  //-------------------------Create Data Dictionaries From Source Data----------------------------------
  const receiptsQty = AggregateToUniqueDictionary(
    receipts,
    "GlAccount",
    "ReceiptQty"
  ); // Take list with duplicate records and groups by item code
  const receiptsValues = AggregateToUniqueDictionary(
    receipts,
    "GlAccount",
    "Amount"
  );
  const beginInvQty = AggregateToUniqueDictionary(
    beginInventory,
    "GlAccount",
    "BeginInvQty"
  );
  const beginInvValues = AggregateToUniqueDictionary(
    beginInventory,
    "GlAccount",
    "BeginInvDollars"
  );
  const endInvQty = AggregateToUniqueDictionary(
    endInventory,
    "GlAccount",
    "EndInvQty"
  );
  // endInvValues = AggregateToUniqueDictionary(endInventory, "GlAccount", "EndInvDollars");
  const accuralReversalQty = AggregateToUniqueDictionary(
    accuralReversals,
    "ImsCode",
    "Qty"
  );
  const accuralReveralValues = AggregateToUniqueDictionary(
    accuralReversals,
    "ImsCode",
    "Value"
  );
  const imsActivityQty = AggregateToUniqueDictionary(
    imsActivity,
    "IMS_Code",
    "TOTALRECEIPTS"
  );

  //-------------------------Instantiate Monthy Model Class-------------------------------------------
  const modelCollection = new ItemCollection(assetMapping);
  //--------------------------Update Model from Source Data---------------------------------------------
  modelCollection.updateModel(receiptsQty, "ReceiptQty", "gl");
  modelCollection.updateModel(receiptsValues, "ReceiptValue", "gl");
  modelCollection.updateModel(beginInvQty, "BeginInvQty", "gl");
  modelCollection.updateModel(beginInvValues, "BeginInvValue", "gl");
  modelCollection.updateModel(endInvQty, "EndInvQty", "gl");
  modelCollection.updateModel(accuralReversalQty, "AccuralReversalQty", "ims");
  modelCollection.updateModel(
    accuralReveralValues,
    "AccuralReversalValue",
    "ims"
  );
  modelCollection.updateModel(imsActivityQty, "ImsReceiptQty", "ims");

  //---------------------------------Run Accual Calculations----------------------------------------------
  modelCollection.calculateAccurals();
  modelCollection.calculateAjustedReceipts();
  modelCollection.calculateUsage();
  modelCollection.calculateEndInventory();

  //----------------------------------Ouptut Field Totals -----------------------------------------------
  console.log(
    `Receipt Value: ${modelCollection.getFieldTotal("ReceiptValue")}`
  );
  console.log(`Receipt Qty: ${modelCollection.getFieldTotal("ReceiptQty")}`);
  console.log(`Begin Qty: ${modelCollection.getFieldTotal("BeginInvQty")}`);
  console.log(`Begin Value: ${modelCollection.getFieldTotal("BeginInvValue")}`);
  console.log(`End Qty: ${modelCollection.getFieldTotal("EndInvQty")}`);
  console.log(`End Value: ${modelCollection.getFieldTotal("EndInvValue")}`);
  console.log(`IMS Qty: ${modelCollection.getFieldTotal("ImsReceiptQty")}`);
  console.log(`AccuralQty: ${modelCollection.getFieldTotal("AccuralQty")}`);
  console.log(`AccuralValue: ${modelCollection.getFieldTotal("AccuralValue")}`);
  console.log(
    `AdjReceiptQty: ${modelCollection.getFieldTotal("AdjReceiptQty")}`
  );
  console.log(
    `AdjReceiptValue: ${modelCollection.getFieldTotal("AdjReceiptValue")}`
  );
  console.log(
    `AccuralReversalQty: ${modelCollection.getFieldTotal("AccuralReversalQty")}`
  );
  console.log(
    `AccuralReversalValue: ${modelCollection.getFieldTotal(
      "AccuralReversalValue"
    )}`
  );
  console.log(`UsageQty: ${modelCollection.getFieldTotal("UsageQty")}`);
  console.log(`UsageValue: ${modelCollection.getFieldTotal("UsageValue")}`);

  console.log("Stop");

  //
  //------------------------------------Load Data --------------------------------
  const expenseMapping: ExpenseMapping[] =
    await prisma.expenseMapping.findMany();
  const bom: BOM[] = await prisma.bOM.findMany();
  const fills: Fills[] = await prisma.fills.findMany();

  //---------------------------Instantiate Expense Collection------------------
  const expenseCollection = new ExpenseCollection(expenseMapping);

  //-----------------------------Calculate Expense Allocations-----------------------
  expenseCollection.loadFillData(fills);
  expenseCollection.firstPass(bom);
  expenseCollection.secondPass(modelCollection.collection);
  expenseCollection.generateExpenseOutput();
  const expenseByGlAccount = expenseCollection.getExpenseByGlAccount();
  const allocatedExpenseByPart = expenseCollection.getAllocatedExpenseByPart();

  modelCollection.updateAllocatedExpense(allocatedExpenseByPart);

  console.log(
    `AllocatedExpenseDollars: ${expenseCollection.getFieldTotal(
      "AllocatedExpenseDollars"
    )}`
  );
  console.log(
    `UnallocatedExpense: ${modelCollection.getFieldTotal("UnallocatedExpense")}`
  );

  const itemModel = Array.from(modelCollection.collection);
  const expenseModel = Array.from(expenseCollection.expenseCollection);
  const items :Item[]= Array.from(modelCollection.collection.values());
  const expenses :ExpenseDetail[]= Array.from(expenseCollection.expenseCollection.values());

   await prisma.$queryRaw`truncate table ItemModel`
  for(const record  of  items){
     await prisma.itemModel.create({
      data: {
        GL:record.GlAccount,
        ItemCode:record.ItemCode,
        StandardCost:record.StandardCost,
        BeginInvQty:record.BeginInvQty,
        BeginInvValue:record.BeginInvValue,
        EndInvQty:record.EndInvQty,
        EndInvValue:record.EndInvValue,
        AdjustmentInvQty:0,
        AdjustmentInvValue:0,
        ReceiptQty:record.ReceiptQty,
        ReceiptValue:record.ReceiptValue,
        UsageQty:record.UsageQty,
        UsageValue:record.UsageValue,
        ImsReceiptQty:record.ImsReceiptQty,
        AccuralQty:record.AccuralReversalQty,
        AccuralValue:record.AccuralValue,
        AccuralReversalQty:record.AccuralReversalQty,
        AccuralReversalValue:record.AccuralReversalValue,
        AdjReceiptQty:0,
        AdjReceiptValue:0,
        AllocatedExpense:record.AllocatedExpense,
        UnallocatedExpense:record.UnallocatedExpense,
        Hurdle:record.Hurdle
      } as ItemModel
    })
  }

  await prisma.$queryRaw`truncate table [ExpenseDetail]`
  for(const record  of  expenses){
    await prisma.expenseDetail.create({
     data: record
   })
 }


 const assetGlExpense = await prisma.$queryRaw`
 SELECT 
 [GL]
 ,[ItemCode]
 ,sum([AllocatedExpense]) as AllocatedExpense
 ,sum([UnallocatedExpense]) as UnallocatedExpense
 FROM [NewContainers].[dbo].[ItemModel]
 Group By 
 [GL]
 ,[ItemCode]
 order by 
 AllocatedExpense desc
 `
 const expenseGlExpense = await prisma.$queryRaw`
 SELECT 
 [ExpenseGl]
 ,sum([AllocatedExpenseDollars]) as AllocatedExpenseDollars 
 FROM [NewContainers].[dbo].[ExpenseDetail]
 Group By 
 [ExpenseGl]
 Order by AllocatedExpenseDollars desc
 `

  res.status(200).json({
  itemModel:itemModel,
  expenseModel:expenseModel,
  expenseGlExpense:expenseGlExpense,
  assetGlExpense:assetGlExpense
});
}
