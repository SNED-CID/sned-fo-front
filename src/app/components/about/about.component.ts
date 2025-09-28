// src/app/features/about/about.component.ts
import {Component, HostListener, OnInit, ViewChildren, QueryList} from '@angular/core';
import { ReadMoreComponent } from '../readmore/readmore.component';
import {JsonPipe, NgClass, NgFor, NgIf} from '@angular/common';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';

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
  imports: [ReadMoreComponent, NgClass, NgFor, NgIf, TranslatePipe, JsonPipe],
  template: `
    <!-- Point de repère en haut -->
    <div id="about-top"></div>

    <section class="py-16 pb-32">
      <div class="max-w-6xl mx-auto px-6 lg:px-12 space-y-20 bg-white rounded-lg">
        <div *ngFor="let section of sections; let i = index"
             class="grid md:grid-cols-2 gap-10">

          <!-- Image -->
          <div class="flex items-center relative"
               [id]="section.id"
               [ngClass]="{ 'order-first md:order-last': i % 2 === 1 }">

            <!-- Section SNED-SECEGSA avec logos côte à côte -->
            <div *ngIf="section.id === 'sned_secegsa'"
                 class="w-3/4 aspect-[4/3] flex items-center justify-center gap-8 p-8 bg-gradient-to-r from-blue-50 to-orange-50 rounded-2xl shadow-lg"
                 [ngClass]="{ 'mr-auto': i % 2 === 0, 'ml-auto': i % 2 === 1 }">
              <img src="assets/logos/snednotext.png"
                   alt="SNED Logo"
                   class="h-20 w-auto object-contain" />
              <div class="text-3xl font-bold text-gray-400">+</div>
              <img src="assets/logos/secegsa.png"
                   alt="SECEGSA Logo"
                   class="h-20 w-auto object-contain" />
            </div>

            <!-- Autres sections avec image normale -->
            <img *ngIf="section.id !== 'sned_secegsa'"
                 [src]="section.image"
                 [alt]="section.title"
                 class="rounded-2xl shadow-lg w-3/4 h-auto object-contain"
                 [ngClass]="{ 'mr-auto': i % 2 === 0, 'ml-auto': i % 2 === 1 }" />

          </div>

          <!-- Texte -->
          <div class="flex items-center">
            <div>
              <h2 class="text-3xl font-bold text-primary mb-6">
                {{ section.title }}
              </h2>
              <p class="text-gray-700 mb-6 line-clamp-3">
                {{ section.short }}
              </p>
              <app-read-more
                [imageUrl]="section.image"
                [label]="'Lire la suite'"
                [title]="section.title"
                [paragraphs]="section.paragraphs"
                [sectionId]="section.id"
                [nextSectionId]="getNextSection(i)?.id || null"
                [nextSectionTitle]="getNextSection(i)?.title || null"
                (navigateToSection)="onNavigateToSection($event)">
              </app-read-more>
            </div>
          </div>
        </div>
      </div>
    </section>

    <div class=" pb-16">
      <!-- Organigramme -->
      <!-- Organigramme -->
      <div id="organigramme" class="w-3/4 mx-auto">
        <div class="flex justify-between items-center mb-6">
          <h2 class="text-3xl font-bold text-primary">
            Organigramme
          </h2>

          <!-- Bouton agrandir/réduire -->
          <button
            (click)="toggleOrganigramme()"
            class="cursor-pointer flex items-center gap-2 text-lg font-semibold text-primary hover:text-[var(--sned-orange)] transition"
            [title]="isOrganigrammeExpanded ? 'Réduire' : 'Agrandir'">
            <i class="fas"
               [ngClass]="isOrganigrammeExpanded ? 'fa-compress-alt' : 'fa-expand-alt'"></i>
          </button>
        </div>

        <div class="relative bg-white rounded-2xl shadow-lg overflow-hidden">
          <!-- Trait coloré en haut -->
          <div class="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-[var(--sned-blue)] to-[var(--sned-orange)]"></div>

          <!-- Contenu collapsible -->
          <div class="overflow-hidden transition-all duration-500 ease-in-out"
               [ngClass]="isOrganigrammeExpanded ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'">
            <div class="p-10 text-center">
              <img src="assets/images/orga.png"
                   alt="organigramme"
                   class="rounded-lg shadow-md w-full h-auto transition-transform duration-300 hover:scale-105 cursor-pointer" />
            </div>
          </div>
        </div>
      </div>



      <!-- Intervenants -->
      <section id="conseil-administration-section" class="mt-16">
        <div class="w-3/4 mx-auto">
          <h2 class="text-3xl font-bold text-primary mb-6 text-left">
            {{ 'about.conseil_administration.title' | translate }}
          </h2>

          <div class="relative bg-white rounded-2xl shadow-lg overflow-hidden">
            <!-- Trait coloré en haut -->
            <div class="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-500 to-orange-500"></div>

            <div class="p-10 space-y-6 text-left">
              <div class="space-y-4 text-gray-700 leading-relaxed">
                <p class="adaptive-body mb-4">
                  {{ 'about.conseil_administration.short' | translate }}
                </p>
                <app-read-more
                  [imageUrl]="null"
                  [label]="'Lire la suite'"
                  [title]="'about.conseil_administration.title' | translate"
                  [paragraphs]="'about.conseil_administration.paragraphs' | translate"
                  [sectionId]="'conseil_administration'"
                  [nextSectionId]="getNextSectionForConseilAdmin()?.id || null"
                  [nextSectionTitle]="getNextSectionForConseilAdmin()?.title || null"
                  (navigateToSection)="onNavigateToSection($event)">
                </app-read-more>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>

    <!-- Bouton Retour en haut amélioré -->
    <button *ngIf="showScrollTop"
            (click)="scrollToTop()"
            class="cursor-pointer fixed bottom-6 right-6 z-50
               w-14 h-14 flex items-center justify-center
               rounded-full shadow-xl border-2 border-white
               bg-gradient-to-br from-[var(--sned-blue)] to-[var(--sned-blue-dark)] text-white
               hover:from-[var(--sned-orange)] hover:to-orange-600 hover:scale-110
               active:scale-95 transition-all duration-300 ease-in-out
               backdrop-blur-sm group">
      <i class="fa-solid fa-arrow-up text-xl group-hover:animate-bounce"></i>
      <!-- Effet de brillance au survol -->
      <div class="absolute inset-0 rounded-full opacity-0 group-hover:opacity-30
                  bg-gradient-to-t from-transparent via-white to-transparent
                  transition-opacity duration-300"></div>
    </button>
  `
})
export class AboutComponent implements OnInit {
  sections: Section[] = [];
  @ViewChildren(ReadMoreComponent) readMoreComponents!: QueryList<ReadMoreComponent>;

  constructor(private translateService: TranslateService) {}

  ngOnInit() {
    this.initializeSections();

    // S'abonner aux changements de langue
    this.translateService.onLangChange.subscribe(() => {
      this.initializeSections();
    });
  }

  private initializeSections() {
    this.sections = [
      {
        id: 'apropos',
        title: this.translateService.instant('about.sned.title'),
        short: this.translateService.instant('about.sned.short'),
        paragraphs: this.translateService.instant('about.sned.paragraphs'),
        image: 'assets/images/bridge_engineer.jpg'
      },
      {
        id: 'contexte',
        title: this.translateService.instant('about.contexte.title'),
        short: this.translateService.instant('about.contexte.short'),
        paragraphs: this.translateService.instant('about.contexte.paragraphs'),
        image: 'assets/images/contexte.jpg'
      },
      {
        id: 'missions',
        title: this.translateService.instant('about.missions.title'),
        short: this.translateService.instant('about.missions.short'),
        paragraphs: this.translateService.instant('about.missions.paragraphs'),
        image: 'assets/images/history.jpg'
      },
      {
        id: 'cadre',
        title: this.translateService.instant('about.cadre.title'),
        short: this.translateService.instant('about.cadre.short'),
        paragraphs: this.translateService.instant('about.cadre.paragraphs'),
        image: 'assets/images/cadre.jpg'
      },
      {
        id: 'sned_secegsa',
        title: this.translateService.instant('about.sned_secegsa.title'),
        short: this.translateService.instant('about.sned_secegsa.short'),
        paragraphs: this.translateService.instant('about.sned_secegsa.paragraphs'),
        image: 'assets/images/cooperation.jpg'
      }
    ];
  }

  showScrollTop = false;
  isOrganigrammeExpanded = false;

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

  getNextSection(currentIndex: number): { id: string, title: string } | null {
    const nextIndex = currentIndex + 1;
    if (nextIndex < this.sections.length) {
      return {
        id: this.sections[nextIndex].id,
        title: this.sections[nextIndex].title
      };
    }
    // Si on est à la dernière section, la suivante est l'organigramme
    if (nextIndex === this.sections.length) {
      return {
        id: 'organigramme',
        title: 'Organigramme'
      };
    }
    return null;
  }

  getNextSectionAfterOrganigramme(): { id: string, title: string } | null {
    // Depuis l'organigramme, aller au Conseil d'Administration
    return {
      id: 'conseil-administration-section',
      title: this.translateService.instant('about.conseil_administration.title')
    };
  }

  getNextSectionForConseilAdmin(): { id: string, title: string } | null {
    // Après le conseil d'administration, on pourrait revenir en haut ou ne rien afficher
    return null;
  }

  onNavigateToSection(sectionId: string) {
    // Scroller vers la section
    const nextElement = document.getElementById(sectionId);
    if (nextElement) {
      nextElement.scrollIntoView({
        behavior: 'smooth',
        block: 'center'
      });

      // Ouvrir automatiquement le ReadMore de la section de destination (si elle en a un)
      if (sectionId !== 'organigramme') {
        setTimeout(() => {
          const readMoreComponent = this.readMoreComponents.find(
            comp => comp.sectionId === sectionId
          );
          if (readMoreComponent) {
            readMoreComponent.openSidebarFromExternal();
          }
        }, 800); // Délai pour laisser le scroll se terminer
      }
    }
  }
}
