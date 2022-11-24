
import type { NextPage } from "next";
import { Fragment } from "react";
import { Grid } from "gridjs-react";
import { BOM, ImsActivity, PrismaClient } from "@prisma/client";





const BillOfMaterialPage:NextPage = (props:{[key:string]:any})=>{
    
 const bom = props.bom;
 const data = bom.map((data:BOM)=>{ 
    return     [
        data.ContainerCode,
        data.ImsCode,
        data.PartType,
        data.Unit,
        data.ProductKey]
 })

 const columnNames = [
    "Container Code",
    "Ims Code",
    "Part Type",
    "Unit",
    "Product Key"
    
 ]
    return (
        <Fragment>
<div>
Current Months Bill of Material
</div>
<div className="verticalScroll">
<Grid 
data={data}
columns={columnNames}
search={true}
sort={true}
/>
</div>      
        </Fragment>
      
    )
}

export default BillOfMaterialPage;


export async function getServerSideProps(){
const prisma = new PrismaClient();
const bom = await prisma.bOM.findMany();
return {
    props:{
        bom:bom
    }
}
}