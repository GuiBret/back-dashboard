import { Test, TestingModule } from '@nestjs/testing';
import { SpotifyElementFactory } from './spotify-element-factory';

describe('SpotifyElementFactory', () => {
  let service: SpotifyElementFactory;

  beforeEach(async() => {

    const module: TestingModule = await Test.createTestingModule({
      providers: [
          SpotifyElementFactory
      ],
    }).compile();

    service = module.get<SpotifyElementFactory>(SpotifyElementFactory);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('Generate album element', () => {
    it('should return an element without the image since the image array is empty', () => {
      const mockKeyElement = {
        id: '1',
        images: [],
        name: 'My name',
        uri: 'My URI'
      };

      const albumElement = service.generateAlbumElement(mockKeyElement);

      expect(albumElement.id).toEqual('1');
      expect(albumElement.imageUrl).toEqual('');
      expect(albumElement.name).toEqual('My name');
      expect(albumElement.uri).toEqual('My URI');
      expect(albumElement.type).toEqual('album');
    });

    it('should return an element with the last image since the image array is not empty', () => {
      const mockKeyElement = {
        id: '1',
        images: [{ url: 'image1Url'}, {url: 'image2Url'}],
        name: 'My name',
        uri: 'My URI'
      };

      const albumElement = service.generateAlbumElement(mockKeyElement);

      expect(albumElement.id).toEqual('1');
      expect(albumElement.imageUrl).toEqual('image2Url');
      expect(albumElement.name).toEqual('My name');
      expect(albumElement.uri).toEqual('My URI');
      expect(albumElement.type).toEqual('album');
    });
  });

  describe('Generate artist element', () => {
    it('should return an element without the image since the image array is empty', () => {
      const mockKeyElement = {
        id: '1',
        images: [],
        name: 'My name',
        uri: 'My URI'
      };

      const albumElement = service.generateArtistElement(mockKeyElement);

      expect(albumElement.id).toEqual('1');
      expect(albumElement.imageUrl).toEqual('');
      expect(albumElement.name).toEqual('My name');
      expect(albumElement.uri).toEqual('My URI');
      expect(albumElement.type).toEqual('artist');
    });

    it('should return an element with the last image since the image array is not empty', () => {
      const mockKeyElement = {
        id: '1',
        images: [{ url: 'image1Url'}, {url: 'image2Url'}],
        name: 'My name',
        uri: 'My URI'
      };

      const albumElement = service.generateArtistElement(mockKeyElement);

      expect(albumElement.id).toEqual('1');
      expect(albumElement.imageUrl).toEqual('image2Url');
      expect(albumElement.name).toEqual('My name');
      expect(albumElement.uri).toEqual('My URI');
      expect(albumElement.type).toEqual('artist');
    });
  });
});
