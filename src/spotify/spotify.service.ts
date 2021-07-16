import { Injectable, HttpService, OnModuleInit, HttpException, HttpStatus } from '@nestjs/common';
import * as querystring from 'querystring';
import { map, catchError } from 'rxjs/operators';
import { SpotifySearchResponse } from '@models/spotify-search-response.interface';
import { SpotifyArtist } from '@models/spotify-artist.interface';
import * as fs from 'fs';
import { EasyconfigService } from 'nestjs-easyconfig';
import { Observable } from 'rxjs';
import { SpotifyElementFactory } from './factories/spotify-element-factory';
import { SpotifyConfigService } from './services/spotify-config.service';

@Injectable()
export class SpotifyService implements OnModuleInit {
    clientId = '';
    clientSecret = '';

    constructor(private http: HttpService, public elementFactory: SpotifyElementFactory, public spotifyConfig: SpotifyConfigService, private ecs: EasyconfigService) {}

    onModuleInit(): void {
        this.spotifyConfig.extractSpotifyParams();
    }

    getNewAccessToken(refreshToken: string): Observable<any> {
        return this.spotifyConfig.getNewAccessToken(refreshToken);
    }

    getSpotifyToken(code: string): Observable<{access_token: string, refresh_token: string}> {
        const request = this.spotifyConfig.getSpotifyTokenRequest(code);

        return request.pipe(map((response: any) => {

            this.spotifyConfig.storeSpotifyToken(response.access_token);

            return response.data;
        }));
    }


    spotifyAutoComp(query: string, token: string, typeParams: string): Observable<any> {

        const reqOpts = {
            headers: {
                'Authorization': 'Bearer ' + token
            },
        };

        return this.http.get(`https://api.spotify.com/v1/search?q=${query}&type=${typeParams}&limit=5`, reqOpts)
                        .pipe(map(this.handleSearchResponse.bind(this)));
    }

    handleSearchResponse(response: { data: SpotifySearchResponse }): any {
        const responseData = [];

        if(response.data.artists) {
            const artists : Array<SpotifyArtist> = response.data.artists.items;

            if(artists.length === 0) {
                return {
                    status: 'KO',
                    error: 'NO_RECORDS_FOUND',
                    data: {}
                };
            } else {
                const artistsFiltered = artists.map(this.elementFactory.generateArtistElement.bind(this.elementFactory));
                responseData.push(...artistsFiltered);


            }
        }


        if(response.data.tracks) {

            const tracks: Array<any> = response.data.tracks.items;
            const tracksFiltered : Array<any> = tracks.map(this.elementFactory.generateTrackElement.bind(this.elementFactory));
            responseData.push(...tracksFiltered);
        }

        if(response.data.albums) {

            if(response.data.albums.length !== 0) {
                const albums: Array<any> = response.data.albums.items;
                const albumsFiltered : Array<any> = albums.map(this.elementFactory.generateAlbumElement.bind(this));
                responseData.push(...albumsFiltered);
            }
        }


        // TODO: rewrite error handling
        return {
            status: 'OK',
            data: responseData
        };

    }

    getUserInfo(token: string): Observable<any> {
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
