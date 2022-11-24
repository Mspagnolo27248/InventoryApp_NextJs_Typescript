import { AssetMapping, Receipts } from "@prisma/client";
import type { NextPage } from "next";
import { Fragment, useContext } from "react";
import DataContext from "../components/context/data-context";
import ItemTable from "../components/ItemTable/ItemTable";
import { Item } from "../containerModel/Models/Item";
import { Grid } from "gridjs-react";
import { ExpenseDetail } from "../containerModel/Models/ExpenseItem";

const CurrentMonthAssetsPage: NextPage = () => {

  const appContext = useContext(DataContext);

  const setCurrentModel = async (e: { preventDefault: any }) => {
    await fetch(`/api/setCurrentModel`)
      .then((response) => response.json())
      .then((data) => {        
        const itemMap = new Map<string, Item>(data.itemModel);
        const expenseMap = new Map<string,ExpenseDetail>(data.expenseModel)
        appContext.updateItemMap(itemMap);
        appContext.updateExpenseMap(expenseMap);
      });
  };


  const getCurrentModel = async (e: { preventDefault: any }) => {
    //fetch asset map
    e.preventDefault;

    const cont = confirm("Should we go forward")
    await fetch(`/api/getCurrentModel`)
      .then((response) => response.json())
      .then((data) => {
        const itemMap = new Map<string, Item>(data.itemModel);
        const expenseMap = new Map<string,ExpenseDetail>(data.expenseDetail)
        appContext.updateItemMap(itemMap);
        appContext.updateExpenseMap(expenseMap);
      });
  };


  const updateReceiptsHandler = async (e: { preventDefault: any }) => {
    console.log("ex");
    e.preventDefault;
    const receipts = await fetch(`/api/receipts`)
      .then((response) => response.json())
      .then((data) => data);

    const updateItems = appContext.items.map((item, idx) => {
      let receipt: Receipts = receipts.find(
        (receipt: Receipts) => receipt.GlAccount == item.GlAccount
      );

      let update: { [key: string]: number } = {
        ReceiptQty: 0 + item.ReceiptQty,
        ReceiptValue: 0 + item.ReceiptValue,
      };

      if (receipt) {
        update = {
          ReceiptQty: receipt.QtyClean || 0 + item.ReceiptQty,
          ReceiptValue: receipt.ReceiptValue || 0 + item.ReceiptValue,
        };
      }

      return Object.assign(item, update);
    });

    appContext.updateItems(updateItems);
  };


  const initalizeAssetMapHandler = async (e: { preventDefault: any }) => {
    e.preventDefault;
    const assetMapping = await fetch(`/api/assetMapping`)
      .then((response) => response.json())
      .then((data) => data);

    const initalItems = assetMapping.map((data: AssetMapping) => {
      return new Item(data.GLAccount!, data.ItemCode!, data.StandardCost!);
    });

    appContext.updateItems(initalItems);
  };


  let itemMap = appContext.itemMap;
  let data: any[] = [];
  if (itemMap) {
    data = [...itemMap.values()].map((data) => 
    [
       data['GlAccount'],
       data['ItemCode'],
       data['StandardCost'].toFixed(2),
       data['BeginInvQty'].toFixed(0),
       data['ReceiptQty'].toFixed(0),
       data['ImsReceiptQty'].toFixed(0),
       data['AccuralReversalQty'].toFixed(0),
       data['AccuralQty'].toFixed(0),
       data['AdjReceiptQty'].toFixed(0),
       data['UsageQty'].toFixed(0),
       data['EndInvQty'].toFixed(0),
       data['BeginInvValue'].toFixed(2),
       data['ReceiptValue'].toFixed(2),
       data['AccuralReversalValue'].toFixed(2),  
       data['AccuralValue'].toFixed(2),      
       data['AdjReceiptValue'].toFixed(2),
 
       data['UsageValue'].toFixed(2), 
       data['EndInvValue'].toFixed(2),
       data['AllocatedExpense'].toFixed(2),
       data['UnallocatedExpense'].toFixed(2)
    ])

  }


  let columnNames: string[] = [
    "Gl Account",
    "Item Code",
    "Standard Cost",
    "Begin Qty",
    "Receipt Qty",
  "IMS Qty",
  "Accural Rev Qty",
"Accural Qty",
"Adj Receipt Qty",
"Usage Qty",
"End Qty",
"Begin Value",
"Receipt Value",
"Accural Rev Value",
"Accrual Value",
"Adj Receipt Value",
"Usage Value",
"End Value",
"Allocated Expense",
" Un-Allocated Expense"
  ]
  //   columnNames = Object.keys([...itemMap.entries()][0][1]);
  // }

  
  return (
    <Fragment>
      <div className="actionButtons">
        <button type="button" onClick={getCurrentModel}>
          Get Current Model
        </button>
        <button type="button" onClick={updateReceiptsHandler}>
          Re-Initalize Receipts
        </button>

        <button type="button" onClick={initalizeAssetMapHandler}>
          Initalize AssetMapp
        </button>

        <button type="button" onClick={setCurrentModel}>
          Run Model Current Month
        </button>
      </div>

     <div className="verticalScroll">
     <Grid data={data} columns={columnNames} search={true} sort={true} />
     </div>


    </Fragment>
  );
};

export default CurrentMonthAssetsPage;
