import { inject, Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import localeFr from '@angular/common/locales/fr';
import localeEn from '@angular/common/locales/en';
import { registerLocaleData } from '@angular/common';

@Injectable({ providedIn: 'root' })
export class LocaleService {
  private readonly translateService = inject(TranslateService);

  constructor() {
  }

  setLanguage(language: string): void {
    localStorage.setItem('language', language);
    this.translateService.use(language);
    registerLocaleData(this.getLocale(language), this.getLocaleId(language));
  }

  setCurrentLocale(): void {
    const language = this.translateService.getCurrentLang();
    localStorage.setItem('language', language);
    registerLocaleData(this.getLocale(language), this.getLocaleId(language));
  }

  getCurrentLocaleId(): string {
    return this.getLocaleId(this.translateService.getCurrentLang());
  }

  private getLocaleId(language: string): string {
    switch (language) {
      case 'fr':
        return 'fr-FR';
      case 'en':
        return 'en-US';
      default:
        return 'en-US';
    }
  }

  private getLocale(language: string): unknown {
    switch (language) {
      case 'fr':
        return localeFr;
      case 'en':
        return localeEn;
      default:
        return localeEn;
    }
  }
}
