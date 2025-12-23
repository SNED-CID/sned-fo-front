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
      class="fixed top-0 right-0 w-1/2 h-full bg-white shadow-2xl flex flex-col"
      style="z-index: 99999;"
    >
      <!-- Header -->
      <div class="flex justify-between items-center p-4 border-b">
        <h2 class="text-2xl font-bold">{{ tenderNumberDisplay }}</h2>
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
        style="background-color: #f5f7fa;"
        data-lenis-prevent
      >
        <app-loader *ngIf="loading()"></app-loader>

        <!-- Container du document -->
        <div *ngIf="!loading()" class="document-container">
          <!-- Document principal -->
          <div class="official-document">
            <!-- Bandeau officiel -->
            <div class="official-banner">
              <div class="banner-stripe"></div>
              <div class="banner-content">
                <div class="official-seal">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" class="seal-icon">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <div class="banner-text">
                  <div class="banner-title">{{ 'tenders.official_document' | translate }}</div>
                  <div class="banner-subtitle">{{ 'tenders.public_tender' | translate }}</div>
                </div>
              </div>
            </div>

            <!-- Informations principales -->
            <div class="document-header">
              <div class="header-row">
                <div class="info-label">{{ 'tenders.reference' | translate }}</div>
                <div class="info-value">{{ tenderNumberDisplay }}</div>
              </div>
              <div class="header-row" *ngIf="formattedDate">
                <div class="info-label">{{ 'tenders.publication_date' | translate }}</div>
                <div class="info-value">{{ formattedDate }}</div>
              </div>
            </div>

            <!-- Séparateur -->
            <div class="section-divider">
              <div class="divider-line"></div>
              <div class="divider-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div class="divider-line"></div>
            </div>

            <!-- Contenu principal du document -->
            <div class="document-body">
              <div class="content-section">
                <h3 class="section-title">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" class="title-icon">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {{ 'tenders.tender_object' | translate }}
                </h3>
                <div class="content-text break-words whitespace-normal" [innerHTML]="trustedContent"></div>
              </div>
            </div>

            <!-- Note de bas de page -->
            <div class="document-footer">
              <div class="footer-notice">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" class="notice-icon">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <span>{{ 'tenders.footer_notice' | translate }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Footer -->
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
            [class]="currentLang() === 'ar' ? 'fas fa-arrow-left text-blue-600 group-hover:-translate-x-1 transition-transform duration-200' : 'fas fa-arrow-right text-blue-600 group-hover:translate-x-1 transition-transform duration-200'"
          ></i>
        </button>
      </div>
    </aside>
  `,
  styles: [
    `
      // Container principal du document
      .document-container {
        max-width: 900px;
        margin: 0 auto;
        padding: 2rem 1.5rem;

        @media (max-width: 768px) {
          padding: 1rem;
        }
      }

      // Document officiel
      .official-document {
        background: white;
        border-radius: 12px;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
        overflow: hidden;
      }

      // Bandeau officiel
      .official-banner {
        position: relative;
        background: linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%);
        padding: 2rem 2.5rem;
        color: white;

        @media (max-width: 768px) {
          padding: 1.5rem 1.25rem;
        }
      }

      .banner-stripe {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        height: 4px;
        background: linear-gradient(
          90deg,
          var(--sned-orange, #f59e0b) 0%,
          var(--sned-blue, #667eea) 50%,
          var(--sned-orange, #f59e0b) 100%
        );
      }

      .banner-content {
        display: flex;
        align-items: center;
        gap: 1.5rem;

        @media (max-width: 768px) {
          gap: 1rem;
        }
      }

      .official-seal {
        background: rgba(255, 255, 255, 0.15);
        backdrop-filter: blur(10px);
        border-radius: 12px;
        padding: 1rem;
        border: 2px solid rgba(255, 255, 255, 0.3);

        @media (max-width: 768px) {
          padding: 0.75rem;
        }
      }

      .seal-icon {
        width: 48px;
        height: 48px;
        stroke-width: 2;

        @media (max-width: 768px) {
          width: 36px;
          height: 36px;
        }
      }

      .banner-text {
        flex: 1;
      }

      .banner-title {
        font-size: 1.5rem;
        font-weight: 700;
        letter-spacing: -0.02em;
        margin-bottom: 0.25rem;

        @media (max-width: 768px) {
          font-size: 1.125rem;
        }
      }

      .banner-subtitle {
        font-size: 1rem;
        opacity: 0.95;
        font-weight: 500;

        @media (max-width: 768px) {
          font-size: 0.875rem;
        }
      }

      // En-tête du document
      .document-header {
        padding: 2rem 2.5rem;
        background: linear-gradient(to bottom, #f8fafc 0%, #ffffff 100%);
        border-bottom: 2px solid #e2e8f0;

        @media (max-width: 768px) {
          padding: 1.5rem 1.25rem;
        }
      }

      .header-row {
        display: grid;
        grid-template-columns: 180px 1fr;
        gap: 1rem;
        padding: 0.75rem 0;

        &:not(:last-child) {
          border-bottom: 1px dashed #e2e8f0;
        }

        @media (max-width: 768px) {
          grid-template-columns: 1fr;
          gap: 0.25rem;
        }
      }

      .info-label {
        font-size: 0.9375rem;
        font-weight: 600;
        color: #475569;
        display: flex;
        align-items: center;

        @media (max-width: 768px) {
          font-size: 0.875rem;
        }
      }

      .info-value {
        font-size: 1rem;
        font-weight: 700;
        color: #1e293b;
        display: flex;
        align-items: center;

        @media (max-width: 768px) {
          font-size: 0.9375rem;
        }
      }

      // Séparateur de section
      .section-divider {
        display: flex;
        align-items: center;
        gap: 1rem;
        padding: 1.5rem 2.5rem;
        background: white;

        @media (max-width: 768px) {
          padding: 1rem 1.25rem;
        }
      }

      .divider-line {
        flex: 1;
        height: 2px;
        background: linear-gradient(
          90deg,
          transparent 0%,
          #cbd5e1 50%,
          transparent 100%
        );
      }

      .divider-icon {
        background: linear-gradient(135deg, var(--sned-blue, #667eea), var(--sned-orange, #f59e0b));
        color: white;
        border-radius: 50%;
        padding: 0.5rem;
        display: flex;
        align-items: center;
        justify-content: center;

        svg {
          width: 20px;
          height: 20px;
          stroke-width: 2.5;
        }
      }

      // Corps du document
      .document-body {
        padding: 2rem 2.5rem;

        @media (max-width: 768px) {
          padding: 1.5rem 1.25rem;
        }
      }

      .content-section {
        margin-bottom: 2rem;
      }

      .section-title {
        display: flex;
        align-items: center;
        gap: 0.75rem;
        font-size: 1.25rem;
        font-weight: 700;
        color: #1e293b;
        margin: 0 0 1.5rem 0;
        padding-bottom: 0.75rem;
        border-bottom: 3px solid #e2e8f0;

        @media (max-width: 768px) {
          font-size: 1.125rem;
        }
      }

      .title-icon {
        width: 28px;
        height: 28px;
        stroke-width: 2;
        color: var(--sned-blue, #667eea);
        flex-shrink: 0;

        @media (max-width: 768px) {
          width: 24px;
          height: 24px;
        }
      }

      .content-text {
        font-size: 1rem;
        line-height: 1.8;
        color: #334155;

        ::ng-deep p {
          margin-bottom: 1rem;
          text-align: justify;

          &:last-child {
            margin-bottom: 0;
          }
        }

        ::ng-deep h1,
        ::ng-deep h2,
        ::ng-deep h3,
        ::ng-deep h4 {
          font-weight: 700;
          color: #1e293b;
          margin-top: 1.5rem;
          margin-bottom: 1rem;
          line-height: 1.3;
        }

        ::ng-deep h1 {
          font-size: 1.75rem;
        }

        ::ng-deep h2 {
          font-size: 1.5rem;
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
          color: #1e293b;
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
            line-height: 1.7;
          }
        }

        ::ng-deep ul {
          list-style-type: disc;
        }

        ::ng-deep ol {
          list-style-type: decimal;
        }

        ::ng-deep a {
          color: var(--sned-blue, #667eea);
          text-decoration: underline;
          transition: color 0.2s;

          &:hover {
            color: var(--sned-orange, #f59e0b);
          }
        }

        ::ng-deep table {
          width: 100%;
          border-collapse: collapse;
          margin: 1.5rem 0;
          font-size: 0.9375rem;

          th {
            background: #f1f5f9;
            border: 1px solid #cbd5e1;
            padding: 0.75rem;
            text-align: left;
            font-weight: 600;
            color: #1e293b;
          }

          td {
            border: 1px solid #e2e8f0;
            padding: 0.75rem;
            color: #334155;
          }

          tr:nth-child(even) {
            background: #f8fafc;
          }
        }

        ::ng-deep blockquote {
          margin: 1.5rem 0;
          padding: 1rem 1.5rem;
          border-left: 4px solid var(--sned-orange, #f59e0b);
          background: #fef3c7;
          font-style: italic;
          color: #78350f;
        }

        ::ng-deep code {
          font-family: 'Courier New', monospace;
          background: #f1f5f9;
          padding: 0.125rem 0.375rem;
          border-radius: 4px;
          font-size: 0.875rem;
        }

        ::ng-deep pre {
          background: #1e293b;
          color: #e2e8f0;
          padding: 1rem;
          border-radius: 8px;
          overflow-x: auto;
          margin: 1.5rem 0;

          code {
            background: transparent;
            color: inherit;
          }
        }

        @media (max-width: 768px) {
          font-size: 0.9375rem;
        }
      }

      // Pied de document
      .document-footer {
        padding: 1.5rem 2.5rem;
        background: linear-gradient(to top, #fffbeb 0%, #ffffff 100%);
        border-top: 2px solid #fde68a;

        @media (max-width: 768px) {
          padding: 1.25rem 1.25rem;
        }
      }

      .footer-notice {
        display: flex;
        align-items: flex-start;
        gap: 1rem;
        padding: 1rem;
        background: white;
        border: 2px solid #fbbf24;
        border-radius: 8px;
        font-size: 0.875rem;
        line-height: 1.6;
        color: #92400e;

        @media (max-width: 768px) {
          font-size: 0.8125rem;
          padding: 0.875rem;
        }
      }

      .notice-icon {
        width: 24px;
        height: 24px;
        stroke-width: 2;
        color: #f59e0b;
        flex-shrink: 0;
        margin-top: 2px;

        @media (max-width: 768px) {
          width: 20px;
          height: 20px;
        }
      }

      // Scroll personnalisé
      .sidebar-scroll {
        &::-webkit-scrollbar {
          width: 10px;
        }

        &::-webkit-scrollbar-track {
          background: #f1f5f9;
        }

        &::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 5px;

          &:hover {
            background: #94a3b8;
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
    this.currentLang.set(this.translate.currentLang || this.translate.defaultLang || 'fr');

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
    return this.sanitizer.bypassSecurityTrustHtml(raw || '');
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
