// src/app/features/about/about.component.ts
import { Component } from '@angular/core';
import { ReadMoreComponent } from '../readmore/readmore.component';
import { NgClass, NgFor } from '@angular/common';

interface Section {
  id: string;
  title: string;
  short: string;
  full: string;
  image: string;
}

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [ReadMoreComponent, NgClass, NgFor],
  template: `
    <section class="py-16 bg-gray-50">
      <div class="max-w-6xl mx-auto px-6 lg:px-12 space-y-20">
        <div *ngFor="let section of sections; let i = index"
             class="grid md:grid-cols-2 gap-10 items-center">

          <!-- Image -->
          <div class="relative" [id]="section.id"
               [ngClass]="{ 'order-first md:order-last': i % 2 === 1 }">
            <img [src]="section.image"
                 [alt]="section.title"
                 class="rounded-2xl shadow-lg w-full object-cover" />
          </div>

          <!-- Texte -->
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
              [fullText]="section.full">
            </app-read-more>
          </div>
        </div>
      </div>
    </section>

    <!-- Organigramme -->
    <div class="py-16 bg-gray-50 text-center">
      <h2 class="text-3xl font-bold text-primary mb-6">
        Organigramme
      </h2>
      <div id="orga">
        <img src="assets/images/orga.png"
             alt="organigramme" class="mb-8 rounded-lg shadow-md w-3/4 mx-auto h-auto" />
      </div>

      <!-- Intervenants -->
      <!-- Intervenants -->
      <section class="py-16 bg-gray-50">
        <div class="max-w-6xl mx-auto px-6 lg:px-12">
          <div class="relative bg-white rounded-2xl shadow-lg overflow-hidden">

            <!-- Trait coloré en haut -->
            <div class="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-500 to-orange-500"></div>

            <div class="p-10 space-y-6 text-left">
              <h2 class="text-3xl font-bold text-primary mb-8 text-center">
                Les Intervenants
              </h2>

              <div class="space-y-4 text-gray-700 leading-relaxed">
                <p><strong>Comité Mixte Intergouvernemental :</strong>
                  Ce comité a été créé à la suite de l’accord complémentaire de coopération signé en 1980 entre le Maroc et l’Espagne donnant naissance aux études pour le projet de liaison fixe entre l’Europe et l’Afrique à travers le détroit de Gibraltar.
                  Il constitue l’organe de gouvernance le plus élevé du projet et donne les grandes directives pour la SNED et la SECEGSA.
                </p>

                <p><strong>SECEGSA :</strong>
                  La SECEGSA est la « sœur jumelle » de la SNED, agissant conjointement sur l’ensemble des missions et activités.
                </p>

                <p><strong>Conseil d’Administration de la SNED :</strong>
                  Composé de trois à douze membres, il fixe les orientations, contrôle la gestion, nomme le Président et les Directeurs Généraux Délégués.
                  <em>Comité d’audit</em> : contrôle régulier des opérations, de l’organisation et des risques.
                  <em>Comité de Gouvernance, de nomination et de rémunération</em> : s’assure des bonnes pratiques et définit la politique salariale.
                </p>

                <p><strong>Président Directeur Général :</strong>
                  Représente la SNED et coordonne ses activités.
                  <em>Secrétariat</em> : gère la communication, la rédaction et l’organisation.
                </p>

                <p><strong>Directeur Général Délégué :</strong>
                  Dispose des mêmes pouvoirs que le Directeur Général selon les délégations.
                  <em>Bureau d’Ordre</em> : gère le courrier entrant/sortant et la documentation.
                </p>

                <p><strong>Pôle Études Techniques :</strong>
                  Collecte et exploite les données, conduit les études d’ingénierie.
                  <em>Service Conception</em> : études de modélisation (tunnel ferroviaire).
                  <em>Service Reconnaissance Milieu Physique</em> : études géologiques, océanographiques, sismiques, etc.
                </p>

                <p><strong>Pôle Promotion du Projet et Coopération :</strong>
                  Assure la communication internationale et le développement des coopérations.
                </p>

                <p><strong>Pôle Études d’impacts Économiques, Sociales et Environnementales :</strong>
                  Étudie les répercussions du projet et son intégration dans l’écosystème socio-économique.
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
  `
})
export class AboutComponent {
  sections: Section[] = [
    {
      id: 'apropos',
      title: 'Une vision Royale pour le Détroit de Gibraltar',
      short: `La Société Nationale d’Études du Détroit de Gibraltar (SNED) a été créée
              pour concrétiser une vision Royale ambitieuse.`,
      full: `...texte complet...`,
      image: 'assets/images/bridge_engineer.jpg'
    },
    {
      id: 'contexte',
      title: 'Une zone stratégique primordiale',
      short: `Le Détroit de Gibraltar fait partie d’une zone stratégique de par sa position
              géographique entre l’Europe et l’Afrique.`,
      full: `...texte complet sur le contexte...`,
      image: 'assets/images/gibraltar.jpg'
    },
    {
      id: 'missions',
      title: 'Missions et valeurs',
      short: `La SNED a pour mission de conduire les études et de coordonner les efforts nationaux.`,
      full: `...texte complet des missions...`,
      image: 'assets/images/bridge_engineer.jpg'
    },
    {
      id: 'cadre',
      title: 'Cadre institutionnel',
      short: `Référentiel légal et réglementaire inhérent au statut juridique de la SNED.`,
      full: `...texte complet du cadre institutionnel...`,
      image: 'assets/images/bridge_engineer.jpg'
    }
  ];
}
