import { Injectable, HttpService, OnModuleInit, HttpException, HttpStatus } from '@nestjs/common';
import { response } from 'express';

import * as fs from 'fs';
import { google } from 'googleapis';
import { oauth2 } from 'googleapis/build/src/apis/oauth2';
import { resolve } from 'path';



@Injectable()
export class GmailService implements OnModuleInit {
    spotify_token = "";
    clientId = "";
    clientSecret = "";
    
    constructor(private http: HttpService) {}

    onModuleInit(): void {
        try {
            
            const credentials = JSON.parse(fs.readFileSync('./src/gmail/private/credentials.json').toString());
        
            this.clientId = credentials.web.client_id;
            this.clientSecret = credentials.web.client_secret;

        } catch(error) {
            // TODO: Handle error
        }
    } 

    handleGmailLogin() {
        const oauth2Client = new google.auth.OAuth2(this.clientId, this.clientSecret, 'http://localhost:4500/gmail/get-code');
        
        const authUrl = oauth2Client.generateAuthUrl({
            access_type: 'offline',
            scope: ['https://www.googleapis.com/auth/gmail.readonly', 'https://www.googleapis.com/auth/gmail.modify']
        });
        return authUrl;
    }

    getToken(code: string) {

        return new Promise((resolve, reject) => {
            const oauth2Client = new google.auth.OAuth2(this.clientId, this.clientSecret, 'http://localhost:4500/gmail/get-code');

            oauth2Client.getToken(code, (err, token) => {
                
                resolve(token);
            });

        })
        
    }

}
