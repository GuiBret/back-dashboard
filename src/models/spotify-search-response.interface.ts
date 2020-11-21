import { SpotifyArtistObject } from "./spotify-artist-object.interface";

export interface SpotifySearchResponse {
    artists: SpotifyArtistObject;
    tracks: any;
    
}
