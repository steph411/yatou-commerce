import React, { useState, useContext } from "react";
// import S3 from "react-aws-s3";

import { useRoutes, Navigate } from "react-router-dom";
// import AWS from "aws-sdk";
// pages
import DashboardPage from "@pages/Dashboard.page";
import UsersPage from "@pages/Users.page";
import OrdersPage from "@pages/Orders.page";
import CategoriesPage from "@pages/Categories.page";
import ProductsPage from "@pages/Products.page";
import RefundsPage from "@pages/Refunds.page";
import TermsPage from "@pages/Terms.page";
import EarningsPage from "@pages/Earnings.page";
import StatisticsPage from "@pages/Statistics.page";
import ProductsCreatePage from "@pages/ProductsCreate.page";
import ProductPage from "@pages/Product.page";
import LoginPage from "@pages/Login.page";
import { AuthContext } from "./Auth";
import { ApolloClient, InMemoryCache, createHttpLink } from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import { ApolloProvider } from "@apollo/client/react";

const apiUrl = import.meta.env.VITE_API_URL;
console.log({ apiUrl });

// also send the current user role through the props here in element

function App() {
  const authState = useContext(AuthContext);
  const isAuthenticated = authState.user;

  const httpLink = createHttpLink({
    uri: apiUrl,
  });

  const authLink = setContext((_, { headers }) => {
    const token = authState.idToken;
    console.log({ tokenapollo: token, authState });
    return {
      headers: {
        ...headers,
        authorization: token ? `Bearer ${token}` : "",
        "X-Hasura-Role": authState.userRole,
        "X-Hasura-User-Id": authState.user?.uid,
      },
    };
  });

  const apolloClient = new ApolloClient({
    link: authLink.concat(httpLink),
    cache: new InMemoryCache(),
    connectToDevTools: true,
  });

  const element = useRoutes([
    {
      path: "/",
      element: isAuthenticated ? (
        <DashboardPage authState={authState} />
      ) : (
        <Navigate to="/login" />
      ),
      children: [
        {
          path: "/users",
          element: <UsersPage authState={authState} />,
        },
        {
          path: "/products",
          element: <ProductsPage authState={authState}/>
        },
        {
          path: "/products/:productId", 
          element: <ProductPage authState={authState}/>
        },
        {
          path: "products/create",
          element: <ProductsCreatePage authState={authState} />,
        },
        {
          path: "/categories",
          element: <CategoriesPage authState={authState} />,
        },
        {
          path: "/orders",
          element: <OrdersPage authState={authState} />,
        },
        {
          path: "/refunds",
          element: <RefundsPage authState={authState} />,
        },
        {
          path: "/terms",
          element: <TermsPage authState={authState} />,
        },
        {
          path: "/earnings",
          element: <EarningsPage authState={authState} />,
        },
        {
          path: "/statistics",
          element: <StatisticsPage authState={authState} />,
        },
      ],
    },
    { path: "/login", element: <LoginPage authState={authState} /> },
  ]);

  return <ApolloProvider client={apolloClient}>{element}</ApolloProvider>;
}

export default App;
