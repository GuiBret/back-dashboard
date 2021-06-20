import { Test, TestingModule } from '@nestjs/testing';
import { SpotifyService } from './spotify.service';
import { HttpService } from '@nestjs/common';
import { EasyconfigService } from 'nestjs-easyconfig';

describe('SpotifyService', () => {
  let service: SpotifyService;

  beforeEach(async() => {

    const httpServiceStub: Partial<HttpService> = {
      get: jasmine.createSpy()
    };

    const easyConfigService : Partial<EasyconfigService> = {};
    const module: TestingModule = await Test.createTestingModule({
      providers: [SpotifyService,
      {
        provide: HttpService, useValue: httpServiceStub
      },
      {provide: EasyconfigService, useValue: easyConfigService}],
    }).compile();

    service = module.get<SpotifyService>(SpotifyService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('Generate base 64 hash', () => {
    it('should generate a base 64 hash matching mocked data', () => {
      service['clientId'] = 'mockClientId';
      service['clientSecret'] = 'mockClientSecret';

      const hash = service['generateBase64Hash']();

      expect(hash).toEqual(new Buffer('mockClientId:mockClientSecret').toString('base64'));
    });
  });
});
