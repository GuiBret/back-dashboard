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
        return this.gmailService.handleGmailLogin();
    }
}
