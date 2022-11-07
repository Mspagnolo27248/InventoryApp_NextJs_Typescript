import React from "react";

export const ReadOnlyRow = (props: { item: any[]; }) => {
  const item: any[]= props.item;
  return (
    <tr>
      {item.map((value) => {
        return <td>{value}</td>;
      })}
    </tr>
  );
};
