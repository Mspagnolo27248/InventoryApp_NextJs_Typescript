import { ExpenseDetail, PrismaClient } from "@prisma/client";
import type { NextPage } from "next";
import { Fragment, MouseEventHandler, useContext, useEffect, useState } from "react";
import DataContext from "../components/context/data-context";
import TestRender from "../components/testContextRender/testContextRender";
import { Item } from "../containerModel/Models/Item";



const CurrentMonthAssetsPage: NextPage = () => {
  const appContext = useContext(DataContext);

  // const [itemModel,setItemModel] = useState<Item[]>(appContext.items||[]);
  // const [expenseDetail,setExpenseDetail] = useState<ExpenseDetail[]>(appContext.expenses||[]);

  // useEffect(()=>{
  //   setItemModel(appContext.items||[]);
  //   setExpenseDetail(appContext.expenses||[])
  //   },[])


  const startMonthHandler = async (e: { preventDefault: any }) => {
    //fetch asset map
    e.preventDefault;
    await fetch(`/api/staticRun`)
      .then((response) => response.json())
      .then((data) => {
        appContext.updateItems(data.items);
        appContext.updateExpenses(data.expenses);
       
       
      });
  };

  const updateReceiptsHandler = () => {

  };

  
  return (
    <Fragment>
      <div className="actionButtons">
        <button type="button" onClick={startMonthHandler}>
          Start Month
        </button>
        <button type="button">Re-Initalize Receipts</button>
      </div>

       <TestRender itemModel={appContext.items} />
    </Fragment>
  );
};

export default CurrentMonthAssetsPage;


// async function getServerSideProps(){
//   const prisma = new PrismaClient();
//   const  items = await prisma.itemModel.findMany();
//   const  expenses = await prisma.expenseDetail.findMany();

//   return {
//     props:{
//       itemModel:items,
//       expenseDetail:expenses,
//     }
//   }


// }
