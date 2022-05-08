import "../../styles/Globals.css";
import "../../styles/Player.css";

const Player = ({ data }: { data: string[] }) => {
    document.title = "Player";
    const deleteSong = function () {};
    return (
        <main id="player">
            <div id="current-playlist-container">
                <img
                    src="data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw=="
                    alt=""
                    id="current-playlist-image"
                />
                <p id="current-playlist-name" style={{ color: "rgb(198, 198, 255)", textDecoration: "underline" }}>
                    Pick a playlist
                </p>
            </div>

            {/* <!-- https://stackoverflow.com/questions/5775469/whats-the-valid-way-to-include-an-image-with-no-src --> */}
            <img id="album-art" src="data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==" alt="album art" />
            <div id="song-info">
                <p id="song-name">song name</p>
                <p id="artist-name">artist name</p>
            </div>

            <div id="skip-container">
                <div id="skip-button-container">
                    <button className="btn skip-btn" id="prev-btn">
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
                    <button className="btn" id="play-btn">
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
                    <button className="btn skip-btn" id="skip-btn">
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
                <div id="skip-info">
                    <div id="next-info">
                        <p id="next-song-name">song name</p>
                        <p id="next-song-artist">artist name</p>
                    </div>
                    <img id="next-song-cover" src="" alt="cover art of next song" />
                </div>
            </div>

            <div className="range-container" id="seek-container">
                <input className="range" type="range" id="seek" name="seek" min="0" max="100" step="any" />
                <div id="seek-number-container">
                    <p className="seek-number" id="seek-number-current">
                        0:00
                    </p>
                    <p className="seek-number" id="seek-number-total">
                        0:00
                    </p>
                </div>
            </div>
            <div className="range-container" id="volume-container">
                <label id="volume-display" htmlFor="volume">
                    2%
                </label>
                <input className="range" type="range" id="volume" value="2" name="volume" min="0" max="100" />
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
