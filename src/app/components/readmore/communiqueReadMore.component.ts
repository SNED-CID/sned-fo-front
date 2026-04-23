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
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Component({
  selector: 'app-communique-read-more',
  standalone: true,
  imports: [LoaderComponent, LazyImageComponent, TranslatePipe, CommonModule],
  animations: [
    trigger('slideInOut', [
      transition(':enter', [
        style({ transform: 'translateX(100%)' }),
        animate(
          '500ms cubic-bezier(0.4, 0, 0.2, 1)',
          style({ transform: 'translateX(0%)' })
        ),
      ]),
      transition(':leave', [
        animate(
          '500ms cubic-bezier(0.4, 0, 0.2, 1)',
          style({ transform: 'translateX(100%)' })
        ),
      ]),
    ]),
  ],
  template: `
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
      class="fixed inset-y-0 right-0 w-full md:w-[75vw] bg-white shadow-2xl flex flex-col"
      style="z-index: 99999;"
    >
      <!-- Header -->
      <div class="flex justify-between items-center p-4 border-b">
        <div class="flex-1">
          <h2 class="text-2xl font-bold mb-1">{{ title }}</h2>
          @if (date) {
          <p class="text-sm text-gray-600">{{ formatDate(date) }}</p>
          }
        </div>
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
      <div class="flex-1 overflow-y-auto p-6 sidebar-scroll" data-lenis-prevent>
        @if (loading()) {
        <app-loader></app-loader>
        } @if (!loading()) {
        <!-- Image -->
        @if (imageUrl) { @defer (on viewport) {
        <div class="mb-6 text-center">
          <app-lazy-image
            [src]="imageUrl"
            [alt]="title"
            imageClass="rounded-lg shadow-md w-full h-auto"
            width="100%"
            height="auto"
          >
          </app-lazy-image>
        </div>
        } @placeholder {
        <div class="mb-6 text-center">
          <div class="w-full h-64 bg-gray-200 rounded-lg animate-pulse"></div>
        </div>
        } }

        <!-- Détails HTML -->
        @if (details) {
        <div
          class="text-gray-700 leading-relaxed mb-4 w-full overflow-hidden break-words"
          style="max-width: 100%; word-wrap: break-word; overflow-wrap: break-word;"
          [innerHTML]="sanitizedDetails()"
        ></div>
        } }
      </div>
    </aside>
    }
  `,
  styles: [
    `
      :host ::ng-deep .sidebar-scroll img,
      :host ::ng-deep .sidebar-scroll iframe,
      :host ::ng-deep .sidebar-scroll video,
      :host ::ng-deep .sidebar-scroll table {
        max-width: 100% !important;
        height: auto !important;
      }

      :host ::ng-deep .sidebar-scroll table {
        display: block;
        overflow-x: auto;
      }

      :host ::ng-deep .sidebar-scroll * {
        max-width: 100%;
        word-wrap: break-word;
        overflow-wrap: break-word;
      }
    `,
  ],
})
export class CommuniqueReadMoreComponent implements OnInit {
  private translate = inject(TranslateService);
  private sanitizer = inject(DomSanitizer);

  currentLang = signal('fr');

  @Input() label = 'shared.readmore.read_more';
  @Input() title = '';
  @Input() date: string | Date | null = null;
  @Input() imageUrl: string | null = null; // URL normale ou base64
  @Input() details: string = ''; // HTML string
  @Input() nextCommuniqueTitle: string | null = null;

  @Output() closed = new EventEmitter<void>();

  sidebarOpen = signal(false);
  loading = signal(false);

  ngOnInit() {
    this.currentLang.set(
      this.translate.currentLang || this.translate.defaultLang || 'fr'
    );

    this.translate.onLangChange.subscribe((event) => {
      this.currentLang.set(event.lang);
    });
  }

  sanitizedDetails(): SafeHtml {
    return this.sanitizer.sanitize(1, this.details) || '';
  }

  formatDate(date: string | Date): string {
    const d = typeof date === 'string' ? new Date(date) : date;
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    };
    return d.toLocaleDateString(this.currentLang(), options);
  }

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

    // attendre la fin de l’animation
    setTimeout(() => {
      this.closed.emit();
    }, 400); // durée animation
  }

  openSidebarFromExternal() {
    this.openSidebar();
  }

  closeSidebarFromExternal() {
    this.closeSidebar();
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
      text: this.details.replace(/<[^>]*>/g, ''), // Enlever les tags HTML
      url: window.location.href,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
        console.log(this.translate.instant('shared.readmore.share_success'));
      } catch (err) {
        console.warn(
          this.translate.instant('shared.readmore.share_error'),
          err
        );
      }
    } else {
      await navigator.clipboard.writeText(
        `${this.title} - ${window.location.href}`
      );
      alert(this.translate.instant('shared.readmore.link_copied'));
    }
  }
}
