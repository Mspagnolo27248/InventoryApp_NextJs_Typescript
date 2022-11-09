import React from "react";

export const ReadOnlyRow = (props: { item: { [key: string]: string | number; }; idx: any; handleEditClick: (arg0: React.MouseEvent<HTMLButtonElement, MouseEvent>, arg1: { [key: string]: string | number; }, arg2: any) => void; })=>{
  const item: {[key:string]:number|string}= props.item;
  const idx = props.idx
  
  return (
    <tr >
      {Object.values(item).map((value,idx) => {
        return <td key={idx}>{value}</td>;
      })}
<td>
<button type="button" onClick={(event)=>props.handleEditClick(event,item,idx)}>Edit</button>
</td>
      
    </tr>
  );
};
