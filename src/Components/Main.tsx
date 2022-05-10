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
