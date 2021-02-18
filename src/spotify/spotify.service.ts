import { Injectable, HttpService, OnModuleInit, HttpException, HttpStatus } from '@nestjs/common';
import * as querystring from 'querystring';
import { map, catchError } from 'rxjs/operators';
import { SpotifySearchResponse } from '@models/spotify-search-response.interface';
import { SpotifyArtist } from '@models/spotify-artist.interface';
import * as fs from 'fs';
import { EasyconfigService } from 'nestjs-easyconfig';
import { response } from 'express';

@Injectable()
export class SpotifyService implements OnModuleInit {
    spotify_token = "";
    clientId = "";
    clientSecret = "";
    
    constructor(private http: HttpService, private ecs: EasyconfigService) {}

    onModuleInit(): void {
        const content: any = JSON.parse(fs.readFileSync('./config/spotify/spotify.conf').toString());
        console.log(content);
        if(content) {
            this.clientId = content.CLIENTID;
            this.clientSecret = content.CLIENTSECRET;
            
        }
    } 

    
    hasInformations(): boolean {
        return this.clientId !== '' && this.clientSecret !== '';
    }
    getUrl() {
        const redirectUri = this.ecs.get('SERVER_ROOT') + '/spotify/get-code';
        return 'https://accounts.spotify.com/authorize?' + querystring.stringify({
            'scope': 'user-read-private user-read-email user-read-playback-state user-modify-playback-state',
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

    spotifyAutoComp(query: string, token: string, typeParams: string) {
        
        const reqOpts = {
            headers: {
                'Authorization': 'Bearer ' + token
            },                
        };

        
        
        return this.http.get(`https://api.spotify.com/v1/search?q=${query}&type=${typeParams}&limit=5`, reqOpts)
                        .pipe(map((response: {data: SpotifySearchResponse}) => {
                            const responseData = [];

                            if(response.data.artists) {
                                const artists : Array<SpotifyArtist> = response.data.artists.items;

                                if(artists.length === 0) {
                                    return {
                                        status: 'KO',
                                        error: 'NO_RECORDS_FOUND',
                                        data: {}
                                    }
                                } else {
                                    const artistsFiltered = artists.map(this.generateArtistElement.bind(this));
                                    responseData.push(...artistsFiltered);
                                    
    
                                }
                            }

                            
                            if(response.data.tracks) {
                                
                                const tracks: Array<any> = response.data.tracks.items;
                                const tracksFiltered : Array<any> = tracks.map(this.generateTrackElement.bind(this));
                                responseData.push(...tracksFiltered);
                            }

                            if(response.data.albums) {
                                
                                if(response.data.albums.length !== 0) {
                                    const albums: Array<any> = response.data.albums.items;
                                    const albumsFiltered : Array<any> = albums.map(this.generateAlbumElement.bind(this));
                                    responseData.push(...albumsFiltered);
                                }
                            }


                            return {
                                status: 'OK',
                                data: responseData
                            };

                            
                            
                            
                        }));
    }

    private generateArtistElement(artist: any) {
        let lastImageUrl = '';
        if(artist.images.length !== 0) {
            lastImageUrl = artist.images[artist.images.length - 1].url;

        }
        return {
            id: artist.id,
            imageUrl: lastImageUrl,
            name: artist.name,
            uri: artist.uri,
            type: 'artist'
        };
    }
    


    private generateTrackElement(track: any) {
        
        
        let lastImageUrl = '';
        if(track.album.images.length !== 0) {
            lastImageUrl = track.album.images[track.album.images.length - 1].url;

        }

        return {
            id: track.id,
            imageUrl: lastImageUrl,
            name: track.name,
            uri: track.uri,
            type: 'track'
        }
    }

    private generateAlbumElement(album: any) {

        
        let lastImageUrl = '';
        if(album.images.length !== 0) {
            lastImageUrl = album.images[album.images.length - 1].url;

        }

        return {
            id: album.id,
            imageUrl: lastImageUrl,
            name: album.name,
            uri: album.uri,
            type: 'album'
        }
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

    getUserInfo(token: string) {
        const reqOpts = {
            headers: {
                'Authorization': 'Bearer ' + token
            }
        };

        return this.http.get('https://api.spotify.com/v1/me', reqOpts).pipe(map((response) => {
            return response.data;
        }));

    }
}
