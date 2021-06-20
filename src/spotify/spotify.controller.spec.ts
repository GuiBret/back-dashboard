import { Test, TestingModule } from '@nestjs/testing';
import { EasyconfigService } from 'nestjs-easyconfig';
import { SpotifyController } from './spotify.controller';
import { SpotifyService } from './spotify.service';

describe('SpotifyController', () => {
  let controller: SpotifyController;

  const spotifyServiceStub: Partial<SpotifyService> = {};
  const easyConfigService: Partial<EasyconfigService> = {};

  beforeEach(async() => {
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
});
