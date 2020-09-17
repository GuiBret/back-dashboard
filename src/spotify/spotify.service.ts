import { Injectable, HttpService } from '@nestjs/common';
import * as querystring from 'querystring';
import { map } from 'rxjs/operators';
import { SpotifySearchResponse } from 'src/models/spotify-search-response.interface';
import { SpotifyArtistObject } from 'src/models/spotify-artist-object.interface';
import { SpotifyArtist } from 'src/models/spotify-artist.interface';

@Injectable()
export class SpotifyService {
    constructor(private http: HttpService) {}
    spotify_token = "";
    getSpotifyToken(code: string, clientId: string, clientSecret: string) {

    // const form = new FormData();
        const formEncoded = {
            code: code,
            redirect_uri: 'http://localhost:3000/spotify/get-code',
            grant_type: "authorization_code"
        };
        // form.append("redirect_uri", 'http://localhost:3000/spotify/save-token');
        // form.append("code", code);
        // form.append("grant_type", 'authorization_code');
            
        return this.http.post('https://accounts.spotify.com/api/token', querystring.stringify(formEncoded), {
            headers: {
            
            'Authorization': 'Basic ' + (new Buffer(clientId + ':' + clientSecret).toString('base64')),
            'Content-Type': 'application/x-www-form-urlencoded'
            }
        });
    }

    storeSpotifyToken(token: string) {
        console.log(token)
        this.spotify_token = token;
    
    }

    get spotifyToken() {
      return this.spotify_token;
    }

    spotifyAutoComp(query: string) {
        if(this.spotify_token === '') {
            return {status: 'KO', error: 'MISSING_TOKEN'};
        }
        const reqOpts = {
            headers: {
                'Authorization': 'Bearer ' + this.spotify_token
            },                
        };
        return this.http.get('https://api.spotify.com/v1/search?q=' + query + "&type=artist&limit=5", reqOpts)
                        .pipe(map((response: {data: SpotifySearchResponse}) => {
                            console.log(response.data);
                            const artists : Array<SpotifyArtist>= response.data.artists.items;
                            const artistsFiltered = artists.map((artist) => {
                                const lastImageUrl = artist.images[artist.images.length - 1].url;
                                return {
                                    id: artist.id,
                                    imageUrl: lastImageUrl,
                                    name: artist.name
                                };
                            });

                            return {
                                status: 'OK',
                                data: artistsFiltered
                            };
                            
                        }));
    }
}
