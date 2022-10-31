import type { NextPage } from "next";
import { Fragment, MouseEventHandler, useContext } from "react";
import DataContext from "../components/context/data-context";

const CurrentMonthAssetsPage: NextPage = () => {
  const appContext = useContext(DataContext);

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

  const updateReceiptsHandler = () => {};
  return (
    <Fragment>
      <div className="actionButtons">
        <button type="button" onClick={startMonthHandler}>
          Start Month
        </button>
        <button type="button">Re-Initalize Receipts</button>
      </div>
    </Fragment>
  );
};

export default CurrentMonthAssetsPage;
