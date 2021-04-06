import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import SidebarMenu from '@components/SidebarMenu'

// icons
import {BellOutlined} from '@ant-design/icons'
import logo from '@assets/logoy.svg'



// ant design components

import { Input, Button } from 'antd'


interface Props{

}


const {Search} = Input

const DashboardPage:React.FC<Props> = ({}) => {

  
  const userimage = ""
  const username = "stephane etaba"
  const onSearch = (value: any) => {
    console.log(value)
  }
  return (
    <section className="grid h-screen bg-white  grid-cols-[minmax(230px,15%),1fr]">
      <aside className="flex flex-col space-y-14 bg-light-blue-800">
        <span className="flex items-center justify-center h-20 overflow-hidden">
          <img src={logo} alt="brand logo" />
        </span> 
        <SidebarMenu />   
      </aside>

      <main className="">
        <header className="flex items-center justify-between h-20 py-5 px-7 bg-light-blue-900">
          <Search
            placeholder="search"
            onSearch={onSearch}
            size="large"
            // className="w-[314px]"
            style={{width: "314px"}}
          />


          <div className="flex items-center justify-between space-x-6">
            <span>
              <BellOutlined style={{color: "white", fontSize:"32px"}} />
            </span>
            
            <div className="flex items-center justify-between space-x-2">
              <span className="font-semibold text-white">
                {username}
              </span>
              <span className="inline-block w-8 h-8 bg-gray-200 rounded-lg">

              </span>
            </div>
          </div>
        </header>

        {/* content section for all the dashboard pages */}
        <section className="p-7">
          <Outlet />
        </section>
      </main>
    </section>
  );
}



export default DashboardPage