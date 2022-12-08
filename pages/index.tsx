import { ExpenseDetail } from "../containerModel/Models/ExpenseItem";
import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import { useContext, useEffect, useState } from "react";
import { BlockContainerButtons } from "../components/BlockContainerButtons/BlockContainerButtons";
import { BlockContainerLinks } from "../components/BlockContainerLinks/BlockContainerLinks";
import DataContext from "../components/context/data-context";
import { Item } from "../containerModel/Models/Item";
import styles from "../styles/Home.module.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { PrismaClient } from "@prisma/client";

const Home: NextPage = (props:{[key:string]:string} ) => {
  const appContext = useContext(DataContext);

  const notify = (msg: string) => toast.info(msg);


  useEffect(()=>{
    let expenses:[key:string,model:ExpenseDetail][] = JSON.parse(props.expenseModel);
    let items:[key:string,model:Item][] = JSON.parse(props.itemModel);
    let assetGlExpense = JSON.parse(props.assetGlExpense);
    let expenseGlExpense = JSON.parse(props.expenseGlExpense);

    if(expenses.length>0&&items.length>0){
      let itemMap = new Map<string, Item>(items);
      let expenseMap = new Map<string, ExpenseDetail>(expenses);
      appContext.updateItemMap(itemMap);
      appContext.updateExpenseMap(expenseMap);
      appContext.updateAssetGlExpense(assetGlExpense);
      appContext.updateExpenseGlExpense(expenseGlExpense);
      appContext.updateAssetGlExpense(assetGlExpense);

    }
  
  },
    [])
  
  async function updateTableHandler(e: { preventDefault: any }, url: string) {
    e.preventDefault;
    notify(`Updating ${[...url.split("=")].pop()} table....`);
    await fetch(url);
  }

  const setCurrentModel = async (e: { preventDefault: any }, url: string) => {
    await toast.promise(
       fetch(`/api/setCurrentModel`)
      .then((response) => response.json())
      .then((data) => {
        const itemMap = new Map<string, Item>(data.itemModel);
        const expenseMap = new Map<string, ExpenseDetail>(data.expenseModel);
        const expenseGls = data.expenseGlExpense;
        const assetGls = data.assetGlExpense;

        appContext.updateItemMap(itemMap);
        appContext.updateExpenseMap(expenseMap);
        appContext.updateAssetGlExpense(assetGls);
        appContext.updateExpenseGlExpense(expenseGls);
        
      }),
      {
        pending: 'Running Allocation Calcs...',
        success: 'Update Success 👌',
        error: 'Promise rejected 🤯'
      })};

const static_items = [  {
  url: "/api/updateTable?table=expenseMapping",
  heading: "Expense Mapping",
  desc: "re-initalize source data for the expense mappings",
  handler: updateTableHandler,
},
{
  url: "/api/updateTable?table=assetMapping",
  heading: "Asset Mapping",
  desc: "re-initalize source data for the asset mappings",
  handler: updateTableHandler,
}

]


  const items = [
  
    {
      url: "/api/updateTable?table=Receipts",
      heading: "Receipts",
      desc: "re-initalize source data for the ap receipts",
      handler: updateTableHandler,
    },
    {
      url: "/api/updateTable?table=Bom",
      heading: "Bill of Materials",
      desc: "re-initalize source data for the bill of materials",
      handler: updateTableHandler,
    },
    {
      url: "/api/updateTable?table=ImsActivity",
      heading: "IMS Activity",
      desc: "re-initalize source data for the IMS Activity",
      handler: updateTableHandler,
    },
    {
      url: "/api/updateTable?table=Fills",
      heading: "Filling Activty",
      desc: "re-initalize source data for the product fills",
      handler: updateTableHandler,
    },
    {
      url: "/api/updateTable?table=BeginInventory",
      heading: "Begining Invetory",
      desc: "re-initalize source data for the product fills",
      handler: updateTableHandler,
    },
    {
      url: "/api/updateTable?table=EndingInv",
      heading: "Ending  Inventory",
      desc: "re-initalize source data for the product fills",
      handler: updateTableHandler,
    },
    {
      url: "/api/updateTable?table=AccuralReversals",
      heading: "Accural Reversals",
      desc: "re-initalize source data for the Accural reversals",
      handler: updateTableHandler,
    },
  ];


  const itemsRunModel = [
    {
      url: "/api/setCurrentModel",
      heading: "Run Current Model",
      desc: "Calculates the usage and product expense from the working tables",
      handler: setCurrentModel,
    },
  ];
  const links = [
    {
      url: "/CurrentMonthAssetsPage",
      heading: `Asset Model`,
      desc: `Current Months Asset Usage`,
    },
    {
      url: "/CurrentMonthExpensePage",
      heading: `Expense Model`,
      desc: `Current Expense Output`,
    },
    {
      url: "/AssetExpenseGlPage",
      heading: `Asset Entry`,
      desc: `Container Consumption by Asset Gl`,
    },
    {
      url: "/ExpenseGlPage",
      heading: `Expense Gl Entry`,
      desc: `Container Consumption by Expense Gl`,
    },
  ];

  return (
    <div className={styles.container}>
      <Head>
        <title>Inventory Module</title>
        <meta name="description" content="Inventory module for containers" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className={styles.contentTitle}>
        <h2>Mapping Tables from Source Data</h2>
      </div>
      <BlockContainerButtons items={static_items} />


      <div className={styles.contentTitle}>
        <h2>Initalize Tables from Source Data</h2>
      </div>
      <BlockContainerButtons items={items} />


      <div className={styles.contentTitle}>

        <h2>Update Model</h2>
      </div>
      <BlockContainerButtons items={itemsRunModel} />
      <div className={styles.contentTitle}>
        <h2>Model Outputs</h2>
      </div>

      <BlockContainerLinks items={links} />

      <ToastContainer
        position="top-right"
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />

      <footer className={styles.footer}>
        <a
          href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          Powered by{" "}
          <span className={styles.logo}>
            <Image src="/vercel.svg" alt="Vercel Logo" width={72} height={16} />
          </span>
        </a>
      </footer>
    </div>
  );
};

export default Home;


export async function getServerSideProps() {
  const prisma = new PrismaClient();

 const items = await   prisma.itemModel.findMany();
 const expenses = await prisma.expenseDetail.findMany();
const itemModel = items.map((data)=>{
  return  [data.ItemCode, 
    new Item(
      data.GL,
      data.ItemCode,    
      data.StandardCost,
      data.BeginInvQty,
      data.BeginInvValue,
      data.EndInvQty,
      data.EndInvValue,
      data.ReceiptQty,
      data.ReceiptValue,
      data.UsageQty,
      data.UsageValue,
      data.ImsReceiptQty,
      data.AccuralReversalQty,
      data.AccuralReversalValue,
      data.AccuralQty,
      data.AccuralValue,
      data.AdjReceiptQty,
      data.AdjReceiptValue,
      data.AllocatedExpense,
      data.UnallocatedExpense,
      data.Hurdle)]
})
const expenseModel = expenses.map((data)=>{
return   [data.ProductKey,new ExpenseDetail(
  data.ProductKey,
  data.ExpenseGl||'999999-99',
  data.ImsCode,
  data.TotalPartFillsQty||0,
  data.SpecificPartUsageQty||0,
  data.AllocatedExpenseDollars||0,
  data.TotalImsUsageDollars||0 )]
})


const assetGlExpense = await prisma.$queryRaw`
SELECT 
[GL]
,[ItemCode]
,sum([AllocatedExpense]) as AllocatedExpense
,sum([UnallocatedExpense]) as UnallocatedExpense
FROM [NewContainers].[dbo].[ItemModel]
Group By 
[GL]
,[ItemCode]
order by 
AllocatedExpense desc
`
const expenseGlExpense = await prisma.$queryRaw`
SELECT 
[ExpenseGl]
,sum([AllocatedExpenseDollars]) as AllocatedExpenseDollars 
FROM [NewContainers].[dbo].[ExpenseDetail]
Group By 
[ExpenseGl]
Order by AllocatedExpenseDollars desc
`
  return {
    props: {
      itemModel: JSON.stringify(itemModel),
      expenseModel:JSON.stringify(expenseModel),
      assetGlExpense:JSON.stringify(assetGlExpense),
      expenseGlExpense:JSON.stringify(expenseGlExpense)    
    },
  };
}