import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';

export interface MenuItem {
  label: string;
  route?: string;
  children?: MenuItem[];
  description?: string;
  isExternal?: boolean;
}

export interface MenuSection {
  title: string;
  items: MenuItem[];
}

@Component({
  selector: 'app-navigation-menu',
  standalone: true,
  imports: [CommonModule, RouterModule, TranslatePipe],
  template: `
    <nav class="hidden lg:flex items-center justify-center space-x-6 rtl:space-x-reverse h-full">
      <div *ngFor="let section of menuSections" class="flex items-center space-x-6 rtl:space-x-reverse">
        <div *ngFor="let item of section.items" class="relative group flex items-center">

          <!-- Menu item simple -->
          <a *ngIf="!item.children"
             [routerLink]="item.route || '/'"
             routerLinkActive="active-link"
             [routerLinkActiveOptions]="{ exact: true }"
             (click)="onMenuItemClick()"
             class="relative px-4 py-2.5 font-medium text-sm xl:text-base rounded-lg inline-flex items-center transition-all duration-200 group text-[var(--sned-orange-dark)] hover:text-[var(--sned-blue)] hover:bg-[var(--sned-orange)]/5 focus:outline-none focus:ring-2 focus:ring-[var(--sned-orange)]/20 cursor-pointer">
            {{ item.label | translate }}

            <!-- Trait animé sous le lien -->
            <span class="absolute left-0 right-0 -bottom-1 h-0.5 bg-gradient-to-r from-[var(--sned-blue)] to-[var(--sned-orange)] scale-x-0 group-hover:scale-x-100 transition-transform duration-300 ease-out origin-left group-[.active-link]:scale-x-100 rounded-full"></span>
          </a>

          <!-- Menu item avec dropdown -->
          <div *ngIf="item.children" class="relative group z-70">
            <button
              [routerLink]="item.route || '/'"
              routerLinkActive="active-link"
              [routerLinkActiveOptions]="{ exact: true }"
              class="relative px-4 py-2.5 font-medium text-sm xl:text-base rounded-lg inline-flex items-center gap-2 transition-all duration-200 group text-[var(--sned-orange-dark)] hover:text-[var(--sned-blue)] hover:bg-[var(--sned-orange)]/5 focus:outline-none focus:ring-2 focus:ring-[var(--sned-orange)]/20 cursor-pointer">
              {{ item.label | translate }}
              <i class="fas fa-chevron-down w-4 h-4 transition-transform duration-200 group-hover:rotate-180"></i>

              <!-- Trait animé sous le lien -->
              <span class="absolute left-0 right-0 -bottom-1 h-0.5 bg-gradient-to-r from-[var(--sned-blue)] to-[var(--sned-orange)] scale-x-0 group-hover:scale-x-100 transition-transform duration-300 ease-out origin-left group-[.active-link]:scale-x-100 rounded-full"></span>
            </button>

            <!-- Sous-menu dropdown -->
            <div class="absolute left-0 rtl:right-0 rtl:left-auto mt-2 min-w-[280px] bg-white backdrop-blur-sm rounded-xl shadow-xl border border-gray-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 ease-out transform translate-y-2 group-hover:translate-y-0 z-70 overflow-hidden">
              <!-- Arrow pointer -->
              <div class="absolute -top-2 left-6 w-4 h-4 bg-white rotate-45 border-l border-t border-gray-100"></div>

              <div class="relative bg-white rounded-xl p-2">
                <a *ngFor="let child of item.children; trackBy: trackByRoute"
                   [routerLink]="child.route || '/'"
                   routerLinkActive="active-sublink"
                   [routerLinkActiveOptions]="{ exact: true }"
                   (click)="onMenuItemClick()"
                   class="flex items-center px-4 py-3 text-sm font-medium text-[var(--sned-orange-dark)] hover:bg-gradient-to-r hover:from-[var(--sned-orange)]/8 hover:to-[var(--sned-blue)]/4 hover:text-[var(--sned-blue)] rounded-lg transition-all duration-200 whitespace-nowrap rtl:text-right group/item relative overflow-hidden cursor-pointer">

                  <!-- Icône animée -->
                  <i class="fas fa-chevron-right w-4 h-4 mr-3 text-[var(--sned-orange)] opacity-0 group-hover/item:opacity-100 transition-all duration-200 transform -translate-x-2 group-hover/item:translate-x-0"></i>

                  <div class="flex-1">
                    <div class="font-medium">{{ child.label | translate }}</div>
                    <div *ngIf="child.description" class="text-xs text-gray-500 mt-0.5">{{ child.description | translate }}</div>
                  </div>

                  <div class="flex items-center space-x-1 ml-2">
                    <span *ngIf="child.isExternal" class="inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                      <i class="fas fa-external-link-alt w-3 h-3"></i>
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
      background: linear-gradient(135deg, var(--sned-orange, #ff6b35) 0%, var(--sned-blue, #0066cc) 100%);
      color: white !important;
      box-shadow: 0 4px 12px rgba(255, 107, 53, 0.3);
      transform: translateX(4px);
      border-left: 3px solid var(--sned-orange, #ff6b35);
      font-weight: 600;
      position: relative;
    }

    .active-sublink::before {
      content: '';
      position: absolute;
      left: 0;
      top: 0;
      bottom: 0;
      width: 4px;
      background: linear-gradient(to bottom, var(--sned-orange, #ff6b35), var(--sned-blue, #0066cc));
      border-radius: 0 4px 4px 0;
    }

    .active-sublink i {
      opacity: 1 !important;
      transform: translateX(0) !important;
      color: white;
    }

    .active-sublink .font-medium {
      color: white;
    }

    .active-sublink .text-xs {
      color: rgba(255, 255, 255, 0.8);
    }

    .group\\/item:hover {
      transform: scale(1.02);
    }

    .group\\/item.active-sublink:hover {
      transform: scale(1.02) translateX(4px);
      box-shadow: 0 6px 16px rgba(255, 107, 53, 0.4);
    }

    /* Animation pour l'état actif */
    .active-sublink {
      animation: slideInActive 0.3s ease-out;
    }

    @keyframes slideInActive {
      from {
        transform: translateX(0);
        box-shadow: none;
      }
      to {
        transform: translateX(4px);
        box-shadow: 0 4px 12px rgba(255, 107, 53, 0.3);
      }
    }

    /* Amélioration du dropdown container */
    .group:hover > div {
      backdrop-filter: blur(12px);
    }

    @media (max-width: 1280px) {
      nav a, nav button {
        font-size: 0.875rem;
        padding: 0.5rem 0.75rem;
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
