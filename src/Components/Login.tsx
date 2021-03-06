import React, { useState } from "react";
import "../styles/Login.css";
import redirect_uri from "../redirect_uri";

// export const redirect_uri = "https://solartify.web.app/main"; //prod
// // export const redirect_uri = "http://localhost:3000/main"; //dev

const Login = () => {
    const [checked, setChecked] = useState(true);
    const login = function () {
        //send auth req to spotify

        const client_id = "ae780b9e7bf4476285fcfc7475fc2664";

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
        } else {
            state = false;
        }

        //if checked, deletion allowed. pretty obvious.
        //dont allow deletion if state cant be validated, just in case
        const scope =
            checked && state
                ? "streaming user-read-playback-state user-modify-playback-state playlist-read-collaborative playlist-read-private user-read-private playlist-modify-public playlist-modify-private"
                : "streaming user-read-playback-state user-modify-playback-state playlist-read-collaborative playlist-read-private user-read-private";

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
            <a href="https://github.com/Santerivee/spa-solartify">Solartify {process.env.REACT_APP_VERSION}</a>
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
