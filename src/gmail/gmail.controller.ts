/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { Controller, Get, Param, Query, Res, Req, Headers } from '@nestjs/common';
// import { SpotifyService } from './spotify.service';
import { GmailService } from './gmail.service';


@Controller('gmail')
export class GmailController {
    
    constructor(private gmailService: GmailService) {
        
    }


    @Get('get-url') 
    testLogin() {

        const response = {
            url: this.gmailService.handleGmailLogin()
        };
        return response;
    }

    @Get('get-code')
    getAuthCode(@Query() query, @Res() res) {
        this.gmailService.getToken(query.code).then((tokenObj: {access_token: string, expiry_date: number}) => {
            console.log(tokenObj);
            res.redirect('http://localhost:4200/gmail/store-token/' + tokenObj.access_token + '/' + tokenObj.expiry_date);
        });
        
    }
}
