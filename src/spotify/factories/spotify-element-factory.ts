import { Injectable } from '@nestjs/common';

@Injectable()
export class SpotifyElementFactory {

    public generateTrackElement(track: {album: { images: Array<any>}, name: string, uri: string, id: string}): any {
        // TODO: make that generic
        let lastImageUrl = '';
        if(track.album.images.length !== 0) {
            lastImageUrl = track.album.images[track.album.images.length - 1].url;
        }

        return {
            id: track.id,
            imageUrl: lastImageUrl,
            name: track.name,
            uri: track.uri,
            type: 'track'
        };
    }

    public generateAlbumElement(album: { images: Array<any>, id: string, name: string, uri: string}) : any {
        return this.createGenericElement(album, 'album');
    }
    public generateArtistElement(artist: { images: Array<any>, name: string, uri: string, id: string}): any {
        return this.createGenericElement(artist, 'artist');
    }

    private createGenericElement(keyElement: { images: Array<any>, id: string, name: string, uri: string}, type: 'album' | 'artist' | 'track'): any {
        let lastImageUrl = '';

        if(keyElement.images.length !== 0) {
            lastImageUrl = keyElement.images[keyElement.images.length - 1].url;
        }

        return {
            id: keyElement.id,
            imageUrl: lastImageUrl,
            name: keyElement.name,
            uri: keyElement.uri,
            type
        };
    }

}
