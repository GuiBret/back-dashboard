/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import {
  Controller,
  Get,
  Param,
  Query,
  Res,
  Req,
  Headers,
} from '@nestjs/common';
import { SpotifyService } from './spotify.service';
import * as fs from 'fs';
import { map } from 'rxjs/operators';
import { EasyconfigService } from 'nestjs-easyconfig';
import { SharedService } from 'src/shared/shared.service';

@Controller('spotify')
export class SpotifyController {
  clientId = '';
  cret = '';
  constructor(
    private spotifyService: SpotifyService,
    private ecs: EasyconfigService,
    private sharedService: SharedService,
  ) {}

  @Get('precheck')
  spotifyPrecheck() {
    if (this.spotifyService.hasInformations()) {
      return {
        status: 'KO',
        error: 'GET_TOKEN',
        url: this.spotifyService.getAuthorizationUrl(),
      };
    } else {
      return { status: 'KO', message: 'MISSING_CLIENT_OR_SECRET' };
    }
  }

  // TODO : déplacer les données dans le service
  @Get('get-url')
  getSpotifyUrl(@Headers('referer') referer) {
    const content = fs.readFileSync('./config/spotify/spotify.conf').toString();
    if (content) {
      return {
        url: this.spotifyService.getAuthorizationUrl(),
      };
    } else {
      return '';
    }
  }

  @Get('autocomp/:query')
  q(@Param() params, @Headers('Authorization') authHeader, @Req() req) {
    const queryStr = params.query;
    const typeParams = req.query.type;

    if (!authHeader) {
      return { status: 'KO', error: 'MISSING_TOKEN' };
    } else {
      const token = this.sharedService.getBearerToken(authHeader);

      return this.spotifyService.spotifyAutoComp(queryStr, token, typeParams);
    }
  }
  @Get('get-code')
  getToken(@Query() query, @Res() res) {
    // Case "Code received" => get token
    if (query.code) {
      const code = query.code;

      this.spotifyService
        .getSpotifyToken(code)
        .pipe(
          map(response => {
            return response.data;
          }),
        )
        .subscribe(response => {
          this.spotifyService.storeSpotifyToken(response.access_token);
          res.redirect(
            this.ecs.get('APP_LOCATION') +
              '/spotify/store-token/' +
              response.access_token +
              '/' +
              response.refresh_token,
          );
        });
    } else {
      // Case "token received"

      this.spotifyService.storeSpotifyToken(query.access_token);
    }
  }

  @Get('refresh-token/:refresh')
  getRefreshedToken(@Param('refresh') refreshToken: string) {
    return this.spotifyService.getNewAccessToken(refreshToken).pipe(
      map((response: any) => {
        const pushedData = {
          token: response.data.access_token,
        };
        return pushedData;
      }),
    );
  }

  @Get('artist/:id')
  getArtistFromSpotify(@Param('id') artistId) {
    // this.spotifyService.getArtistInfo()
  }

  @Get('my-info')
  getUserInfo(@Headers('Authorization') authHeader) {
    const token = this.sharedService.getBearerToken(authHeader);
    return this.spotifyService.getUserInfo(token);
  }
}
