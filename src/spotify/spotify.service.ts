import { Injectable, HttpService, OnModuleInit } from '@nestjs/common';
import * as querystring from 'querystring';
import { map } from 'rxjs/operators';
import { SpotifySearchResponse } from 'src/models/spotify-search-response.interface';
import { SpotifyArtist } from 'src/models/spotify-artist.interface';
import * as fs from 'fs';
@Injectable()
export class SpotifyService implements OnModuleInit {
    spotify_token = "";
    clientId = "";
    clientSecret = "";
    
    constructor(private http: HttpService) {}

    onModuleInit() {
        const content: any = JSON.parse(fs.readFileSync('./config/spotify/spotify.conf').toString());
        console.log(content);
        if(content) {
            this.clientId = content.CLIENTID;
            this.clientSecret = content.CLIENTSECRET;
            console.log(this.clientId);
        }
    } 

    getUrl() {
        const redirectUri = 'http://localhost:3000/spotify/get-code';
        return 'https://accounts.spotify.com/authorize?' + querystring.stringify({
            'scope': 'user-read-private user-read-email',
            'client_id': this.clientId,
            'redirect_uri': redirectUri,
            'response_type': 'code',
        });
    }

    getSpotifyToken(code: string, clientId: string, clientSecret: string) {

    // const form = new FormData();
        const formEncoded = {
            code: code,
            redirect_uri: 'http://localhost:3000/spotify/get-code',
            grant_type: "authorization_code"
        };
        
        
        return this.http.post('https://accounts.spotify.com/api/token', querystring.stringify(formEncoded), {
            headers: {
            
            'Authorization': 'Basic ' + (new Buffer(this.clientId + ':' + this.clientSecret).toString('base64')),
            'Content-Type': 'application/x-www-form-urlencoded'
            }
        });
    }

    storeSpotifyToken(token: string) : void {
        
        this.spotify_token = token;
    
    }

    get spotifyToken() : string {
      return this.spotify_token;
    }

    spotifyAutoComp(query: string, token: string) {
        
        const reqOpts = {
            headers: {
                'Authorization': 'Bearer ' + token
            },                
        };
        return this.http.get('https://api.spotify.com/v1/search?q=' + query + "&type=artist&limit=5", reqOpts)
                        .pipe(map((response: {data: SpotifySearchResponse}) => {

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
