import Link from "next/link";
import { Key } from "react";
import classes from './dropdown.module.css'

function DropContent(props: { subMenu: {name:string;url:string;}[]}) {
  const { subMenu } = props;
  return (
    <ul className={classes.dropdownContent}>
      
        {subMenu.map((data,idx) => {
          return(

            <li key={idx} >
                <Link href={data.url}>{data.name}</Link>
            </li>
          )
          
       
        })}
      
    </ul>
  );
}

export default DropContent;
