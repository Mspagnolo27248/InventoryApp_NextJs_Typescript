import { ExpenseMapping, PrismaClient } from "@prisma/client";
import type { NextPage } from "next";
import { Receipts } from "@prisma/client";
import { Fragment, useState } from "react";
import { Grid ,_} from "gridjs-react";
import TableContainer from "../components/tableContainer/tableContainer";





const ExpenseMapping:NextPage = (props:{[key:string]:any})=>{

   
    const propData = props.expenseMapping.map((data:ExpenseMapping)=>{ 
        return     [
            data.ProductKey,
            data.ExpenseGl
           
        ]
     });

const rowSaveHandler = async  (cell:any ,row:any)=>{
    const productKey = row.cells[0].data;
    const expenseGl = row.cells[1].data;

  const records = {ProductKey:productKey ,ExpenseGl:expenseGl}
 const output = await fetch('/api/expenseMapping',{
     method: 'POST',
     body: JSON.stringify(records) 
    }) 


}

    const [data, setData] = useState(propData);
    

 const rowClickHandler = (cell:any,row:any)=>{
    alert(`Editing "${row.cells[0].data}" "${row.cells[1].data}"  `)
    
 }


    


    const gridProps = new Grid({
        data: data,
        columns: [
          
          "Product Key",
          {
            name: 'Expense Gl',
            formatter: (cell: any, row: any) => _(
                <input 
                type={'text'} 
                defaultValue={cell}
             
                ></input>
            )
          } ,
          
            {
                name: 'Email',
                formatter: (cell: any, row: any) => _(<button onClick={()=>rowSaveHandler(cell,row)}></button>)
              } 
          
        ],
      
        sort: true,
        fixedHeader: true,
        height: '400px',
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