import { Fills, PrismaClient } from "@prisma/client";
import { strict } from "assert";
import type { NextPage } from "next";
import { Fragment, Key, SetStateAction, useState } from "react";
import { EditableRow } from "../components/table-mds/components/EditableRow";
import { ReadOnlyRow } from "../components/table-mds/components/ReadOnlyRow";
import classes from '../components/table-mds/components/Rows.module.css'

const MikeTestCustomPage: NextPage = (props: { [key: string]: any }) => {

const handleEditClick = (event: { preventDefault: () => void; },item: any ,idx: number| null)=>{
    event.preventDefault();
    setEditId(idx)  
    setEditFormData(item)
}

const handleEditFormChange = (event: { preventDefault: () => void; target: { getAttribute: (arg0: string) => string; value: string | number; }; })=>{
    event.preventDefault();
    const name:string= event.target.getAttribute('name');
    const value:string|number = event.target.value;

    const newFormData:{[key:string]:number|string} = {...editFormData}
    newFormData[name]= value;
    setEditFormData(newFormData)
}

  const fills = props.fills;
  const fillsArray = fills.map((data: Fills) => {
    return {
      id:data.id,
      Code:data.Code,
      ContainerProduct:data.ContainerProduct,
      ContainerDesc:data.ContainerDesc,
      GroupCode:data.GroupCode,
      Key:data.Key,
      Product:data.Product,
      ProductDesc:data.ProductDesc,
      FillBottles:data.FillBottles,
      FillCases:data.FillCases,
      FillQty:data.FillQty,
      QtyOrBottle:data.QtyOrBottle,
    };
  });

  const columnNames = [
    "id",
    "Code",
    "ContainerProduct",
    "ContainerDesc",
    "GroupCode",
    "Key",
    "Product",
    "ProductDesc",
    "FillBottles",
    "FillCases",
    "FillQty",
    "QtyOrBottle",
  ];

const [data,setData] = useState(fillsArray)
const [editId, setEditId] = useState<null|number>(null);
const [editFormData,setEditFormData] = useState<{[key:string]:number|string}>({
    id:0,
    Code:"",
    ContainerProduct:"",
    ContainerDesc:"",
    GroupCode:"",
    Key:"",
    Product:"",
    ProductDesc:"",
    FillBottles:0,
    FillCases:0,
    FillQty:0,
    QtyOrBottle:0
});

const handleEditFormSubmit = async (event: { preventDefault: () => void; })=>{
    event.preventDefault();
    const updatedData = [...data];    
    updatedData[editId||0] = editFormData;
    setData(updatedData);

    const output = await fetch('/api/fills',{
      method: 'POST',
      body: JSON.stringify(editFormData) 
     }) 
    setEditId(null)

}


  return (
    <Fragment>
      <div>Current Month Receipts</div>
      <form>
        <table className={classes.tableGrid}>
          <thead>
            <tr key={999999} >
              {columnNames.map((item, idx) => {
                return <th key={idx}>{item}</th>;
              })}
            </tr>
          </thead>
          <tbody>
            {data.map((row: {[key:string]:number|string}, idx: Key) => {
              return (
                <Fragment key={idx} >
                  
                  {editId === idx ? (
                    <EditableRow 
                    item={editFormData} 
                    names={columnNames} 
                    idx={+idx}  
                    handleEditClick={handleEditClick} 
                    handleEditFormChange={handleEditFormChange}
                    handleEditFormSubmit={handleEditFormSubmit}
                    />
                  ) : (
                    <ReadOnlyRow item={row} idx={+idx} handleEditClick={handleEditClick} ></ReadOnlyRow>
                  )}
                </Fragment>
              );
            })}
          </tbody>
        </table>
      </form>
    </Fragment>
  );
};

export default MikeTestCustomPage;

export async function getServerSideProps() {
  const prisma = new PrismaClient();
  const fills = await prisma.fills.findMany();
  return {
    props: {
      fills: fills,
    },
  };
}
