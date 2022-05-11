import React, { useState } from "react";
import "../styles/Login.css";

const Login = () => {
    const [checked, setChecked] = useState(true);
    const login = function () {
        //send auth req to spotify
        const client_id = "ae780b9e7bf4476285fcfc7475fc2664";
        const _redirect_uri = "https://solartify.web.app/main"; //prod
        const redirect_uri = "http://localhost:3000/main"; //dev

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
            console.log("localstorage state set");
            localStorage.setItem("state", state);
        } else {
            state = false;
        }

        //if checked, deletion allowed. pretty obvious.
        //dont allow deletion if state cant be validated, just in case
        const scope =
            checked && state
                ? "streaming playlist-read-collaborative playlist-read-private user-read-private playlist-modify-public playlist-modify-private"
                : "streaming playlist-read-collaborative playlist-read-private user-read-private";

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
            <a href="https://github.com/santerivee/spa-solartify">Github</a>
        </div>
    );
};
export default Login;
