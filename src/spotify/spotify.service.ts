import { Injectable, HttpService, OnModuleInit, HttpException, HttpStatus } from '@nestjs/common';
import * as querystring from 'querystring';
import { map, catchError } from 'rxjs/operators';
import { SpotifySearchResponse } from 'src/models/spotify-search-response.interface';
import { SpotifyArtist } from 'src/models/spotify-artist.interface';
import * as fs from 'fs';
import { EasyconfigService } from 'nestjs-easyconfig';

@Injectable()
export class SpotifyService implements OnModuleInit {
    spotify_token = "";
    clientId = "";
    clientSecret = "";
    
    constructor(private http: HttpService, private ecs: EasyconfigService) {}

    onModuleInit() {
        const content: any = JSON.parse(fs.readFileSync('./config/spotify/spotify.conf').toString());
        console.log(content);
        if(content) {
            this.clientId = content.CLIENTID;
            this.clientSecret = content.CLIENTSECRET;
            
        }
    } 

    hasInformations() {
        return this.clientId !== '' && this.clientSecret !== '';
    }
    getUrl() {
        const redirectUri = this.ecs.get('SERVER_ROOT') + '/spotify/get-code';
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
            redirect_uri: this.ecs.get('SERVER_ROOT') + '/spotify/get-code',
            grant_type: "authorization_code"
        };
        
        
        return this.http.post('https://accounts.spotify.com/api/token', querystring.stringify(formEncoded), {
            headers: {
            
            'Authorization': 'Basic ' + this.generateBase64Hash(),
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

        
        return this.http.get(`https://api.spotify.com/v1/search?q=${query}&type=artist&limit=5`, reqOpts)
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


    /**
     * Calls Spotify's endpoint delivering a new token from a refresh
     * @param refreshToken The refresh token
     */
    getNewAccessToken(refreshToken: string) {

        const formEncoded = {
            grant_type: 'refresh_token',
            refresh_token: refreshToken
        };

        const reqOpts = {
            headers: {
                'Authorization': 'Basic ' + this.generateBase64Hash()
            }
        }
        
        return this.http.post('https://accounts.spotify.com/api/token', querystring.stringify(formEncoded), reqOpts)
                        .pipe(
                        catchError((error) => {
                            
                            throw new HttpException({status: 'KO', error: 'INVALID_REFRESH', message: 'Invalid refresh token'}, HttpStatus.FORBIDDEN);
                        })
                        );
    }

    /**
     * Generates a hash in base 64 of clientId:clientSecret, used in login procedures
     */
    private generateBase64Hash() {
        return (new Buffer(this.clientId + ':' + this.clientSecret).toString('base64'));
    }
}
