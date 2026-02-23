import {
  Component,
  Input,
  Output,
  EventEmitter,
  HostListener,
  inject,
  OnDestroy,
  OnInit,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { trigger, style, transition, animate } from '@angular/animations';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { LoaderComponent } from '../loader/loader.component';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import DOMPurify from 'dompurify';

@Component({
  selector: 'app-tender-read-more',
  standalone: true,
  imports: [CommonModule, LoaderComponent, TranslatePipe],
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
    <div
      *ngIf="sidebarOpen()"
      class="fixed inset-0 bg-black/50"
      style="z-index: 9998;"
      (click)="closeSidebar()"
    ></div>

    <!-- Sidebar -->
    <aside
      *ngIf="sidebarOpen()"
      @slideInOut
      class="
  fixed top-0 right-0 w-full md:w-[80%] lg:w-[75%] h-full bg-white shadow-2xl flex flex-col"
      style="z-index: 99999;"
    >
      <!-- Header avec boutons -->
      <div class="flex justify-end items-center p-4 border-b bg-gray-50">
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
          <button
            (click)="closeSidebar()"
            class="cursor-pointer text-gray-600 hover:text-black text-xl"
            [title]="'shared.readmore.close' | translate"
          >
            <i class="fas fa-times"></i>
          </button>
        </div>
      </div>

      <!-- Contenu avec scroll -->
      <div
        class="flex-1 overflow-y-auto sidebar-scroll"
        style="background-color: #e5e7eb;"
        data-lenis-prevent
      >
        <app-loader *ngIf="loading()"></app-loader>

        <!-- Container du document PDF -->
        <div *ngIf="!loading()" class="pdf-container">
          <!-- Page PDF -->
          <div class="pdf-page">
            <!-- Date en haut à droite -->
            <div class="pdf-header">
              <div class="pdf-date" *ngIf="formattedDate">
                {{ formattedDate }}
              </div>
            </div>

            <!-- Titre principal (Numéro) -->
            <div class="pdf-title-section">
              <h1 class="pdf-main-title">{{ tenderNumberDisplay }}</h1>
            </div>

            <!-- Contenu du document -->
            <div class="pdf-content">
              <div
                class="pdf-text whitespace-normal"
                [innerHTML]="trustedContent"
              ></div>
            </div>
          </div>
        </div>
      </div>

      <!-- Footer navigation -->
      <div
        class="border-t bg-white p-4 shadow-lg"
        *ngIf="nextTenderId !== null && nextTenderTitle"
      >
        <button
          (click)="navigateToNextTender()"
          class="cursor-pointer w-full flex items-center justify-between p-4 rounded-lg
                       bg-gradient-to-r from-blue-50 to-blue-100
                       hover:from-blue-100 hover:to-blue-200
                       transition-all duration-200 group border border-blue-200"
        >
          <div class="flex items-center gap-3">
            <span class="text-sm text-gray-600 font-medium">{{
              'shared.readmore.next_section' | translate
            }}</span>
            <span class="font-semibold text-gray-900">{{
              nextTenderTitle
            }}</span>
          </div>
          <i
            [class]="
              currentLang() === 'ar'
                ? 'fas fa-arrow-left text-blue-600 group-hover:-translate-x-1 transition-transform duration-200'
                : 'fas fa-arrow-right text-blue-600 group-hover:translate-x-1 transition-transform duration-200'
            "
          ></i>
        </button>
      </div>
    </aside>
  `,
  styles: [
    `
      // Container PDF
      .pdf-container {
        padding: 2rem;
        min-height: 100%;
        display: flex;
        justify-content: center;
        overflow: visible;
        box-sizing: border-box;

        @media (max-width: 768px) {
          padding: 1rem;
        }
      }

      // Page PDF style
      .pdf-page {
        width: 100%;
        max-width: 210mm; // Largeur A4
        background: white;
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        padding-top: 20mm; /* ← ici */
        padding-right: 25mm;
        padding-bottom: 40mm;
        padding-left: 25mm;
        min-height: calc(100vh - 4rem);
        overflow: visible;
        box-sizing: border-box;

        @media (max-width: 768px) {
          padding: 20mm 15mm;
        }
      }

      // En-tête du document (date seulement)
      .pdf-header {
        display: flex;
        justify-content: flex-end;
        margin-bottom: 3rem;

        @media (max-width: 768px) {
          margin-bottom: 2rem;
        }
      }

      .pdf-date {
        font-size: 0.9375rem;
        color: #6b7280;
        font-weight: 500;

        @media (max-width: 768px) {
          font-size: 0.875rem;
        }
      }

      // Section titre (numéro)
      .pdf-title-section {
        margin-bottom: 3rem;

        @media (max-width: 768px) {
          margin-bottom: 2rem;
        }
      }

      .pdf-main-title {
        font-size: 2.25rem;
        font-weight: 700;
        color: #111827;
        margin: 0;
        line-height: 1.2;
        letter-spacing: -0.02em;
        text-align: center;

        @media (max-width: 768px) {
          font-size: 1.75rem;
        }
      }

      // Contenu principal
      .pdf-content {
        margin-bottom: 3rem;
      }

      .pdf-section {
        margin-bottom: 2rem;
      }

      .pdf-text {
        font-size: 1rem;
        line-height: 1.75;
        color: #374151;
        text-align: justify;
        // white-space: normal;
        // word-break: normal;
        // overflow-wrap: break-word;
        white-space: normal !important;
        word-break: normal !important;
        overflow-wrap: break-word !important;
        hyphens: none !important;

        ::ng-deep p {
          margin-bottom: 1rem;

          &:last-child {
            margin-bottom: 0;
          }
        }

        ::ng-deep h1,
        ::ng-deep h2,
        ::ng-deep h3,
        ::ng-deep h4 {
          font-weight: 700;
          color: #111827;
          margin-top: 1.5rem;
          margin-bottom: 0.75rem;
          line-height: 1.3;
        }

        ::ng-deep h1 {
          font-size: 1.5rem;
        }
        ::ng-deep h2 {
          font-size: 1.375rem;
        }
        ::ng-deep h3 {
          font-size: 1.25rem;
        }
        ::ng-deep h4 {
          font-size: 1.125rem;
        }

        ::ng-deep strong,
        ::ng-deep b {
          font-weight: 700;
          color: #111827;
        }

        ::ng-deep em,
        ::ng-deep i {
          font-style: italic;
        }

        ::ng-deep ul,
        ::ng-deep ol {
          margin: 1rem 0;
          padding-left: 2rem;

          li {
            margin-bottom: 0.5rem;
            line-height: 1.65;
          }
        }

        ::ng-deep ul {
          list-style-type: disc;
        }
        ::ng-deep ol {
          list-style-type: decimal;
        }

        ::ng-deep a {
          color: #2563eb;
          text-decoration: underline;

          &:hover {
            color: #1d4ed8;
          }
        }

        ::ng-deep table {
          width: 100%;
          border-collapse: collapse;
          margin: 1.5rem 0;
          font-size: 0.9375rem;

          th {
            background: #f3f4f6;
            border: 1px solid #d1d5db;
            padding: 0.75rem;
            text-align: left;
            font-weight: 600;
            color: #111827;
          }

          td {
            border: 1px solid #e5e7eb;
            padding: 0.75rem;
            color: #374151;
          }

          tr:nth-child(even) {
            background: #f9fafb;
          }
        }

        ::ng-deep blockquote {
          margin: 1.5rem 0;
          padding: 1rem 1.5rem;
          border-left: 4px solid #3b82f6;
          background: #eff6ff;
          font-style: italic;
          color: #1e40af;
        }

        ::ng-deep code {
          font-family: 'Courier New', monospace;
          background: #f3f4f6;
          padding: 0.125rem 0.375rem;
          border-radius: 3px;
          font-size: 0.875rem;
        }

        ::ng-deep pre {
          background: #1f2937;
          color: #f3f4f6;
          padding: 1rem;
          border-radius: 6px;
          overflow-x: auto;
          margin: 1.5rem 0;

          code {
            background: transparent;
            color: inherit;
          }
        }

        @media (max-width: 768px) {
          font-size: 0.9375rem;
          line-height: 1.65;
        }
      }

      // Pied de page
      .pdf-footer {
        margin-top: 3rem;
        padding-top: 1.5rem;
      }

      .pdf-footer-line {
        height: 1px;
        background: #d1d5db;
        margin-bottom: 1rem;
      }

      .pdf-footer-content {
        display: flex;
        align-items: flex-start;
        gap: 0.75rem;
        font-size: 0.8125rem;
        line-height: 1.5;
        color: #6b7280;
        font-style: italic;

        @media (max-width: 768px) {
          font-size: 0.75rem;
        }
      }

      .pdf-footer-icon {
        width: 18px;
        height: 18px;
        stroke-width: 2;
        color: #9ca3af;
        flex-shrink: 0;
        margin-top: 1px;

        @media (max-width: 768px) {
          width: 16px;
          height: 16px;
        }
      }

      // Scroll personnalisé
      .sidebar-scroll {
        &::-webkit-scrollbar {
          width: 10px;
        }

        &::-webkit-scrollbar-track {
          background: #f3f4f6;
        }

        &::-webkit-scrollbar-thumb {
          background: #d1d5db;
          border-radius: 5px;

          &:hover {
            background: #9ca3af;
          }
        }
      }
    `,
  ],
})
export class TenderReadMoreComponent implements OnInit, OnDestroy {
  private translate = inject(TranslateService);
  private sanitizer = inject(DomSanitizer);

  @Input() label = 'shared.readmore.read_more';
  @Input() tenderId: number | null = null;
  @Input() numberText: string = '';
  @Input() datePosting: Date | null = null;
  @Input() content: string = '';
  @Input() nextTenderId: number | null = null;
  @Input() nextTenderTitle: string | null = null;
  @Output() navigateToTender = new EventEmitter<number>();

  sidebarOpen = signal(false);
  loading = signal(false);
  trustedContent: SafeHtml | null = null;
  currentLang = signal('fr');

  ngOnInit() {
    // Initialiser la langue courante
    this.currentLang.set(
      this.translate.currentLang || this.translate.defaultLang || 'fr'
    );

    // S'abonner aux changements de langue
    this.translate.onLangChange.subscribe((event) => {
      this.currentLang.set(event.lang);
    });
  }

  get tenderNumberDisplay() {
    return this.numberText || `${this.tenderId ?? ''}`;
  }

  get formattedDate(): string | null {
    if (!this.datePosting) return null;
    try {
      const d = new Date(this.datePosting);
      return new Intl.DateTimeFormat('fr-FR', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      }).format(d);
    } catch {
      return null;
    }
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
  }

  openSidebarFromExternal(tender?: {
    id?: number;
    number?: string;
    datePosting?: Date | null;
    content?: string;
  }) {
    if (tender) {
      if (typeof tender.id === 'number') this.tenderId = tender.id;
      if (typeof tender.number === 'string') this.numberText = tender.number;
      if (tender.datePosting !== undefined)
        this.datePosting = tender.datePosting ?? null;
      if (typeof tender.content === 'string') this.content = tender.content;
    }
    this.trustedContent = this.sanitizeContent(this.content ?? '');
    this.openSidebar();
  }

  private sanitizeContent(raw: string): SafeHtml {
    // return this.sanitizer.bypassSecurityTrustHtml(raw || '');
    if (!raw) return '';

    // 1️⃣ remplacer les &nbsp; par des espaces normaux
    const normalized = raw.replace(/&nbsp;/g, ' ').replace(/\u00A0/g, ' ');

    // 2️⃣ nettoyer le HTML
    const clean = DOMPurify.sanitize(normalized, {
      FORBID_ATTR: ['style'],
    });

    return this.sanitizer.bypassSecurityTrustHtml(clean);
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
      this.trustedContent = this.sanitizeContent(this.content ?? '');
      this.loading.set(false);
    }, 450);
  }

  printDocument() {
    window.print();
  }

  async shareContent() {
    const text = (this.content || '').replace(/<\/?[^>]+(>|$)/g, '');
    const shareData = {
      title: this.tenderNumberDisplay,
      text,
      url: window.location.href,
    };

    if ((navigator as any).share) {
      try {
        await (navigator as any).share(shareData);
        console.log(this.translate.instant('shared.readmore.share_success'));
      } catch (err) {
        console.warn(
          this.translate.instant('shared.readmore.share_error'),
          err
        );
      }
    } else {
      await navigator.clipboard.writeText(
        `${this.tenderNumberDisplay} - ${window.location.href}`
      );
      alert(this.translate.instant('shared.readmore.link_copied'));
    }
  }

  navigateToNextTender() {
    if (this.nextTenderId !== null) {
      this.closeSidebar();
      setTimeout(() => {
        this.navigateToTender.emit(this.nextTenderId!);
      }, 350);
    }
  }

  ngOnDestroy(): void {
    document.documentElement.classList.remove('overflow-hidden');
    document.body.classList.remove('overflow-hidden', 'readmore-open');
  }
}
