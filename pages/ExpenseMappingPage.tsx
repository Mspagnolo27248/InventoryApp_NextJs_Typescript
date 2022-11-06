import { ExpenseMapping, PrismaClient } from "@prisma/client";
import type { NextPage } from "next";
import { Receipts } from "@prisma/client";
import { Fragment } from "react";
import { Grid } from "gridjs-react";
import TableContainer from "../components/tableContainer/tableContainer";





const ExpenseMapping:NextPage = (props:{[key:string]:any})=>{
    const data = props.expenseMapping.map((data:ExpenseMapping)=>{ 
        return     [
            data.ExpenseGl
            ,data.ProductKey
        ]
     })
    
 
    const gridProps = new Grid({
        data: data,
        columns: [
          "Expense GL",
          "Product Key"
        ],
        pagination: {
          enabled: true,
          limit: 15
        },
        className: {
          container: "table-wrapper"
        }
      });
    
 const expenseMapping = props.expenseMapping;

    return (
        <Fragment>
<div>
Current Month Receipts
</div>
  <TableContainer>
<Grid {...gridProps.props} />

  </TableContainer>

      
        </Fragment>
      
    )
}

export default ExpenseMapping;


export async function getServerSideProps(){
const prisma = new PrismaClient();
const expenseMapping = await prisma.expenseMapping.findMany();
return {
    props:{
        expenseMapping:expenseMapping
    }
}
}