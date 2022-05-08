import React, { useEffect, useContext, useState } from "react";
import Spinner from "./Main/Spinner";
import { AuthContext } from "../App";

const Playlists = () => {
    // const user = ["saodfjsadf", () => { console.log("lolxd"); }];
    const authContext = useContext<any>(AuthContext);
    const [playLists, setPlayLists] = useState<any>(null);

    useEffect(() => {
        const BASEURL = "https://api.spotify.com/v1/";

        (async (): Promise<void> => {
            const user = await fetch(BASEURL + "me", {
                headers: [
                    ["Authorization", "Bearer " + "userContext['access_token'']"],
                    ["Content-Type", "application/json"],
                    ["Accept", "application/json"],
                ],
            })
                .then((response) => response.json())
                .catch((error) => console.log(error));

            async function getPlaylists(lastTotal = 0, lastArray: any = []) {
                return new Promise<void>(async (resolve, reject) => {
                    const data = await fetch(BASEURL + "users/" + user["id"] + "/playlists?limit=50&offset=" + lastTotal, {
                        headers: [
                            ["Authorization", "Bearer " + "userContext['access_token'']"],
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
                        });
                    });

                    //if total is not maxed out, it means we have all the playlists
                    if (data["items"].length !== 50) {
                        setPlayLists(lastArray);
                        resolve();
                    }
                    //if total is maxed out, we need to get the next 50 playlists
                    else {
                        getPlaylists(lastTotal + 50, lastArray);
                    }
                });
            }
        })();

        return () => {};
    }, []);

    if (!playLists) {
        return <Spinner text={"getting playlists"} />;
    } else {
        return (
            <div>
                <h1>Playlists</h1>
                {playLists.map((playlist: any) => {
                    return (
                        <div key={playlist["id"]}>
                            <img src={playlist["img"]} alt={playlist["name"]} />
                            <p>{playlist["name"]}</p>
                        </div>
                    );
                })}
            </div>
        );
    }
};
export default Playlists;
