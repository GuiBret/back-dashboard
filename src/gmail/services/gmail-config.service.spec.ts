import { Test, TestingModule } from '@nestjs/testing';
import { EasyconfigService } from 'nestjs-easyconfig';
import * as fs from 'fs';
import { GmailConfigService } from './gmail-config.service';
import { google } from 'googleapis';

describe('GmailConfigService', () => {
  let service: GmailConfigService;

  beforeEach(async() => {

    const easyConfigService : Partial<EasyconfigService> = {
      get: jest.fn()
    };
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

  // TODO: test functions with Gmail login
  // describe('Get token request', () => {
  //   it('should have called Googles OAuth client to generate the URL', (done) => {
  //     google.auth.OAuth2.prototype.getToken = jest.fn((code, cb) => cb(code));

  //     const result = service.getTokenRequest('ABCDEF');
  //     result.subscribe((res) => {
  //       console.log(res);
  //       done();
  //     }, (err) => {
  //       console.log(err);
  //       done();
  //     });
  //   });
  // });

});
