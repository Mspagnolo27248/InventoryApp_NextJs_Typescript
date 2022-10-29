import Link from "next/link";
import { Key } from "react";

function DropContent(props: { subMenu: {name:string;url:string;}[]}) {
  const { subMenu } = props;
  return (
    <ul>
      
        {subMenu.map((data,idx) => {
          return(

            <li>
                <Link href={data.url}>{data.name}</Link>
            </li>
          )
          
       
        })}
      
    </ul>
  );
}

export default DropContent;
