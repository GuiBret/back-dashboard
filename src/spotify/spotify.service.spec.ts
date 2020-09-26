import { Test, TestingModule } from '@nestjs/testing';
import { SpotifyService } from './spotify.service';
import { HttpService } from '@nestjs/common';

describe('SpotifyService', () => {
  let service: SpotifyService;

  beforeEach(async () => {

    let httpServiceStub: Partial<HttpService>;

    httpServiceStub = {
      get: jasmine.createSpy()
    }
    const module: TestingModule = await Test.createTestingModule({
      providers: [SpotifyService,
      {
        provide: HttpService, useValue: httpServiceStub
      }],
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
    })
  })
});
