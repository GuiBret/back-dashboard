/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { Controller, Get, Query, Res } from '@nestjs/common';
import { EasyconfigService } from 'nestjs-easyconfig';
import { GmailService } from './gmail.service';


@Controller('gmail')
export class GmailController {
    constructor(private gmailService: GmailService, private ecs: EasyconfigService) {}


    @Get('auth/url')
    testLogin() {

        const response = {
            url: this.gmailService.handleGmailLogin()
        };
        return response;
    }

    @Get('auth/code')
    getAuthCode(@Query() query, @Res() res) {
        this.gmailService.getToken(query.code).then((tokenObj: {access_token: string, expiry_date: number}) => {

            res.redirect(this.ecs.get('APP_LOCATION') + '/gmail/store-token/' + tokenObj.access_token + '/' + tokenObj.expiry_date);
        });

    }
}
