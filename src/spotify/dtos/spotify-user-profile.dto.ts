import {
  SpotifyGenericExternalUrlsDto,
  SpotifyGenericUserImageDto,
} from './spotify-generic.dto';

export class SpotifyUserProfileDto {
  country: string;
  display_name: string;
  email: string;
  explicit_content: SpotifyExplicitContentInfoDto;
  external_urls: SpotifyGenericExternalUrlsDto;
  followers: SpotifyFollowersDto;
  href: string;
  id: string;
  images: SpotifyGenericUserImageDto;
  product: string;
  type: string;
  uri: string;
}

export class SpotifyExplicitContentInfoDto {
  filter_enabled: boolean;
  filter_locked: boolean;
}

export class SpotifyFollowersDto {
  href: string;
  total: number;
}
