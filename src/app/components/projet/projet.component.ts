// src/app/components/projet/projet.component.ts
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
import { ActivatedRoute, RouterLink } from '@angular/router';

interface Section {
  id: string;
  title: string;
  short: string;
  full?: string;
  description?: string;
  paragraphs?: string[];
  image: string;
  image2?: string;
}

@Component({
  selector: 'app-projet',
  standalone: true,
  imports: [
    ReadMoreComponent,
    NgClass,
    TranslatePipe,
    LazyImageComponent,
    ScrollAnimationDirective,
    RouterLink,
  ],
  template: `
    <!-- Point de repère en haut -->
    <div id="projet-top"></div>

    <section class="py-16 pb-32 ">
      <div
        class="w-full mx-auto px-6 sm:px-8 lg:px-12 xl:px-16 2xl:px-20 space-y-24 lg:space-y-32 2xl:space-y-40 bg-white rounded-lg max-w-7xl lg:max-w-full 2xl:max-w-none"
      >
        @for (section of sections; track $index; let i = $index) {
          @defer (on
        immediate; prefetch on idle) {
            <div class="grid md:grid-cols-2 gap-12 lg:gap-16 2xl:gap-20">
              <!-- Image -->
              <div
                class="flex items-center relative"
                [id]="section.id"
                [ngClass]="{
                  'order-first md:order-last': i % 2 === 1,
                  'md:justify-start': i % 2 === 0,
                  'md:justify-end': i % 2 === 1,
                }"
                appScrollAnimation
                [animationType]="'fadeUp'"
                [animationDelay]="i * 100"
              >
                <!-- Autres sections avec image normale -->
                <app-lazy-image
                  [src]="section.image"
                  [alt]="section.title"
                  imageClass="rounded-2xl shadow-lg w-full max-w-md lg:max-w-lg 2xl:max-w-2xl aspect-[16/10] max-h-[320px] lg:max-h-[360px] object-cover"
                  width="100%"
                  height="auto"
                >
                </app-lazy-image>
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
                    class="text-base lg:text-lg text-gray-700 mb-6 lg:mb-8 leading-relaxed whitespace-pre-line"
                  >
                    {{ section.short }}
                  </p>
                </div>
                <app-read-more
              [imageUrl]=section.image
              [label]="'shared.readmore.read_more' | translate"
              [title]="section.title"
              [description]="section.description || null"
              [paragraphs]="section.paragraphs"
              [sectionId]="section.id"
              

              [sectionImages]="
                section.id === 'recherche-sur-le-milieu-physique'
                  ? ['assets/images/recherche-milieu.jpg']
                  : section.id === 'ingenierie-du-projet'
                    ? [
                        'assets/images/img1.png',
                        'assets/images/img2.png',
                        'assets/images/img3.png',
                        'assets/images/img4.png',
                        'assets/images/img5.png',
                        'assets/images/img6.png',
                        'assets/images/img7.png',
                        'assets/images/img8.png'
                      ]
                    : section.id === 'realite-et-perspectives-socioeconomiques'
                      ? [
                          'assets/images/union-med-1.png',
                          'assets/images/union-med-2.png'
                        ]
                      : section.id === 'composante-geostrategique'
                        ? [
                            'assets/images/geostrategique-1.png',
                            'assets/images/geostrategique-2.png'
                          ]
                        : []
              "

              [titleImageIndexes]="
                section.id === 'recherche-sur-le-milieu-physique'
                  ? [6]
                  : section.id === 'ingenierie-du-projet'
                    ? [0,3,7,10,12,16,18,20]
                    : section.id === 'realite-et-perspectives-socioeconomiques'
                      ? [3, 5]
                      : section.id === 'composante-geostrategique'
                        ? [3, 4]
                        : []
              "

          [imagePositionIndex]="section.id === 'recherche-sur-le-milieu-physique' ? 6 : null"

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
                class="w-3/4 h-64 bg-gradient-to-r from-slate-200 to-slate-100 rounded-2xl mx-auto animate-pulse"
              ></div>
              <div class="space-y-4">
                <div
                  class="h-8 bg-gradient-to-r from-slate-200 to-slate-100 rounded animate-pulse"
                ></div>
                <div
                  class="h-4 bg-gradient-to-r from-slate-200 to-slate-100 rounded w-full animate-pulse"
                ></div>
                <div
                  class="h-4 bg-gradient-to-r from-slate-200 to-slate-100 rounded w-5/6 animate-pulse"
                ></div>
              </div>
            </div>
          }
        }
        <div class="pb-6 lg:pb-8"></div>
      </div>
    </section>

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
export class ProjetComponent implements OnInit {
  sections: Section[] = [];
  @ViewChildren(ReadMoreComponent)
  readMoreComponents!: QueryList<ReadMoreComponent>;

  constructor(
    private translateService: TranslateService,
    private activatedRoute: ActivatedRoute,
  ) {}

  ngOnInit() {
    this.initializeSections();

    this.translateService.onLangChange.subscribe(() => {
      this.initializeSections();
    });

    this.activatedRoute.fragment.subscribe((fragment) => {
      if (fragment) {
        setTimeout(() => {
          this.scrollToFragment(fragment);
        }, 100);
      }
    });
  }

  private initializeSections() {
    const projectSections = [
      {
        id: 'description-du-projet',
        title: this.translateService.instant(
          'projet_liaison_fixe.description_du_projet.title',
        ),
        short: this.translateService.instant(
          'projet_liaison_fixe.description_du_projet.short',
        ),
        description: this.translateService.instant(
          'projet_liaison_fixe.description_du_projet.description',
        ),
        paragraphs: this.translateService.instant(
          'projet_liaison_fixe.description_du_projet.paragraphs',
        ),
        image: 'assets/images/description.jpg',
      },
      {
        id: 'historique-du-projet',
        title: this.translateService.instant(
          'projet_liaison_fixe.historique_du_projet.title',
        ),
        short: this.translateService.instant(
          'projet_liaison_fixe.historique_du_projet.short',
        ),
        paragraphs: this.translateService.instant(
          'projet_liaison_fixe.historique_du_projet.paragraphs',
        ),
        image: 'assets/images/historique.png',
      },
      {
        id: 'recherche-sur-le-milieu-physique',
        title: this.translateService.instant(
          'projet_liaison_fixe.recherche_sur_le_milieu_physique.title',
        ),
        short: this.translateService.instant(
          'projet_liaison_fixe.recherche_sur_le_milieu_physique.short',
        ),
        paragraphs: this.translateService.instant(
          'projet_liaison_fixe.recherche_sur_le_milieu_physique.paragraphs',
        ),
        image: 'assets/images/recherche-milieu.jpg',
      },
      {
        id: 'ingenierie-du-projet',
        title: this.translateService.instant(
          'projet_liaison_fixe.ingénierie_du_projet.title',
        ),
        short: this.translateService.instant(
          'projet_liaison_fixe.ingénierie_du_projet.short',
        ),
        paragraphs: this.translateService.instant(
          'projet_liaison_fixe.ingénierie_du_projet.paragraphs',
        ),
        image: 'assets/images/img7.png',
      },
      {
        id: 'aspects-juridiques',
        title: this.translateService.instant(
          'projet_liaison_fixe.aspects_juridiques.title',
        ),
        short: this.translateService.instant(
          'projet_liaison_fixe.aspects_juridiques.short',
        ),
        paragraphs: this.translateService.instant(
          'projet_liaison_fixe.aspects_juridiques.paragraphs',
        ),
        image: 'assets/images/aspect-jur.jpeg',
      },
      {
        id: 'realite-et-perspectives-socioeconomiques',
        title: this.translateService.instant(
          'projet_liaison_fixe.réalité_et_perspectives_socioéconomiques.title',
        ),
        short: this.translateService.instant(
          'projet_liaison_fixe.réalité_et_perspectives_socioéconomiques.short',
        ),
        paragraphs: this.translateService.instant(
          'projet_liaison_fixe.réalité_et_perspectives_socioéconomiques.paragraphs',
        ),
        image: 'assets/images/union-med-2.png',
      },
      {
        id: 'composante-geostrategique',
        title: this.translateService.instant(
          'projet_liaison_fixe.composante_géostratégique.title',
        ),
        short: this.translateService.instant(
          'projet_liaison_fixe.composante_géostratégique.short',
        ),
        paragraphs: this.translateService.instant(
          'projet_liaison_fixe.composante_géostratégique.paragraphs',
        ),
        image: 'assets/images/geostrategique-1.png',
      },
    ];

    this.sections = projectSections;
  }

  showScrollTop = false;

  @HostListener('window:scroll')
  onScroll() {
    this.showScrollTop = window.scrollY > 300;
  }

  scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  getNextSection(currentIndex: number): { id: string; title: string } | null {
    const nextIndex = currentIndex + 1;
    if (nextIndex < this.sections.length) {
      return {
        id: this.sections[nextIndex].id,
        title: this.sections[nextIndex].title,
      };
    }
    return null;
  }

  onNavigateToSection(sectionId: string) {
    this.scrollToFragment(sectionId);
  }

  private scrollToFragment(fragment: string) {
    const element = document.getElementById(fragment);
    if (element) {
      const headerOffset = 100;
      const elementPosition =
        element.getBoundingClientRect().top + window.scrollY;
      const offsetPosition = elementPosition - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth',
      });
    }
  }
}
