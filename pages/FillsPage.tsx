import { Fills, PrismaClient } from "@prisma/client";
import { strict } from "assert";
import type { NextPage } from "next";
import {
  Fragment,
  Key,
  MouseEvent,
  SetStateAction,
  useEffect,
  useState,
} from "react";
import { EditableRow } from "../components/table-mds/components/EditableRow";
import { ReadOnlyRow } from "../components/table-mds/components/ReadOnlyRow";
import classes from "../components/table-mds/components/Rows.module.css";

const FillsPage: NextPage = (props: { [key: string]: any }) => {
  const fillsArray = props.fills.map((data: Fills) => {
    return {
      id: data.id,
      Code: data.Code,
      ContainerProduct: data.ContainerProduct,
      ContainerDesc: data.ContainerDesc,
      GroupCode: data.GroupCode,
      Key: data.Key,
      Product: data.Product,
      ProductDesc: data.ProductDesc,
      FillBottles: data.FillBottles,
      FillCases: data.FillCases,
      FillQty: data.FillQty,
      QtyOrBottle: data.QtyOrBottle,
    };
  });

  const columnNames = [
    "id",
    "Code",
    "ContainerProduct",
    "ContainerDesc",
    "GroupCode",
    "Key",
    "Product",
    "ProductDesc",
    "FillBottles",
    "FillCases",
    "FillQty",
    "QtyOrBottle",
  ];

  
  const prettyNames = [
    "ID",
    "Container",
    "Prod Cont",
    "Desc",
    "Unit",
    "Key",
    "Product",
    "Product Desc",
    "Fill Bottles",
    "Fill Cases",
    "Fill Qty",
    "Qty Or Bottle",
  ];


  //State Varibles
  const [data, setData] = useState(fillsArray);
  const [filteredData, setFilteredData] = useState(data);
  const [editId, setEditId] = useState<null | number>(null);
  const [searchField, setSearchField] = useState("");
  const [sortOrder, setSortOrder] = useState<{ [key: string]: number }>({
    id: 0,
    Code: 0,
    ContainerProduct: 0,
    ContainerDesc: 0,
    GroupCode: 0,
    Key: 0,
    Product: 0,
    ProductDesc: 0,
    FillBottles: 0,
    FillCases: 0,
    FillQty: 0,
    QtyOrBottle: 0,
  });

  const [editFormData, setEditFormData] = useState<{
    [key: string]: number | string;
  }>({
    id: 0,
    Code: "",
    ContainerProduct: "",
    ContainerDesc: "",
    GroupCode: "",
    Key: "",
    Product: "",
    ProductDesc: "",
    FillBottles: 0,
    FillCases: 0,
    FillQty: 0,
    QtyOrBottle: 0,
  });

  //Action Handlers
  const handleSortClick = (
    event: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>
  ) => {
    const currentData = [...filteredData];
    const e = event.target as HTMLInputElement;
    const sortField = e.name;

    if (sortOrder[sortField] === 0) {
      currentData.sort((a, b) =>
        a[sortField] > b[sortField] ? 1 : b[sortField] > a[sortField] ? -1 : 0
      );
      const newSortOrder: { [key: string]: number } = { ...sortOrder };
      newSortOrder[sortField] = 1;
      setSortOrder(newSortOrder);
      setData(currentData);
    } else {
      currentData.sort((a, b) =>
        a[sortField] < b[sortField] ? 1 : b[sortField] < a[sortField] ? -1 : 0
      );
      const newSortOrder: { [key: string]: number } = { ...sortOrder };
      newSortOrder[sortField] = 0;
      setSortOrder(newSortOrder);
      setFilteredData(currentData);
    }
  };

  const handleEditClick = (
    event: { preventDefault: () => void },
    item: any,
    idx: number | null
  ) => {
    event.preventDefault();
    if(idx===null){
      setEditId(null);
    }
    else{
      setEditId(item.id);
    }
    setEditFormData(item);
  };

  const handleEditFormChange = (event: {
    preventDefault: () => void;
    target: { getAttribute: (arg0: string) => string; value: string | number };
  }) => {
    event.preventDefault();
    const name: string = event.target.getAttribute("name");
    const value: string | number = event.target.value;
    const newFormData: { [key: string]: number | string } = { ...editFormData };
    newFormData[name] = value;
    setEditFormData(newFormData);
  };

  const handleSearchBoxFilter = (event: {
    preventDefault: () => void;
    target: { value: any };
  }) => {
    event.preventDefault();
    const searchValue = event.target.value;
    setSearchField(searchValue);
  };

  const handleEditFormSubmit = async (event: {
    preventDefault: () => void;
  }) => {
    event.preventDefault();
    const currentData = [...data];
    const updatedData = currentData.map((item, idx) => {
      if (item.id === editId) {
        return Object.assign(item, editFormData);
      } else {
        return item;
      }
    });
    setData(updatedData);

    const output = await fetch("/api/fills", {
      method: "POST",
      body: JSON.stringify(editFormData),
    });
    setEditId(null);
  };

  useEffect(() => {
    const currentData = [...data];
    const newFilteredData = currentData.filter((record) => {
      const values: string[] = Object.values(record);
      const foundValues = values.filter((field) =>
        field.toString().includes(searchField)
      );
      return foundValues.length > 0;
    });
    setFilteredData(newFilteredData);
  }, [data, searchField]);

  const dynamicStyle = Object.values(fillsArray[0]).map((item,idx)=>{
    const valueWidth:number = item?.toString().length||1;
    return  (
      { border: "none",
      backgroundColor: "inherit",
      cursor: "pointer",
      fontWeight: "bolder",
      width:`${valueWidth*6}px`,
      minWidth:"70px"
   }

    )  
  })



  return (
    <Fragment>
      <div>Current Month Receipts</div>
      <div>
        <input
          type="text"
          name="tableSearch"
          onChange={handleSearchBoxFilter}
         
        ></input>
      </div>
      <form>
        <table className={classes.tableGrid}>
          <thead>
            <tr key={999999}>
              {columnNames.map((item, idx) => {
         
                return (
                  <th key={idx}>
                    <button
                      type="button"
                      name={item}
                      onClick={(event) => handleSortClick(event)}
                     style={dynamicStyle[idx]}
                    >
                      {prettyNames[idx]}
                    </button>
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {filteredData.map(
              (row: { [key: string]: number | string }, idx: Key) => {
                return (
                  <Fragment key={idx}>
                    {row.id === editId ? (
                      <EditableRow
                        item={editFormData}
                        names={columnNames}
                        idx={+idx}
                        handleEditClick={handleEditClick}
                        handleEditFormChange={handleEditFormChange}
                        handleEditFormSubmit={handleEditFormSubmit}
                      />
                    ) : (
                      <ReadOnlyRow
                        item={row}
                        idx={+idx}
                        handleEditClick={handleEditClick}
                      ></ReadOnlyRow>
                    )}
                  </Fragment>
                );
              }
            )}
          </tbody>
        </table>
      </form>
    </Fragment>
  );
};

export default FillsPage;

export async function getServerSideProps() {
  const prisma = new PrismaClient();
  const fills = await prisma.fills.findMany();
  return {
    props: {
      fills: fills,
    },
  };
}


