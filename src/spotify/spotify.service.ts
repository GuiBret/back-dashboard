import {
  HttpException,
  HttpService,
  HttpStatus,
  Injectable,
  OnModuleInit,
} from '@nestjs/common';
import * as fs from 'fs';
import { EasyconfigService } from 'nestjs-easyconfig';
import * as querystring from 'querystring';
import { Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { SpotifyArtist } from 'src/models/spotify-artist.interface';
import { SpotifySearchResponse } from 'src/models/spotify-search-response.interface';
import { SpotifyUserProfileDto } from './dtos/spotify-user-profile.dto';
import { SpotifySearchType } from './enums/spotify-search-type.enum';
import { SharedService } from 'src/shared/shared.service';

@Injectable()
export class SpotifyService implements OnModuleInit {
  token = '';
  clientId = '';
  clientSecret = '';

  constructor(
    private http: HttpService,
    private ecs: EasyconfigService,
    private sharedService: SharedService,
  ) {}

  onModuleInit(): void {
    const content: any = JSON.parse(
      fs.readFileSync('./config/spotify/spotify.conf').toString(),
    );
    if (content) {
      this.clientId = content.CLIENTID;
      this.clientSecret = content.CLIENTSECRET;
    }
  }

  hasInformations(): boolean {
    return this.clientId !== '' && this.clientSecret !== '';
  }
  getAuthorizationUrl(): string {
    const redirectUri = this.ecs.get('SERVER_ROOT') + '/spotify/get-code';

    return this.generateAuthorizationUrl(redirectUri);
  }

  private generateAuthorizationUrl(redirectUri: string) {
    return (
      'https://accounts.spotify.com/authorize?' +
      querystring.stringify({
        scope:
          'user-read-private user-read-email user-read-playback-state user-modify-playback-state',
        client_id: this.clientId,
        redirect_uri: redirectUri,
        response_type: 'code',
      })
    );
  }

  getSpotifyToken(code: string) {
    // const form = new FormData();
    const formEncoded = {
      code: code,
      redirect_uri: this.ecs.get('SERVER_ROOT') + '/spotify/get-code',
      grant_type: 'authorization_code',
    };

    return this.http.post(
      'https://accounts.spotify.com/api/token',
      querystring.stringify(formEncoded),
      {
        headers: {
          Authorization: this.sharedService.generateAuthorizationHeaderFromString(
            this.clientId + ':' + this.clientSecret,
          ),
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      },
    );
  }

  storeSpotifyToken(token: string): void {
    this.token = token;
  }

  get spotifyToken(): string {
    return this.token;
  }

  spotifyAutoComp(query: string, token: string, typeParams: string) {
    const reqOpts = {
      headers: {
        Authorization: 'Bearer ' + token,
      },
    };

    return this.http
      .get(
        `https://api.spotify.com/v1/search?q=${query}&type=${typeParams}&limit=5`,
        reqOpts,
      )
      .pipe(
        map((response: { data: SpotifySearchResponse }) => {
          return response.data;
        }),
        map((searchResponse: SpotifySearchResponse) => {
          const responseData = [];

          if (searchResponse.artists) {
            const artists: Array<SpotifyArtist> = searchResponse.artists.items;

            if (artists.length === 0) {
              return {
                status: 'KO',
                error: 'NO_RECORDS_FOUND',
                data: {},
              };
            } else {
              const artistsFiltered = artists.map(
                this.generateArtistElement.bind(this),
              );
              responseData.push(...artistsFiltered);
            }
          }

          if (searchResponse.tracks) {
            const tracks: Array<any> = searchResponse.tracks.items;
            const tracksFiltered: Array<any> = tracks.map(
              this.generateTrackElement.bind(this),
            );
            responseData.push(...tracksFiltered);
          }

          if (searchResponse.albums) {
            if (searchResponse.albums.length !== 0) {
              const albums: Array<any> = searchResponse.albums.items;
              const albumsFiltered: Array<any> = albums.map(
                this.generateAlbumElement.bind(this),
              );
              responseData.push(...albumsFiltered);
            }
          }

          return {
            status: 'OK',
            data: responseData,
          };
        }),
      );
  }

  private generateArtistElement(artist: any) {
    let lastImageUrl = '';
    if (artist.images.length !== 0) {
      lastImageUrl = artist.images[artist.images.length - 1].url;
    }
    return {
      id: artist.id,
      imageUrl: lastImageUrl,
      name: artist.name,
      uri: artist.uri,
      type: SpotifySearchType.ARTIST,
    };
  }

  private generateTrackElement(track: any) {
    let lastImageUrl = '';
    if (track.album.images.length !== 0) {
      lastImageUrl = track.album.images[track.album.images.length - 1].url;
    }

    return {
      id: track.id,
      imageUrl: lastImageUrl,
      name: track.name,
      uri: track.uri,
      type: SpotifySearchType.TRACK,
    };
  }

  private generateAlbumElement(album: any) {
    let lastImageUrl = '';
    if (album.images.length !== 0) {
      lastImageUrl = album.images[album.images.length - 1].url;
    }

    return {
      id: album.id,
      imageUrl: lastImageUrl,
      name: album.name,
      uri: album.uri,
      type: SpotifySearchType.ALBUM,
    };
  }

  /**
   * Calls Spotify's endpoint delivering a new token from a refresh
   * @param refreshToken The refresh token
   */
  getNewAccessToken(refreshToken: string) {
    const formEncoded = {
      grant_type: 'refresh_token',
      refresh_token: refreshToken,
    };

    const reqOpts = {
      headers: {
        Authorization: this.sharedService.generateAuthorizationHeaderFromString(
          this.clientId + ':' + this.clientSecret,
        ),
      },
    };

    return this.http
      .post(
        'https://accounts.spotify.com/api/token',
        querystring.stringify(formEncoded),
        reqOpts,
      )
      .pipe(
        catchError(error => {
          throw new HttpException(
            {
              status: 'KO',
              error: 'INVALID_REFRESH',
              message: 'Invalid refresh token',
            },
            HttpStatus.FORBIDDEN,
          );
        }),
      );
  }

  getUserInfo(token: string): Observable<SpotifyUserProfileDto> {
    const reqOpts = {
      headers: {
        Authorization: 'Bearer ' + token,
      },
    };

    return this.http.get('https://api.spotify.com/v1/me', reqOpts).pipe(
      map(response => {
        return response.data;
      }),
    );
  }
}
