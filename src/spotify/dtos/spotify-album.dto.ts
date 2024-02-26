import { SpotifyArtistDto } from './spotify-artist.dto';
import {
  SpotifyGenericExternalUrlsDto,
  SpotifyGenericUserImageDto,
} from './spotify-generic.dto';

export class SpotifyAlbumDto {
  album_type: string;
  total_tracks: number;
  available_markets: Array<string>;
  external_urls: SpotifyGenericExternalUrlsDto;
  href: string;
  id: string;
  images: Array<SpotifyGenericUserImageDto>;
  name: string;
  release_date: string;
  release_date_precision: string; // TODO: enum
  type: string; // TODO: enum
  uri: string;
  artists: SpotifyArtistDto;
}

export class SpotifyReleaseRestrictions {
  reason: string;
}
