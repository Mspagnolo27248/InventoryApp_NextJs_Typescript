
import type { NextPage } from "next";
import { Fragment } from "react";
import { Grid } from "gridjs-react";
import { ImsActivity, PrismaClient } from "@prisma/client";





const ImsActivityPage:NextPage = (props:{[key:string]:any})=>{
    
 const imsActivity = props.imsActivity;
 const data = imsActivity.map((data:ImsActivity)=>{ 
    return     [
data.IMS_Code,
data.BEGBALANCE,
data.TOTALRECEIPTS,
data.TOTALISSUES,
data.TOTALRETURNS,
data.TOTALADJUSTMENTS,
data.TOTALPHYSICAL,
data.TOTALTRANSFERFROM,
data.TOTALTRANSFERTO,
data.ENDBALANCE ]
 })

 const columnNames = [
    "IMS Code",
    "BEG BALANCE",
    "TOTAL RECEIPTS",
    "TOTAL ISSUES",
    "TOTAL RETURNS",
    "TOTAL ADJUSTMENTS",
    "TOTAL PHYSICAL",
    "TOTAL TRANSFER FROM",
    "TOTAL TRANSFER TO",
    "END BALANCE"    
 ]
    return (
        <Fragment>
<div>
Current Months IMS Activity
</div>
<div  className="verticalScroll">
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

export default ImsActivityPage;


export async function getServerSideProps(){
const prisma = new PrismaClient();
const imsActivity = await prisma.imsActivity.findMany();
return {
    props:{
        imsActivity:imsActivity
    }
}
}