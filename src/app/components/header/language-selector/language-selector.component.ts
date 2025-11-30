import { Component, Input, Output, EventEmitter, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface Language {
  code: string;
  label: string;
  initials: string;
}

@Component({
  selector: 'app-language-selector',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="relative flex-shrink-0"
         (mouseenter)="showDropdown.set(true)"
         (mouseleave)="showDropdown.set(false)">

      <!-- Globe icon button -->
      <button class="cursor-pointer flex items-center gap-2 hover:opacity-75 transition-opacity duration-200 group">
        <i class="fas fa-globe w-5 h-5 text-[var(--sned-orange)]"></i>
        <span class="text-sm font-semibold text-[var(--sned-orange)]">{{ getCurrentLangInitials() }}</span>

        <!-- Zone de tolérance (invisible) -->
        <div class="absolute top-full right-0 w-12 h-3"></div>
      </button>

      <!-- Language dropdown -->
      @if (showDropdown()) {
        <div class="absolute top-[calc(100%+0.5rem)] left-1/2 -translate-x-1/2 flex flex-col space-y-2 z-60">
          @for (lang of languages; track lang.code) {
            <button
              (click)="onLanguageChange(lang)"
              [ngClass]="{
                'bg-gradient-to-r from-[var(--sned-orange)] to-[var(--sned-blue)] text-white shadow-lg': lang.code === currentLang(),
                'bg-white hover:bg-[var(--sned-orange)]/10 text-[var(--sned-orange-dark)]': lang.code !== currentLang()
              }"
              class="cursor-pointer px-3 py-2 rounded-lg shadow-md flex items-center justify-center transition-all duration-200 font-semibold text-sm min-w-[3rem] group relative"
              [title]="lang.label">
              {{ lang.initials }}

              <!-- Tooltip -->
              <span
                [ngClass]="{
                  'right-full mr-2': currentLang() !== 'ar',
                  'left-full ml-2': currentLang() === 'ar'
                }"
                class="absolute top-1/2 -translate-y-1/2 px-2 py-1 text-xs rounded-md bg-gray-800 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-70">
                {{ lang.label }}
              </span>
            </button>
          }
        </div>
      }
    </div>
  `,
  styles: [`
    :host {
      display: block;
    }
  `]
})
export class LanguageSelectorComponent {
  @Input({ required: true }) languages: Language[] = [];
  @Input({ required: true }) currentLang: () => string = () => 'fr';
  @Output() languageChange = new EventEmitter<Language>();

  showDropdown = signal(false);

  getCurrentLangInitials(): string {
    const currentLangCode = this.currentLang();
    const language = this.languages.find(lang => lang.code === currentLangCode);
    return language?.initials || 'FR';
  }

  onLanguageChange(language: Language) {
    this.languageChange.emit(language);
    this.showDropdown.set(false);
  }
}
