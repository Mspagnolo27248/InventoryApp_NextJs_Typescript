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
        ['Run Close','runModel']
    ]

 
  return (
    <Fragment>
       {/* <Image src='/logo.svg' alt='logo' width={50} height={10}></Image> */}
        <Nav links={navs}/>
         <Dropdown links={menuItems} />
        <main>{props.children}</main>
    </Fragment>
  )
}