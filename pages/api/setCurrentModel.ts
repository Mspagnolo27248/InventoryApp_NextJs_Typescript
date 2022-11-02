// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { Prisma, PrismaClient } from '@prisma/client'
import type { NextApiRequest, NextApiResponse } from 'next'
import { IassetMapping } from '../../containerModel/interfaces';
import { ItemCollection } from '../../containerModel/Models/ItemCollection';
import { AggregateToUniqueDictionary } from '../../containerModel/utils/Utils';

type Data = {

  }

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
    const prisma = new PrismaClient();

    //ETL truncate and load tables from sources.
    const rawSQL = `Run_All_Syncs`
    const result = await prisma.$executeRaw`${rawSQL}`;

    //Read In Data
    const assetMapping =  await prisma.assetMapping.findMany();
    const receipts = await prisma.receipts.findMany();
    const beginInventory = await prisma.beginInventory.findMany();
    const endInventory = await prisma.endingInventory.findMany();
    const imsActivity =  await prisma.imsActivity.findMany();
    const accuralReversals = await prisma.accuralReversals.findMany();
   
// Aggreate
//-------------------------Create Data Dictionaries From Source Data----------------------------------
const receiptsQty = AggregateToUniqueDictionary(receipts, "GlAccount", "ReceiptQty"); // Take list with duplicate records and groups by item code
const receiptsValues = AggregateToUniqueDictionary(receipts, "GlAccount", "Amount"); 
const beginInvQty = AggregateToUniqueDictionary(beginInventory, "GlAccount", "BeginInvQty"); 
const beginInvValues = AggregateToUniqueDictionary(beginInventory, "GlAccount", "BeginInvDollars"); 
const endInvQty = AggregateToUniqueDictionary(endInventory, "GlAccount", "EndInvQty"); 
// endInvValues = AggregateToUniqueDictionary(endInventory, "GlAccount", "EndInvDollars"); 
const accuralReversalQty = AggregateToUniqueDictionary(accuralReversals, "ImsCode", "Qty"); 
const accuralReveralValues = AggregateToUniqueDictionary(accuralReversals, "ImsCode", "Value"); 
const imsActivityQty = AggregateToUniqueDictionary(imsActivity, "IMS_Code", "TOTALRECEIPTS"); 

//-------------------------Instantiate Monthy Model Class-------------------------------------------
const modelCollection = new ItemCollection(assetMapping);
//--------------------------Update Model from Source Data---------------------------------------------
modelCollection.updateModel(receiptsQty, "ReceiptQty", "gl");
modelCollection.updateModel(receiptsValues, "ReceiptValue", "gl");
modelCollection.updateModel(beginInvQty,'BeginInvQty', "gl");
modelCollection.updateModel(beginInvValues, "BeginInvValue", "gl");
modelCollection.updateModel(endInvQty, "EndInvQty", "gl");
modelCollection.updateModel(accuralReversalQty, "AccuralReversalQty", "ims");
modelCollection.updateModel(accuralReveralValues, "AccuralReversalValue", "ims");
modelCollection.updateModel(imsActivityQty,'ImsReceiptQty','ims')


//---------------------------------Run Accual Calculations----------------------------------------------
modelCollection.calculateAccurals();
modelCollection.calculateAjustedReceipts();
modelCollection.calculateUsage();
modelCollection.calculateEndInventory();


//----------------------------------Ouptut Field Totals -----------------------------------------------
  console.log(`Receipt Value: ${modelCollection.getFieldTotal("ReceiptValue" )}`);
  console.log(`Receipt Qty: ${modelCollection.getFieldTotal("ReceiptQty")}`);
  console.log(`Begin Qty: ${modelCollection.getFieldTotal("BeginInvQty")}`);
  console.log(`Begin Value: ${modelCollection.getFieldTotal("BeginInvValue")}`);
  console.log(`End Qty: ${modelCollection.getFieldTotal("EndInvQty")}`);
  console.log(`End Value: ${modelCollection.getFieldTotal("EndInvValue")}`);
  console.log(`IMS Qty: ${modelCollection.getFieldTotal("ImsReceiptQty")}`);
  console.log(`AccuralQty: ${modelCollection.getFieldTotal("AccuralQty")}`);
  console.log(`AccuralValue: ${modelCollection.getFieldTotal("AccuralValue")}`);
  console.log(`AdjReceiptQty: ${modelCollection.getFieldTotal("AdjReceiptQty")}`);
  console.log(`AdjReceiptValue: ${modelCollection.getFieldTotal("AdjReceiptValue")}`);
  console.log(`AccuralReversalQty: ${modelCollection.getFieldTotal("AccuralReversalQty")}`);
  console.log(`AccuralReversalValue: ${modelCollection.getFieldTotal("AccuralReversalValue")}`);
  console.log(`UsageQty: ${modelCollection.getFieldTotal("UsageQty")}`);
  console.log(`UsageValue: ${modelCollection.getFieldTotal("UsageValue")}`);

  console.log("Stop")

const itemModel = Array.from(modelCollection.collection);

res.status(200).json(itemModel)



}
