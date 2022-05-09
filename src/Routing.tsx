import React from "react";
import { BrowserRouter, Routes, Route, Router } from "react-router-dom";
import Login from "./Components/Login";
import Main from "./Components/Main";
import Playlists from "./Components/Main/Playlists";

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
