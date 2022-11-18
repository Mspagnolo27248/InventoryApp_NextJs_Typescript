import Link from "next/link";
import React from "react";
import { UrlObject } from "url";
import classes from "./BlockContainer.module.css";

export const BlockContainer = (props: {
  items: { url: string; heading: string; desc: string }[];
}) => {
  const items = props.items;

  return (
    <div className={classes.container}>
      <ul className={classes.featureList}>
        {items.map((item,idx) => {return(

        
          <li className={classes.featureItem} key={idx}>
            <Link href={item.url} className={classes.listItemLink}>
              <div className={classes.itemCard}>
                <h3 className={classes.itemCardHeading}>{item.heading}</h3>
                <p className={classes.itemCardText}>
                 {item.desc}
                </p>
              </div>
            </Link>
          </li>)
        })}
      </ul>
    </div>
  );
};
