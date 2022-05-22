import Player from "./Main/Player";
import Spinner from "./Main/Spinner";
import { AuthContext } from "../App";
import { useEffect, useContext, useState } from "react";
import Playlists from "./Main/Playlists";

const Main = () => {
    //@ts-ignore
    const [authObj, setAuthObj] = useContext(AuthContext);
    const [playlist, setPlaylist] = useState<any>(null);

    useEffect(() => {
        const params = Object.fromEntries(new URLSearchParams(window.location.hash.substring(1)).entries());
        // params = {accessToken: string, expiresIn: number, tokenType: string (Bearer), state: string}

        if (window.localStorage) {
            const state = window.localStorage.getItem("state");
            if (!params["state"] || state !== params["state"]) {
                setAuthObj(null);
                console.error(new Error("states did not match"));
                //@ts-ignore
                window.location = "/";
            }
        }
        setAuthObj(params);

        fetch("https://api.spotify.com/v1/me/", {
            headers: [
                ["Authorization", "Bearer " + params["access_token"]],
                ["Content-Type", "application/json"],
                ["Accept", "application/json"],
            ],
        })
            .then((val) => {
                if (val.ok) {
                    return val.json();
                } else {
                    return Promise.reject(val);
                }
            })
            .then((json) => {
                fetch("http://localhost:5001/solartify/us-central1/addToken" /* "https://us-central1-solartify.cloudfunctions.net/addToken" */, {
                    method: "POST",
                    body: JSON.stringify({
                        token: params["access_token"],
                        userid: json.id,
                        expire_time: params["expires_in"],
                    }),
                }).catch((e) => {
                    console.log(e);
                });
            });

        return () => {};
    }, []);

    // return true ? <Player data={["1"]} /> : <Spinner text={"getting something"} />;

    if (playlist) {
        return <Player playlistObj={[playlist, setPlaylist]} authObj={authObj} />;
    } else if (authObj) {
        return <Playlists playlistObj={[playlist, setPlaylist]} /* playlist={playlist} setPlaylist={setPlaylist} */ authObj={authObj} />;
    } else {
        return <Spinner text={"waiting for auth"} />;
    }
};
export default Main;
