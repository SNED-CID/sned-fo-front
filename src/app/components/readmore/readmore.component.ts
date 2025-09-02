import { Component, Input, signal } from '@angular/core';
import { NgIf } from '@angular/common';
import { trigger, style, transition, animate } from '@angular/animations';
import { LoaderComponent } from '../loader/loader.component';

@Component({
  selector: 'app-read-more',
  standalone: true,
  imports: [NgIf, LoaderComponent],
  animations: [
    trigger('slideInOut', [
      transition(':enter', [
        style({ transform: 'translateX(100%)' }),
        animate('300ms ease-out', style({ transform: 'translateX(0%)' }))
      ]),
      transition(':leave', [
        animate('300ms ease-in', style({ transform: 'translateX(100%)' }))
      ])
    ])
  ],
  template: `
    <!-- Bouton -->
    <button
      (click)="openSidebar()"
      class="cursor-pointer group flex items-center gap-2 px-5 py-2 rounded-full bg-[var(--sned-orange)] text-white font-medium transition-all duration-300 hover:translate-y-[-2px] hover:bg-sned-blue"
    >
      <span>{{ label }}</span>
      <span class="transition-transform duration-300 group-hover:translate-x-1">➔</span>
    </button>

    <!-- Overlay -->
    <div
      *ngIf="sidebarOpen()"
      class="fixed inset-0 bg-black/50 z-40"
      (click)="closeSidebar()"
    ></div>

    <!-- Sidebar animée -->
    <aside
      *ngIf="sidebarOpen()"
      @slideInOut
      class="fixed top-0 right-0 w-full md:w-[600px] h-full bg-white shadow-2xl z-50 flex flex-col"
    >
      <!-- Header -->
      <div class="flex justify-between items-center p-4 border-b">
        <h2 class="text-2xl font-bold">{{ title }}</h2>
        <button
          (click)="closeSidebar()"
          class="cursor-pointer text-gray-600 hover:text-black text-xl"
        >
          ✕
        </button>
      </div>

      <!-- Contenu scrollable -->
      <div class="flex-1 overflow-y-auto p-6 sidebar-scroll" data-lenis-prevent>
        <app-loader *ngIf="loading()"></app-loader>

        <!-- Image -->
        <img *ngIf="imageUrl && !loading()" [src]="imageUrl"
             alt="{{ title }}" class="mb-4 rounded-lg shadow-md w-3/4 mx-auto h-auto" />

        <!-- Texte -->
        <p *ngIf="!loading()" class="text-gray-700 leading-relaxed whitespace-pre-line">
          {{ fullText }}
        </p>
      </div>
    </aside>
  `
})
export class ReadMoreComponent {
  @Input() label = 'Lire la suite';
  @Input() title = 'Détails';
  @Input() fullText = '';
  @Input() imageUrl: string | null = null;  // ✅ nouvelle propriété

  sidebarOpen = signal(false);
  loading = signal(false);

  openSidebar() {
    this.sidebarOpen.set(true);
    document.documentElement.classList.add('overflow-hidden');
    document.body.classList.add('overflow-hidden');
    this.loadContent();
  }

  closeSidebar() {
    this.sidebarOpen.set(false);
    document.documentElement.classList.remove('overflow-hidden');
    document.body.classList.remove('overflow-hidden');
  }

  private loadContent() {
    this.loading.set(true);
    setTimeout(() => {
      this.loading.set(false);
    }, 1000);
  }
}
