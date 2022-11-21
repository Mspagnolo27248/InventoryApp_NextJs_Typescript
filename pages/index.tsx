import { ExpenseDetail } from "../containerModel/Models/ExpenseItem";
import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import { useContext, useState } from 'react'
import { BlockContainerButtons } from '../components/BlockContainerButtons/BlockContainerButtons'
import { BlockContainerLinks } from '../components/BlockContainerLinks/BlockContainerLinks'
import DataContext from "../components/context/data-context";
import { Item } from '../containerModel/Models/Item'
import styles from '../styles/Home.module.css'
// import ClipLoader from "react-spinners/ClipLoader";
import { BeatLoader } from "react-spinners";


const Home: NextPage = () => {
BeatLoader
// const orbitalLinks = [
//   { url: '/Table '; heading: string; desc: string },
//   { url: string; heading: string; desc: string }
//   { url: string; heading: string; desc: string }
// ]
const [ loading,setLoading] = useState<boolean>(false);

  async function updateExpenseTableHandler(e: { preventDefault: any }){
    e.preventDefault;
  await fetch('/api/updateTable?table=expenseMapping')

  }
  
  async function updateTableHandler(e: { preventDefault: any }, url:string){
    e.preventDefault;
    setLoading(true);
  await fetch(url)
  .then(()=>setLoading(false))

  }

  const appContext = useContext(DataContext);

  const setCurrentModel = async (e: { preventDefault: any },url:string) => {
    setLoading(true);
    await fetch(`/api/setCurrentModel`)
      .then((response) => response.json())
      .then((data) => {        
        const itemMap = new Map<string, Item>(data.itemModel);
        const expenseMap = new Map<string,ExpenseDetail>(data.expenseModel)
        appContext.updateItemMap(itemMap);
        appContext.updateExpenseMap(expenseMap);
        setLoading(false);
      });
  };

 const items = [
  {url: '/api/updateTable?table=expenseMapping', heading: 'Expense Mapping', desc:'re-initalize source data for the expense mappings' ,handler:updateTableHandler},
  {url: '/api/updateTable?table=Receipts', heading: 'Receipts', desc:'re-initalize source data for the ap receipts' ,handler:updateTableHandler},
  {url: '/api/updateTable?table=Bom', heading: 'Bill of Materials', desc:'re-initalize source data for the bill of materials' ,handler:updateTableHandler},
  {url: '/api/updateTable?table=ImsActivity', heading: 'IMS Activity', desc:'re-initalize source data for the IMS Activity' ,handler:updateTableHandler},
  {url: '/api/updateTable?table=Fills', heading: 'Filling Activty', desc:'re-initalize source data for the product fills' ,handler:updateTableHandler},
]

const itemsRunModel =  [{url: '/api/setCurrentModel', heading: 'Run Current Model', desc:'Calculates the usage and product expense from the working tables' ,handler:setCurrentModel}]
const links = [
  { url: '/CurrentMonthAssetsPage', heading: `Asset Model`, desc: `Current Months Asset Usage` },
  { url: '/CurrentMonthExpensePage', heading: `Expense Model`, desc: `Current Expense Output` },
  { url: '/CurrentMonthAssets', heading: `Live Model`, desc: `Current Months Model` },
]

  return (
    <div className={styles.container}>
      <Head>
        <title>Inventory Module</title>
        <meta name="description" content="Inventory module for containers" />
        <link rel="icon" href="/favicon.ico" />

      </Head>

   
      {/* <div className={styles.contentStart}>
        Test */}
        {/* <button type='button' onClick={updateExpenseTableHandler}> Update Table</button>
      </div> */}

      <div className={styles.contentTitle}>
        <h2>Initalize Tables from Source Data</h2>
      </div>
      <BlockContainerButtons items={items} />
      <div className={styles.contentTitle}>
        <h2>Update Model</h2>
      
        <BeatLoader
        loading={loading}
        aria-label="Loading Spinner"
        data-testid="loader"
      />
      </div>
      <BlockContainerButtons items={itemsRunModel} />
      <div className={styles.contentTitle}>
        <h2>Model Outputs</h2>
      </div>

      <BlockContainerLinks items={links}  />
    




      <footer className={styles.footer}>
        <a
          href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          Powered by{' '}
          <span className={styles.logo}>
            <Image src="/vercel.svg" alt="Vercel Logo" width={72} height={16} />
          </span>
        </a>
      </footer>
    </div>
  )
}

export default Home
