import { Component, Input, Output, EventEmitter, signal, inject } from '@angular/core';
import { trigger, style, transition, animate } from '@angular/animations';
import { LoaderComponent } from '../loader/loader.component';
import { LazyImageComponent } from '../shared/lazy-image/lazy-image.component';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-read-more',
  standalone: true,
  imports: [LoaderComponent, LazyImageComponent, TranslatePipe],
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
      <span>{{ label | translate }}</span>
      <span class="transition-transform duration-300 group-hover:translate-x-1">➔</span>
    </button>

    <!-- Overlay -->
    @if (sidebarOpen()) {
      <div
        class="fixed inset-0 bg-black/50"
        style="z-index: 9998;"
        (click)="closeSidebar()"
      ></div>
    }

    <!-- Sidebar animée -->
    @if (sidebarOpen()) {
      <aside
        @slideInOut
        class="fixed top-0 right-0 w-full md:w-[600px] h-full bg-white shadow-2xl flex flex-col"
        style="z-index: 9999;"
      >
      <!-- Header -->
      <div class="flex justify-between items-center p-4 border-b">
        <h2 class="text-2xl font-bold">{{ title | translate }}</h2>
        <div class="flex items-center gap-3">
          <!-- Bouton partager -->
          <button
            (click)="shareContent()"
            class="cursor-pointer text-gray-600 hover:text-blue-600 text-xl"
            [title]="'shared.readmore.share' | translate"
          >
            <i class="fas fa-share-alt"></i>
          </button>

          <!-- Bouton fermer -->
          <!-- Bouton fermer -->
          <button
            (click)="closeSidebar()"
            class="cursor-pointer text-gray-600 hover:text-black text-xl"
            [title]="'shared.readmore.close' | translate"
          >
            <i class="fas fa-times"></i>
          </button>

        </div>
      </div>

      <!-- Contenu scrollable -->
      <div class="flex-1 overflow-y-auto p-6 sidebar-scroll" data-lenis-prevent>
        @if (loading()) {
          <app-loader></app-loader>
        }

        <!-- Image spéciale pour SNED-SECEGSA -->
        @if (sectionId === 'sned_secegsa' && !loading()) {
          @defer (on viewport) {
            <div class="mb-4 w-3/4 mx-auto aspect-[4/3] flex items-center justify-center gap-8 p-8 bg-gradient-to-r from-blue-50 to-orange-50 rounded-lg shadow-md">
              <app-lazy-image
                src="assets/logos/snednotext.png"
                alt="SNED Logo"
                imageClass="h-20 w-auto object-contain"
                width="auto"
                height="5rem"
                [priority]="true">
              </app-lazy-image>
              <div class="text-3xl font-bold text-gray-400">+</div>
              <app-lazy-image
                src="assets/logos/secegsa.png"
                alt="SECEGSA Logo"
                imageClass="h-20 w-auto object-contain"
                width="auto"
                height="5rem"
                [priority]="true">
              </app-lazy-image>
            </div>
          } @placeholder {
            <div class="mb-4 w-3/4 mx-auto aspect-[4/3] bg-gray-200 rounded-lg animate-pulse"></div>
          }
        }

        <!-- Image normale pour les autres sections -->
        @if (imageUrl && !loading() && sectionId !== 'sned_secegsa') {
          @defer (on viewport) {
            <div class="mb-4 text-center">
              <app-lazy-image
                [src]="imageUrl"
                [alt]="title"
                imageClass="rounded-lg shadow-md w-full h-auto"
                width="75%"
                height="auto">
              </app-lazy-image>
            </div>
          } @placeholder {
            <div class="mb-4 text-center">
              <div class="inline-block w-3/4 h-64 bg-gray-200 rounded-lg animate-pulse"></div>
            </div>
          }
        }

        <!-- Texte en paragraphes -->
        @if (!loading()) {
          <div>
            @for (paragraph of paragraphs; track paragraph) {
              <p class="text-gray-700 leading-relaxed mb-4 adaptive-body">
                {{ paragraph }}
              </p>
            }
          </div>
        }
      </div>

      <!-- Footer avec navigation vers section suivante -->
      @if (nextSectionId && nextSectionTitle) {
        <div class="border-t bg-gray-50 p-4">
          <button
            (click)="navigateToNextSection()"
            class="cursor-pointer w-full flex items-center justify-between p-3 rounded-lg hover:bg-gray-100 transition-colors duration-200 group">
            <div class="flex items-center gap-3">
              <span class="text-gray-600">{{ 'shared.readmore.next_section' | translate }}</span>
              <span class="font-semibold text-gray-800">{{ nextSectionTitle }}</span>
            </div>
            <i class="fas fa-arrow-right text-[var(--sned-orange)] group-hover:translate-x-1 transition-transform duration-200"></i>
          </button>
        </div>
      }
      </aside>
    }
  `
})
export class ReadMoreComponent {
  private translate = inject(TranslateService);
  @Input() label = 'shared.readmore.read_more';
  @Input() title = 'shared.readmore.details';
  @Input() paragraphs: string[] | undefined = [];
  @Input() imageUrl: string | null = null;
  @Input() sectionId: string = '';
  @Input() nextSectionId: string | null = null;
  @Input() nextSectionTitle: string | null = null;
  @Output() navigateToSection = new EventEmitter<string>();

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

  openSidebarFromExternal() {
    this.openSidebar();
  }

  private loadContent() {
    this.loading.set(true);
    setTimeout(() => {
      this.loading.set(false);
    }, 1000);
  }

  async shareContent() {
    const shareData = {
      title: this.title,
      text: this.paragraphs!.join('\n\n')!,
      url: window.location.href
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
        console.log(this.translate.instant('shared.readmore.share_success'));
      } catch (err) {
        console.warn(this.translate.instant('shared.readmore.share_error'), err);
      }
    } else {
      // Fallback : copier dans le presse-papier
      await navigator.clipboard.writeText(`${this.title} - ${window.location.href}`);
      alert(this.translate.instant('shared.readmore.link_copied'));
    }
  }

  navigateToNextSection() {
    if (this.nextSectionId) {
      // Fermer la sidebar
      this.closeSidebar();

      // Émettre l'événement vers le parent pour gérer la navigation
      setTimeout(() => {
        this.navigateToSection.emit(this.nextSectionId!);
      }, 350); // 350ms correspond à la durée de l'animation slideInOut
    }
  }
}
