import type { NextPage } from "next";
import { Fragment, useContext } from "react";
import DataContext from "../components/context/data-context";
import { Grid } from "gridjs-react";

const ExpenseGlPage: NextPage = () => {
  const appContext = useContext(DataContext);
  const expenseGlExpense = appContext.expenseGlExpense;
  let data: any[] = [];
  let columnNames: any[] = [
    "Expense GL",
    {name:'Allocated Expense Dollars',
    formatter: (cell:any) => `${cell.toLocaleString("en-US")}`

    }
  ];

  if (expenseGlExpense) {
    data = [...expenseGlExpense.values()].map((data) => {
      return [
      
        data["ExpenseGl"],
        data["AllocatedExpenseDollars"],

      ];
    });
  }

  return (
    <Fragment>
      <div className="verticalScroll tableContainer">
        <Grid data={data} columns={columnNames} search={true} sort={true} />
      </div>
    </Fragment>
  );
};

export default ExpenseGlPage;
