import { Fragment } from "react";
import { Item } from "../../containerModel/Models/Item";



function TestRender(props:{[key:string]:any}) {
    const {itemModel} = props;

    if(itemModel){
        return (
            <div>
            {itemModel.map((data:Item)=>{ return(
        <div>{data.GlAccount},{data.ItemCode}</div>
      )
        })};       
          </div>
        )
    }

}

export default TestRender;