import React, { createContext, useState } from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import App from "./App";

const root = ReactDOM.createRoot(document.getElementById("root") as HTMLElement);

const AuthContext = createContext<any>(null);

root.render(
    <React.StrictMode>
        <App />
    </React.StrictMode>
);
