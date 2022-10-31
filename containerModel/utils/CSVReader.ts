import fs from "fs";
import path from "path";
import { Item } from "../Models/Item";

export class CsvReader{
  constructor() {}

  readToObject<T>(
    filename: string,
    setHeaders?: string[],
    firstRowHeaders?: boolean
  ): T[] {
    const dataFile = filename;
    const dataPath = path.join(process.cwd(), dataFile);
    const rowStart = firstRowHeaders ? 1 : 0;
    let dataAsArray: string[][] = [];
    dataAsArray = fs
      .readFileSync(dataPath, "utf-8")
      .split("\n")
      .map((record: string) => record.split(","));

    let headers: string[] = [];

    let dataAsObject:T[] = [];
    if (!setHeaders) {
      headers = dataAsArray[0];
    } else {
      headers = setHeaders;
    }

    for (let i = rowStart; i < dataAsArray.length - rowStart; i++) {
      let obj: any = {};
      for (let j = 0; j < dataAsArray[0].length; j++) {
        obj[headers[j]] = dataAsArray[i][j].replace(/[\n\r]/g, "");;
      }
      dataAsObject.push(obj);
    }
    return dataAsObject;
  }

  readToArray(filename: string): string[][] {
    let dataAsArray: string[][] = [];
    const dataFile = filename;
    const dataPath = path.join(process.cwd(), dataFile);
    dataAsArray = fs
      .readFileSync(dataPath, "utf-8")
      .split("\n")
      .map((record: string) => record.split(","));
    return dataAsArray;
  }
}
