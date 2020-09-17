import { SpotifyArtist } from "./spotify-artist.interface";

export interface SpotifyArtistObject {
    items: Array<SpotifyArtist>;
    total: number;
    limit: number;
    offset: number;
    previous: any;
}
