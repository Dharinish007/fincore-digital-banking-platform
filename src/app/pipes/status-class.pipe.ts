import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'statusClass',
  standalone: false
})
export class StatusClassPipe implements PipeTransform {
  transform(value: string | undefined | null): string {
    if (!value) {
      return '';
    }
    return value.toLowerCase().replace(/\s+/g, '-');
  }
}
