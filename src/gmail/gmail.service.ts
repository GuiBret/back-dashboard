import { Injectable, HttpService, OnModuleInit } from '@nestjs/common';
import * as fs from 'fs';
import { google } from 'googleapis';
import { EasyconfigService } from 'nestjs-easyconfig';
import { GmailConfigService } from './services/gmail-config.service';


@Injectable()
export class GmailService implements OnModuleInit {
    spotify_token = '';
    clientId = '';
    clientSecret = '';

    constructor(private gmailConfig: GmailConfigService, private ecs: EasyconfigService) {}

    onModuleInit(): void {
        this.gmailConfig.extractGmailParams();
    }

    handleGmailLogin(): string {
        const oauth2Client = new google.auth.OAuth2(this.clientId, this.clientSecret, this.ecs.get('SERVER_ROOT') + '/gmail/auth/code');

        const authUrl = oauth2Client.generateAuthUrl({
            access_type: 'offline',
            scope: ['https://www.googleapis.com/auth/gmail.readonly', 'https://mail.google.com/']
        });
        return authUrl;
       }

    getToken(code: string): Promise<any> {

        return new Promise((resolve) => {
            const oauth2Client = new google.auth.OAuth2(this.clientId, this.clientSecret, this.ecs.get('SERVER_ROOT') + '/gmail/auth/code');

            oauth2Client.getToken(code, (err, token) => {
                resolve(token);
            });
        });
    }

}
