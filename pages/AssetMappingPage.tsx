
import { AssetMapping, PrismaClient } from "@prisma/client";
import type { NextPage } from "next";
import React, { Fragment, Key, useEffect, useState } from 'react'
import { EditableRow } from '../components/table-mds/components/EditableRow';
import { ReadOnlyRow } from '../components/table-mds/components/ReadOnlyRow';
import classes from "../components/table-mds/components/Rows.module.css";

export const AssetMappingPage:NextPage = (props: { [key: string]: AssetMapping[] }) => {

    const assetMapping: AssetMapping[] = props.assetMapping;
    const prettyNames = [
"Item Code",
"GL Account",
"GL Desc",
"Gl Account",
"Part",
"Standard Cost" 
]

    //State Varibles
    const [data, setData] = useState<AssetMapping[]>(assetMapping);
    const [filteredData, setFilteredData] = useState(data);
    const [editId, setEditId] = useState<null | string>(null);
    const [searchField, setSearchField] = useState("");
    const [sortOrder, setSortOrder] = useState<{ [key: string]: number }>({
        ItemCode:0,
        GL:0,
      Desc:0,
    GlAccount:0,
  Part:0,
StandardCost:0  });


        const [editFormData, setEditFormData] = useState<{
            [key: string]: number | string;
          }>({
              ItemCode:"",
              GL:"",
              Desc:"",
              GlAccount:"",
              Part:"",
              StandardCost:0        
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
        a[sortField as keyof AssetMapping]! > b[sortField as keyof AssetMapping]!
          ? 1
          : b[sortField as keyof AssetMapping]! > a[sortField as keyof AssetMapping]!
          ? -1
          : 0
      );
      const newSortOrder: { [key: string]: number } = { ...sortOrder };
      newSortOrder[sortField] = 1;
      setSortOrder(newSortOrder);
      setData(currentData);
    } else {
      currentData.sort((a, b) =>
        a[sortField as keyof AssetMapping]! < b[sortField as keyof AssetMapping]!
          ? 1
          : b[sortField as keyof AssetMapping]! < a[sortField as keyof AssetMapping]!
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
      setEditId(item.ItemCode);
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
      if (item.ItemCode === editId) {
        return Object.assign(item, editFormData);
      } else {
        return item;
      }
    });

    setData(updatedData);

    const output = await fetch("/api/assetMapping", {
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

  let dynamicStyle:{
    border: string,
    backgroundColor: string,
    cursor:string,
    fontWeight:string,
    width: string,
    minWidth: string}[] = []
    
  if(assetMapping.length>0){
     dynamicStyle = Object.values(assetMapping[0]).map((item, idx) => {
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
  }
  else{
     dynamicStyle = [{
      border: "none",
      backgroundColor: "inherit",
      cursor: "pointer",
      fontWeight: "bolder",
      width: `${16 * 6}px`,
      minWidth: "70px",
    }]
  }


if(assetMapping.length>0){
  return (
    <Fragment>
    <div>Asset Mapping</div>
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
          {Object.keys(assetMapping[0]).map((item, idx) => {
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
              {row.ItemCode === editId ? (
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
else{
  return (
    <></>
  )
}


}


export default AssetMappingPage;

export async function getServerSideProps(){
    const prisma = new PrismaClient();
    const assetMapping = await prisma.assetMapping.findMany();
    return {
      props: {
        assetMapping: assetMapping,
      },
    };
}
