import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'slugify'
})
export class SlugifyPipe implements PipeTransform {

  transform(input: string): string {
    return input
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, ' ')
      .replace(/[\s-]+/g, '-');
  }
}
