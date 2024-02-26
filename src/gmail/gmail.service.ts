import { Injectable, HttpService, OnModuleInit } from '@nestjs/common';
import * as fs from 'fs';
import { google } from 'googleapis';
import { EasyconfigService } from 'nestjs-easyconfig';

@Injectable()
export class GmailService implements OnModuleInit {
  clientId = '';
  clientSecret = '';

  constructor(private http: HttpService, private ecs: EasyconfigService) {}

  onModuleInit(): void {
    try {
      const credentials = JSON.parse(
        fs.readFileSync('./config/gmail/credentials.json').toString(),
      );

      this.clientId = credentials.web.client_id;
      this.clientSecret = credentials.web.client_secret;
    } catch (error) {
      // TODO: Handle error
    }
  }

  handleGmailLogin(): string {
    const oauth2Client = new google.auth.OAuth2(
      this.clientId,
      this.clientSecret,
      this.ecs.get('SERVER_ROOT') + '/gmail/get-code',
    );

    const authUrl = oauth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: [
        'https://www.googleapis.com/auth/gmail.readonly',
        'https://mail.google.com/',
      ],
    });
    return authUrl;
  }

  getToken(code: string) {
    return new Promise((resolve, reject) => {
      const oauth2Client = new google.auth.OAuth2(
        this.clientId,
        this.clientSecret,
        this.ecs.get('SERVER_ROOT') + '/gmail/get-code',
      );

      oauth2Client.getToken(code, (err, token) => {
        resolve(token);
      });
    });
  }
}
