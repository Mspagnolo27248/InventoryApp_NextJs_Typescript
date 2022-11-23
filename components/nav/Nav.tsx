import Link from "next/link";
import classes from './layout.module.css'
import Image from 'next/image'
function Nav(props: { links: string[][] }) {
  const { links } = props;
  return (
    <header className={classes.header}>
        <Image src='/ArgLogo.png' alt='logo' width={150} height={50}></Image>
      <nav className={classes.navigation}>
    
        <ul>
          {links.map((link,idx) => {
            return (
              <li key={idx} className={classes.link}>
                <Link href={`/${link[1]}`}>{link[0]}</Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </header>
  );
}

export default Nav;
