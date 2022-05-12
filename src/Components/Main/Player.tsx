import { useEffect, useState } from "react";
import Spinner from "./Spinner";
import { IWebPlaybackState, ICurrent, IPlaylistObj } from "../../types";
import { ErrorModal } from "./ErrorModal";
import { Link } from "react-router-dom";
import { parse } from "path";
import { threadId } from "worker_threads";

const Player = ({ playlistObj, authObj }: any) => {
    /* playlistObj: {
        name: playlist["name"],
        external_url: playlist["external_urls"]["spotify"],
        id: playlist["id"],
        uri: playlist["uri"],
        img: image,
        length: playlist["tracks"]["total"],
    }*/
    const [thisPlaylist, setThisPlaylist] = useState<IPlaylistObj | null>(null);
    const [thisQueue, setThisQueue] = useState<any>(null);
    const [player, setPlayer] = useState<any>(null);
    const [metaData, setMetaData] = useState<any>(null);
    const [spinnerPercentage, setSpinnerPercentage] = useState<number>(0);
    const [spinnerText, setSpinnerText] = useState("Waiting for spotify api");
    const [current, setCurrent] = useState<ICurrent | null>(null);
    const [volume, setVolume] = useState(0.01);
    const [seek, setSeek] = useState(0);
    const [playlist, setPlaylist] = playlistObj;

    const [error, setError] = useState<Error | string | null>(null);

    //look away
    (async () => (document.querySelector("html").style.overflow = "visible"))();

    const defaultHeaders = [
        ["Authorization", "Bearer " + authObj["access_token"]],
        ["Content-Type", "application/json"],
        ["Accept", "application/json"],
    ];

    document.title = "Player";
    const BASEURL = "https://api.spotify.com/v1/";
    //on mount
    useEffect(() => {
        const script = document.createElement("script");
        script.src = "https://sdk.scdn.co/spotify-player.js";
        script.async = true;
        document.body.appendChild(script);

        //@ts-ignore
        window.onSpotifyWebPlaybackSDKReady = () => {
            //@ts-ignore
            const thisPlayer = new window.Spotify.Player({
                name: "Web Playback SDK",
                getOAuthToken: (cb: any) => {
                    cb(authObj["access_token"]);
                },
                volume: volume,
            });

            thisPlayer.addListener("ready", ({ device_id }: any) => {
                setMetaData({ device_id });
            });

            thisPlayer.addListener("not_ready", ({ device_id }: any) => {
                console.log("Device ID has gone offline", device_id);
            });
            ["initialization_error", "authentication_error", "account_error", "playback_error"].forEach((name) => {
                thisPlayer.addListener(name, () => {
                    setError(name);
                    setSpinnerText(name);
                });
            });

            thisPlayer.connect().then((success: boolean) => {
                if (!success) {
                    setError("spotify sdk error");
                    setSpinnerText("spotify sdk error");
                }
            });

            thisPlayer.addListener("player_state_changed", (webPlaybackState: IWebPlaybackState) => {
                console.log("player state change");

                if (!webPlaybackState) return;
                setSeek(webPlaybackState["position"]);
                if (
                    (!current || webPlaybackState["duration"] !== current!["currentSong"]["duration_ms"]) &&
                    webPlaybackState["track_window"]["current_track"] !== null
                ) {
                    //song has changed, update current
                    const artists: string[] = [];
                    const nextArtists: string[] = [];

                    for (let i = 0; i < webPlaybackState["track_window"]["current_track"]["artists"].length; i++) {
                        artists.push(webPlaybackState["track_window"]["current_track"]["artists"][i]["name"]);
                    }
                    for (let i = 0; i < webPlaybackState["track_window"]["next_tracks"][0]["artists"].length; i++) {
                        nextArtists.push(webPlaybackState["track_window"]["next_tracks"][0]["artists"][i]["name"]);
                    }

                    setCurrent({
                        currentSong: {
                            name: webPlaybackState["track_window"]["current_track"]["name"],
                            artist: artists.join(", "),
                            uri: webPlaybackState["track_window"]["current_track"]["uri"],
                            duration_ms: webPlaybackState["duration"],
                            //@ts-ignore
                            duration: new Date((webPlaybackState["duration"] / 1000) * 1000).toISOString().substring(14, 19),
                        },
                        currentAlbum: {
                            name: webPlaybackState["track_window"]["current_track"]["album"]["name"],
                            cover: webPlaybackState["track_window"]["current_track"]["album"]["images"][2]["url"], //change this to index 0 for higher quality
                            uri: webPlaybackState["track_window"]["current_track"]["album"]["uri"],
                        },
                        currentPlaylist: {
                            name: webPlaybackState["context"]["metadata"]["context_description"],
                            uri: webPlaybackState["context"]["uri"],
                        },
                        nextSong: {
                            name: webPlaybackState["track_window"]["next_tracks"][0]["name"],
                            cover: webPlaybackState["track_window"]["next_tracks"][0]["album"]["images"][1]["url"],
                            artist: nextArtists.join(", "),
                        },
                    });
                }
            });

            setPlayer(thisPlayer);
        };
        setThisPlaylist(playlist);
    }, []);

    useEffect(() => {
        if (!thisPlaylist) return;
        try {
            if (thisPlaylist["alreadySaved"]) {
                const dbTracks = JSON.parse(window.localStorage.getItem(thisPlaylist["id"])) || null;
                console.log(thisPlaylist["total"], dbTracks.length);
                if (thisPlaylist["total"] === dbTracks.length) {
                    shufflePlaylist(dbTracks);
                    return;
                } else {
                    setThisPlaylist((last) => {
                        last["alreadySaved"] = false;
                        last["toSave"] = true;
                        console.log(last);
                        return last;
                    });
                }
            }
        } catch (e) {
            console.log("idarray or " + thisPlaylist["id"] + " not in localstorage");
            console.log(e);
            //@ts-ignore
            setSpinnerText(e);
        }

        (() => {
            // fetch songs and shuffle them and set queue
            const tracks: string[] = [];
            setSpinnerText("Getting your tracks");
            get50Tracks();
            // spotify only allows you to fetch 50 tracks in one request
            // this used to be concurrent but managing the rate limiting is not fun
            async function get50Tracks(offset: number = 0): Promise<string[]> {
                return new Promise((resolve, reject) => {
                    fetch(BASEURL + "playlists/" + thisPlaylist["id"] + "/tracks?limit=50&offset=" + offset, {
                        headers: defaultHeaders,
                    })
                        .then((response) => {
                            if (response.status === 429) {
                                const wait = parseInt(response.headers.get("retry-after"));
                                console.log({ wait });
                                setTimeout(() => {
                                    //idk if this actually works
                                    return get50Tracks(offset);
                                }, wait * 1000);
                            } else if (!(response.status > 199 && response.status < 300)) {
                                console.log(response);
                            } else {
                                return response.json();
                            }
                        })
                        .then((data: SpotifyApi.PlaylistTrackResponse) => {
                            data["items"].forEach((item) => {
                                tracks.push(item["track"]["uri"]);
                            });
                            if (offset >= thisPlaylist["total"]) {
                                shufflePlaylist(tracks);
                            } else {
                                //@ts-ignore
                                setSpinnerPercentage(parseInt((offset / thisPlaylist["total"]) * 100));
                                get50Tracks(offset + 50);
                            }
                        })
                        .catch((e) => console.log(e));
                    // .catch((e: Error) => {
                    //     reject(e);
                    //     console.log(e);
                    // });
                });
            }
        })();
        // shuffle tracks and set queue
        function shufflePlaylist(tracks: string[]) {
            setSpinnerText("Shuffling your playlist");
            const len = tracks.length - 1;
            for (let i = len; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));

                [tracks[i], tracks[j]] = [tracks[j], tracks[i]];
            }
            if (len > 100) tracks.length = 100;

            setThisQueue(tracks);

            if (thisPlaylist["toSave"] && !thisPlaylist["alreadySaved"]) {
                const db = window.localStorage;
                const idArray: string[] = JSON.parse(db.getItem("idarray")) || [];

                // let newArr;
                if (!idArray.includes(thisPlaylist["id"])) {
                    idArray.push(thisPlaylist["id"]);
                } else {
                    //uncomment this if duplicates start popping up
                    /* newArr = (() => {
                        // https://stackoverflow.com/questions/9229645/remove-duplicate-values-from-js-array
                        let a = idArray;
                        var seen = {};
                        var out = [];
                        var len = a.length;
                        var j = 0;
                        for (var i = 0; i < len; i++) {
                            var item = a[i];
                            //@ts-ignore
                            if (seen[item] !== 1) {
                                //@ts-ignore
                                seen[item] = 1;
                                out[j++] = item;
                            }
                        }
                        return out;
                    })(); */
                }
                db.setItem(thisPlaylist["id"], JSON.stringify(tracks));
                db.setItem("idarray", JSON.stringify(idArray));
            }
        }

        return () => {};
    }, [thisPlaylist]);

    useEffect(() => {
        if (!metaData) {
            return;
        }
        function handleSetQueueError(res: any) {
            console.log(res);
            if (res.status === 502) {
                //bad gateway
                setTimeout(() => setQueue(), 1000);
            }
        }
        //start playing custom queue
        function setQueue(stackCounter = 0) {
            if (stackCounter > 3) {
                setError("Unable to start playback");
                return;
            }
            fetch(BASEURL + "me/player/play?device_id=" + metaData["device_id"], {
                method: "PUT",
                headers: defaultHeaders,
                body: JSON.stringify({
                    uris: thisQueue,
                }),
            })
                .then((res) => (/* res.status.startsWith("2") */ res.ok ? null : handleSetQueueError(res)))
                .catch((e: Error) => {
                    console.log(e);
                    setTimeout(() => {
                        setQueue(stackCounter + 1);
                    }, 1000);
                });
        }
        setQueue();

        return () => {};
    }, [thisQueue, metaData]);

    useEffect(() => {
        //automatically increment seek
        setInterval(() => {
            setSeek((prev) => prev + 1000);
        }, 1000);
    }, []);

    const deleteSong = function () {
        fetch(BASEURL + "playlists/" + thisPlaylist["id"] + "/tracks", {
            method: "DELETE",
            headers: defaultHeaders,
            body: JSON.stringify({ tracks: [{ uri: current["currentSong"]["uri"] }] }),
        })
            .then(() => skip("next"))
            .catch((e: Error) => setError(e));
    };
    const skip = function (direction: "next" | "prev" | "pause-play") {
        switch (direction) {
            case "next":
                player.nextTrack();
                return;
            case "prev":
                player.previousTrack();
                return;
            case "pause-play":
                player.togglePlay();
                return;
            default:
                console.log("lol");
                return;
        }
    };
    if (!current) return <Spinner percentage={spinnerPercentage} text={spinnerText} />;
    return (
        <main id="player">
            {error ? <ErrorModal error={error} /> : null}
            <header id="header">
                <Link id="logout-container" to="/">
                    <button
                        onClick={() => {
                            player.disconnect();
                            window.localStorage.removeItem("state");
                        }}
                        id="logout-btn"
                    >
                        Log out
                    </button>
                </Link>
                <div onClick={() => setPlaylist(null)} id="current-playlist-container">
                    <img
                        src={
                            thisPlaylist["img"] ||
                            "playlistObj:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw=="
                        }
                        alt=""
                        id="current-playlist-image"
                    />

                    <p id="current-playlist-name" style={{ color: "rgb(198, 198, 255)", textDecoration: "underline" }}>
                        {thisPlaylist["name"]}
                    </p>
                </div>
            </header>
            {/* <!-- https://stackoverflow.com/questions/5775469/whats-the-valid-way-to-include-an-image-with-no-src --> */}
            <img
                id="album-art"
                src={
                    current["currentAlbum"]["cover"] ||
                    "playlistObj:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw=="
                }
                alt="album art"
            />
            <div id="song-info">
                <p id="song-name">{current["currentSong"]["name"]} </p>
                <p id="artist-name">{current["currentSong"]["artist"]}</p>
            </div>

            <div id="skip-container">
                <button onClick={() => skip("prev")} className="btn skip-btn" id="prev-btn">
                    {/* <!-- https://www.svgrepo.com/svg/42622/back --> */}
                    <svg
                        version="1.1"
                        id="prev-svg"
                        xmlns="http://www.w3.org/2000/svg"
                        xmlnsXlink="http://www.w3.org/1999/xlink"
                        viewBox="0 0 300 300"
                    >
                        <defs>
                            <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="0%">
                                <stop offset="0%" style={{ stopColor: " rgb(119, 184, 174)", stopOpacity: "1" }} />
                                <stop offset="100%" style={{ stopColor: "rgb(60, 155, 189)", stopOpacity: "1" }} />
                            </linearGradient>
                        </defs>
                        <path
                            fill="url(#grad1)"
                            d="M150,0C67.157,0,0,67.157,0,150c0,82.841,67.157,150,150,150c82.838,0,150-67.162,150-150C300,67.159,232.838,0,150,0z     M217.343,203.764c0,3.704-1.979,7.132-5.187,8.982c-1.605,0.926-3.4,1.393-5.187,1.393c-1.792,0-3.582-0.467-5.187-1.393    l-81.103-46.823c-0.993-0.573-1.854-1.312-2.594-2.153v35.955c0,9.498-7.7,17.198-17.198,17.198s-17.198-7.7-17.198-17.198    v-89.078h0.002c0-9.498,7.7-17.198,17.198-17.198c9.498,0,17.198,7.7,17.198,17.198v39.465c0.739-0.84,1.6-1.58,2.594-2.155    l81.1-46.823c3.211-1.854,7.164-1.854,10.375,0c3.208,1.852,5.187,5.278,5.187,8.984V203.764z"
                        />
                    </svg>
                </button>
                <button onClick={() => skip("pause-play")} className="btn" id="play-btn">
                    {/*  <!-- https://www.svgrepo.com/svg/100677/pause-button --> */}
                    <svg
                        id="play-svg"
                        version="1.1"
                        xmlns="http://www.w3.org/2000/svg"
                        xmlnsXlink="http://www.w3.org/1999/xlink"
                        viewBox="0 0 512 512"
                        xmlSpace="preserve"
                    >
                        <defs>
                            <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="0%">
                                <stop offset="0%" style={{ stopColor: "rgb(119, 184, 174)", stopOpacity: "1" }} />
                                <stop offset="100%" style={{ stopColor: "rgb(60, 155, 189)", stopOpacity: "1" }} />
                            </linearGradient>
                        </defs>
                        <path
                            fill="url(#grad1)"
                            d="M256,0C114.617,0,0,114.615,0,256s114.617,256,256,256s256-114.615,256-256S397.383,0,256,0z M224,320  c0,8.836-7.164,16-16,16h-32c-8.836,0-16-7.164-16-16V192c0-8.836,7.164-16,16-16h32c8.836,0,16,7.164,16,16V320z M352,320  c0,8.836-7.164,16-16,16h-32c-8.836,0-16-7.164-16-16V192c0-8.836,7.164-16,16-16h32c8.836,0,16,7.164,16,16V320z"
                        />
                    </svg>
                </button>
                <button onClick={() => skip("next")} className="btn skip-btn" id="skip-btn">
                    <svg
                        version="1.1"
                        id="skip-svg"
                        xmlns="http://www.w3.org/2000/svg"
                        xmlnsXlink="http://www.w3.org/1999/xlink"
                        viewBox="0 0 300 300"
                    >
                        <defs>
                            <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="0%">
                                <stop offset="0%" style={{ stopColor: "rgb(119, 184, 174)", stopOpacity: "1" }} />
                                <stop offset="100%" style={{ stopColor: "rgb(60, 155, 189)", stopOpacity: "1" }} />
                            </linearGradient>
                        </defs>

                        <path
                            fill="url(#grad1)"
                            d="M150,0C67.162,0,0,67.159,0,150s67.162,150,150,150c82.843,0,150-67.162,150-150C300,67.157,232.843,0,150,0z     M216.312,199.725h-0.003c0,9.498-7.7,17.198-17.198,17.198c-9.498,0-17.198-7.7-17.198-17.198V163.77    c-0.739,0.84-1.6,1.58-2.594,2.153l-81.098,46.82c-1.605,0.926-3.395,1.393-5.187,1.393c-1.787,0-3.582-0.467-5.187-1.393    c-3.208-1.849-5.187-5.278-5.187-8.982v-93.643c0-3.706,1.979-7.132,5.187-8.984c3.211-1.854,7.164-1.854,10.375,0l81.1,46.823    c0.993,0.576,1.854,1.315,2.594,2.155v-39.465c0-9.498,7.7-17.198,17.198-17.198s17.198,7.7,17.198,17.198V199.725z"
                        />
                    </svg>
                </button>
            </div>

            <div className="range-container" id="seek-container">
                <input
                    onInput={(e) => {
                        //@ts-ignore
                        const thing = (parseInt(e.target.value) * current["currentSong"]["duration_ms"]) / 100;
                        player.seek(thing);
                        setSeek(thing);
                    }}
                    value={(seek / current["currentSong"]["duration_ms"]) * 100}
                    className="range"
                    type="range"
                    id="seek"
                    name="seek"
                    min="0"
                    max="100"
                    step="any"
                />
                <div id="seek-number-container">
                    <p className="seek-number" id="seek-number-current">
                        {/*skull emoji formatting*/ new Date((seek / 1000) * 1000).toISOString().substring(14, 19)}
                    </p>
                    <p className="seek-number" id="seek-number-total">
                        {current["currentSong"]["duration"].toString()}
                    </p>
                </div>
            </div>
            <div className="range-container" id="volume-container">
                <label id="volume-display" htmlFor="volume">
                    {volume}
                </label>
                <input
                    onChange={(e) => {
                        //@ts-ignore
                        const settable = e.target.value / 100;

                        player.setVolume(settable).then(() => {
                            //@ts-ignore
                            setVolume(parseInt(settable * 100));
                        });
                    }}
                    className="range"
                    type="range"
                    id="volume"
                    value={volume}
                    name="volume"
                    min="0"
                    max="100"
                />
            </div>

            <div id="remove-container">
                <button onClick={() => deleteSong()} id="remove-btn">
                    Remove song from playlist
                </button>
            </div>
        </main>
    );
};
export default Player;
