import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface Language {
  code: string;
  label: string;
  flag: string;
}

@Component({
  selector: 'app-language-selector',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="relative"
         (mouseenter)="onMouseEnter()"
         (mouseleave)="onMouseLeave()">

      <!-- Langue active -->
      <div class="relative group">
        <button class="cursor-pointer p-1 rounded-full shadow-md bg-white flex items-center justify-center hover:ring-2 hover:ring-[var(--sned-orange)] transition">
          <img [src]="currentLanguage.flag"
               [alt]="currentLanguage.label"
               class="w-8 h-8 rounded-full"/>
        </button>
        
        <!-- Tooltip langue active -->
        <span
          class="absolute right-full mr-3 top-1/2 -translate-y-1/2 px-2 py-1 text-sm rounded-md bg-gray-800 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
          {{ currentLanguage.label }}
        </span>
      </div>

      <!-- Zone de tolérance (invisible) -->
      <div class="absolute top-full right-0 w-12 h-3"></div>

      <!-- Autres langues -->
      <div
        class="absolute top-[calc(100%+0.5rem)] right-0 flex flex-col space-y-2 z-50 transform transition-all duration-300 ease-out"
        [ngClass]="{
          'opacity-100 translate-y-0 pointer-events-auto': isOpen,
          'opacity-0 -translate-y-2 pointer-events-none': !isOpen
        }">

        <ng-container *ngFor="let lang of availableLanguages">
          <div *ngIf="lang.code !== currentLanguage.code" class="relative group">
            <button
              (click)="selectLanguage(lang)"
              class="cursor-pointer p-1 rounded-full shadow-md bg-white hover:bg-[var(--sned-orange-light)] flex items-center justify-center transition">
              <img [src]="lang.flag"
                   [alt]="lang.label"
                   class="w-8 h-8 rounded-full"/>
            </button>
            
            <!-- Tooltip langues secondaires -->
            <span
              class="absolute right-full mr-3 top-1/2 -translate-y-1/2 px-2 py-1 text-sm rounded-md bg-gray-800 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
              {{ lang.label }}
            </span>
          </div>
        </ng-container>
      </div>
    </div>
  `,
  styles: [`
    @media (max-width: 640px) {
      :host {
        display: none;
      }
    }
  `]
})
export class LanguageSelectorComponent {
  @Input({ required: true }) currentLanguage!: Language;
  @Input({ required: true }) availableLanguages: Language[] = [];
  @Input() isOpen: boolean = false;
  @Output() languageChange = new EventEmitter<Language>();
  @Output() toggleDropdown = new EventEmitter<boolean>();

  onMouseEnter() {
    this.toggleDropdown.emit(true);
  }

  onMouseLeave() {
    this.toggleDropdown.emit(false);
  }

  selectLanguage(language: Language) {
    this.languageChange.emit(language);
  }
}