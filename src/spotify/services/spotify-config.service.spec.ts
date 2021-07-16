import { HttpService } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { EasyconfigService } from 'nestjs-easyconfig';
import { SpotifyConfigService } from '../services/spotify-config.service';
import * as fs from 'fs';
import * as querystring from 'querystring';

describe('SpotifyConfigService', () => {
  let service: SpotifyConfigService;
  let httpServiceStub: Partial<HttpService>;

  beforeEach(async() => {

    httpServiceStub = {
      post: jest.fn()
    };

    const easyConfigService : Partial<EasyconfigService> = {
      get: jest.fn(() => 'mockGet')
    };
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SpotifyConfigService,
        { provide: HttpService, useValue: httpServiceStub },
        { provide: EasyconfigService, useValue: easyConfigService}
      ],
    }).compile();

    service = module.get<SpotifyConfigService>(SpotifyConfigService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('Extract spotify params', () => {
    it('should not set content since it was defined', () => {
      spyOn(fs, 'readFileSync').and.returnValue('{"CLIENTID": "abcdef", "CLIENTSECRET": "123456"}');

      service.extractSpotifyParams();

      expect(service['clientId']).toEqual('abcdef');
      expect(service['clientSecret']).toEqual('123456');
    });
  });

  describe('Store spotify token', () => {
    it('should store the token', () => {
        const token = 'testtoken';

        service.storeSpotifyToken(token);

        expect(service.spotifyToken).toEqual(token);
      });
  });

  describe('Generate base 64 hash', () => {
    it('should generate a base 64 hash matching mocked data', () => {
      service['clientId'] = 'mockClientId';
      service['clientSecret'] = 'mockClientSecret';

      const hash = service['generateBase64Hash']();

      expect(hash).toEqual(new Buffer('mockClientId:mockClientSecret').toString('base64'));
    });
  });

  describe('Has informations', () => {
    it('should return false since the clientId is empty', () => {
      service['clientId'] = 'abcdef';
      service['clientSecret'] = null;

      const result = service.hasInformations();

      expect(result).toEqual(false);
    });

    it('should return false since the clientSecret is empty', () => {
      service['clientId'] = null;
      service['clientSecret'] = 'abcdef';

      const result = service.hasInformations();

      expect(result).toEqual(false);
    });

    it('should return true since both are not empty', () => {
      service['clientId'] = '123456';
      service['clientSecret'] = 'abcdef';

      const result = service.hasInformations();

      expect(result).toEqual(true);
    });
  });

  describe('Get spotify token', () => {
    it('should have called post with set parameters', () => {
      service['generateBase64Hash'] = jest.fn().mockReturnValue('Base64hash');

      const expectedForm = querystring.stringify({
        code: 'ABCDEF',
        redirect_uri: 'mockGet/spotify/auth/code',
        grant_type: 'authorization_code'
      });
      const expectedHeaderObject = {
        headers: {
          'Authorization': 'Basic Base64hash', 'Content-Type': 'application/x-www-form-urlencoded'
        }
      };

      service.getSpotifyToken('ABCDEF');

      expect(httpServiceStub.post).toHaveBeenCalledWith('https://accounts.spotify.com/api/token', expectedForm, expectedHeaderObject);


    });
  });
  describe('Get login URL', () => {
    it('should have returned a URL', () => {
      const expectedForm = querystring.stringify({
        scope: 'user-read-private user-read-email user-read-playback-state user-modify-playback-state streaming',
        client_id: service['clientId'],
        redirect_uri: 'mockGet/spotify/auth/code',
        response_type: 'code'
      });

      const loginUrl = service.getLoginUrl();

      expect(loginUrl).toEqual('https://accounts.spotify.com/authorize?' + expectedForm);
    });
  });
});
