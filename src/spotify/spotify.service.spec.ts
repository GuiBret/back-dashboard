import { Test, TestingModule } from '@nestjs/testing';
import { SpotifyService } from './spotify.service';
import { HttpService } from '@nestjs/common';
import { EasyconfigService } from 'nestjs-easyconfig';
import * as fs from 'fs';
import { SpotifyElementFactory } from './factories/spotify-element-factory';
import { SpotifyConfigService } from './services/spotify-config.service';

let httpServiceStub : Partial<HttpService>;
let spotifyElementFactoryStub: Partial<SpotifyElementFactory>;
let spotifyConfigServiceStub: Partial<SpotifyConfigService>;
describe('SpotifyService', () => {
  let service: SpotifyService;

  beforeEach(async() => {

    httpServiceStub = {
      get: jasmine.createSpy()
    };

    spotifyElementFactoryStub = {
      generateAlbumElement: jest.fn(),
      generateArtistElement: jest.fn(),
      generateTrackElement: jest.fn(),
    };

    spotifyConfigServiceStub = {
      extractSpotifyParams: jest.fn()
    };

    const easyConfigService : Partial<EasyconfigService> = {};
    const module: TestingModule = await Test.createTestingModule({
      providers: [SpotifyService,
      {
        provide: HttpService, useValue: httpServiceStub,
      },
      {provide: EasyconfigService, useValue: easyConfigService},
      { provide: SpotifyConfigService, useValue: spotifyConfigServiceStub},
      { provide: SpotifyElementFactory, useValue: spotifyElementFactoryStub}
    ],
    }).compile();

    service = module.get<SpotifyService>(SpotifyService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('On module init', () => {
    it('should call the config service to extract the info', () => {

      service.onModuleInit();

      expect(spotifyConfigServiceStub.extractSpotifyParams).toHaveBeenCalled();

    });
  });
});
