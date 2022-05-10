import React, { createContext, useState } from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import App from "./App";

const root = ReactDOM.createRoot(document.getElementById("root") as HTMLElement);

/*
    TODO about page
    credits:
        {external_link_tag(playlists): "https://commons.wikimedia.org/wiki/File:OOjs_UI_icon_external-link-ltr.svg"}
*/

const AuthContext = createContext<any>(null);

root.render(<App />);
