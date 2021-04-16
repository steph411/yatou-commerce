import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter as Router } from "react-router-dom";
import "./index.css";
import "antd/dist/antd.css";
import App from "./App";
import { AuthProvider } from "./Auth";
// import { ApolloClient, InMemoryCache } from "@apollo/client";
// import {ApolloProvider} from '@apollo/client/react';

// const apiUrl = "http://localhost:7789/v1/graphql"
// const apolloClient = new ApolloClient({
//   uri: apiUrl,
//   cache: new InMemoryCache(),
// });

ReactDOM.render(
  <React.StrictMode>
    <AuthProvider>
      <Router>
        <App />
      </Router>
    </AuthProvider>
  </React.StrictMode>,
  document.getElementById("root")
);
