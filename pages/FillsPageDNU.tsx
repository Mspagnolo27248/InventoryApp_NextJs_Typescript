import { Fills, prisma, PrismaClient } from "@prisma/client";
import type { NextPage } from "next";

import { Fragment } from "react";
import { Grid } from "gridjs-react";





const FillsPageDNU:NextPage = (props:{[key:string]:any})=>{
    
 const fills = props.fills;
 const data = fills.map((data:Fills)=>{ 
    return     [
data.id,
data.Code,
data.ContainerProduct,
data.ContainerDesc,
data.GroupCode,
data.Key,
data.Product,
data.ProductDesc,
data.FillBottles,
data.FillCases,
data.FillQty,
data.QtyOrBottle,

    ]
 })

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
    "QtyOrBottle"
 ]
    return (
        <Fragment>
<div>
Current Month Receipts
</div>
  
<Grid data={data} columns={columnNames} search={true} sort={true} />
      
        </Fragment>
      
    )
}

export default FillsPageDNU;


export async function getServerSideProps(){
const prisma = new PrismaClient();
const fills = await prisma.fills.findMany();
return {
    props:{
        fills:fills
    }
}
}