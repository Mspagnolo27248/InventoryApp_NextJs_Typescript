import { PrismaClient } from "@prisma/client";
import type { NextPage } from "next";
import { Receipts } from "@prisma/client";
import { Fragment } from "react";
import { Grid } from "gridjs-react";
import TableContainer from "../components/tableContainer/tableContainer";





const ReceiptsPage:NextPage = (props:{[key:string]:any})=>{
    
 const receipts = props.receipts;
 const data = receipts.map((data:Receipts)=>{ 
    return     [
    data.id,
    data.GlAccount,
    data.TGDesc,
    data.CD,
    data.Journal,
    data.ReceiptQty,
    data.ReceiptValue,
    data.Date, 
    data.Amount,
    data.QtyClean    ]
 })

 const columnNames = [
    'Id',
    'Gl Account',
    'Gl Description',
    'C/D',
    'Journal',
    'Receipt Qty',
    'Receipt Value',
    'Date',
    'Amount',
    'Qty Clean'
 ]
    return (
        <Fragment>
<div>
Current Month Receipts
</div>
  <TableContainer>
  <Grid 
  data={data} 
  columns={columnNames} 
  search={true}
   sort={true}  
   fixedHeader={true}
   height={'800px'}/>

  </TableContainer>

      
        </Fragment>
      
    )
}

export default ReceiptsPage;


export async function getServerSideProps(){
const prisma = new PrismaClient();
const receipts = await prisma.receipts.findMany();
return {
    props:{
        receipts:receipts
    }
}
}