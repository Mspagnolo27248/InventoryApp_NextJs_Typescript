import Link from "next/link";
import { Key } from "react";
import DropContent from "./DropContent";
import classes from './dropdown.module.css'

function Dropdown(props: { links: any; }) {
  const { links } = props;
  return (
    <header className={classes.header}>
      <nav className={classes.navigation}>
        <ul>
          {links.map((link: {url:string;name:string;subMenu:any[];},idx: Key | null | undefined) => {
            return (
              <li key={idx} className={classes.link}>
                {link.subMenu?(
                    <>
                    <button type="button">
                        {link.name}
                    </button>
                    <DropContent subMenu={link.subMenu}/>
                    </>

                ):(
                    <>
                    <Link href={link.url}> {link.name} </Link>
                    </>

                )}
              
                
              </li>
            );
          })}
        </ul>
      </nav>
    </header>
  );
}

export default Dropdown;
