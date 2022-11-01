import {
  AssetMapping,
  Receipts,
} from "@prisma/client";
import type { NextPage } from "next";
import {
  Fragment,
  useContext,
} from "react";
import DataContext from "../components/context/data-context";
import ItemTable from "../components/ItemTable/ItemTable";
import { Item } from "../containerModel/Models/Item";

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

  const updateReceiptsHandler = async (e: { preventDefault: any }) => {
    console.log("ex");
    e.preventDefault;
    const receipts = await fetch(`/api/receipts`)
      .then((response) => response.json())
      .then((data) => data);

    const updateItems = appContext.items.map((item, idx) => {
      let receipt: Receipts = receipts.find(
        (receipt: Receipts) => receipt.GlAccount == item.GlAccount
      );

      let update: { [key: string]: number } = {
        ReceiptQty: 0 + item.ReceiptQty,
        ReceiptValue: 0 + item.ReceiptValue,
      };

      if (receipt) {
        update = {
          ReceiptQty: receipt.QtyClean || 0 + item.ReceiptQty,
          ReceiptValue: receipt.ReceiptValue || 0 + item.ReceiptValue,
        };
      }

      return Object.assign(item, update);
    });

    appContext.updateItems(updateItems);
  };

  const initalizeAssetMapHandler = async (e: { preventDefault: any }) => {
    e.preventDefault;
    const assetMapping = await fetch(`/api/assetMapping`)
      .then((response) => response.json())
      .then((data) => data);

    const initalItems = assetMapping.map((data: AssetMapping) => {
      return new Item(data.GLAccount!, data.ItemCode!, data.StandardCost!);
    });

    appContext.updateItems(initalItems);
  };

  return (
    <Fragment>
      <div className="actionButtons">
        <button type="button" onClick={startMonthHandler}>
          Start Month
        </button>
        <button type="button" onClick={updateReceiptsHandler}>
          Re-Initalize Receipts
        </button>

        <button type="button" onClick={initalizeAssetMapHandler}>
          Initalize AssetMapp
        </button>
      </div>

      <ItemTable itemModel={appContext.items} />
    </Fragment>
  );
};

export default CurrentMonthAssetsPage;
