import { Injectable, HttpService, OnModuleInit } from '@nestjs/common';
import * as fs from 'fs';
import { google } from 'googleapis';
import { EasyconfigService } from 'nestjs-easyconfig';
import { Observable } from 'rxjs';
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

    getGmailLoginUrl(): string {

        return this.gmailConfig.handleGmailLogin();

       }

    getToken(code: string): Observable<any> {

        return this.gmailConfig.getTokenRequest(code);
    }

}
