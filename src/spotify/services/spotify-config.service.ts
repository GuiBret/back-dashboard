import { Injectable, HttpService, HttpException, HttpStatus } from '@nestjs/common';
import * as querystring from 'querystring';
import { catchError } from 'rxjs/operators';
import * as fs from 'fs';
import { EasyconfigService } from 'nestjs-easyconfig';
import { Observable } from 'rxjs';

@Injectable()
export class SpotifyConfigService {
    private spotify_token = '';
    private clientId = '';
    private clientSecret = '';

    constructor(private http: HttpService, private ecs: EasyconfigService) {}

    // TODO: Change function name
    extractSpotifyParams(): void {
        const content: any = JSON.parse(fs.readFileSync('./config/spotify/spotify.conf').toString());

        if(content) {
            this.clientId = content.CLIENTID;
            this.clientSecret = content.CLIENTSECRET;

        }
    }


    hasInformations(): boolean {
        return this.clientId != null && this.clientSecret != null;
    }

    getLoginUrl(): string {

        const formEncoded = this.encodeFormForLoginUrl();
        return 'https://accounts.spotify.com/authorize?' + formEncoded;
    }

    getSpotifyToken(code: string): Observable<any> {
        const formEncoded = this.encodeFormForSpotifyToken(code);

        return this.http.post('https://accounts.spotify.com/api/token', formEncoded, {
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


    /**
     * Calls Spotify's endpoint delivering a new token from a refresh
     * @param refreshToken The refresh token
     */
    getNewAccessToken(refreshToken: string): Observable<any> {

        const formEncoded = {
            grant_type: 'refresh_token',
            refresh_token: refreshToken
        };

        const reqOpts = {
            headers: {
                'Authorization': 'Basic ' + this.generateBase64Hash()
            }
        };

        return this.http.post('https://accounts.spotify.com/api/token', querystring.stringify(formEncoded), reqOpts)
                        .pipe(
                        catchError(() => {

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

    private encodeFormForSpotifyToken(code: string): string {
        return querystring.stringify({
            code,
            redirect_uri: this.ecs.get('SERVER_ROOT') + '/spotify/auth/code',
            grant_type: 'authorization_code'
        });
    }

    private encodeFormForLoginUrl(): string {
        const redirectUri = this.ecs.get('SERVER_ROOT') + '/spotify/auth/code';

        return querystring.stringify({
            'scope': 'user-read-private user-read-email user-read-playback-state user-modify-playback-state streaming',
            'client_id': this.clientId,
            'redirect_uri': redirectUri,
            'response_type': 'code',
        });
    }
}
