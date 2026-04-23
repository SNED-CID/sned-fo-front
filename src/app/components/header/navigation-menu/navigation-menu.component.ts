import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnInit,
  signal,
  inject,
} from '@angular/core';
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
    <nav
      class="hidden lg:flex items-center justify-center gap-8 h-full flex-1"
    >
      @for (section of menuSections; track section.title) {
        <div class="flex items-center gap-8">
          @for (item of section.items; track item.route || item.label) {
            <div class="relative group flex items-center">
              <!-- Menu item simple -->
              @if (!item.children) {
                <a
                  [routerLink]="getNavigationLink(item)"
                  [fragment]="item.sectionId"
                  (click)="onMenuItemClick(item)"
                  class="nav-title relative px-1 py-2 font-semibold text-base lg:text-lg rounded-none inline-flex items-center gap-2 whitespace-nowrap transition-colors duration-200 group text-black hover:text-black focus:outline-none cursor-pointer"
                >
                  <span class="nav-title-text">{{ item.label | translate }}</span>
                </a>
              }

              <!-- Menu item avec dropdown -->
              @if (item.children) {
                <div class="relative group z-70">
                  <button
                    [routerLink]="getNavigationLink(item)"
                    [fragment]="item.sectionId"
                    class="nav-title no-fluid-btn relative px-1 py-2 font-semibold text-base lg:text-lg rounded-none inline-flex items-center gap-2 whitespace-nowrap transition-colors duration-200 group text-black hover:text-black focus:outline-none cursor-pointer"
                  >
                    <span class="nav-title-text">{{ item.label | translate }}</span>
                    <i
                      class="fas fa-chevron-down w-3 h-3 transition-transform duration-200 group-hover:rotate-180"
                    ></i>
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
                          class="flex items-center px-4 py-3 text-sm lg:text-base font-medium text-black rounded-lg border border-transparent transition-all duration-300 ease-out whitespace-nowrap rtl:text-right group/item relative overflow-hidden cursor-pointer hover:bg-[var(--sned-orange)]/10 hover:text-black hover:border-[var(--sned-orange)] hover:shadow-[0_8px_24px_rgba(245,130,32,0.2)] hover:-translate-y-0.5"
                        >
                          <!-- Icône animée -->
                          <i
                            [class]="
                              currentLang() === 'ar'
                                ? 'fas fa-chevron-left w-4 h-4 mr-3 rtl:ml-3 text-black opacity-0 group-hover/item:opacity-100 transition-all duration-200 transform translate-x-2 group-hover/item:translate-x-0 group-hover/item:text-black'
                                : 'fas fa-chevron-right w-4 h-4 mr-3 rtl:ml-3 text-black opacity-0 group-hover/item:opacity-100 transition-all duration-200 transform -translate-x-2 group-hover/item:translate-x-0 group-hover/item:text-black'
                            "
                          ></i>

                          <!-- Label avec trait en dessous -->
                          <div class="relative font-bold">
                            {{ child.label | translate }}
                          </div>

                          <div class="flex items-center space-x-1 ml-2">
                            @if (child.isExternal) {
                              <span
                                class="inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 transition-colors duration-200 group-hover/item:bg-white/20 group-hover/item:text-white"
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
  styles: [
    `
      .nav-title-text {
        position: relative;
        display: inline-block;
        z-index: 2;
      }

      .water-nav-btn {
        isolation: isolate;
        overflow: hidden;
        border-radius: 999px;
        padding-inline: 0.95rem;
        transition: color 240ms ease, box-shadow 280ms ease, transform 240ms ease;
      }

      .water-nav-btn::before,
      .water-nav-btn::after {
        content: '';
        position: absolute;
        inset: 0;
        opacity: 0;
        pointer-events: none;
      }

      .water-nav-btn::before {
        z-index: 0;
        background:
          radial-gradient(95% 65% at 14% 38%, rgba(120, 226, 255, 0.34) 0%, rgba(120, 226, 255, 0) 62%),
          radial-gradient(80% 55% at 84% 68%, rgba(35, 176, 244, 0.3) 0%, rgba(35, 176, 244, 0) 68%),
          linear-gradient(120deg, rgba(15, 142, 201, 0.2), rgba(20, 163, 225, 0.24));
        transform: translateX(-12%) scale(1.05);
      }

      .water-nav-btn::after {
        z-index: 1;
        background:
          radial-gradient(75% 60% at 50% 120%, rgba(190, 245, 255, 0.42) 0%, rgba(190, 245, 255, 0) 72%),
          linear-gradient(95deg, rgba(255, 255, 255, 0.05), rgba(255, 255, 255, 0.22), rgba(255, 255, 255, 0.05));
        transform: translateX(-115%);
      }

      .water-nav-btn:hover {
        color: #06385a;
        box-shadow: 0 6px 18px rgba(17, 123, 181, 0.28), inset 0 0 0 1px rgba(122, 218, 255, 0.44);
      }

      .water-nav-btn:hover::before,
      .water-nav-btn:hover::after {
        opacity: 1;
      }

      .water-nav-btn:hover::before {
        animation: water-btn-flow 1.3s ease-in-out infinite alternate;
      }

      .water-nav-btn:hover::after {
        animation: water-btn-gloss 1.7s cubic-bezier(0.35, 0.08, 0.25, 1) infinite;
      }

      @keyframes water-btn-flow {
        0% {
          transform: translateX(-12%) scale(1.05) translateY(0%);
        }

        100% {
          transform: translateX(12%) scale(1.09) translateY(-3%);
        }
      }

      @keyframes water-btn-gloss {
        0% {
          transform: translateX(-115%);
        }

        100% {
          transform: translateX(115%);
        }
      }

      .nav-title-text::after {
        content: '';
        position: absolute;
        left: 50%;
        bottom: -0.28rem;
        width: 100%;
        height: 4px;
        background: var(--sned-orange);
        border-radius: 999px;
        transform: translateX(-50%) scaleX(1) scaleY(0.22);
        transform-origin: center;
        opacity: 0;
        transition: opacity 140ms ease-out;
      }

      .nav-title:hover .nav-title-text::after,
      .nav-title:focus-visible .nav-title-text::after {
        opacity: 1;
        animation: nav-title-underline-grow 1050ms cubic-bezier(0.2, 0.8, 0.2, 1) forwards;
      }

      @keyframes nav-title-underline-grow {
        0% {
          transform: translateX(-50%) scaleX(1) scaleY(0.22);
        }

        100% {
          transform: translateX(-50%) scaleX(1) scaleY(1);
        }
      }

      /* Amélioration du dropdown container */
      .group:hover > div {
        backdrop-filter: blur(12px);
      }

      @media (max-width: 1280px) {
        nav a,
        nav button {
          font-size: 0.875rem;
          padding: 0.5rem 0.75rem;
        }
      }
    `,
  ],
})
export class NavigationMenuComponent implements OnInit {
  private translateService = inject(TranslateService);
  private analytics = inject(AnalyticsService);

  @Input({ required: true }) menuSections: MenuSection[] = [];
  @Output() menuItemClick = new EventEmitter<void>();

  currentLang = signal('fr');

  ngOnInit() {
    this.currentLang.set(
      this.translateService.currentLang ||
        this.translateService.defaultLang ||
        'fr',
    );
    this.translateService.onLangChange.subscribe((event) => {
      this.currentLang.set(event.lang);
    });
  }

  onMenuItemClick(item?: MenuItem, parentLabel?: string) {
    if (item) {
      if (parentLabel) {
        // C'est un sous-menu
        this.analytics.trackSubmenuClick(
          parentLabel,
          item.label,
          item.route || '',
        );
      } else {
        // C'est un menu principal
        this.analytics.trackMenuClick(
          item.label,
          item.route || '',
          !!item.children,
        );
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
