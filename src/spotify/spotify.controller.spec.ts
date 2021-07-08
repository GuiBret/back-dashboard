import { Test, TestingModule } from '@nestjs/testing';
import { EasyconfigService } from 'nestjs-easyconfig';
import { Observable } from 'rxjs';
import { SpotifyController } from './spotify.controller';
import { SpotifyService } from './spotify.service';

describe('SpotifyController', () => {
  let controller: SpotifyController;

  const spotifyServiceStub: Partial<SpotifyService> = {
    getUrl: jest.fn(),
    spotifyAutoComp: jest.fn(),
    storeSpotifyToken: jest.fn(),
    getSpotifyToken: jest.fn().mockReturnValue(new Observable())
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
        {provide: EasyconfigService, useValue: easyConfigService}
      ]
    }).compile();

    controller = module.get<SpotifyController>(SpotifyController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('Spotify precheck', () => {
    it('should return the URL since the service has informations', () => {
      spotifyServiceStub.hasInformations = jest.fn(() => true);

      const result = controller.spotifyPrecheck();

      expect(result).toHaveProperty('status', 'OK');
      expect(result).toHaveProperty('message', 'GET_TOKEN');
      expect(result).toHaveProperty('url');

      expect(spotifyServiceStub.getUrl).toHaveBeenCalled();
    });

    it('should return an error since the service has no informations', () => {
      spotifyServiceStub.hasInformations = jest.fn(() => false);

      const result = controller.spotifyPrecheck();

      expect(result).toHaveProperty('status', 'KO');
      expect(result).toHaveProperty('message', 'MISSING_CLIENT_OR_SECRET');

      expect(spotifyServiceStub.getUrl).not.toHaveBeenCalled();
    });
  });

  // describe('Get Spotify URL', () => {
  //   it('should ')
  // })

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

      expect(spotifyServiceStub.storeSpotifyToken).toHaveBeenCalledWith(mockQuery.access_token);
    });

    it('should call the service to get the token using the code passed', () => {
      const mockQuery = {
        code: 'ABCDEF'
      };

      controller.getToken(mockQuery, mockResponse);

      expect(spotifyServiceStub.getSpotifyToken).toHaveBeenCalledWith(mockQuery.code);
    });
  });
});
