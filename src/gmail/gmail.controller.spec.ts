import { Test, TestingModule } from '@nestjs/testing';
import { servicebroker } from 'googleapis/build/src/apis/servicebroker';
import { EasyconfigService } from 'nestjs-easyconfig';
import { Observable } from 'rxjs';
import { GmailController } from './gmail.controller';
import { GmailService } from './gmail.service';
import { GmailConfigService } from './services/gmail-config.service';

describe('SpotifyController', () => {
  let controller: GmailController;

  const gmailConfigServiceStub: Partial<GmailConfigService> = {
  };

  const gmailServiceStub: Partial<GmailService> = {
  };
  const easyConfigService: Partial<EasyconfigService> = {};

  const mockResponse = {
    send: jest.fn(),
    redirect: jest.fn(),
    status: jest.fn()
  };

  beforeEach(async() => {

    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [GmailController],
      providers:[
        {provide: GmailConfigService, useValue: gmailConfigServiceStub},
        {provide: EasyconfigService, useValue: easyConfigService},
        { provide: GmailService, useValue: gmailServiceStub}
      ]
    }).compile();

    controller = module.get<GmailController>(GmailController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('Get login URL', () => {
    it('should call the service to get the URL and return it', () => {
        gmailServiceStub.getGmailLoginUrl = jest.fn(() => 'http://myurl');
        const result = controller.getLoginUrl();

        expect(gmailServiceStub.getGmailLoginUrl).toHaveBeenCalled();
        expect(result).toEqual({
            url: 'http://myurl'
        });
    });
  });
});
