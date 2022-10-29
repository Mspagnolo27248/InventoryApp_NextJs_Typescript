import Link from "next/link";
import { Key } from "react";
import DropContent from "./DropContent";
import classes from './dropdown.module.css'

function Dropdown(props: { links: any; }) {
  const { links } = props;
  return (
    <header>
      <nav className={classes.navbar}>
        <ul>
          {links.map((link: {url:string;name:string;subMenu:any[];},idx: Key | null | undefined) => {
            return (
              <li key={idx} className={classes.link}>
                {link.subMenu?(
                    <div className={classes.dropdown}>
                    <button type="button" className={classes.dropbtn}>
                        {link.name}
                    </button>
                    <DropContent subMenu={link.subMenu}/>
                    </div>

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
