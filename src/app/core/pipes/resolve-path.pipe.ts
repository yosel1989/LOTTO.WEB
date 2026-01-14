import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'resolvePath',
  standalone: true
})
export class ResolvePathPipe implements PipeTransform {
  transform(obj: any, path: string): any {
    const value = path.split('.').reduce((acc, part) => acc?.[part], obj);
    return value ?? null;
  }
}
