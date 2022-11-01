import { Fragment, Key } from "react";
import { Item } from "../../containerModel/Models/Item";



function ItemTable(props:{[key:string]:any}) {
    const {itemModel} = props;

    if(itemModel){
        return (
            <div>
            {itemModel.map((data:Item,idx: Key )=>{ return(
        <div key={idx}>GL: {data.GlAccount},
        Item: {data.ItemCode},
        Std: {data.StandardCost},
        ReceiptQty: {data.ReceiptQty},
        Receipt$: {data.ReceiptValue}</div>
      )
        })};       
          </div>
        )        
    }
    return <></>

}

export default ItemTable;