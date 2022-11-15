

import type { NextPage } from "next";
import { PrismaClient, Receipts } from '@prisma/client';
import {
  Fragment,
  Key,
  MouseEvent,
  SetStateAction,
  useEffect,
  useState,
} from "react";

const ReceiptsPages:NextPage = (props:{[key:string]:any}) => {
const receipts:Receipts[] = props.receipts;
const columnHeaders = [
    "ID",
    "Gl Account",
    "Journal",
    "C/D",
    "Amount",
    "Date",
    "Value",
    "Description",
    "Clean Qty",
    "Receipt Qty"]

const [data, setData] = useState<Receipts[]>(receipts);
const [filteredData, setFilteredData] = useState(data);
const [editId, setEditId] = useState<null | number>(null);
const [searchField, setSearchField] = useState("");
const [sortOrder, setSortOrder] = useState<{ [key: string]: number }>({
id :0,  
GlAccount :0,   
Journal : 0, 
CD :0,
Amount:0,     
Date :0,       
ReceiptValue : 0,
TGDesc  :0,
QtyClean :0,  
ReceiptQty : 0 });

const [editFormData, setEditFormData] = useState<{
    [key: string]: number | string;
  }>({
id :0,  
GlAccount :"",   
Journal : "", 
CD :"",
Amount:0,     
Date :0,       
ReceiptValue : 0,
TGDesc  :"",
QtyClean :0,  
ReceiptQty : 0 
  });


//Action Handlers
const handleSortClick = (
    event: { target: HTMLElement; }
  ) => {
    const currentData = [...filteredData];
    const e = event.target as HTMLElement;
    const sortField = e.innerText;

    if (sortOrder[sortField] === 0) {
      currentData.sort((a, b) =>
        a[sortField as keyof Receipts]! > b[sortField as keyof Receipts]! ? 1 :
         b[sortField as keyof Receipts]! > a[sortField as keyof Receipts]! ? -1 : 0
      );
      const newSortOrder: { [key: string]: number } = { ...sortOrder };
      newSortOrder[sortField] = 1;
      setSortOrder(newSortOrder);
      setData(currentData);
    } else {
      currentData.sort((a, b) =>
        a[sortField as keyof Receipts]! < b[sortField as keyof Receipts]! ? 1 : 
        b[sortField as keyof Receipts]! < a[sortField as keyof Receipts]! ? -1 : 0
      );
      const newSortOrder: { [key: string]: number } = { ...sortOrder };
      newSortOrder[sortField] = 0;
      setSortOrder(newSortOrder);
      setFilteredData(currentData);
    }
  };

  const handleEditClick = (
    event: { preventDefault: () => void },
    item: any,
    idx: number | null
  ) => {
    event.preventDefault();
    setEditId(item.id);
    setEditFormData(item);
  };

  const handleEditFormChange = (event: {
    preventDefault: () => void;
    target: { getAttribute: (arg0: string) => string; value: string | number };
  }) => {
    event.preventDefault();
    const name: string = event.target.getAttribute("name");
    const value: string | number = event.target.value;
    const newFormData: { [key: string]: number | string } = { ...editFormData };
    newFormData[name] = value;
    setEditFormData(newFormData);
  };

  const handleSearchBoxFilter = (event: {
    preventDefault: () => void;
    target: { value: any };
  }) => {
    event.preventDefault();
    const searchValue = event.target.value;
    setSearchField(searchValue);
  };

  const handleEditFormSubmit = async (event: {
    preventDefault: () => void;
  }) => {
    event.preventDefault();
    const currentData = [...data];
    const updatedData = currentData.map((item, idx) => {
      if (item.id === editId) {
        return Object.assign(item, editFormData);
      } else {
        return item;
      }
    });
    setData(updatedData);

    const output = await fetch("/api/fills", {
      method: "POST",
      body: JSON.stringify(editFormData),
    });
    setEditId(null);
  };

  useEffect(() => {
    const currentData = [...data];
    const newFilteredData = currentData.filter((record) => {
      const values: (string|number|null)[] = Object.values(record);
      const foundValues = values.filter((field) =>
        field?.toString().includes(searchField)
      );
      return foundValues.length > 0;
    });
    setFilteredData(newFilteredData);
  }, [data, searchField]);

  const dynamicStyle = Object.values(receipts[0]).map((item,idx)=>{
    const valueWidth:number = item?.toString().length||1;
    return  (
      { border: "none",
      backgroundColor: "inherit",
      cursor: "pointer",
      fontWeight: "bolder",
      width:`${valueWidth*6}px`,
      minWidth:"70px"
   }

    )  
  })

  return (
    <Fragment>
            <div>:NextPage</div>
   {receipts.map((item)=>{
        return <p>{Object.values(item)}</p>
    })}

    </Fragment>

  )
}

export default ReceiptsPages;

export async function getServerSideProps(){

    const prisma = new PrismaClient();
    const receipts = await prisma.receipts.findMany();

    return {
        props:{
            receipts:receipts
        }
    }

}



