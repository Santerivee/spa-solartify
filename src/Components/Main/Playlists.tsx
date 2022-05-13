import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Spinner from "./Spinner";
import "../../styles/index.css";
import { IPlaylistObj } from "../../types";
import icon_save_black from "../../media/Vectorsave_icon_black.png";
import icon_save_green from "../../media/Vectorsave_icon_green.png";
import icon_save_blue from "../../media/Vectorsave_icon_blue.png";
import icon_save_red from "../../media/Vectorsave_icon_red.png";

const Playlists = ({ playlistObj, authObj }: { playlistObj: [any, React.Dispatch<any>]; authObj: any }) => {
    const [playlist, setPlaylist] = playlistObj;
    const [PlaylistList, setPlaylistList] = useState<Array<IPlaylistObj | null>>(null);
    const [searchState, setSearchState] = useState("");
    const [random, setRandom] = useState(0);
    const forceUpdate = function () {
        setRandom(Math.random());
    };
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

    function determineColor(alreadySaved: boolean, toSave: boolean, hoverChangedTo: boolean) {
        const red = icon_save_red;
        const blue = icon_save_blue;
        const green = icon_save_green;
        const black = icon_save_black;

        if (hoverChangedTo) {
            if (alreadySaved) {
                return red;
            } else if (!alreadySaved) {
                if (toSave) {
                    return black;
                } else if (!toSave) {
                    return green;
                }
            }
        } else if (!hoverChangedTo) {
            //hover left
            if (alreadySaved) {
                return blue;
            } else if (!alreadySaved) {
                if (toSave) {
                    return green;
                } else if (!toSave) {
                    return black;
                }
            }
        }
    }

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
                                    if (playlist["alreadySaved"]) {
                                        if (
                                            !window.confirm(
                                                "Are you sure you want to remove " + playlist["name"] + " from your saved playlists?"
                                            )
                                        )
                                            return;
                                        //me when i make an unreadable one-liner to save 2 variables
                                        //remove this id from idarray
                                        window.localStorage.setItem(
                                            "idarray",
                                            JSON.stringify(
                                                (JSON.parse(window.localStorage.getItem("idarray")) || []).filter(
                                                    (e: string) => e !== playlist["id"]
                                                )
                                            )
                                        );
                                        window.localStorage.removeItem(playlist["id"]);
                                        playlist["alreadySaved"] = false;
                                        playlist["toSave"] = false;
                                        (document.getElementById(playlist["id"] + "-img") as HTMLImageElement).src = icon_save_black;
                                    } else {
                                        playlist["toSave"] = !playlist["toSave"];
                                        (document.getElementById(playlist["id"] + "-img") as HTMLImageElement).src = determineColor(
                                            playlist["alreadySaved"],
                                            playlist["toSave"],
                                            false
                                        );
                                    }
                                }}
                                title="Save playlist"
                                className={"playlist-save-container" + (playlist["alreadySaved"] ? " playlist-already-saved" : "")}
                                onMouseOver={() =>
                                    ((document.getElementById(playlist["id"] + "-img") as HTMLImageElement).src = determineColor(
                                        playlist["alreadySaved"],
                                        playlist["toSave"],
                                        true
                                    ))
                                }
                                onMouseOut={() =>
                                    ((document.getElementById(playlist["id"] + "-img") as HTMLImageElement).src = determineColor(
                                        playlist["alreadySaved"],
                                        playlist["toSave"],
                                        false
                                    ))
                                }
                            >
                                <img
                                    id={playlist["id"] + "-img"}
                                    src={playlist["alreadySaved"] ? icon_save_blue : playlist["toSave"] ? icon_save_green : icon_save_black}
                                ></img>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};
export default Playlists;
