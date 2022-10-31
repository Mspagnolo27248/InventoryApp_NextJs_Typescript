import { Item } from "./Models/Item";
import { CsvReader } from "./utils/CSVReader";
import { AggregateToUniqueDictionary,WriteDictToCsv,WriteMapToCsv,} from "./utils/Utils";
import { assetHeaders, beginInventoryHeaders, billOfMaterialHeaders, endInventoryHeaders, expenseMappingHeaders, receiptHeaders } from "./DataHeaders";
import {IassetMapping,IBom} from './interfaces'
import { ItemCollection } from "./Models/ItemCollection";
import { ExpenseCollection } from "./Models/ExpenseCollection";


console.log("Start")
console.time()
//-----------------------Read in Data----------------
const reader = new CsvReader();

const assetMapping: IassetMapping[] = reader.readToObject<IassetMapping>(
  "/data/AssetMapping.csv",
  assetHeaders,
  true
);

const receipts: {[key:string]:string}[] = reader.readToObject<{[key:string]:string}>(
  "/data/Receipts.csv",
  receiptHeaders,
  true
);

const beginInventory:{[key:string]:string}[] = reader.readToObject(
  "/data/BeginInventory.csv",
  beginInventoryHeaders,
  true
);

const endInventory:{[key:string]:string}[] = reader.readToObject(
  "/data/EndInventory.csv",
  endInventoryHeaders,
  true
);

const imsActivity:{[key:string]:string}[] = reader.readToObject(
  '/data/ImsActvity.csv',
  undefined,
  true)

const accuralReversals:{[key:string]:string}[]= reader.readToObject(
  '/data/AccuralReversals.csv',
  ['imsCode','GlAccount','Qty','Value'],
  true)


//-------------------------Instantiate Monthy Model Class-------------------------------------------
const modelCollection = new ItemCollection(assetMapping);


//-------------------------Create Data Dictionaries From Source Data----------------------------------
const receiptsQty = AggregateToUniqueDictionary(receipts, "GlAccount", "ReceiptQty"); // Take list with duplicate records and groups by item code
const receiptsValues = AggregateToUniqueDictionary(receipts, "GlAccount", "ReceiptValue"); 
const beginInvQty = AggregateToUniqueDictionary(beginInventory, "GlAccount", "BeginInvQty"); 
const beginInvValues = AggregateToUniqueDictionary(beginInventory, "GlAccount", "BeginInvDollars"); 
const endInvQty = AggregateToUniqueDictionary(endInventory, "GlAccount", "EndInvQty"); 
// endInvValues = AggregateToUniqueDictionary(endInventory, "GlAccount", "EndInvDollars"); 
const accuralReversalQty = AggregateToUniqueDictionary(accuralReversals, "imsCode", "Qty"); 
const accuralReveralValues = AggregateToUniqueDictionary(accuralReversals, "imsCode", "Value"); 
const imsActivityQty = AggregateToUniqueDictionary(imsActivity, "IMS_Code", "TOTALRECEIPTS"); 


//--------------------------Update Model from Source Data---------------------------------------------
modelCollection.updateModel(receiptsQty, "ReceiptQty", "gl");
modelCollection.updateModel(receiptsValues, "ReceiptValue", "gl");
modelCollection.updateModel(beginInvQty,'BeginInvQty', "gl");
modelCollection.updateModel(beginInvValues, "BeginInvValue", "gl");
modelCollection.updateModel(endInvQty, "EndInvQty", "gl");
//modelCollection.updateModel(endInvValues, "EndInvValue", "gl");
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


//---------------------Run Expense Allocation------------------------------


//------------------------------------Load Data --------------------------------
const expenseMapping:{[keys:string]:string}[] = reader.readToObject('/data/ExpenseMapping.csv',expenseMappingHeaders,true)
const bom:IBom[] = reader.readToObject('/data/BOM.csv',billOfMaterialHeaders,true)
const fills:{[keys:string]:string}[] = reader.readToObject('/data/Fills.csv',undefined,true)

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




console.log(`AllocatedExpenseDollars: ${expenseCollection.getFieldTotal("AllocatedExpenseDollars")}`);
console.log(`UnallocatedExpense: ${modelCollection.getFieldTotal("UnallocatedExpense")}`);



// -----------------Reports to CSV files------------
WriteMapToCsv<string, Item>(expenseCollection.expenseCollection,"expenseMap.csv",
['ProductKey',
'ExpenseGl',
'ImsCode',
'TotalPartFillsQty',
'SpecificPartUsageQty',
'AllocatedExpenseDollars',
'TotalImsUsageDollars'
  ]);

WriteMapToCsv<string, Item>(modelCollection.collection,"myMap.csv",[
  'GL',
  'ItemCode',
  'StandardCost',
  'BeginInvQty',
  'BeginInvValue',
  'EndInvQty',
  'EndInvValue',
  'ReceiptQty',
  'ReceiptValue',
  'UsageQty',
  'UsageValue',
  'ImsReceiptQty',
  'AccuralReversalQty',
  'AccuralReversalValue',
  'AccuralQty',
  'AccuralValue',
  'AdjReceiptQty',
  'AdjReceiptValue',
  'AllocatedExpense',
  'UnallocatedExpense',
  'Hurdle'  
]);
WriteDictToCsv(expenseByGlAccount,"expenseByGl.csv",['GLAccount','ExpenseDollars'])
//WriteDictToCsv(unAllocatedExpense,"unAllocatedExpense.csv",['GLAccount','Un-AllocatedExpenseDollars'])
//WriteDictToCsv(allocatedExpense,"AllocatedExpense.csv",['GLAccount','AllocatedExpenseDollars'])
console.timeEnd();
console.log("stop");


//Need to add an Ending Inventory Value formula for Qty and Value




