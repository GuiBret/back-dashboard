import {
  SpotifyGenericExternalUrlsDto,
  SpotifyGenericFollowersDto,
  SpotifyGenericImageDto,
} from './spotify-generic.dto';

export class SpotifyUserProfileDto {
  country: string;
  display_name: string;
  email: string;
  explicit_content: SpotifyExplicitContentInfoDto;
  external_urls: SpotifyGenericExternalUrlsDto;
  followers: SpotifyGenericFollowersDto;
  href: string;
  id: string;
  images: SpotifyGenericImageDto;
  product: string;
  type: string;
  uri: string;
}

export class SpotifyExplicitContentInfoDto {
  filter_enabled: boolean;
  filter_locked: boolean;
}
