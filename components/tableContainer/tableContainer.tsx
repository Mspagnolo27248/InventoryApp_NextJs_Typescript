import { ReactElement, JSXElementConstructor, ReactFragment, ReactPortal } from "react"
import classes from "./tableContainer.module.css"


function TableContainer(props: { children:  ReactElement<any, string | JSXElementConstructor<any>> | ReactFragment  }){

    return (
        <div className={classes.tableContainer}>
            {props.children}
        </div>
    )
}

export default TableContainer