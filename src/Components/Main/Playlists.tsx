import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Spinner from "./Spinner";
import "../../styles/index.css";
import { IPlaylistObj } from "../../types";
import { builtinModules } from "module";

const Playlists = ({ playlistObj, authObj }: { playlistObj: [any, React.Dispatch<any>]; authObj: any }) => {
    const [playlist, setPlaylist] = playlistObj;
    const [PlaylistList, setPlaylistList] = useState<Array<IPlaylistObj | null>>(null);
    const [searchState, setSearchState] = useState("");

    //surely i will not resort to this in a react app?
    (async () => (document.querySelector("html").style.overflow = "visible"))();

    useEffect(() => {
        if (!authObj || PlaylistList) return;

        const BASEURL = "https://api.spotify.com/v1/";
        const idArray: string[] = JSON.parse(window.localStorage.getItem("idarray")) || [];

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
                        const pushable: IPlaylistObj = {
                            name: playlist["name"],
                            external_url: playlist["external_urls"]["spotify"],
                            id: playlist["id"],
                            uri: playlist["uri"],
                            img: image,
                            total: playlist["tracks"]["total"],
                            toSave: false,
                            alreadySaved: idArray.includes(playlist["id"]),
                        };

                        lastArray.push(pushable);
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
                {PlaylistList.filter((val) => val["name"].toUpperCase().includes(searchState.toUpperCase())).map((playlist) => {
                    /* interface IPlaylistObj {
                            name: string;
                            external_url: string;
                            id: string;
                            uri: string;
                            img: string;
                            total: number;
                            toSave: boolean;
                        } */

                    return (
                        <div title={"Choose playlist " + playlist["name"]} className="playlist-item" key={playlist["id"]}>
                            <img onClick={() => setPlaylist(playlist)} src={playlist["img"]} alt={playlist["name"] + " cover art"} />
                            <h5 onClick={() => setPlaylist(playlist)}>{playlist["name"]} </h5>

                            <div
                                onClick={(e) => {
                                    if (playlist["alreadySaved"]) return;
                                    const lastState = playlist["toSave"];
                                    const newState = !playlist["toSave"];

                                    //@ts-ignore
                                    const svg = e.target.childNodes[0];
                                    const children = svg.children;
                                    for (const child of children) {
                                        child.style.fill = newState ? "green" : "black";
                                    }
                                    playlist["toSave"] = newState;
                                }}
                                title="Save playlist"
                                className={"playlist-save-container" + (playlist["alreadySaved"] ? " playlist-already-saved" : "")}
                            >
                                <svg
                                    className="playlist-save-svg"
                                    width="45"
                                    height="48"
                                    viewBox="0 0 45 48"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                        className="playlist-save-svg-path"
                                        fillRule="evenodd"
                                        clipRule="evenodd"
                                        d="M21.4746 15.8308C23.1288 15.7374 24.5456 17.0026 24.639 18.6568L26.0609 43.8277C26.1543 45.4819 24.8891 46.8987 23.2348 46.9921C21.5806 47.0855 20.1639 45.8203 20.0704 44.1661L18.6486 18.9952C18.5551 17.341 19.8204 15.9243 21.4746 15.8308Z"
                                        fill="black"
                                    />
                                    <path
                                        className="playlist-save-svg-path"
                                        fillRule="evenodd"
                                        clipRule="evenodd"
                                        d="M32.9419 32.9381C34.1776 34.0417 34.2848 35.9382 33.1811 37.174L25.1879 46.1243C24.0843 47.3601 22.1878 47.4672 20.952 46.3636C19.7162 45.2599 19.6091 43.3635 20.7127 42.1277L28.706 33.1774C29.8096 31.9416 31.7061 31.8345 32.9419 32.9381Z"
                                        fill="black"
                                    />
                                    <path
                                        className="playlist-save-svg-path"
                                        fillRule="evenodd"
                                        clipRule="evenodd"
                                        d="M25.1879 46.1243C24.0843 47.3601 22.1878 47.4672 20.952 46.3636L12.0017 38.3704C10.7659 37.2667 10.6588 35.3703 11.7624 34.1345C12.866 32.8987 14.7625 32.7916 15.9983 33.8952L24.9486 41.8884C26.1844 42.9921 26.2915 44.8885 25.1879 46.1243Z"
                                        fill="black"
                                    />
                                    <path
                                        className="playlist-save-svg-path"
                                        fillRule="evenodd"
                                        clipRule="evenodd"
                                        d="M0 3C0 1.34315 1.34315 0 3 0H42C43.6569 0 45 1.34315 45 3C45 4.65685 43.6569 6 42 6H3C1.34315 6 0 4.65685 0 3Z"
                                        fill="black"
                                    />
                                    <path
                                        className="playlist-save-svg-path"
                                        fillRule="evenodd"
                                        clipRule="evenodd"
                                        d="M42 0C43.6569 0 45 1.34315 45 3V35H39V3C39 1.34315 40.3431 0 42 0Z"
                                        fill="black"
                                    />
                                    <path
                                        className="playlist-save-svg-path"
                                        fillRule="evenodd"
                                        clipRule="evenodd"
                                        d="M3 0C4.65685 0 6 1.34315 6 3V35H0V3C0 1.34315 1.34315 0 3 0Z"
                                        fill="black"
                                    />
                                </svg>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};
export default Playlists;
