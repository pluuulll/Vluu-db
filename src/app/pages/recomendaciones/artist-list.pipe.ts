import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'artistList'
})
export class ArtistListPipe implements PipeTransform {
  transform(artists: any[]): string {
    return artists?.map(artist => artist.name).join(', ') || 'Artistas desconocidos';
  }
}