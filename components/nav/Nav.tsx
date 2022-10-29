import Link from "next/link";
import classes from './layout.module.css'

function Nav(props: { links: string[][] }) {
  const { links } = props;
  return (
    <header className={classes.header}>
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
