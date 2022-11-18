import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import { BlockContainerButtons } from '../components/BlockContainerButtons/BlockContainerButtons'

import styles from '../styles/Home.module.css'



const Home: NextPage = () => {

// const orbitalLinks = [
//   { url: '/Table '; heading: string; desc: string },
//   { url: string; heading: string; desc: string }
//   { url: string; heading: string; desc: string }
// ]

  async function updateExpenseTableHandler(e: { preventDefault: any }){
    e.preventDefault;
  await fetch('/api/updateTable?table=expenseMapping')

  }
  
  async function updateTableHandler(e: { preventDefault: any }, url:string){
    e.preventDefault;
  await fetch(url)

  }
 const items = [
  {url: '/api/updateTable?table=expenseMapping', heading: 'Expense Mapping', desc:'re-initalize source data for the expense mappings' ,handler:updateTableHandler},
  {url: '/api/updateTable?table=Receipts', heading: 'Receipts', desc:'re-initalize source data for the ap receipts' ,handler:updateTableHandler},
  {url: '/api/updateTable?table=Bom', heading: 'Bill of Materials', desc:'re-initalize source data for the bill of materials' ,handler:updateTableHandler},
  {url: '/api/updateTable?table=ImsActivity', heading: 'IMS Activity', desc:'re-initalize source data for the IMS Activity' ,handler:updateTableHandler},
  {url: '/api/updateTable?table=Fills', heading: 'Filling Activty', desc:'re-initalize source data for the product fills' ,handler:updateTableHandler},

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
