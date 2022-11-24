import type { NextPage } from "next";
import { Fragment, useContext } from "react";
import DataContext from "../components/context/data-context";
import { Grid } from "gridjs-react";

const CurrentMonthExpensePage: NextPage = () => {
  const appContext = useContext(DataContext);
  const expenseMap = appContext.expenseMap;
  let data: any[] = [];
  let columnNames: string[] = [
    "Product Key",
    "Gl Account",
    "IMS Code",
    "Total Parts Filled Qty",
    "Specific Part Usage Qty",
    "Allocated Expense Dollars",
    "IMS Usage Dollars",
  ];
  if (expenseMap) {
    data = [...expenseMap.values()].map((data) => {
      return [
        data["ProductKey"],
        data["ExpenseGl"],
        data["ImsCode"],
        data["TotalPartFillsQty"],
        data["SpecificPartUsageQty"],
        data["AllocatedExpenseDollars"],
        data["TotalImsUsageDollars"],
      ];
    });
  }

  return (
    <Fragment>
      <div className="verticalScroll">
        <Grid data={data} columns={columnNames} search={true} sort={true} />
      </div>
    </Fragment>
  );
};

export default CurrentMonthExpensePage;
