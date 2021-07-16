import { Test, TestingModule } from '@nestjs/testing';
import { EasyconfigService } from 'nestjs-easyconfig';
import * as fs from 'fs';
import { google } from 'googleapis';
import { GmailService } from './gmail.service';
import { GmailConfigService } from './services/gmail-config.service';

describe('GmailConfigService', () => {
  let service: GmailService;
  const gmailConfigServiceStub: Partial<GmailConfigService> = {
    getTokenRequest: jest.fn()
  };
  beforeEach(async() => {

    const easyConfigService : Partial<EasyconfigService> = {};


    const module: TestingModule = await Test.createTestingModule({
      providers: [GmailService,
      {provide: EasyconfigService, useValue: easyConfigService},
      {provide: GmailConfigService, useValue: gmailConfigServiceStub},
    ],
    }).compile();

    service = module.get<GmailService>(GmailService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('Get token', () => {
    it('should call the service to retrieve the token', () => {
        const code = 'ABCDEF';

        service.getToken(code);
        expect(gmailConfigServiceStub.getTokenRequest).toHaveBeenCalledWith(code);
    });

  });

});
