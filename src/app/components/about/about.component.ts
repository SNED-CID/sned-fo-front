// src/app/features/about/about.component.ts
import {
  Component,
  HostListener,
  OnInit,
  ViewChildren,
  QueryList,
} from '@angular/core';
import { ReadMoreComponent } from '../readmore/readmore.component';
import { NgClass } from '@angular/common';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { LazyImageComponent } from '../shared/lazy-image/lazy-image.component';
import { ScrollAnimationDirective } from '../../directives/scroll-animation.directive';
import { ActivatedRoute } from '@angular/router';
import { PartnersComponent } from '../partners/partners.component';
import { TendersComponent } from '../tenders/tenders.component';

interface Section {
  id: string;
  title: string;
  short: string;
  full?: string;
  paragraphs?: string[];
  image: string;
}

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [
    ReadMoreComponent,
    NgClass,
    TranslatePipe,
    LazyImageComponent,
    ScrollAnimationDirective,
    PartnersComponent,
    TendersComponent,
  ],
  template: `
    <!-- Point de repère en haut -->
    <div id="about-top"></div>

    <section class="py-16 pb-32">
      <div
        class="w-full mx-auto px-6 sm:px-8 lg:px-12 xl:px-16 2xl:px-20 space-y-24 lg:space-y-32 2xl:space-y-40 bg-white rounded-lg max-w-7xl lg:max-w-full 2xl:max-w-none"
      >
        @for (section of sections; track $index; let i = $index) { @defer (on
        viewport; prefetch on idle) {
        <div class="grid md:grid-cols-2 gap-12 lg:gap-16 2xl:gap-20">
          <!-- Image -->
          <div
            class="flex items-center relative"
            [id]="section.id"
            [ngClass]="{
              'order-first md:order-last': i % 2 === 1,
              'md:justify-start': i % 2 === 0,
              'md:justify-end': i % 2 === 1
            }"
            appScrollAnimation
            [animationType]="'fadeUp'"
            [animationDelay]="i * 100"
          >
            <!-- Section SNED-SECEGSA avec logos côte à côte -->
            @if (section.id === 'sned_secegsa') {
            <div
              class="w-full max-w-md lg:max-w-lg 2xl:max-w-2xl aspect-[4/3] flex items-center justify-center gap-8 p-8 lg:p-12 bg-gradient-to-r from-blue-50 to-orange-50 rounded-2xl shadow-lg"
              [ngClass]="{ 'mr-auto': i % 2 === 0, 'ml-auto': i % 2 === 1 }"
            >
              <app-lazy-image
                src="assets/logos/snednotext.png"
                alt="SNED Logo"
                imageClass="h-20 w-auto object-contain"
                width="auto"
                height="5rem"
                [priority]="true"
              >
              </app-lazy-image>
              <div class="text-3xl font-bold text-gray-400">+</div>
              <app-lazy-image
                src="assets/logos/secegsa.png"
                alt="SECEGSA Logo"
                imageClass="h-20 w-auto object-contain"
                width="auto"
                height="5rem"
                [priority]="true"
              >
              </app-lazy-image>
            </div>
            }

            <!-- Autres sections avec image normale -->
            @if (section.id !== 'sned_secegsa') {
            <app-lazy-image
              [src]="section.image"
              [alt]="section.title"
              imageClass="rounded-2xl shadow-lg w-full max-w-md lg:max-w-lg 2xl:max-w-2xl h-auto object-contain"
              width="100%"
              height="auto"
            >
            </app-lazy-image>
            }
          </div>

          <!-- Texte -->
          <div class="flex flex-col items-center justify-center">
            <div
              class="w-full"
              appScrollAnimation
              [animationType]="'fadeUp'"
              [animationDelay]="i * 100 + 50"
            >
              <h2
                class="text-3xl lg:text-4xl xl:text-5xl font-bold text-primary mb-6 lg:mb-8"
              >
                {{ section.title }}
              </h2>
              <p
                class="text-base lg:text-lg text-gray-700 mb-6 lg:mb-8 line-clamp-3 leading-relaxed"
              >
                {{ section.short }}
              </p>
            </div>
            <app-read-more
              [imageUrl]="section.image"
              [label]="'shared.readmore.read_more' | translate"
              [title]="section.title"
              [paragraphs]="section.paragraphs"
              [sectionId]="section.id"
              [nextSectionId]="getNextSection(i)?.id || null"
              [nextSectionTitle]="getNextSection(i)?.title || null"
              (navigateToSection)="onNavigateToSection($event)"
            >
            </app-read-more>
          </div>
        </div>
        } @placeholder {
        <div class="grid md:grid-cols-2 gap-10 animate-pulse">
          <div class="w-3/4 h-64 bg-gray-200 rounded-2xl mx-auto"></div>
          <div class="space-y-4">
            <div class="h-8 bg-gray-200 rounded w-3/4"></div>
            <div class="h-4 bg-gray-200 rounded w-full"></div>
            <div class="h-4 bg-gray-200 rounded w-5/6"></div>
            <div class="h-10 bg-gray-200 rounded w-32"></div>
          </div>
        </div>
        } @loading (minimum 300ms) {
        <div class="grid md:grid-cols-2 gap-10">
          <div
            class="flex items-center justify-center w-3/4 h-64 bg-gray-100 rounded-2xl mx-auto"
          >
            <div class="text-center">
              <div
                class="w-8 h-8 border-4 border-[var(--sned-orange)] border-t-transparent rounded-full animate-spin mx-auto mb-2"
              ></div>
              <p class="text-sm text-gray-500">Chargement...</p>
            </div>
          </div>
          <div class="flex items-center">
            <div class="w-full space-y-4">
              <div class="h-8 bg-gray-200 rounded w-3/4 animate-pulse"></div>
              <div class="h-4 bg-gray-200 rounded w-full animate-pulse"></div>
              <div class="h-4 bg-gray-200 rounded w-5/6 animate-pulse"></div>
            </div>
          </div>
        </div>
        } }
      </div>
    </section>

    <div class="pb-16">
      <!-- Conteneur unique avec barre colorée -->
      <div
        class="w-3/4 lg:w-5/6 2xl:w-full mx-auto px-6 sm:px-8 lg:px-12 xl:px-16 2xl:px-20 relative bg-white rounded-2xl shadow-lg overflow-hidden"
      >
        <!-- Trait coloré unique en haut -->
        <div
          class="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[var(--sned-blue)] to-[var(--sned-orange)] rounded-t-2xl"
        ></div>

        <!-- Grid intérieur -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          <!-- Conseil d'Administration à gauche -->
          <div
            id="conseil-administration-section"
            class="flex flex-col items-center justify-center pt-6 pb-6"
          >
            <h2 class="text-3xl font-bold text-primary mb-6 text-center">
              {{ 'about.conseil_administration.title' | translate }}
            </h2>

            <div class="space-y-6 max-w-md">
              <div class="space-y-4 text-gray-700 leading-relaxed text-center">
                <p class="adaptive-body mb-4">
                  {{ 'about.conseil_administration.short' | translate }}
                </p>
              </div>
              <div style="isolation: auto;">
                <app-read-more
                  [imageUrl]="null"
                  [label]="'shared.readmore.read_more' | translate"
                  [title]="'about.conseil_administration.title' | translate"
                  [paragraphs]="
                    'about.conseil_administration.paragraphs' | translate
                  "
                  [sectionId]="'conseil_administration'"
                  [nextSectionId]="getNextSectionForConseilAdmin()?.id || null"
                  [nextSectionTitle]="
                    getNextSectionForConseilAdmin()?.title || null
                  "
                  (navigateToSection)="onNavigateToSection($event)"
                  style="position: relative"
                >
                </app-read-more>
              </div>
            </div>
          </div>

          <!-- Organigramme à droite -->
          <div id="organigramme">
            <div class="flex items-center justify-center mb-6 pt-6 gap-4">
              <h2 class="text-3xl font-bold text-primary">
                {{ 'header.menu.organization' | translate }}
              </h2>

              <!-- Bouton agrandir/réduire -->
              <button
                (click)="toggleOrganigramme()"
                class="cursor-pointer flex items-center gap-2 text-lg font-semibold text-primary hover:text-[var(--sned-orange)] transition"
                [title]="isOrganigrammeExpanded ? 'Réduire' : 'Agrandir'"
              >
                <i
                  class="fas"
                  [class.fa-compress-alt]="isOrganigrammeExpanded"
                  [class.fa-expand-alt]="!isOrganigrammeExpanded"
                ></i>
              </button>
            </div>

            <!-- Contenu collapsible -->
            <div
              class="overflow-hidden transition-all duration-500 ease-in-out"
              [ngClass]="
                isOrganigrammeExpanded
                  ? 'max-h-screen opacity-100'
                  : 'max-h-0 opacity-0'
              "
            >
              @defer (on viewport; prefetch on idle) {
              <div class="p-6 text-center group">
                <app-lazy-image
                  src="assets/images/orga.png"
                  alt="organigramme"
                  imageClass="rounded-lg shadow-md w-full max-w-3xl h-auto object-contain transition-all duration-500 ease-out hover:scale-110 hover:shadow-2xl cursor-pointer group-hover:opacity-100"
                  width="100%"
                  height="auto"
                >
                </app-lazy-image>
              </div>
              } @placeholder {
              <div class="p-6 text-center">
                <div
                  class="w-full h-64 bg-gray-200 rounded-lg animate-pulse"
                ></div>
              </div>
              } @loading {
              <div class="p-6 text-center">
                <div
                  class="flex items-center justify-center w-full h-64 bg-gray-100 rounded-lg"
                >
                  <div class="text-center">
                    <div
                      class="w-12 h-12 border-4 border-[var(--sned-blue)] border-t-transparent rounded-full animate-spin mx-auto mb-4"
                    ></div>
                    <p class="text-gray-600">Chargement de l'organigramme...</p>
                  </div>
                </div>
              </div>
              }
            </div>
          </div>
        </div>

        <!-- Padding inférieur du conteneur -->
        <div class="pb-6 lg:pb-8"></div>
      </div>

      <!-- Section Partenaires -->
      <div
        class="w-3/4 lg:w-5/6 2xl:w-full mx-auto mt-16 px-6 sm:px-8 lg:px-12 xl:px-16 2xl:px-20 relative bg-white rounded-2xl shadow-lg overflow-hidden"
      >
        <div
          class="absolute top-0 left-0 w-full h-5 sm:h-8 bg-gradient-to-r from-[var(--sned-blue)] to-[var(--sned-orange)] rounded-t-2xl"
        ></div>

        <h2
          class="text-3xl lg:text-4xl xl:text-5xl font-bold text-primary  mt-10 text-left lg:mb-6 rtl:text-right"
        >
          {{ 'header.menu.partners' | translate }}
        </h2>

        <div id="partenaires" class="pt-6 w-full">
          <app-partners class="w-full"></app-partners>
        </div>
      </div>

      <!-- Section Appels d'offres -->
      <div
        class="w-3/4 lg:w-5/6 2xl:w-full mx-auto mt-16 px-6 sm:px-8 lg:px-12 xl:px-16 2xl:px-20 relative bg-white rounded-2xl shadow-lg overflow-hidden"
      >
        <h2
          class="text-3xl lg:text-4xl xl:text-5xl font-bold text-primary  mt-10 text-left lg:mb-6 rtl:text-right"
        >
          {{ "tenders.title" | translate }}
        </h2>
        <div
          class="absolute top-0 left-0 w-full h-5 sm:h-8 bg-gradient-to-r from-[var(--sned-blue)] to-[var(--sned-orange)] rounded-t-2xl"
        ></div>
        <div id="appels_offres" class="pt-3 w-full">
          <app-tenders class="w-full"></app-tenders>
        </div>
      </div>
    </div>

    <!-- Bouton Retour en haut amélioré -->
    @if (showScrollTop) {
    <button
      (click)="scrollToTop()"
      class="cursor-pointer fixed bottom-6 right-6 z-50
                 w-14 h-14 flex items-center justify-center
                 rounded-full shadow-xl border-2 border-white
                 bg-gradient-to-br from-[var(--sned-blue)] to-[var(--sned-blue-dark)] text-white
                 hover:from-[var(--sned-orange)] hover:to-orange-600 hover:scale-110
                 active:scale-95 transition-all duration-300 ease-in-out
                 backdrop-blur-sm group"
    >
      <i class="fa-solid fa-arrow-up text-xl group-hover:animate-bounce"></i>
      <!-- Effet de brillance au survol -->
      <div
        class="absolute inset-0 rounded-full opacity-0 group-hover:opacity-30
                    bg-gradient-to-t from-transparent via-white to-transparent
                    transition-opacity duration-300"
      ></div>
    </button>
    }
  `,
})
export class AboutComponent implements OnInit {
  sections: Section[] = [];
  @ViewChildren(ReadMoreComponent)
  readMoreComponents!: QueryList<ReadMoreComponent>;

  constructor(
    private translateService: TranslateService,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit() {
    this.initializeSections();

    // S'abonner aux changements de langue
    this.translateService.onLangChange.subscribe(() => {
      this.initializeSections();
    });

    // Écouter les changements du fragment dans l'URL
    this.activatedRoute.fragment.subscribe((fragment) => {
      if (fragment) {
        // Délai pour laisser le DOM se charger et les éléments se rendre
        setTimeout(() => {
          this.scrollToFragment(fragment);
        }, 100);
      }
    });
  }

  private initializeSections() {
    this.sections = [
      // {
      //   id: 'apropos',
      //   title: this.translateService.instant('about.sned.title'),
      //   short: this.translateService.instant('about.sned.short'),
      //   paragraphs: this.translateService.instant('about.sned.paragraphs'),
      //   image: 'assets/images/bridge_engineer.jpg'
      // },
      // {
      //   id: 'contexte',
      //   title: this.translateService.instant('about.contexte.title'),
      //   short: this.translateService.instant('about.contexte.short'),
      //   paragraphs: this.translateService.instant('about.contexte.paragraphs'),
      //   image: 'assets/images/contexte.jpg'
      // },
      {
        id: 'cadre',
        title: this.translateService.instant('about.cadre.title'),
        short: this.translateService.instant('about.cadre.short'),
        paragraphs: this.translateService.instant('about.cadre.paragraphs'),
        image: 'assets/images/cadre.jpg',
      },
      {
        id: 'missions',
        title: this.translateService.instant('about.missions.title'),
        short: this.translateService.instant('about.missions.short'),
        paragraphs: this.translateService.instant('about.missions.paragraphs'),
        image: 'assets/images/history.jpg',
      },
      {
        id: 'sned_secegsa',
        title: this.translateService.instant('about.sned_secegsa.title'),
        short: this.translateService.instant('about.sned_secegsa.short'),
        paragraphs: this.translateService.instant(
          'about.sned_secegsa.paragraphs'
        ),
        image: 'assets/images/cooperation.jpg',
      },
    ];
  }

  showScrollTop = false;
  isOrganigrammeExpanded = true;

  @HostListener('window:scroll')
  onScroll() {
    this.showScrollTop = window.scrollY > 300;
  }

  scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  toggleOrganigramme() {
    this.isOrganigrammeExpanded = !this.isOrganigrammeExpanded;
  }

  getNextSection(currentIndex: number): { id: string; title: string } | null {
    const nextIndex = currentIndex + 1;
    if (nextIndex < this.sections.length) {
      return {
        id: this.sections[nextIndex].id,
        title: this.sections[nextIndex].title,
      };
    }
    // Si on est à la dernière section, la suivante est l'organigramme
    if (nextIndex === this.sections.length) {
      return {
        id: 'organigramme',
        title: 'Organigramme',
      };
    }
    return null;
  }

  getNextSectionAfterOrganigramme(): { id: string; title: string } | null {
    // Depuis l'organigramme, aller au Conseil d'Administration
    return {
      id: 'conseil-administration-section',
      title: this.translateService.instant(
        'about.conseil_administration.title'
      ),
    };
  }

  getNextSectionForConseilAdmin(): { id: string; title: string } | null {
    // Après le conseil d'administration, on pourrait revenir en haut ou ne rien afficher
    return null;
  }

  onNavigateToSection(sectionId: string) {
    // Scroller vers la section
    const nextElement = document.getElementById(sectionId);
    if (nextElement) {
      nextElement.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      });

      // Ouvrir automatiquement le ReadMore de la section de destination (si elle en a un)
      if (sectionId !== 'organigramme') {
        setTimeout(() => {
          const readMoreComponent = this.readMoreComponents.find(
            (comp) => comp.sectionId === sectionId
          );
          if (readMoreComponent) {
            readMoreComponent.openSidebarFromExternal();
          }
        }, 800); // Délai pour laisser le scroll se terminer
      }
    }
  }

  /**
   * Scroller vers une section basée sur son ID (utilisé pour les fragments d'URL)
   * Exemple: /about#contexte scrollera vers la section contexte
   */
  private scrollToFragment(fragmentId: string) {
    const element = document.getElementById(fragmentId);
    if (element) {
      element.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      });
    }
  }
}
