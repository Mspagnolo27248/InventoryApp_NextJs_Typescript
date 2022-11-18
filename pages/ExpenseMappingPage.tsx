import { ExpenseMapping, PrismaClient } from '@prisma/client';
import type { NextPage } from "next";
import React, { Fragment, Key, useEffect, useState } from 'react'
import { EditableRow } from '../components/table-mds/components/EditableRow';
import { ReadOnlyRow } from '../components/table-mds/components/ReadOnlyRow';
import classes from "../components/table-mds/components/Rows.module.css";

export const ExpenseMappingPage:NextPage = (props: { [key: string]: ExpenseMapping[] }) => {

    const expenseMapping: ExpenseMapping[] = props.expenseMapping;
    const prettyNames = [
        'Product Key',
        'Expense Gl']

    //State Varibles
    const [data, setData] = useState<ExpenseMapping[]>(expenseMapping);
    const [filteredData, setFilteredData] = useState(data);
    const [editId, setEditId] = useState<null | string>(null);
    const [searchField, setSearchField] = useState("");
    const [sortOrder, setSortOrder] = useState<{ [key: string]: number }>({
        ProductKey:0,
        ExpenseGl:0  });


        const [editFormData, setEditFormData] = useState<{
            [key: string]: number | string;
          }>({
            ProductKey: "",
            ExpenseGl:""        
            });


            //Action Handlers
  const handleSortClick = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    const currentData = [...filteredData];
    const e = event.target as HTMLButtonElement;
    const sortField = e.name;

    if (sortOrder[sortField] === 0) {
      currentData.sort((a, b) =>
        a[sortField as keyof ExpenseMapping]! > b[sortField as keyof ExpenseMapping]!
          ? 1
          : b[sortField as keyof ExpenseMapping]! > a[sortField as keyof ExpenseMapping]!
          ? -1
          : 0
      );
      const newSortOrder: { [key: string]: number } = { ...sortOrder };
      newSortOrder[sortField] = 1;
      setSortOrder(newSortOrder);
      setData(currentData);
    } else {
      currentData.sort((a, b) =>
        a[sortField as keyof ExpenseMapping]! < b[sortField as keyof ExpenseMapping]!
          ? 1
          : b[sortField as keyof ExpenseMapping]! < a[sortField as keyof ExpenseMapping]!
          ? -1
          : 0
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
      setEditId(item.ProductKey);
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
      if (item.ProductKey === editId) {
        return Object.assign(item, editFormData);
      } else {
        return item;
      }
    });
    setData(updatedData);

    const output = await fetch("/api/expenseMapping", {
      method: "POST",
      body: JSON.stringify(editFormData),
    });
    setEditId(null);
  };

  useEffect(() => {
    const currentData = [...data];
    const newFilteredData = currentData.filter((record) => {
      const values: (string | number | null)[] = Object.values(record);
      const foundValues = values.filter((field) =>
        field?.toString().includes(searchField)
      );
      return foundValues.length > 0;
    });
    setFilteredData(newFilteredData);
  }, [data, searchField]);

  const dynamicStyle = Object.values(expenseMapping[0]).map((item, idx) => {
    const valueWidth: number = item?.toString().length || 1;
    return {
      border: "none",
      backgroundColor: "inherit",
      cursor: "pointer",
      fontWeight: "bolder",
      width: `${valueWidth * 6}px`,
      minWidth: "70px",
    };
  });



  return (
    <Fragment>
    <div>ExpenseMappingPage</div>
    <div>
    <input
      type="text"
      name="tableSearch"
      onChange={handleSearchBoxFilter}
    ></input>
  </div>
  <div className={classes.verticalScroll}>

 
  <form>
  <table className={classes.tableGrid}>
      <thead>
        <tr>
          {Object.keys(expenseMapping[0]).map((item, idx) => {
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
          <th> Data</th>
        </tr>
      </thead>
      <tbody>
        {filteredData.map((row, idx: Key) => {
          return (
            <Fragment key={idx}>
              {row.ProductKey === editId ? (
                <EditableRow
                  item={editFormData}
                  names={Object.keys(editFormData)}
                  idx={+idx}
                  handleEditClick={handleEditClick}
                  handleEditFormChange={handleEditFormChange}
                  handleEditFormSubmit={handleEditFormSubmit}
                />
              ) : (
                <ReadOnlyRow
                  item={row as { [key: string]: string | number }}
                  idx={+idx}
                  handleEditClick={handleEditClick}
                ></ReadOnlyRow>
              )}
            </Fragment>
          );
        })}
      </tbody>
    </table>
  </form>
  </div>
</Fragment>
  )
}


export default ExpenseMappingPage;

export async function getServerSideProps(){
    const prisma = new PrismaClient();
    const expenseMapping = await prisma.expenseMapping.findMany();
    return {
      props: {
        expenseMapping: expenseMapping,
      },
    };
}
