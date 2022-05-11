import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Spinner from "./Spinner";

const Playlists = ({ playlistObj, authObj }: { playlistObj: [any, React.Dispatch<any>]; authObj: any }) => {
    const [playlist, setPlaylist] = playlistObj;
    const [PlaylistList, setPlaylistList] =
        useState<Array<{ name: string; external_url: string; id: string; uri: string; img: string; total: number }>>(null);
    const [searchState, setSearchState] = useState("");

    //surely i will not resort to this in a react app?
    (async () => (document.querySelector("html").style.overflow = "visible"))();

    useEffect(() => {
        const BASEURL = "https://api.spotify.com/v1/";

        if (!authObj || PlaylistList) return;
        (async (): Promise<void> => {
            // const user = await fetch(BASEURL + "me", {
            //     headers: [
            //         ["Authorization", "Bearer " + authObj["accessToken"]],
            //         ["Content-Type", "application/json"],
            //         ["Accept", "application/json"],
            //     ],
            // })
            //     .then((response) => response.json())
            //     .catch((error) => console.log(error));

            async function getPlaylists(lastTotal = 0, lastArray: any = []) {
                return new Promise<void>(async (resolve, reject) => {
                    const data = await fetch(BASEURL + /* "users/" + user["id"]  +*/ "me/playlists?limit=50&offset=" + lastTotal, {
                        headers: [
                            ["Authorization", "Bearer " + authObj["access_token"]],
                            ["Content-Type", "application/json"],
                            ["Accept", "application/json"],
                        ],
                    })
                        .then((response) => response.json())
                        .then((data) => data)
                        .catch((error) => reject(error));

                    data["items"].forEach((playlist: any) => {
                        let image = "";
                        if (playlist["images"].length > 0) {
                            if (playlist["images"].length > 2) {
                                image = playlist["images"][2]["url"];
                            } else {
                                image = playlist["images"][0]["url"];
                            }
                        }
                        //@ts-ignore
                        lastArray.push({
                            name: playlist["name"],
                            external_url: playlist["external_urls"]["spotify"],
                            id: playlist["id"],
                            uri: playlist["uri"],
                            img: image,
                            total: playlist["tracks"]["total"],
                        });
                    });

                    //if total is not maxed out, it means we have all the playlists
                    if (data["items"].length !== 50) {
                        setPlaylistList(lastArray);
                        resolve();
                    }
                    //if total is maxed out, we need to get the next 50 playlists
                    else {
                        getPlaylists(lastTotal + 50, lastArray);
                    }
                });
            }
            getPlaylists();
        })();

        return () => {};
    }, []);

    if (!PlaylistList) {
        return <Spinner text={"Getting your playlists"} />;
    }
    return (
        <div id="playlists-container">
            <Link id="playlists-logout-container" to="/">
                <button
                    onClick={() => {
                        window.localStorage.removeItem("state");
                    }}
                    id="playlists-logout-btn"
                >
                    Log out
                </button>
            </Link>
            <input
                onInput={(e) => {
                    //@ts-ignore
                    setSearchState(e.target.value);
                }}
                value={searchState}
                placeholder="Search by name"
                type="search"
                id="playlist-search"
            ></input>

            <div id="playlists-container">
                {PlaylistList.filter((val) => val["name"].toUpperCase().includes(searchState.toUpperCase())).map((playlist: any) => {
                    return (
                        <div title={"Choose playlist " + playlist["name"]} className="playlist-item" key={playlist["id"]}>
                            <img onClick={() => setPlaylist(playlist)} src={playlist["img"]} alt={playlist["name"]} />
                            <h5
                                onClick={() => {
                                    setPlaylist(playlist);
                                }}
                            >
                                {playlist["name"]}{" "}
                            </h5>

                            <a href={"https://open.spotify.com/playlist/" + playlist["id"]} rel="noreferrer" target="_blank">
                                <svg id="external-link-svg" viewBox="0 0 50 50" xmlns="http://www.w3.org/2000/svg">
                                    <rect id="external-link-btn" x="0" y="0" width="50" height="50" onClick={() => alert("click!")} />
                                    <path
                                        fillRule="evenodd"
                                        clipRule="evenodd"
                                        d="M3 50C1.34315 50 0 48.6569 0 47V8C0 6.34314 1.34315 5 3 5C4.65685 5 6 6.34314 6 8V47C6 48.6569 4.65685 50 3 50Z"
                                    />
                                    <path
                                        fillRule="evenodd"
                                        clipRule="evenodd"
                                        d="M0 47C0 45.3431 1.34315 44 3 44H42C43.6569 44 45 45.3431 45 47C45 48.6569 43.6569 50 42 50H3C1.34315 50 0 48.6569 0 47Z"
                                    />
                                    <path
                                        fillRule="evenodd"
                                        clipRule="evenodd"
                                        d="M45 26V46C45 47.6569 43.6569 49 42 49C40.3431 49 39 47.6569 39 46V26H45Z"
                                    />
                                    <path
                                        fillRule="evenodd"
                                        clipRule="evenodd"
                                        d="M26.8787 22.9481C25.7071 21.7766 25.7071 19.8771 26.8787 18.7055L44.7055 0.878664C45.8771 -0.292909 47.7766 -0.292908 48.9482 0.878664C50.1197 2.05024 50.1197 3.94973 48.9482 5.1213L31.1213 22.9481C29.9497 24.1197 28.0502 24.1197 26.8787 22.9481Z"
                                    />
                                    <path
                                        fillRule="evenodd"
                                        clipRule="evenodd"
                                        d="M32 3C32 1.34314 33.3431 -3.63807e-06 35 -3.38769e-06L47 -1.57424e-06C48.6569 -1.32386e-06 50 1.34314 50 3C50 4.65685 48.6569 6 47 6L35 6C33.3431 6 32 4.65685 32 3Z"
                                    />
                                    <path
                                        fillRule="evenodd"
                                        clipRule="evenodd"
                                        d="M47 -1.57424e-06C48.6569 -1.32386e-06 50 1.34314 50 3V15C50 16.6569 48.6569 18 47 18C45.3431 18 44 16.6569 44 15V3C44 1.34314 45.3431 -1.57424e-06 47 -1.57424e-06Z"
                                    />
                                    <path
                                        fillRule="evenodd"
                                        clipRule="evenodd"
                                        d="M0 8C0 6.34314 1.34315 5 3 5H24V11H3C1.34315 11 0 9.65685 0 8Z"
                                    />
                                </svg>
                            </a>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};
export default Playlists;
