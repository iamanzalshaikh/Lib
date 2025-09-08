import React from "react";
import ReactDOM from "react-dom/client";
import { HashRouter } from 'react-router-dom';
import App from "./App";
import "./index.css";
import AuthProvider from "./context/AuthContext";
import UserContext from "./context/userContext";

ReactDOM.createRoot(document.getElementById("root")).render(
  <HashRouter>
    <AuthProvider>
      <UserContext>
        <App />
      </UserContext>
    </AuthProvider>
  </HashRouter>
);
