import { IBom } from "../interfaces";
import { ExpenseDetail } from "./ExpenseItem";
import { Item } from "./Item";

export class ExpenseCollection {
  expenseGlMap = new Map<string, string>();
  expenseCollection: Map<string, ExpenseDetail> = new Map();
  imsTotalFills: { [keys: string]: number } = {};
  productFills: { [keys: string]: number } = {};
  expenseByGlAccount: { [key: string]: number } = {};
  expenseByImsCode: { [key: string]: number } = {};

  constructor(data: { [keys: string]: string }[]) {
    //This initalizes the unique keys of the expenseglMap and assigns them GL's <Product Key, Expense Gl>
    for (let record of data) {
      let key = record.ProductKey.replace(/ /g, "-");
      this.expenseGlMap.set(key, record.ExpenseGl);
    }
  }

  loadFillData(fills: { [keys: string]: string }[]) {
    for (let record of fills) {
    //Initalize and Sums the product Fills Data  <Product Key, Fill Qty>
      let key = (record.ContainerProduct + "-" + record.GroupCode).replace( / /g,"-");

      if (Object.keys(this.productFills).includes(key))
        this.productFills[key] += parseInt(record.QtyOrBottle);
      else {
        this.productFills[key] = parseInt(record.QtyOrBottle);
      }
    }
  }

  firstPass(bom: IBom[]) {
    //Update Expense Detail Map (Pass 1 Initalize Data)
    for (let record of bom) {
      let produtKey = record.ProductKey.replace(/ /g, "-");  //Product Key
      let key = produtKey + "-" + record.IMSCode; //Product Key Plus IMS Code
      let partsFilled = this.productFills[produtKey] || 0;
      let expenseGl = this.expenseGlMap.get(produtKey)!;

      //initialize the expenseItem Collection  <ProductKey+IMSCode,ExpenseItem>
      this.expenseCollection.set(key, new ExpenseDetail(
          produtKey, //Key
          expenseGl, //Gl
          record.IMSCode, //ItemCode
          0, //Total Fills for Part
          partsFilled, //Specific Fills
          0, //Allocated Expense to GL
          0 //Total Expense to be Allocated
        )
      );

      //update the PartTotalFills data structure
      //Keep Track of Total Fills by IMS Part
      if (Object.keys(this.imsTotalFills).includes(record.IMSCode)) {
        this.imsTotalFills[record.IMSCode] += partsFilled;
      } else {
        this.imsTotalFills[record.IMSCode] = partsFilled;
      }
    }
  }

  secondPass(itemMap: Map<string, Item>) { //TODO- refactor this to take in a dict of <key,value >
    //Pass 2 Update the Total Fills for the Part and Calculate part allocation %
    for (let [key, value] of this.expenseCollection.entries()) {

    //Populate the 
      value.TotalPartFillsQty = this.imsTotalFills[value.ImsCode]; // Update Total Fills for the Part
      value.TotalImsUsageDollars = itemMap.get(value.ImsCode)?.UsageValue || 0; // Update total Usage Dollars for Part
      value.AllocatedExpenseDollars = +(
        value.TotalImsUsageDollars *
        (value.SpecificPartUsageQty / value.TotalPartFillsQty || 0)
      ).toFixed(2);
   
      //



    }
  }

  generateExpenseOutput(){
    //Update Expense Output by GL
        for (let [key, value] of this.expenseCollection.entries()) {
       
            //Update expenseByGlAccount
        if(Object.keys(this.expenseByGlAccount).includes(value.ExpenseGl))
        this.expenseByGlAccount[value.ExpenseGl]+= value.AllocatedExpenseDollars;
        else{
        this.expenseByGlAccount[value.ExpenseGl]= value.AllocatedExpenseDollars;
        }
            //Update expense by IMScode
            if(Object.keys(this.expenseByImsCode).includes(value.ImsCode))
        this.expenseByImsCode[value.ImsCode]+= value.AllocatedExpenseDollars;
        else{
        this.expenseByImsCode[value.ImsCode]= value.AllocatedExpenseDollars;
        
        }
    }}

    getExpenseByGlAccount(){
            return this.expenseByGlAccount;
        }
    getAllocatedExpenseByPart(){       
        return this.expenseByImsCode;

    }

    getFieldTotal(
        fieldName: keyof ExpenseDetail
      ) {
        let cumulativeTotal = 0;
        for (let [key, value] of this.expenseCollection) {
          if (value[fieldName]) {
            cumulativeTotal = cumulativeTotal + +value[fieldName]! || 0;
          }
        }
        return Math.round(cumulativeTotal * 1000) / 1000;
      }
  
  
}
