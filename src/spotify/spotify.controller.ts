/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { Controller, Get, Param, Query, Res, Req, Headers } from '@nestjs/common';
import { SpotifyService } from './spotify.service';
import * as fs from 'fs';
import { map } from 'rxjs/operators';
import { isFunction } from 'util';


@Controller('spotify')
export class SpotifyController {
    clientId = '';
    clientSecret = '';
    constructor(private spotifyService: SpotifyService) {}

    @Get('precheck')
    spotifyPrecheck() {
      if(this.spotifyService.hasInformations()) {
        return { status: 'KO', error: 'GET_TOKEN',url: this.spotifyService.getUrl()};

      } else {
        return { status: 'KO', message: 'MISSING_CLIENT_OR_SECRET'};
      }

        
    }

    // TODO : déplacer les données dans le service
    @Get('get-url')
    getSpotifyUrl() {
        const content = fs.readFileSync('./config/spotify/spotify.conf').toString();
        if(content) {
            const jsonContent = JSON.parse(content);
            this.clientId = jsonContent.CLIENTID;
            this.clientSecret = jsonContent.CLIENTSECRET;
            
     
        } else {
            return "";
        }

    }

  @Get('autocomp/:query')
  q(@Param() params, @Headers('Authorization') authHeader) {
    const queryStr = params.query;
    
    if(!authHeader) {
      return {status: 'KO', error: 'MISSING_TOKEN'};
    } else {
      const token = authHeader.split(' ')[1];
      return this.spotifyService.spotifyAutoComp(queryStr, token);
    }
    
  }
  @Get('get-code')
  getToken(@Query() query, @Res() res) {
    

    // Case "Code received" => get token
    if(query.code) {
        const code = query.code;
        
        this.spotifyService.getSpotifyToken(code, this.clientId, this.clientSecret)
                           .pipe(map((response) => {
                               return response.data;
                        
                           })).subscribe((response) => {
                               
                                this.spotifyService.storeSpotifyToken(response.access_token);
                                res.redirect('http://localhost:4200/spotify/store-token/' + response.access_token + '/' + response.refresh_token);
        });

    } else { // Case "token received"
      
      this.spotifyService.storeSpotifyToken(query.access_token);
      
    }
    
  }

  @Get('artist/:id')
  getArtistFromSpotify(@Param('id') artistId) {
    console.log(artistId);
    // this.spotifyService.getArtistInfo()
  }
}
