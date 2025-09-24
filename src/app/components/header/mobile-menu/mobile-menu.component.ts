import { Component, Input, Output, EventEmitter, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { trigger, state, style, transition, animate } from '@angular/animations';

export interface MenuItem {
  label: string;
  route?: string;
  children?: MenuItem[];
  description?: string;
  isExternal?: boolean;
  hasModal?: boolean;
  hasPagination?: boolean;
}

export interface MenuSection {
  title: string;
  items: MenuItem[];
}

export interface Language {
  code: string;
  label: string;
  flag: string;
}

@Component({
  selector: 'app-mobile-menu',
  standalone: true,
  imports: [CommonModule, RouterModule],
  animations: [
    trigger('slideDown', [
      transition(':enter', [
        style({ transform: 'translateY(-100%)', opacity: 0 }),
        animate('300ms cubic-bezier(0.4, 0, 0.2, 1)', 
          style({ transform: 'translateY(0)', opacity: 1 })
        )
      ]),
      transition(':leave', [
        animate('300ms cubic-bezier(0.4, 0, 0.2, 1)', 
          style({ transform: 'translateY(-100%)', opacity: 0 })
        )
      ])
    ]),
    trigger('expandCollapse', [
      transition(':enter', [
        style({ height: '0px', opacity: 0 }),
        animate('250ms ease-out', style({ height: '*', opacity: 1 }))
      ]),
      transition(':leave', [
        animate('250ms ease-in', style({ height: '0px', opacity: 0 }))
      ])
    ])
  ],
  template: `
    <!-- Mobile Menu Toggle Button -->
    <div class="lg:hidden flex items-center space-x-3">
      
      <!-- Language selector mobile simple -->
      <div class="relative">
        <button 
          (click)="toggleMobileLangDropdown()"
          class="flex items-center justify-center w-10 h-10 rounded-lg bg-white/90 backdrop-blur-sm shadow-sm hover:shadow-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[var(--sned-orange)]/50">
          <img [src]="currentLanguage.flag"
               [alt]="currentLanguage.label"
               class="w-5 h-5 rounded-full object-cover"/>
        </button>
        
        <!-- Dropdown langues mobile -->
        <div *ngIf="showMobileLangDropdown()" 
             [@expandCollapse]
             class="absolute top-full right-0 mt-2 bg-white rounded-xl shadow-xl border border-gray-100 min-w-[160px] z-50 overflow-hidden">
          <div class="p-2">
            <button *ngFor="let lang of availableLanguages"
                    (click)="selectLanguage(lang)"
                    [class.bg-[var(--sned-orange)]="lang.code === currentLanguage.code"
                    [class.text-white]="lang.code === currentLanguage.code"
                    class="w-full flex items-center space-x-3 px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 hover:bg-[var(--sned-orange)]/10 hover:text-[var(--sned-orange)]">
              <img [src]="lang.flag" [alt]="lang.label" class="w-4 h-4 rounded-full object-cover flex-shrink-0"/>
              <span>{{ lang.label }}</span>
              <svg *ngIf="lang.code === currentLanguage.code" class="w-4 h-4 ml-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
              </svg>
            </button>
          </div>
        </div>
      </div>
      
      <!-- Menu Toggle Button -->
      <button 
        (click)="toggleMenu()"
        [attr.aria-expanded]="isOpen"
        [attr.aria-label]="isOpen ? 'Fermer le menu' : 'Ouvrir le menu'"
        class="relative flex items-center justify-center w-10 h-10 rounded-lg bg-white/90 backdrop-blur-sm shadow-sm hover:shadow-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[var(--sned-orange)]/50 group">
        
        <!-- Animated hamburger icon -->
        <div class="relative w-5 h-5 flex flex-col justify-center items-center">
          <span class="absolute w-5 h-0.5 bg-[var(--sned-blue-dark)] transform transition-all duration-300 ease-in-out"
                [ngClass]="isOpen ? 'rotate-45 translate-y-0' : '-translate-y-1.5'"></span>
          <span class="absolute w-5 h-0.5 bg-[var(--sned-blue-dark)] transform transition-all duration-300 ease-in-out"
                [ngClass]="isOpen ? 'opacity-0' : 'opacity-100'"></span>
          <span class="absolute w-5 h-0.5 bg-[var(--sned-blue-dark)] transform transition-all duration-300 ease-in-out"
                [ngClass]="isOpen ? '-rotate-45 translate-y-0' : 'translate-y-1.5'"></span>
        </div>
      </button>
    </div>

    <!-- Mobile Menu Overlay -->
    <div *ngIf="isOpen" 
         [@slideDown]
         class="lg:hidden absolute top-full left-0 right-0 bg-white/98 backdrop-blur-md shadow-2xl border-t border-gray-100/50 z-40 max-h-[calc(100vh-theme(spacing.16))] overflow-y-auto">
      
      <div class="max-w-7xl mx-auto">
        <div class="px-4 py-4 space-y-2">
          
          <!-- Menu Items -->
          <ng-container *ngFor="let section of menuSections; trackBy: trackBySection">
            <ng-container *ngFor="let item of section.items; trackBy: trackByItem">
              
              <!-- Simple menu item -->
              <div *ngIf="!item.children" class="relative overflow-hidden rounded-lg">
                <a [routerLink]="item.route || '/'"
                   (click)="onMenuItemClick()"
                   routerLinkActive="active-mobile"
                   class="flex items-center px-4 py-3.5 text-base font-medium text-[var(--sned-blue-dark)] hover:bg-gradient-to-r hover:from-[var(--sned-orange)]/8 hover:to-[var(--sned-blue)]/4 hover:text-[var(--sned-blue)] rounded-lg transition-all duration-200 group relative">
                  
                  <svg class="w-5 h-5 mr-3 text-[var(--sned-orange)] opacity-0 group-hover:opacity-100 transition-all duration-200 transform -translate-x-2 group-hover:translate-x-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
                  </svg>
                  
                  <span>{{ item.label }}</span>
                  
                  <!-- Active indicator -->
                  <div class="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-[var(--sned-orange)] to-[var(--sned-blue)] scale-y-0 group-[.active-mobile]:scale-y-100 transition-transform duration-300 origin-top rounded-r-full"></div>
                </a>
              </div>

              <!-- Dropdown menu item -->
              <div *ngIf="item.children" class="relative overflow-hidden rounded-lg">
                <button 
                  (click)="toggleMobileDropdown(item.label)"
                  class="w-full flex items-center justify-between px-4 py-3.5 text-base font-medium text-[var(--sned-blue-dark)] hover:bg-gradient-to-r hover:from-[var(--sned-orange)]/8 hover:to-[var(--sned-blue)]/4 hover:text-[var(--sned-blue)] rounded-lg transition-all duration-200 group">
                  
                  <div class="flex items-center">
                    <svg class="w-5 h-5 mr-3 text-[var(--sned-orange)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path>
                    </svg>
                    <span>{{ item.label }}</span>
                  </div>
                  
                  <svg class="w-5 h-5 transition-transform duration-300"
                       [ngClass]="{'rotate-180': isMobileDropdownOpen(item.label)}"
                       fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                  </svg>
                </button>
                
                <!-- Submenu -->
                <div *ngIf="isMobileDropdownOpen(item.label)" 
                     [@expandCollapse]
                     class="mt-1 ml-4 pl-6 border-l-2 border-[var(--sned-orange)]/20 space-y-1">
                  <a *ngFor="let child of item.children; trackBy: trackByChild"
                     [routerLink]="child.route || '/'"
                     (click)="onMenuItemClick()"
                     routerLinkActive="active-mobile-sub"
                     class="flex items-start px-4 py-2.5 text-sm text-[var(--sned-blue-dark)] hover:bg-gradient-to-r hover:from-[var(--sned-orange)]/8 hover:to-[var(--sned-blue)]/4 hover:text-[var(--sned-blue)] rounded-lg transition-all duration-200 group/sub">
                    
                    <svg class="w-4 h-4 mr-3 mt-0.5 text-[var(--sned-orange)] opacity-0 group-hover/sub:opacity-100 transition-all duration-200 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5-5 5M6 12h12"></path>
                    </svg>
                    
                    <div class="flex-1">
                      <div class="font-medium">{{ child.label }}</div>
                      <div *ngIf="child.description" class="text-xs text-gray-500 mt-1">{{ child.description }}</div>
                    </div>
                  </a>
                </div>
              </div>
            </ng-container>
          </ng-container>
        </div>
      </div>
    </div>

    <!-- Backdrop -->
    <div *ngIf="isOpen" 
         (click)="closeMenu()"
         class="fixed inset-0 bg-black/20 backdrop-blur-sm z-30 lg:hidden"
         [@slideDown]></div>
  `,
  styles: [`
    .active-mobile {
      @apply bg-gradient-to-r from-[var(--sned-orange)]/10 to-[var(--sned-blue)]/5 text-[var(--sned-blue)];
    }
    
    .active-mobile-sub {
      @apply bg-gradient-to-r from-[var(--sned-orange)]/8 to-[var(--sned-blue)]/4 text-[var(--sned-blue)];
    }
    
    /* Smooth scrollbar */
    .overflow-y-auto::-webkit-scrollbar {
      width: 4px;
    }
    
    .overflow-y-auto::-webkit-scrollbar-track {
      background: transparent;
    }
    
    .overflow-y-auto::-webkit-scrollbar-thumb {
      background-color: var(--sned-orange);
      border-radius: 2px;
    }
  `]
})
export class MobileMenuComponent {
  @Input({ required: true }) menuSections: MenuSection[] = [];
  @Input({ required: true }) currentLanguage!: Language;
  @Input({ required: true }) availableLanguages: Language[] = [];
  @Input({ required: true }) isOpen: boolean = false;
  @Input({ required: true }) openDropdowns: Set<string> = new Set();

  @Output() menuToggle = new EventEmitter<void>();
  @Output() menuClose = new EventEmitter<void>();
  @Output() menuItemClick = new EventEmitter<void>();
  @Output() dropdownToggle = new EventEmitter<string>();
  @Output() languageChange = new EventEmitter<Language>();

  showMobileLangDropdown = signal(false);

  toggleMenu() {
    this.menuToggle.emit();
  }

  closeMenu() {
    this.menuClose.emit();
    this.showMobileLangDropdown.set(false);
  }

  onMenuItemClick() {
    this.menuItemClick.emit();
    this.showMobileLangDropdown.set(false);
  }

  toggleMobileDropdown(itemLabel: string) {
    this.dropdownToggle.emit(itemLabel);
  }

  isMobileDropdownOpen(itemLabel: string): boolean {
    return this.openDropdowns.has(itemLabel);
  }

  toggleMobileLangDropdown() {
    this.showMobileLangDropdown.update(value => !value);
  }

  selectLanguage(language: Language) {
    this.languageChange.emit(language);
    this.showMobileLangDropdown.set(false);
  }

  trackBySection(index: number, section: MenuSection): string {
    return section.title;
  }

  trackByItem(index: number, item: MenuItem): string {
    return item.route || item.label;
  }

  trackByChild(index: number, child: MenuItem): string {
    return child.route || child.label;
  }
}