import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

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

@Component({
  selector: 'app-navigation-menu',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <nav class="hidden lg:flex items-center space-x-6 rtl:space-x-reverse">
      <div *ngFor="let section of menuSections" class="flex space-x-6 rtl:space-x-reverse">
        <div *ngFor="let item of section.items" class="relative group">

          <!-- Menu item simple -->
          <a *ngIf="!item.children"
             [routerLink]="item.route || '/'"
             routerLinkActive="active-link"
             [routerLinkActiveOptions]="{ exact: true }"
             (click)="onMenuItemClick()"
             class="relative px-4 py-2.5 font-medium text-sm xl:text-base rounded-lg inline-flex items-center transition-all duration-200 group text-[var(--sned-orange-dark)] hover:text-[var(--sned-blue)] hover:bg-[var(--sned-orange)]/5 focus:outline-none focus:ring-2 focus:ring-[var(--sned-orange)]/20">
            {{ item.label }}

            <!-- Trait animé sous le lien -->
            <span class="absolute left-0 right-0 -bottom-1 h-0.5 bg-gradient-to-r from-[var(--sned-blue)] to-[var(--sned-orange)] scale-x-0 group-hover:scale-x-100 transition-transform duration-300 ease-out origin-left group-[.active-link]:scale-x-100 rounded-full"></span>
          </a>

          <!-- Menu item avec dropdown -->
          <div *ngIf="item.children" class="relative group">
            <button
              [routerLink]="item.route || '/'"
              routerLinkActive="active-link"
              class="relative px-4 py-2.5 font-medium text-sm xl:text-base rounded-lg inline-flex items-center gap-2 transition-all duration-200 group text-[var(--sned-orange-dark)] hover:text-[var(--sned-blue)] hover:bg-[var(--sned-orange)]/5 focus:outline-none focus:ring-2 focus:ring-[var(--sned-orange)]/20">
              {{ item.label }}
              <svg class="w-4 h-4 transition-transform duration-200 group-hover:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
              </svg>

              <!-- Trait animé sous le lien -->
              <span class="absolute left-0 right-0 -bottom-1 h-0.5 bg-gradient-to-r from-[var(--sned-blue)] to-[var(--sned-orange)] scale-x-0 group-hover:scale-x-100 transition-transform duration-300 ease-out origin-left group-[.active-link]:scale-x-100 rounded-full"></span>
            </button>

            <!-- Sous-menu dropdown -->
            <div class="absolute left-0 rtl:right-0 rtl:left-auto mt-2 min-w-[280px] bg-white/98 backdrop-blur-sm rounded-xl shadow-xl border border-gray-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 ease-out transform translate-y-2 group-hover:translate-y-0 z-50 overflow-hidden">
              <!-- Arrow pointer -->
              <div class="absolute -top-2 left-6 w-4 h-4 bg-white/98 rotate-45 border-l border-t border-gray-100"></div>

              <div class="relative bg-white/98 rounded-xl p-2">
                <a *ngFor="let child of item.children; trackBy: trackByRoute"
                   [routerLink]="child.route || '/'"
                   routerLinkActive="active-sublink"
                   [routerLinkActiveOptions]="{ exact: true }"
                   (click)="onMenuItemClick()"
                   class="flex items-center px-4 py-3 text-sm font-medium text-[var(--sned-orange-dark)] hover:bg-gradient-to-r hover:from-[var(--sned-orange)]/8 hover:to-[var(--sned-blue)]/4 hover:text-[var(--sned-blue)] rounded-lg transition-all duration-200 whitespace-nowrap rtl:text-right group/item relative overflow-hidden">

                  <!-- Icône animée -->
                  <svg class="w-4 h-4 mr-3 text-[var(--sned-orange)] opacity-0 group-hover/item:opacity-100 transition-all duration-200 transform -translate-x-2 group-hover/item:translate-x-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
                  </svg>

                  <div class="flex-1">
                    <div class="font-medium">{{ child.label }}</div>
                    <div *ngIf="child.description" class="text-xs text-gray-500 mt-0.5">{{ child.description }}</div>
                  </div>

                  <!-- Badges pour les fonctionnalités spéciales -->
                  <div class="flex items-center space-x-1 ml-2">
                    <span *ngIf="child.hasModal" class="inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">Modal</span>
                    <span *ngIf="child.hasPagination" class="inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">Pages</span>
                    <span *ngIf="child.isExternal" class="inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                      <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path>
                      </svg>
                    </span>
                  </div>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  `,
  styles: [`
    .active-sublink {
      @apply bg-gradient-to-r from-[var(--sned-orange)]/10 to-[var(--sned-blue)]/5 text-[var(--sned-blue)];
    }

    .active-sublink svg {
      @apply opacity-100 transform translate-x-0;
    }

    /* Amélioration des animations hover */
    .group/item:hover {
      @apply transform scale-[1.02];
    }

    /* Responsive design */
    @media (max-width: 1280px) {
      nav a, nav button {
        @apply text-sm px-3 py-2;
      }
    }
  `]
})
export class NavigationMenuComponent {
  @Input({ required: true }) menuSections: MenuSection[] = [];
  @Output() menuItemClick = new EventEmitter<void>();

  onMenuItemClick() {
    this.menuItemClick.emit();
  }

  trackByRoute(index: number, item: MenuItem): string {
    return item.route || item.label;
  }
}
