/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { Controller, Get, Param, Query, Res, Req, Headers } from '@nestjs/common';
import { SpotifyService } from './spotify.service';
import * as fs from 'fs';
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
        } else { // If the token is missing, we'll tell the user to login using this URL
        return { status: 'KO', url: this.spotifyService.getUrl()}
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
                                res.redirect('http://localhost:4200/spotify/store-token/' + response.access_token);
        });

    } else { // Case "token received"
      
      this.spotifyService.storeSpotifyToken(query.access_token);
      
    }
    
  }

}
