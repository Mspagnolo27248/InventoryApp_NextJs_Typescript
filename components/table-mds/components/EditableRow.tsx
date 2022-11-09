import React, { Key } from "react";


export const EditableRow = (props: {
  item:  {[key:string]:number|string};
  names: string[];
  idx:number;
  handleEditClick: (event: { preventDefault: () => void; },item: any ,idx: number| null) => void;
  handleEditFormChange: (event: any)=>void;
}) => {
  const item: {[key:string]:number|string}= props.item;
  const names: string[] = props.names;
  const idx:number = props.idx;
  return (
    <tr >
      {Object.values(item).map((value,idx) => {
        return (
          <td key={idx} >
          
            <input
              type="text"
              required={true}
              placeholder="...."
              value={value.toString()}
              name={names[+idx]}
              key={idx}
              onChange={props.handleEditFormChange}
              ></input>  
               
          </td>
        )
      })}
      <td>
      <button type="button" onClick={(event)=>props.handleEditClick(event,item,null)}>Cancel</button>
      {/* <button type="button" onClick={(event)=>props.}>Save</button> */}
      </td>
    </tr>
  )
};
