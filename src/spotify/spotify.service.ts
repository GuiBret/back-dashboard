import { Injectable, HttpService } from '@nestjs/common';
import * as querystring from 'querystring';

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

        const reqOpts = {
            headers: {
                'Authorization': 'Bearer ' + this.spotify_token
            },                
        };
        return this.http.get('https://api.spotify.com/v1/search?q=' + query + "&type=album,track", reqOpts);
    }
}
