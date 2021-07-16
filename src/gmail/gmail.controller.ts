/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { Controller, Get, Query, Res } from '@nestjs/common';
import { EasyconfigService } from 'nestjs-easyconfig';
import { GmailService } from './gmail.service';


@Controller('gmail')
export class GmailController {
    constructor(private gmailService: GmailService, private ecs: EasyconfigService) {}


    @Get('auth/url')
    getLoginUrl() {

        return {
            url: this.gmailService.getGmailLoginUrl()
        };
    }

    @Get('auth/code')
    getAuthCode(@Query() query, @Res() res) {
        this.gmailService.getToken(query.code).subscribe(this.makeRedirectWithTokenInfo.bind(this, res));

    }

    private makeRedirectWithTokenInfo(res: any, tokenObj: { expiry_date: string, access_token: string}) {
        res.redirect(this.ecs.get('APP_LOCATION') + '/gmail/store-token/' + tokenObj.access_token + '/' + tokenObj.expiry_date);
    }
}
