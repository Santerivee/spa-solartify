import React, { useState } from "react";
import { Link } from "react-router-dom";
import "../styles/Login.css";

const Login = () => {
    const [checked, setChecked] = useState(true);
    const login = function () {
        //send auth req to spotify

        //if checked, deletion allowed. pretty obvious
        const scope = checked
            ? "streaming playlist-read-collaborative playlist-read-private user-read-private playlist-modify-public playlist-modify-private"
            : "streaming playlist-read-collaborative playlist-read-private user-read-private";

        const client_id = "ae780b9e7bf4476285fcfc7475fc2664";
        const redirect_uri = "http://localhost:3000/main";

        let state: string | boolean = (() => {
            const length = 36;
            const possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
            let text = "";

            for (let i = 0; i < length; i++) {
                text += possible.charAt(Math.floor(Math.random() * possible.length));
            }
            return text;
        })();

        //state to local storage if exists
        if (window.localStorage) {
            localStorage.setItem("state", state);
            localStorage.setItem("scope", scope);
        } else {
            state = false;
        }

        let url =
            "https://accounts.spotify.com/authorize" +
            "?response_type=token" +
            "&client_id=" +
            encodeURIComponent(client_id) +
            "&scope=" +
            encodeURIComponent(scope) +
            "&redirect_uri=" +
            encodeURIComponent(redirect_uri) +
            (state ? "&state=" + encodeURIComponent(state) : "");

        //redirect to url
        //@ts-ignore
        window.location = url;
    };

    return (
        <div id="login-container">
            <button onClick={() => login()} id="login-btn">
                Login
            </button>
            <label id="allow-delete-label" htmlFor="allow-delete">
                allow removing songs on playlists
            </label>
            <input
                onChange={function (e) {
                    setChecked(e.target.checked);
                }}
                checked={checked}
                type="checkbox"
                id="allow-delete"
            ></input>
        </div>
    );
};
export default Login;
