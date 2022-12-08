import type { NextPage } from "next";
import { Fragment, useContext } from "react";
import DataContext from "../components/context/data-context";
import { Grid } from "gridjs-react";

const  AssetGlExpensePage: NextPage = () => {
  const appContext = useContext(DataContext);
  const assetGlExpense = appContext.assetGlExpense;
  let data: any[] = [];
  let columnNames: any[] = [
    "Asset Gl",
    "Item Code",
    {name:'Allocated Expense Dollars',
    formatter: (cell:any) => `${cell.toLocaleString("en-US")}`
    },
    {name:'Un-allocated Expense Dollars',
    formatter: (cell:any) => `${cell.toLocaleString("en-US")}`
    },

  ];

  if (assetGlExpense) {
    data = [...assetGlExpense.values()].map((data) => {
      return [
      
        data["GL"],
        data["ItemCode"],
        data["AllocatedExpense"],
        data["UnallocatedExpense"],

      ];
    });
  }

  return (
    <Fragment>
      <div className="verticalScroll tableContainer">
        <Grid 
        data={data}
         columns={columnNames}
          search={true}
           sort={true} 
          />
      </div>
    </Fragment>
  );
};

export default AssetGlExpensePage;
