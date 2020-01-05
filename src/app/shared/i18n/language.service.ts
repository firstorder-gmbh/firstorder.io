import { isPlatformBrowser } from '@angular/common';
import { BehaviorSubject } from 'rxjs';
import { Direction, Directionality } from '@angular/cdk/bidi';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Injectable()
export class LanguageService {
  static storageKey = 'language-current';
  availableLanguages: Array<string> = ['ar', 'de', 'en'];
  defaultLanguage = 'en';
  dir$: BehaviorSubject<Direction>;

  // check if running im browser
  private storage = isPlatformBrowser(this.platformId) ? localStorage : undefined;

  constructor(
      private directionality: Directionality,
      private translate: TranslateService,
      @Inject(PLATFORM_ID) private platformId) {

    // this language will be used as a fallback when a translation isn't found in the current language
    translate.setDefaultLang(this.defaultLanguage);
    // adding available localisation languages
    translate.addLangs(this.availableLanguages);

    const storedLanguage = this.getStoredLanguage();
    const browserLanguage = translate.getBrowserLang();

    if (!storedLanguage && this.availableLanguages.indexOf(browserLanguage) !== -1) {
      // use language saved by currentUser
      translate.use(translate.getBrowserLang());
    } else if (!storedLanguage && this.availableLanguages.indexOf(browserLanguage) === -1) {
      // the lang to use, if the lang isn't available, it will use the current loader to get them
      translate.use(this.defaultLanguage);
    } else {
      // use browser language
      translate.use(storedLanguage);
    }

    this.dir$ = new BehaviorSubject(this.directionality.value);
  }

  clearStorage(): void {
    if (this.storage) {
      try {
        this.storage.removeItem(LanguageService.storageKey);
      } catch (e) {
        return;
      }
    }
  }

  getLanguage(): string {
    return this.translate.currentLang;
  }

  getStoredLanguage(): string {
    if (this.storage) {
      try {
        return this.storage[LanguageService.storageKey] || '';
      } catch {
        return undefined;
      }
    } else {
      return undefined;
    }
  }

  setLanguage(locale: string): void {
    this.translate.use(locale);
    this.storeLanguage(locale);
  }

  storeLanguage(language: string): void {
    if (this.storage) {
      try {
        this.storage[LanguageService.storageKey] = language;
      } catch {
        return; // Safari will return an error when Private Browsing
      }
    }
  }
}
