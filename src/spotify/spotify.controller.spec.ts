import { Test, TestingModule } from '@nestjs/testing';
import { EasyconfigService } from 'nestjs-easyconfig';
import { Observable } from 'rxjs';
import { SpotifyConfigService } from './services/spotify-config.service';
import { SpotifyController } from './spotify.controller';
import { SpotifyService } from './spotify.service';

describe('SpotifyController', () => {
  let controller: SpotifyController;

  const spotifyConfigServiceStub: Partial<SpotifyConfigService> = {
    storeSpotifyToken: jest.fn(),
    getSpotifyToken: jest.fn(() => new Observable()),
    getLoginUrl: jest.fn()
  };

  const spotifyServiceStub: Partial<SpotifyService> = {
    spotifyAutoComp: jest.fn()
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
      controllers: [SpotifyController],
      providers:[
        {provide: SpotifyService, useValue: spotifyServiceStub},
        {provide: EasyconfigService, useValue: easyConfigService},
        { provide: SpotifyConfigService, useValue: spotifyConfigServiceStub}
      ]
    }).compile();

    controller = module.get<SpotifyController>(SpotifyController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('Spotify precheck', () => {
    it('should return the URL since the service has informations', () => {
      spotifyConfigServiceStub.hasInformations = jest.fn(() => true);

      const result = controller.spotifyPrecheck();

      expect(result).toHaveProperty('status', 'OK');
      expect(result).toHaveProperty('message', 'GET_TOKEN');
      expect(result).toHaveProperty('url');

      expect(spotifyConfigServiceStub.getLoginUrl).toHaveBeenCalled();
    });

    it('should return an error since the service has no informations', () => {
      spotifyConfigServiceStub.hasInformations = jest.fn(() => false);

      const result = controller.spotifyPrecheck();

      expect(result).toHaveProperty('status', 'KO');
      expect(result).toHaveProperty('message', 'MISSING_CLIENT_OR_SECRET');

      expect(spotifyConfigServiceStub.getLoginUrl).not.toHaveBeenCalled();
    });
  });

  describe('Search', () => {
    it('should return an error since the header was not provided', () => {
      const params = {
        'artist': '123',
        'key': 'value'
      };

      const mockReq = {
        query: {
          type: 'artist'
        }
      };

      const result = controller.q(params, null, mockReq);

      expect(result).toHaveProperty('status', 'KO');
      expect(result).toHaveProperty('error', 'MISSING_TOKEN');
    });

    it('should call the service to perform an autocomplete search ', () => {
      const params = {

        query: {
          'artist': '123',
          'key': 'value'

        }
      };

      const mockReq = {
        query: {
          type: 'artist'
        }
      };

      controller.q(params, 'Authorization abcdefgh', mockReq);

      expect(spotifyServiceStub.spotifyAutoComp).toHaveBeenCalledWith(params.query, 'abcdefgh', mockReq.query.type);
    });
  });

  describe('Get token', () => {
    it('should store the token if it was passed', () => {

      const mockQuery = {
        access_token: 'abcdef'
      };

      controller.getToken(mockQuery, mockResponse);

      expect(spotifyConfigServiceStub.storeSpotifyToken).toHaveBeenCalledWith(mockQuery.access_token);
    });

    it('should call the service to get the token using the code passed', () => {
      const mockQuery = {
        code: 'ABCDEF'
      };

      controller.getToken(mockQuery, mockResponse);

      expect(spotifyConfigServiceStub.getSpotifyToken).toHaveBeenCalledWith(mockQuery.code);
    });
  });
});
