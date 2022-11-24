import React, { Fragment } from 'react'
import DropContent from '../dropdown/DropContent'
import Dropdown from '../dropdown/DropDown'
import Nav from './Nav'
import {menuItems} from '../../content/menus'
import Image from 'next/image'

export  const Layout = (props: {
     children: string | number | boolean | 
     React.ReactElement<any, string | React.JSXElementConstructor<any>> | 
     React.ReactFragment | React.ReactPortal | null | undefined }) => {
  

    const navs = [
        ['Home',''],
        ['Run Close','CurrentMonthAssetsPage']
    ]

 
  return (
    <Fragment>
       <header style={
        {position:"fixed",
        top:"0",
        width:"100%",
        zIndex:"100"
        }}>

      
        <Nav links={navs}/>
      
         <Dropdown links={menuItems} />
         </header>
        <main>{props.children}</main>
   
    </Fragment>
  )
}