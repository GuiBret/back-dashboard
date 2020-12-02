import { Injectable, HttpService, OnModuleInit, HttpException, HttpStatus } from '@nestjs/common';

import * as fs from 'fs';
import { google } from 'googleapis';



@Injectable()
export class GmailService implements OnModuleInit {
    spotify_token = "";
    clientId = "";
    clientSecret = "";
    
    constructor(private http: HttpService) {}

    onModuleInit(): void {
        try {
            
            const credentials = JSON.parse(fs.readFileSync('./src/gmail/private/credentials.json').toString());
            console.log("Credentials : " + credentials);
            this.clientId = credentials.web.client_id;
            this.clientSecret = credentials.web.client_secret;

        } catch(error) {
            // TODO: Handle error
        }
    } 

    handleGmailLogin() {
        const oauth2Client = new google.auth.OAuth2(this.clientId, this.clientSecret, 'http://localhost:4200/gmail/store-token');
        console.log("Client id : " + this.clientId);
        console.log(this.clientSecret);
        const authUrl = oauth2Client.generateAuthUrl({
            access_type: 'offline',
            scope: ['https://www.googleapis.com/auth/gmail.readonly']
        });
        return authUrl;
    }

}
