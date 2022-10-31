import { Item } from "../Models/Item";
import fs from 'fs'

export function ReturnFieldTotalFromModel<T>(
  fieldName: keyof T,
  model: Map<string, T>
) {
  let cumulativeTotal = 0;
  for (let [key, value] of model) {
    if (value[fieldName]) {
      cumulativeTotal = cumulativeTotal + +value[fieldName]! || 0;
    }
  }
  return Math.round(cumulativeTotal * 1000) / 1000;
}

export function AggregateToUniqueDictionary<T extends {[keys:string]:any}>(
  data: T[],
  keyField: string,
  valueField:string
): { [keys: string]: number } {
  let output: { [keys: string]: number } = {};

  for (let record of data) {
    if (Object.keys(output).includes(record[keyField])) {
      output[record[keyField]] += +record[valueField];
    } else {
      output[record[keyField]] = +record[valueField];
    }
  }
  return output;
}


//
export function WriteMapToCsv<T, V>(collection: Map<T, Object>,filename:string,headers:string[]) {
  let outputString = headers.join(',')+'\n';
  for (let row of collection.values()) {
    outputString += Object.values(row).join(",") + "\n";
  }
  fs.writeFileSync(filename, outputString);
}

export  function WriteDictToCsv(collection: {[key:string]:number} ,filename:string,headers:string[]) {
  let outputString = headers.join(',')+"\n";
  for (let [key,value] of Object.entries(collection)) {
    outputString += `${key},${value}` + "\n";
  }
  fs.writeFileSync(filename, outputString);
}