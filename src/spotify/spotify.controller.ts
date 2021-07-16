/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { Controller, Get, Param, Query, Res, Req, Headers } from '@nestjs/common';
import { SpotifyService } from './spotify.service';
import * as fs from 'fs';
import { map } from 'rxjs/operators';
import { EasyconfigService } from 'nestjs-easyconfig';
import { SpotifyConfigService } from './services/spotify-config.service';


@Controller('spotify')
export class SpotifyController {
    clientId = '';
    clientSecret = '';
    constructor(private spotifyService: SpotifyService, private spotifyConfig: SpotifyConfigService, private ecs: EasyconfigService) {}

    @Get('auth/precheck')
    spotifyPrecheck() {
      if(this.spotifyConfig.hasInformations()) {
        return { status: 'OK', message: 'GET_TOKEN',url: this.spotifyConfig.getLoginUrl()};

      }

      return { status: 'KO', message: 'MISSING_CLIENT_OR_SECRET'};
    }

    // TODO : déplacer les données dans le service
    @Get('auth/url')
    getSpotifyUrl() {
        const content = fs.readFileSync('./config/spotify/spotify.conf').toString();
        if(content) {

            return {
              url: this.spotifyConfig.getLoginUrl()
            };


        }

        return {};

    }

  @Get('search/:query')
  q(@Param() params, @Headers('Authorization') authHeader, @Req() req) {
    const queryStr = params.query;
    const typeParams = req.query.type;

    if(!authHeader) {
      return {status: 'KO', error: 'MISSING_TOKEN'};
    } else {
      const token = authHeader.split(' ')[1];

      return this.spotifyService.spotifyAutoComp(queryStr, token, typeParams);
    }
  }
  @Get('auth/code')
  getToken(@Query() query, @Res() res) {

    // Case "Code received" => get token
    if(query.code) {
        const code = query.code;
        this.spotifyConfig.getSpotifyToken(code)
                           .pipe(map((response) => {
                               return response.data;
                           })).subscribe((response) => {

                                this.spotifyConfig.storeSpotifyToken(response.access_token);
                                res.redirect(this.ecs.get('APP_LOCATION') + '/spotify/store-token/' + response.access_token + '/' + response.refresh_token);
        });

    } else { // Case "token received"

      this.spotifyConfig.storeSpotifyToken(query.access_token);

    }

  }

  @Get('auth/refresh/:refresh')
  getRefreshedToken(@Param('refresh') refreshToken: string) {
    return this.spotifyConfig.getNewAccessToken(refreshToken).pipe(map((response: any) => {

      const pushedData = {
        token: response.data.access_token
      };
      return pushedData;
    }));
  }

  @Get('artists/:id')
  getArtistFromSpotify(@Param('id') artistId) {
    console.log(artistId);
    // this.spotifyService.getArtistInfo()
  }

  @Get('my-info')
  getUserInfo(@Headers('Authorization') authHeader) {
    const token = authHeader.split(' ')[1];
    return this.spotifyService.getUserInfo(token);

  }
}
