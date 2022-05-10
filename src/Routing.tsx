import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./Components/Login";
import Main from "./Components/Main";

function Routing() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Login />}></Route>
                <Route path="main" element={<Main />}></Route>
            </Routes>
        </BrowserRouter>
    );
}
export default Routing;
