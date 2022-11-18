import Link from "next/link";
import React from "react";
import classes from "./BlockContainerButtons.module.css";

 export const BlockContainerButtons = (props: {
  items: { url: string; heading: string; desc: string,handler:(event: any,url: string)=>void }[];
}) => {
  const items = props.items;

  return (
    <div className={classes.container}>
      <ul className={classes.featureList}>
        {items.map((item,idx) => {return(
        
          <li className={classes.featureItem} key={idx}>
            <button onClick={(event)=>item.handler(event,item.url)}  className={classes.listItemLink}>
              <div className={classes.itemCard}>
                <h3 className={classes.itemCardHeading}>{item.heading}</h3>
                <p className={classes.itemCardText}>
                 {item.desc}
                </p>
              </div>
            </button>
          </li>)
        })}
      </ul>
    </div>
  );
};

