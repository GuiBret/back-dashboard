import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import { google } from 'googleapis';
import { EasyconfigService } from 'nestjs-easyconfig';
import { Observable } from 'rxjs';


@Injectable()
export class GmailConfigService {
    clientId = '';
    clientSecret = '';

    constructor(private ecs: EasyconfigService) {}

    extractGmailParams(): void {
        try {

            const credentials = JSON.parse(fs.readFileSync('./config/gmail/credentials.json').toString());

            this.clientId = credentials.web.client_id;
            this.clientSecret = credentials.web.client_secret;

        } catch(error) {
            // TODO: Handle error
            return error;
        }
    }

    handleGmailLogin(): string {
        const oauth2Client = new google.auth.OAuth2(this.clientId, this.clientSecret, this.ecs.get('SERVER_ROOT') + '/gmail/auth/code');

        const authUrl = oauth2Client.generateAuthUrl({
            access_type: 'offline',
            scope: ['https://www.googleapis.com/auth/gmail.readonly', 'https://mail.google.com/']
        });
        return authUrl;
       }

    getTokenRequest(code: string): Observable<any> {

        return new Observable((observer) => {
            const oauth2Client = new google.auth.OAuth2(this.clientId, this.clientSecret, this.ecs.get('SERVER_ROOT') + '/gmail/auth/code');
            oauth2Client.getToken(code, (err, token) => {
                console.log(err);
                observer.next(token);
            });
        });
    }

}
