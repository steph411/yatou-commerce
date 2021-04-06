import React, { useState } from 'react'


import {useRoutes} from 'react-router-dom'

// pages
import DashboardPage from "@pages/Dashboard.page"
import UsersPage from "@pages/Users.page"
import OrdersPage from "@pages/Orders.page"
import CategoriesPage from "@pages/Categories.page"
import ProductsPage from "@pages/Products.page"
import RefundsPage from "@pages/Refunds.page"
import TermsPage from "@pages/Terms.page"
import EarningsPage from '@pages/Earnings.page'
import StatisticsPage from '@pages/Statistics.page'
import LoginPage from '@pages/Login.page'




function App() {
  
  const element = useRoutes([
    { 
      path: "/", 
      element: <DashboardPage />,
      children: [
        {path: "/users", element: <UsersPage />},
        {path: "/products", element: <ProductsPage />},
        {path: "/categories", element: <CategoriesPage />},
        {path: "/orders", element: <OrdersPage />},
        {path: "/refunds", element: <RefundsPage />},
        {path: "/terms", element: <TermsPage />},
        {path: "/earnings", element: <EarningsPage />},
        {path: "/statistics", element: <StatisticsPage />},
      ]
    },
    {path:"/login", element: <LoginPage />},
  ])

  return element
}

export default App
