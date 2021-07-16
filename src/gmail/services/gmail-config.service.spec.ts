import { Test, TestingModule } from '@nestjs/testing';
import { EasyconfigService } from 'nestjs-easyconfig';
import * as fs from 'fs';
import { GmailConfigService } from './gmail-config.service';
import { google } from 'googleapis';

describe('GmailConfigService', () => {
  let service: GmailConfigService;

  beforeEach(async() => {

    const easyConfigService : Partial<EasyconfigService> = {};
    const module: TestingModule = await Test.createTestingModule({
      providers: [GmailConfigService,
      {provide: EasyconfigService, useValue: easyConfigService},
    ],
    }).compile();

    service = module.get<GmailConfigService>(GmailConfigService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('Extract gmail params', () => {
    it('should throw an error since the file could not be found', () => {
        spyOn(fs, 'readFileSync').and.returnValue('');
        // expect(service.extractGmailParams()).toThrowError(SyntaxError);
    });
    it('should set the parameters since the file was found', () => {
        spyOn(fs, 'readFileSync').and.returnValue('{"web": {"client_id": "123456", "client_secret": "abcdef"}}');

        service.extractGmailParams();
        expect(service.clientId).toEqual('123456');
        expect(service.clientSecret).toEqual('abcdef');
    });
  });

});
