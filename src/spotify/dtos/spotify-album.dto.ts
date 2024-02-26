import { SpotifySearchType } from '../enums/spotify-search-type.enum';
import { SpotifyArtistDto } from './spotify-artist.dto';
import {
  SpotifyGenericExternalUrlsDto,
  SpotifyGenericImageDto,
} from './spotify-generic.dto';

export class SpotifyAlbumDto {
  album_type: string;
  total_tracks: number;
  available_markets: Array<string>;
  external_urls: SpotifyGenericExternalUrlsDto;
  href: string;
  id: string;
  images: Array<SpotifyGenericImageDto>;
  name: string;
  release_date: string;
  release_date_precision: string; // TODO: enum
  type: SpotifySearchType;
  uri: string;
  artists: Array<SpotifyArtistDto>;
}

export class SpotifyReleaseRestrictions {
  reason: string;
}
