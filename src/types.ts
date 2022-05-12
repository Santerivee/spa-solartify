export interface IWebPlaybackState {
    //THIS INTERFACE DOES NOT HAVE ALL KEYS BTW
    timestamp: number;
    context: {
        uri: string; // The URI of the context (can be null)
        metadata: {
            // Additional metadata for the context (can be null)
            context_description: string; //playlist name
        };
    };
    position: number; //current position in track in ms
    duration: number; //length of track in ms

    // paused: false; // Whether the current track is paused.
    // repeat_mode: 0; // The repeat mode. No repeat mode is 0
    // playback_quality: any; //playback quality, something like "VERY_HIGH" etc
    // repeat context is 1 and repeat track is 2.
    // shuffle: false; // True if shuffled, false otherwise.
    track_window: {
        current_track: IWebPlaybackTrack; // The track currently on local playback
        previous_tracks: Array<IWebPlaybackTrack>; // Previously played tracks. Number can vary.
        next_tracks: Array<IWebPlaybackTrack>; // Tracks queued next. Number can vary.
    };
}

export interface IWebPlaybackTrack {
    uri: string; // Spotify URI
    id: string; // Spotify ID from URI (can be null)
    type: "track" | "episode" | "ad"; // Content type: can be "track", "episode" or "ad"
    media_type: "audio" | "video"; // Type of file: can be "audio" or "video"
    name: string; // Name of content
    is_playable: boolean; // Flag indicating whether it can be played
    album: {
        uri: string; // Spotify Album URI
        name: string;
        images: IAlbumImageArray;
    };
    artists: Array<{ uri: string; name: string }>;
}

interface IBigImage {
    url: string;
    height: 640;
    width: 640;
}
interface ISmallImage {
    url: string;
    height: 64;
    width: 64;
}
interface IMediumImage {
    url: string;
    height: 300;
    width: 300;
}
interface IAlbumImageArray {
    [0]: IBigImage;
    [1]: ISmallImage;
    [2]: IMediumImage;
}

export interface ICurrent {
    currentSong: {
        name: string;
        artist: string;
        uri: string;
        duration_ms: number;
        //@ts-ignore
        duration: Date;
    };
    currentAlbum: {
        name: string;
        cover: string;
        uri: string;
    };
    currentPlaylist: {
        name: string;
        uri: string;
    };
    nextSong: {
        name: string;
        cover: string;
        artist: string;
    };
}
export interface IPlaylistObj {
    name: string;
    external_url: string;
    id: string;
    uri: string;
    img: string;
    total: number;
    toSave: boolean;
    alreadySaved: boolean;
}
