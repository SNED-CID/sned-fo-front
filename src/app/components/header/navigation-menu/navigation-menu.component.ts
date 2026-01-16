import { Component, Input, Output, EventEmitter, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { AnalyticsService } from '../../../services/analytics.service';

export interface MenuItem {
  label: string;
  route?: string;
  children?: MenuItem[];
  description?: string;
  isExternal?: boolean;
  sectionId?: string;
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
    <nav class="hidden lg:flex items-center justify-center space-x-3 rtl:space-x-reverse h-full flex-1">
      @for (section of menuSections; track section.title) {
        <div class="flex items-center space-x-3 rtl:space-x-reverse">
          @for (item of section.items; track item.route || item.label) {
            <div class="relative group flex items-center">

              <!-- Menu item simple -->
              @if (!item.children) {
                <a
                  [routerLink]="getNavigationLink(item)"
                  [fragment]="item.sectionId"
                  routerLinkActive="active-link"
                  [routerLinkActiveOptions]="{ exact: true }"
                  (click)="onMenuItemClick(item)"
                  class="relative px-2 lg:px-2.5 py-2 font-medium text-xs lg:text-sm rounded-none inline-flex items-center gap-1.5 whitespace-nowrap transition-all duration-200 group text-black hover:text-black hover:bg-white focus:outline-none focus:ring-2 focus:ring-[var(--sned-orange)]/20 cursor-pointer"
>
                  {{ item.label | translate }}

                  <!-- Trait animé sous le lien -->
                  <span
                    class="absolute left-0 right-0 -bottom-1 h-0.5 bg-[var(--sned-orange)] scale-x-0 group-hover:scale-x-100 transition-transform duration-300 ease-out origin-left group-[.active-link]:scale-x-100 rounded-full"
                  ></span>
                </a>
              }

              <!-- Menu item avec dropdown -->
              @if (item.children) {
                <div class="relative group z-70">
                  <button
                    [routerLink]="getNavigationLink(item)"
                    [fragment]="item.sectionId"
                    routerLinkActive="active-link"
                    [routerLinkActiveOptions]="{ exact: true }"
                    class="relative px-2 lg:px-2.5 py-2 font-medium text-xs lg:text-sm rounded-lg inline-flex items-center gap-1 whitespace-nowrap transition-all duration-200 group text-bg-[var(--sned-orange)] hover:text-bg-[var(--sned-orange)] hover:bg-[var(--sned-orange)]/5 focus:outline-none focus:ring-2 focus:ring-[var(--sned-orange)]/20 cursor-pointer"
                  >
                    {{ item.label | translate }}
                    <i
                      class="fas fa-chevron-down w-3 h-3 transition-transform duration-200 group-hover:rotate-180"
                    ></i>

                    <!-- Trait animé sous le lien -->
                    <span
                      class="absolute left-0 right-0 -bottom-1 h-0.5 bg-[var(--sned-orange)] scale-x-0 group-hover:scale-x-100 transition-transform duration-300 ease-out origin-left group-[.active-link]:scale-x-100 rounded-full"
                    ></span>
                  </button>

                  <!-- Sous-menu dropdown -->
                  <div
                    class="absolute left-0 rtl:right-0 rtl:left-auto mt-2 min-w-[280px] bg-white backdrop-blur-sm rounded-xl shadow-xl border border-gray-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 ease-out transform translate-y-2 group-hover:translate-y-0 z-70 overflow-hidden"
                  >
                    <!-- Arrow pointer -->
                    <div
                      class="absolute -top-2 left-6 w-4 h-4 bg-white rotate-45 border-l border-t border-gray-100"
                    ></div>

                    <div class="relative bg-white rounded-xl p-2">
                      @for (child of item.children; track $index) {
                        <a
                          [routerLink]="getNavigationLink(child)"
                          [fragment]="child.sectionId"
                          routerLinkActive="active-sublink"
                          [routerLinkActiveOptions]="{ exact: true }"
                          (click)="onMenuItemClick(child, item.label)"
                          class="flex items-center px-4 py-3 text-sm font-medium text-[var(--sned-orange)] hover:bg-gradient-to-r hover:from-[var(--sned-orange)]/8 hover:to-[var(--sned-blue)]/4 hover:text-bg-[var(--sned-orange)] rounded-lg transition-all duration-200 whitespace-nowrap rtl:text-right group/item relative overflow-hidden cursor-pointer"
                        >
                          <!-- Icône animée -->
                          <i
                            [class]="currentLang() === 'ar' ? 'fas fa-chevron-left w-4 h-4 mr-3 rtl:ml-3 text-[var(--sned-orange)] opacity-0 group-hover/item:opacity-100 transition-all duration-200 transform translate-x-2 group-hover/item:translate-x-0' : 'fas fa-chevron-right w-4 h-4 mr-3 rtl:ml-3 text-[var(--sned-orange)] opacity-0 group-hover/item:opacity-100 transition-all duration-200 transform -translate-x-2 group-hover/item:translate-x-0'"
                          ></i>

                          <div class="flex-1">
                            {{ child.label | translate }}
                          </div>

                          <div class="flex items-center space-x-1 ml-2">
                            @if (child.isExternal) {
                              <span
                                class="inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800"
                              >
                            <i class="fas fa-external-link-alt w-3 h-3"></i>
                          </span>
                            }
                          </div>
                        </a>
                      }
                    </div>
                  </div>
                </div>
              }
            </div>
          }
        </div>
      }
    </nav>
  `,
  styles: [`
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
export class NavigationMenuComponent implements OnInit {
  private translateService = inject(TranslateService);
  private analytics = inject(AnalyticsService);

  @Input({ required: true }) menuSections: MenuSection[] = [];
  @Output() menuItemClick = new EventEmitter<void>();

  currentLang = signal('fr');

  ngOnInit() {
    this.currentLang.set(this.translateService.currentLang || this.translateService.defaultLang || 'fr');
    this.translateService.onLangChange.subscribe((event) => {
      this.currentLang.set(event.lang);
    });
  }

  onMenuItemClick(item?: MenuItem, parentLabel?: string) {
    if (item) {
      if (parentLabel) {
        // C'est un sous-menu
        this.analytics.trackSubmenuClick(parentLabel, item.label, item.route || '');
      } else {
        // C'est un menu principal
        this.analytics.trackMenuClick(item.label, item.route || '', !!item.children);
      }
    }
    this.menuItemClick.emit();
  }

  /**
   * Construit l'URL de navigation avec fragment si nécessaire
   * Exemple: /about#contexte pour scroller vers la section contexte
   */
  getNavigationLink(item: MenuItem): any {
    if (item.sectionId) {
      // Si un sectionId est défini, naviguer vers la page avec le fragment
      const basePath = item.route?.split('#')[0] || '/';
      return [basePath];
    }
    return item.route || '/';
  }
}
