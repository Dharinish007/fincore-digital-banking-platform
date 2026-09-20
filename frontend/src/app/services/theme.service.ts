import { Injectable, signal } from '@angular/core';

export type ThemeMode = 'NIGHT' | 'DAY';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  readonly mode = signal<ThemeMode>('NIGHT');

  setTheme(mode: ThemeMode): void {
    this.mode.set(mode);
    if (typeof document !== 'undefined') {
      if (mode === 'DAY') {
        document.body.classList.add('theme-light');
        document.body.classList.remove('theme-dark');
      } else {
        document.body.classList.add('theme-dark');
        document.body.classList.remove('theme-light');
      }
    }
  }

  toggleTheme(): void {
    this.setTheme(this.mode() === 'NIGHT' ? 'DAY' : 'NIGHT');
  }
}

