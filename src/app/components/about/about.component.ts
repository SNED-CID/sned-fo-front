// src/app/features/about/about.component.ts
import {Component, HostListener} from '@angular/core';
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

    <section class="py-16 ">
      <div class="max-w-6xl mx-auto px-6 lg:px-12 space-y-20 bg-white rounded-lg">
        <div *ngFor="let section of sections; let i = index"
             class="grid md:grid-cols-2 gap-10">

          <!-- Image -->
          <div class="flex items-center relative"
               [id]="section.id"
               [ngClass]="{ 'order-first md:order-last': i % 2 === 1 }">

            <img [src]="section.image"
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
                [paragraphs]="section.paragraphs">
              </app-read-more>
            </div>
          </div>
        </div>
      </div>
    </section>

    <div class=" pb-16">
      <!-- Organigramme -->
      <!-- Organigramme -->
      <div class="w-3/4 mx-auto">
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
      <section class="mt-16">
        <div class="w-3/4 mx-auto">
          <h2 class="text-3xl font-bold text-primary mb-6 text-left">
            Les Intervenants
          </h2>

          <div class="relative bg-white rounded-2xl shadow-lg overflow-hidden">
            <!-- Trait coloré en haut -->
            <div class="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-500 to-orange-500"></div>

            <div class="p-10 space-y-6 text-left">
              <div class="space-y-4 text-gray-700 leading-relaxed">
                <p><strong>Comité Mixte Intergouvernemental :</strong>
                  Ce comité a été créé à la suite de l'accord complémentaire de coopération signé en 1980 entre le Maroc et l'Espagne donnant naissance aux études pour le projet de liaison fixe entre l'Europe et l'Afrique à travers le détroit de Gibraltar.
                  Il constitue l'organe de gouvernance le plus élevé du projet et donne les grandes directives pour la SNED et la SECEGSA.
                </p>

                <p><strong>SECEGSA :</strong>
                  La SECEGSA est la « sœur jumelle » de la SNED, agissant conjointement sur l'ensemble des missions et activités.
                </p>

                <p><strong>Conseil d'Administration de la SNED :</strong>
                  Composé de trois à douze membres, il fixe les orientations, contrôle la gestion, nomme le Président et les Directeurs Généraux Délégués.
                  <em>Comité d'audit</em> : contrôle régulier des opérations, de l'organisation et des risques.
                  <em>Comité de Gouvernance, de nomination et de rémunération</em> : s'assure des bonnes pratiques et définit la politique salariale.
                </p>

                <p><strong>Président Directeur Général :</strong>
                  Représente la SNED et coordonne ses activités.
                  <em>Secrétariat</em> : gère la communication, la rédaction et l'organisation.
                </p>

                <p><strong>Directeur Général Délégué :</strong>
                  Dispose des mêmes pouvoirs que le Directeur Général selon les délégations.
                  <em>Bureau d'Ordre</em> : gère le courrier entrant/sortant et la documentation.
                </p>

                <p><strong>Pôle Études Techniques :</strong>
                  Collecte et exploite les données, conduit les études d'ingénierie.
                  <em>Service Conception</em> : études de modélisation (tunnel ferroviaire).
                  <em>Service Reconnaissance Milieu Physique</em> : études géologiques, océanographiques, sismiques, etc.
                </p>

                <p><strong>Pôle Promotion du Projet et Coopération :</strong>
                  Assure la communication internationale et le développement des coopérations.
                </p>

                <p><strong>Pôle Études d'impacts Économiques, Sociales et Environnementales :</strong>
                  Étudie les répercussions du projet et son intégration dans l'écosystème socio-économique.
                </p>

                <p><strong>Pôle Support :</strong>
                  Garantit le bon fonctionnement de la SNED.
                  <em>Service RH</em> : gestion du personnel et de la paie.
                  <em>Service Affaires Générales</em> : patrimoine documentaire, achats, juridique.
                  <em>Service Comptabilité et Finance</em> : comptabilité, budget, trésorerie et audits.
                </p>
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
export class AboutComponent {
  sections: Section[] = [];

  constructor(private translateService: TranslateService) {
    this.initializeSections();
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
        title: 'Contexte stratégique',
      short: `Le Détroit de Gibraltar est une zone stratégique reliant l'Europe et l'Afrique,
            et un carrefour maritime entre l'Atlantique et la Méditerranée.`,
      full: `
Le Détroit de Gibraltar occupe une position géographique primordiale,
reliant l'Europe et l'Afrique et reliant l'Atlantique à la Méditerranée.
Il s'agit d'un passage stratégique pour la navigation maritime mondiale.

Le Maroc et l'Espagne ont initié l'étude d'une liaison fixe afin de renforcer leur coopération
et faire de la Méditerranée Occidentale un centre d'échanges névralgique.
Ce projet contribuerait à un essor économique et social régional, à l'intégration
des réseaux de transport et au développement territorial sur les deux rives.
    `,
      image: 'assets/images/contexte.jpg'
    },
    {
      id: 'missions',
      title: 'Missions et valeurs',
      short: `La SNED a pour mission principale de conduire les études relatives à la liaison fixe
            Europe-Afrique et de promouvoir le projet.`,
      full: `
La SNED a pour objet social :

• La réalisation d'études d'une liaison fixe entre l'Europe et l'Afrique à travers le Détroit,
  portant sur la conception, les moyens et les modalités de sa construction et de son exploitation ;
• La promotion du projet aux niveaux national et international ;
• La mise en œuvre de toutes opérations susceptibles de favoriser son développement.

Il est important de noter que la mission de la SNED se limite aux études,
à la conception et à la promotion : la réalisation de la liaison fixe ne relève pas de sa responsabilité.

Depuis sa création, la SNED a traversé plusieurs phases :
– Phase préliminaire (1980–1982) : acquisition des données de base ;
– Préfaisabilité (1982–1990) : études techniques, milieu physique et socio-économique ;
– Faisabilité (1990–aujourd'hui) : approfondissement des études et choix technique.

Depuis 2017, elle s'est engagée dans une nouvelle dynamique orientée vers la collecte et l'analyse
des données socio-économiques et commerciales, avec un plan de travail triennal.
    `,
      image: 'assets/images/history.jpg'
    },
    {
      id: 'cadre',
      title: 'Cadre institutionnel et légal',
      short: `La SNED est une société anonyme de droit marocain à majorité publique,
            régie par un ensemble de textes législatifs et réglementaires.`,
      full: `
La SNED est une Société Anonyme dont le capital est divisé en 27.500 actions de 100 dirhams,
détenues à 99,96 % par l'État et des organismes publics.

Elle est considérée comme une filiale publique à participation directe majoritaire de l'État
au sens de la loi 69-00 relative au contrôle financier des entreprises publiques.

Référentiel légal et réglementaire applicable :
– Statuts de la SNED refondus le 21 juin 2023 ;
– Loi 69-00 relative au contrôle financier de l'État sur les EEP ;
– Loi 82-20 portant création de l'Agence Nationale de Gestion Stratégique des Participations de l'État ;
– Loi-cadre 50-21 relative à la réforme des EEP ;
– Code du commerce, Code général des impôts, Code du travail, lois relatives à la comptabilité et à la fiscalité ;
– Textes spécifiques à la protection de l'environnement (loi 11-03, loi 49-17, charte nationale de l'environnement, etc.) ;
– Conventions internationales ratifiées (Convention de Montego Bay, CITES, Kyoto, Ramsar, Barcelone, etc.).

Ce cadre juridique assure à la SNED une gouvernance conforme aux normes nationales
et internationales, notamment en matière de transparence, de durabilité et de bonne gouvernance.
    `,
      image: 'assets/images/cadre.jpg'
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
}
