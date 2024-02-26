import { SpotifySearchType } from '../enums/spotify-search-type.enum';
import {
  SpotifyGenericExternalUrlsDto,
  SpotifyGenericFollowersDto,
  SpotifyGenericImageDto,
} from './spotify-generic.dto';

export class SpotifyArtistShortDto {
  external_urls: SpotifyGenericExternalUrlsDto;
  href: string;
  id: string;
  name: string;
  type: SpotifySearchType;
  uri: string;
}

export class SpotifyArtistDto extends SpotifyArtistShortDto {
  followers: SpotifyGenericFollowersDto;
  genres: Array<string>; // TODO: enum ??
  images: Array<SpotifyGenericImageDto>;
  popularity: number;
}
