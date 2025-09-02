// src/app/features/about/about.component.ts
import { Component } from '@angular/core';
import {ReadMoreComponent} from '../readmore/readmore.component';
import {NgClass} from '@angular/common';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [ReadMoreComponent, NgClass],
  template: `
    <section class="py-16 bg-gray-50">
      <div class="max-w-6xl mx-auto px-6 lg:px-12">
        <div class="grid md:grid-cols-2 gap-10 items-center">

          <!-- Image -->
          <div class="relative">
            <img
              src="assets/images/bridge_engineer.jpg"
              alt="SNED - Détroit de Gibraltar"
              class="rounded-2xl shadow-lg"
            />
          </div>

          <!-- Texte -->
          <div>
            <h2 class="text-3xl font-bold text-primary mb-6">
              Une vision Royale pour le Détroit de Gibraltar
            </h2>
            <p class="text-gray-700 mb-6 line-clamp-3">
              {{ shortText }}
            </p>
            <app-read-more class="z-100"
              [imageUrl]="'assets/images/bridge_engineer.jpg'"
              [label]="'Lire la suite'"
              [title]="'Une vision Royale pour le Détroit de Gibraltar'"
              [fullText]="fullText">
            </app-read-more>
          </div>

        </div>
      </div>
    </section>
  `
})
export class AboutComponent {
  shortText = `
    La Société Nationale d'Études du Détroit de Gibraltar (SNED) a été créée
    pour concrétiser une vision Royale ambitieuse : relier l’Afrique et l’Europe
    à travers le Détroit de Gibraltar.
  `;

  fullText = `
    La Société Nationale d'Études du Détroit de Gibraltar (SNED) a été créée
    pour concrétiser une vision Royale ambitieuse : relier l’Afrique et l’Europe
    à travers le Détroit de Gibraltar, en faisant de ce projet un symbole de
    coopération, de prospérité et de rapprochement des peuples.

    Sa mission est de mener les études techniques, économiques et environnementales
    nécessaires, et de coordonner les efforts nationaux et internationaux pour
    garantir la faisabilité et la durabilité de cette initiative stratégique.

    Par ses travaux, la SNED contribue à renforcer la place du Maroc en tant que hub régional et acteur clé du dialogue euro-africain.
  `;
}
