import { AssetMapping } from "@prisma/client";
import { IassetMapping } from "../interfaces";
import { Item } from "./Item";

export class ItemCollection {
  collection = new Map<string, Item>();
  glMaps = new Map<string, string>();
  imsMaps = new Map<string, string>();

  constructor(data: AssetMapping[]) {
    for (var row of data) {

      this.collection.set(
        row.ItemCode,
        new Item(row.GLAccount||'999999-99', row.ItemCode, (row.StandardCost!))
      );

      this.glMaps.set(row.GLAccount||'999999-99', row.ItemCode);

      this.imsMaps.set(row.ItemCode, row.GLAccount||'999999-99');
    }
  }

  getImsCodeFromGlCode(glAccount: string): string | undefined {
    return this.glMaps.get(glAccount.replace("-", "")) || undefined;
  }

  updateModel(
    inputData: { [keys: string]: number | string },
    fieldNameToUpdate: string,
    keyType: "ims" | "gl"
  ): void {
    for (let [key, value] of Object.entries(inputData)) {
      if (keyType === "gl") {
        let keyLookupValue = this.getImsCodeFromGlCode(key.replace("-", ""));
        if (!keyLookupValue) {
          console.log(key);
          throw console.error("No Key Exisits");
        }
        key = keyLookupValue;
      }
      let newRecord: { [key: string]: any } = {};
      newRecord[fieldNameToUpdate] = value;

      let currentRecord = this.collection.get(key);
      if (currentRecord) {
        let updatedRecord = Object.assign(currentRecord, newRecord);
        this.collection.set(key, updatedRecord);
      }
    }
  }

  calculateAccurals() {
    for (const [key, value] of this.collection.entries()) {
      value.calculateAccurals();
    }
  }

  calculateAjustedReceipts() {
    for (const [key, value] of this.collection.entries()) {
      value.calculateAjustedReceipts();
    }
  }

  calculateUsage() {
    for (const [key, value] of this.collection.entries()) {
      value.calculateUsage();
    }
  }
  calculateEndInventory() {
    for (let [key, value] of this.collection.entries()) {
      value.EndInvValue =
        value.BeginInvValue + value.AdjReceiptValue - value.UsageValue;
      this.collection.set(key, value);
    }
  }

  calculateUnAllocatedExpense(){
    for(let  [key, value] of this.collection.entries()){
         let unAllocatedExpense = value.UsageValue - value.AllocatedExpense;
      if(Math.abs(unAllocatedExpense)>.02){
        value.UnallocatedExpense = unAllocatedExpense;
      }
  
  }
}



   getFieldTotal(
    fieldNameToUpdate: keyof Item
  ) {
    let cumulativeTotal = 0;
    for (let [key, value] of this.collection) {
      if (value[fieldNameToUpdate]) {
        cumulativeTotal = cumulativeTotal + +value[fieldNameToUpdate]! || 0;
      }
    }
    return Math.round(cumulativeTotal * 1000) / 1000;
  }

  updateAllocatedExpense(expesneByPart:{ [key: string]: number }){
    //Update the Asset Detail to show the allocated expense. 
    for(let [key,value] of Object.entries(expesneByPart))
if([...this.collection.keys()].includes(key)){ //Some items in BOM are un-costed.

    let currentRecord:Item = this.collection.get(key)!;
    let allocatedUsage = value + currentRecord.AllocatedExpense;
    currentRecord.AllocatedExpense = allocatedUsage;
    currentRecord.UnallocatedExpense = (currentRecord.UsageValue-allocatedUsage);
    this.collection.set(key,currentRecord) 
   
  }
  this.calculateUnAllocatedExpense();
  }
}
