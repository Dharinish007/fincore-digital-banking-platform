import { Injectable, signal } from '@angular/core';
import { StorageUtil } from '../../core/utils/storage.util';
import { STORAGE_KEYS } from '../../core/constants/storage-keys';

export type Theme = 'light' | 'dark' | 'system';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private currentTheme = signal<Theme>('system');
  readonly theme = this.currentTheme.asReadonly();

  constructor() {
    this.initializeTheme();
  }

  setTheme(theme: Theme): void {
    this.currentTheme.set(theme);
    StorageUtil.setItem(STORAGE_KEYS.THEME, theme);
    this.applyTheme(theme);
  }

  private initializeTheme(): void {
    const savedTheme = StorageUtil.getItem<Theme>(STORAGE_KEYS.THEME) || 'system';
    this.setTheme(savedTheme);
  }

  private applyTheme(theme: Theme): void {
    const isDark = theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
    
    if (isDark) {
      document.documentElement.classList.add('dark-theme');
    } else {
      document.documentElement.classList.remove('dark-theme');
    }
  }
}
