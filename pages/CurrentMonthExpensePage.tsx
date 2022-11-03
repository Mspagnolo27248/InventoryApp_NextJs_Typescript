import { AssetMapping, Receipts } from "@prisma/client";
import type { NextPage } from "next";
import { Fragment, useContext } from "react";
import DataContext from "../components/context/data-context";
import ItemTable from "../components/ItemTable/ItemTable";
import { Item } from "../containerModel/Models/Item";
import { Grid } from "gridjs-react";
import { ExpenseDetail } from "../containerModel/Models/ExpenseItem";

const CurrentMonthExpensePage: NextPage = () => {

const appContext = useContext(DataContext);
const expenseMap = appContext.expenseMap
let data: any[] = [];
let columnNames:string[] = [
  "Product Key",
  "Gl Account",
  "IMS Code",
  "Total Parts Filled Qty",
  "Specific Part Usage Qty",
  "Allocated Expense Dollars",
  "IMS Usage Dollars"
  
]
if(expenseMap){
  data = [...expenseMap.values()].map(data=>{ return[
   data['ProductKey'],
   data['ExpenseGl'],
   data['ImsCode'],
   data['TotalPartFillsQty'],
   data['SpecificPartUsageQty'],
   data['AllocatedExpenseDollars'],
   data['TotalImsUsageDollars']
  ]});

}



  return(
    <Fragment>

<Grid data={data} columns={columnNames} search={true} sort={true} />

    </Fragment>
  )
}

export default CurrentMonthExpensePage