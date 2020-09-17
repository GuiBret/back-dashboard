/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { Controller, Get, Param, Query, Req, Res, Post } from '@nestjs/common';
import { SpotifyService } from './spotify.service';
import * as fs from 'fs';
import * as querystring from 'querystring';
import { map } from 'rxjs/operators';


@Controller('spotify')
export class SpotifyController {
    clientId = '';
    clientSecret = '';
    constructor(private spotifyService: SpotifyService) {}

    @Get('precheck')
    spotifyPrecheck() {
  
        if(this.spotifyService.spotifyToken !== '') {
        return {status: 'OK'}
        } else {
        return { status: 'KO'}
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
            
            const redirectUri = 'http://localhost:3000/spotify/get-code';
            const url = 'https://accounts.spotify.com/authorize?' + querystring.stringify({
                'scope': 'user-read-private user-read-email',
                'client_id': this.clientId,
                'redirect_uri': redirectUri,
                'response_type': 'code',
            });

            return {
                'status': 'OK',
                url: url
            }
        } else {
            return "";
        }

    }

  @Get('autocomp/:query')
  q(@Param() params) {
    const queryStr = params.query;
    
    return this.spotifyService.spotifyAutoComp(queryStr);
  }
  @Get('get-code')
  getToken(@Query() query, @Res() res) {
    
    if(query.code) {
        const code = query.code;
        if(this.clientId === '' || this.clientSecret === '') {
            return {status: 'KO', error:'MISSING_CLIENT_OR_SECRET'};
        }
        this.spotifyService.getSpotifyToken(code, this.clientId, this.clientSecret)
                           .pipe(map((response) => {
                               
                               return response;
                            
                            
                           })).subscribe((response) => {
      
            this.spotifyService.storeSpotifyToken(response.data.access_token);
            res.redirect('http://localhost:4200/spotify');
        });

    } else {
      
      this.spotifyService.storeSpotifyToken(query.access_token);
      
    }
    // console.log(request);
    

    
  }

}
