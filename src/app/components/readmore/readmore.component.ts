import {
  Component,
  Input,
  Output,
  EventEmitter,
  signal,
  inject,
  HostListener,
  OnInit,
} from '@angular/core';
import { trigger, style, transition, animate } from '@angular/animations';
import { LoaderComponent } from '../loader/loader.component';
import { LazyImageComponent } from '../shared/lazy-image/lazy-image.component';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-read-more',
  standalone: true,
  imports: [LoaderComponent, LazyImageComponent, TranslatePipe, CommonModule],
  animations: [
    trigger('slideInOut', [
      transition(':enter', [
        style({ transform: 'translateX(100%)' }),
        animate(
          '500ms cubic-bezier(0.4, 0, 0.2, 1)',
          style({ transform: 'translateX(0%)' }),
        ),
      ]),
      transition(':leave', [
        animate(
          '500ms cubic-bezier(0.4, 0, 0.2, 1)',
          style({ transform: 'translateX(100%)' }),
        ),
      ]),
    ]),
  ],
  template: `
    <div class="flex justify-center w-full">
      <!-- Bouton -->
      <button
        (click)="openSidebar()"
        class="cursor-pointer group flex items-center gap-2 px-5 py-2 rounded-full bg-[var(--sned-orange)] text-white font-medium transition-all duration-300 hover:translate-y-[-2px] hover:bg-sned-blue whitespace-nowrap"
      >
        <span>{{ label | translate }}</span>
        <span
          [class]="
            currentLang() === 'ar'
              ? 'transition-transform duration-300 group-hover:-translate-x-1'
              : 'transition-transform duration-300 group-hover:translate-x-1'
          "
        >
          {{ currentLang() === 'ar' ? '←' : '➔' }}
        </span>
      </button>
    </div>

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
        class="fixed top-0 right-0 w-full md:w-3/4 h-full bg-white shadow-2xl flex flex-col"
        style="z-index: 99999;"
      >
        <!-- Header -->
        <div class="flex justify-between items-center p-4 border-b">
          <h2 class="text-2xl font-bold">{{ title | translate }}</h2>
          <div class="flex items-center gap-3">
            <!-- Bouton partager -->
            <button
              (click)="shareContent()"
              class="no-fluid-btn cursor-pointer bg-transparent border-0 shadow-none text-gray-600 hover:text-gray-700 text-xl p-1"
              [title]="'shared.readmore.share' | translate"
            >
              <i class="fas fa-share-alt"></i>
            </button>

            <!-- Bouton fermer -->
            <!-- Bouton fermer -->
            <button
              (click)="closeSidebar()"
              class="no-fluid-btn cursor-pointer bg-transparent border-0 shadow-none text-gray-600 hover:text-black text-xl p-1"
              [title]="'shared.readmore.close' | translate"
            >
              <i class="fas fa-times"></i>
            </button>
          </div>
        </div>

        <!-- Contenu scrollable -->
        <div
          class="flex-1 overflow-y-auto p-6 sidebar-scroll"
          data-lenis-prevent
        >
          @if (loading()) {
            <app-loader></app-loader>
          }

          <!-- Image spéciale pour SNED-SECEGSA -->
          @if (sectionId === 'sned_secegsa' && !loading()) {
            @defer (on viewport) {
              <div
                class="mb-4 w-3/4 mx-auto aspect-[4/3] flex items-center justify-center gap-8 p-8 bg-gradient-to-r from-blue-50 to-orange-50 rounded-lg shadow-md"
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
            } @placeholder {
              <div
                class="mb-4 w-3/4 mx-auto aspect-[4/3] bg-gray-200 rounded-lg animate-pulse"
              ></div>
            }
          }

          <!-- Image normale pour les autres sections -->
          @if (
            imageUrl &&
            !loading() &&
            sectionId !== 'sned_secegsa' &&
            sectionId !== 'recherche-sur-le-milieu-physique' &&
            sectionId !== 'ingenierie-du-projet' &&
            sectionId !== 'realite-et-perspectives-socioeconomiques' &&
            sectionId !== 'composante-geostrategique'
          ) {
            @defer (on viewport) {
              <div class="mb-4 text-center">
                <app-lazy-image
                  [src]="imageUrl"
                  [alt]="title"
                  imageClass="rounded-lg shadow-md w-full h-auto"
                  width="75%"
                  height="auto"
                >
                </app-lazy-image>
              </div>
            } @placeholder {
              <div class="mb-4 text-center">
                <div
                  class="inline-block w-3/4 h-64 bg-gray-200 rounded-lg animate-pulse"
                ></div>
              </div>
            }
          }

          <!-- Description sous l'image 1 -->
          @if (description && !loading()) {
            <div class="mb-4 text-center">
              <p
                class="w-3/4 mx-auto px-6 py-4 bg-gray-50 text-gray-700 leading-relaxed mb-4 adaptive-body rounded-lg shadow-md"
              >
                {{ description }}
              </p>
            </div>
          }

          <!-- Texte en paragraphes -->
          @if (!loading() && paragraphs) {

  @for (paragraph of paragraphs; track $index; let i = $index) {

    <p
      class="m-10 text-gray-700 leading-relaxed mb-4 adaptive-body"
      [class.text-2xl]="sectionId === 'historique-du-projet' && (i === 4 || i === 34)"
      [class.text-center]="sectionId === 'historique-du-projet' && (i === 4 || i === 34)"
      [class.font-bold]="sectionId === 'historique-du-projet' && (i === 4 || i === 34)"
      [class.text-blue-600]="sectionId === 'historique-du-projet' && (i === 4 || i === 34)"
      [innerHTML]="paragraph"
    >
    </p>

    <!-- Image unique recherche milieu physique -->
    @if (
    sectionId === 'recherche-sur-le-milieu-physique'
    && imagePositionIndex !== null
    && i === imagePositionIndex
  ) {
    <div class="mb-8 text-center">
      <app-lazy-image
        [src]="imageUrl!"
        [alt]="title"
        imageClass="rounded-lg shadow-md w-full h-auto"
        width="75%"
        height="auto"
      >
      </app-lazy-image>
    </div>
  }

    <!-- Images ingénierie -->
    @if (
      sectionId === 'ingenierie-du-projet'
      && titleImageIndexes.includes(i)
    ) {

      <div class="mb-8 text-center">

        <app-lazy-image
          [src]="sectionImages[titleImageIndexes.indexOf(i)]"
          [alt]="title"
          imageClass="rounded-lg shadow-md w-full h-auto"
          width="75%"
          height="auto"
        >
        </app-lazy-image>

      </div>

    }

    <!-- Images réalité et perspectives socioéconomiques -->
@if (
  sectionId === 'realite-et-perspectives-socioeconomiques'
  && titleImageIndexes.includes(i)
) {
  <div class="mb-8 text-center">
    <app-lazy-image
      [src]="sectionImages[titleImageIndexes.indexOf(i)]"
      [alt]="title"
      imageClass="rounded-lg shadow-md w-full h-auto"
      width="75%"
      height="auto"
    >
    </app-lazy-image>
  </div>
}

<!-- Images composante géostratégique -->
@if (
  sectionId === 'composante-geostrategique'
  && titleImageIndexes.includes(i)
) {
  <div class="mb-8 text-center">
    <app-lazy-image
      [src]="sectionImages[titleImageIndexes.indexOf(i)]"
      [alt]="title"
      imageClass="rounded-lg shadow-md w-full h-auto"
      width="75%"
      height="auto"
    >
    </app-lazy-image>
  </div>
}

  }

}
        </div>
      </aside>
    }
  `,
})
export class ReadMoreComponent implements OnInit {
  private translate = inject(TranslateService);
  currentLang = signal('fr');
  @Input() label = 'shared.readmore.read_more';

  @Input() sectionImages: string[] = [];
@Input() titleImageIndexes: number[] = [];

  ngOnInit() {
    // Initialiser la langue courante
    this.currentLang.set(
      this.translate.currentLang || this.translate.defaultLang || 'fr',
    );

    // S'abonner aux changements de langue
    this.translate.onLangChange.subscribe((event) => {
      this.currentLang.set(event.lang);
    });
  }
  @Input() title = 'shared.readmore.details';
  @Input() paragraphs: string[] | undefined = [];
  @Input() imageUrl: string | null = null;
  @Input() description: string | null = null;
  @Input() imagePositionIndex: number | null = null;
  @Input() sectionId: string = '';
  @Input() nextSectionId: string | null = null;
  @Input() nextSectionTitle: string | null = null;
  @Output() navigateToSection = new EventEmitter<string>();

  sidebarOpen = signal(false);
  loading = signal(false);

  openSidebar() {
    this.sidebarOpen.set(true);
    document.documentElement.classList.add('overflow-hidden');
    document.body.classList.add('overflow-hidden', 'readmore-open');
    this.loadContent();
  }

  closeSidebar() {
    this.sidebarOpen.set(false);
    document.documentElement.classList.remove('overflow-hidden');
    document.body.classList.remove('overflow-hidden', 'readmore-open');
  }

  openSidebarFromExternal() {
    this.openSidebar();
  }

  @HostListener('document:keydown.escape')
  onEscapePress() {
    if (this.sidebarOpen()) {
      this.closeSidebar();
    }
  }

  private loadContent() {
    this.loading.set(true);
    setTimeout(() => {
      this.loading.set(false);
    }, 500);
  }

  async shareContent() {
    const shareData = {
      title: this.title,
      text: this.paragraphs!.join('\n\n')!,
      url: window.location.href,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
        console.log(this.translate.instant('shared.readmore.share_success'));
      } catch (err) {
        console.warn(
          this.translate.instant('shared.readmore.share_error'),
          err,
        );
      }
    } else {
      // Fallback : copier dans le presse-papier
      await navigator.clipboard.writeText(
        `${this.title} - ${window.location.href}`,
      );
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
