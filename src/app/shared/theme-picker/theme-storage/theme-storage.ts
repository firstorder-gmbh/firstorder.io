import { EventEmitter, Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

export interface AppTheme {
  accent: string;
  href: string;
  isDark?: boolean;
  isDefault?: boolean;
  primary: string;
}

@Injectable()
export class ThemeStorage {

  static storageKey = 'theme-storage-current';

  onThemeUpdate: EventEmitter<AppTheme> = new EventEmitter<AppTheme>();

  // check if running im browser
  private storage = isPlatformBrowser(this.platformId) ? window.localStorage : undefined;

  constructor(@Inject(PLATFORM_ID) private platformId) {
  }

  clearStorage(): void {
    if (this.storage) {
      try {
        this.storage.removeItem(ThemeStorage.storageKey);
      } catch (e) {
        return;
      }
    }
  }

  getStoredTheme(): AppTheme {
    if (this.storage) {
      try {
        return JSON.parse(this.storage[ThemeStorage.storageKey] || null);
      } catch (e) {
        return null;
      }
    }
  }

  storeTheme(theme: AppTheme): void {
    if (this.storage) {
      try {
        this.storage[ThemeStorage.storageKey] = JSON.stringify(theme);
      } catch (e) {
        return;
      }
    }

    this.onThemeUpdate.emit(theme);
  }
}
