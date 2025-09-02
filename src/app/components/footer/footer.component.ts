// src/app/layout/footer/footer.component.ts
import { Component } from '@angular/core';
import { NgClass } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [NgClass, RouterLink],
  template: `
    <footer class="bg-gray-100 border-t border-gray-200 mt-12">
      <div class="max-w-7xl mx-auto px-6 py-10 lg:px-8 grid grid-cols-1 md:grid-cols-3 gap-10">

        <!-- Logo + adresse -->
        <div>
          <a routerLink="/" class="flex items-center space-x-3 rtl:space-x-reverse">
            <img src="assets/images/sned.svg" alt="sned_logo" class="h-14 w-auto"/>
          </a>
          <p class="mt-4 text-gray-600 text-sm leading-relaxed">
            Société Nationale d’Études du Détroit de Gibraltar (SNED) <br/>
            11, Rue Antar Ibn Chaddad <br/>
            Avenue Mohamed VI, Km 8 <br/>
            Souissi – Rabat, Maroc
          </p>
          <p class="mt-2 text-gray-600 text-sm">
            ☎ Téléphone : +212 5 37 71 90 00
          </p>
        </div>

        <!-- Suivez-nous -->
        <div class="flex flex-col items-start md:items-center">
          <h3 class="text-lg font-semibold text-gray-800 mb-3">Suivez-nous</h3>
          <div class="flex space-x-4 rtl:space-x-reverse">
            <a href="#" aria-label="Facebook" class="text-gray-500 hover:text-blue-600 transition">
              <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M22 12c0-5.522-4.478-10-10-10S2 6.478 2 12c0 5 3.657 9.128 8.438 9.878v-6.988H7.898v-2.89h2.54V9.845c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562v1.875h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 17 22 12"/>
              </svg>
            </a>
            <a href="#" aria-label="Twitter" class="text-gray-500 hover:text-sky-500 transition">
              <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M19.633 7.581c.013.175.013.35.013.525 0 5.375-4.09 11.566-11.566 11.566-2.3 0-4.435-.662-6.23-1.812.325.038.637.05.975.05a8.179 8.179 0 0 0 5.063-1.744 4.088 4.088 0 0 1-3.817-2.83c.25.038.5.063.763.063.362 0 .725-.05 1.063-.137a4.082 4.082 0 0 1-3.275-4.006v-.05c.55.3 1.188.475 1.862.5A4.075 4.075 0 0 1 4.9 7.07c0-.75.2-1.45.55-2.05a11.6 11.6 0 0 0 8.425 4.275c-.062-.3-.1-.612-.1-.925a4.084 4.084 0 0 1 7.063-2.787 8.2 8.2 0 0 0 2.587-.987 4.072 4.072 0 0 1-1.794 2.25 8.223 8.223 0 0 0 2.35-.637 8.818 8.818 0 0 1-2.112 2.175"/>
              </svg>
            </a>
            <a href="#" aria-label="LinkedIn" class="text-gray-500 hover:text-blue-700 transition">
              <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.762 2.239 5 5 5h14c2.762 0 5-2.238 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-10h3v10zm-1.5-11.268c-.966 0-1.75-.79-1.75-1.764 0-.975.784-1.764 1.75-1.764s1.75.789 1.75 1.764c0 .974-.784 1.764-1.75 1.764zm13.5 11.268h-3v-5.604c0-1.337-.027-3.059-1.865-3.059-1.867 0-2.155 1.459-2.155 2.965v5.698h-3v-10h2.878v1.367h.041c.401-.761 1.378-1.562 2.838-1.562 3.036 0 3.593 2.004 3.593 4.609v5.586z"/>
              </svg>
            </a>
            <a href="#" aria-label="YouTube" class="text-gray-500 hover:text-red-600 transition">
              <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M19.615 3.184c-1.605-.44-8.048-.44-8.048-.44s-6.443 0-8.048.44C2.636 3.636 2 5.067 2 8.365v7.27c0 3.298.636 4.729 1.519 5.181 1.605.44 8.048.44 8.048.44s6.443 0 8.048-.44C21.364 20.364 22 18.933 22 15.635v-7.27c0-3.298-.636-4.729-1.519-5.181zM10 15.5v-7l6 3.5-6 3.5z"/>
              </svg>
            </a>
          </div>
        </div>

        <!-- Copyright -->
        <div class="flex flex-col md:items-end justify-between">
          <p class="text-gray-600 text-sm">
            © {{ currentYear }} SNED. Tous droits réservés.
          </p>
        </div>
      </div>
    </footer>
  `
})
export class FooterComponent {
  currentYear = new Date().getFullYear();
}
