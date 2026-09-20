import { Injectable, effect, signal } from '@angular/core';

export type ThemeMode = 'light' | 'dark';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private readonly THEME_KEY = 'fincore-theme';
  private currentTheme = signal<ThemeMode>(this.getInitialTheme());

  constructor() {
    // Apply theme on initialization and whenever it changes
    effect(() => {
      this.applyThemeToRoot(this.currentTheme());
    });
  }

  get theme() {
    return this.currentTheme.asReadonly();
  }

  toggleTheme(): void {
    const nextTheme = this.currentTheme() === 'light' ? 'dark' : 'light';
    this.currentTheme.set(nextTheme);
    localStorage.setItem(this.THEME_KEY, nextTheme);
  }

  setTheme(theme: ThemeMode): void {
    this.currentTheme.set(theme);
    localStorage.setItem(this.THEME_KEY, theme);
  }

  private getInitialTheme(): ThemeMode {
    const stored = localStorage.getItem(this.THEME_KEY) as ThemeMode;
    if (stored === 'light' || stored === 'dark') {
      return stored;
    }
    // Default to dark mode for modern enterprise banking aesthetic, or check preference
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches) {
      return 'light';
    }
    return 'dark';
  }

  private applyThemeToRoot(theme: ThemeMode): void {
    const root = document.documentElement;
    const body = document.body;

    if (theme === 'dark') {
      root.classList.add('dark-theme');
      body.classList.add('dark-theme');
      root.style.colorScheme = 'dark';
    } else {
      root.classList.remove('dark-theme');
      body.classList.remove('dark-theme');
      root.style.colorScheme = 'light';
    }
  }
}
