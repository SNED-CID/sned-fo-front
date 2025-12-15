import {
  Component,
  Input,
  Output,
  EventEmitter,
  HostListener,
  inject,
  OnDestroy,
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
      class="fixed top-0 right-0 w-[60%] max-w-[900px] h-full bg-gray-600 shadow-2xl flex flex-col"
      style="z-index: 99999;"
    >
      <!-- Header -->
      <div
        class="flex justify-between items-center p-6 border-b border-gray-300"
        style="background-image: linear-gradient(135deg, var(--sned-blue, #667eea) 0%, var(--sned-orange, #f59e0b) 100%);"
      >
        <h2 class="text-2xl font-bold text-white">
          À propos de l'appel d'offre
        </h2>
        <div class="flex items-center gap-3">
          <button
            (click)="shareContent()"
            class="cursor-pointer text-white hover:text-blue-200 text-xl transition-colors"
            [title]="'shared.readmore.share' | translate"
          >
            <i class="fas fa-share-alt"></i>
          </button>
          <button
            (click)="closeSidebar()"
            class="cursor-pointer text-white hover:text-blue-200 text-xl transition-colors"
            [title]="'shared.readmore.close' | translate"
          >
            <i class="fas fa-times"></i>
          </button>
        </div>
      </div>

      <!-- Contenu avec scroll -->
      <div
        class="flex-1 overflow-y-auto p-2 sidebar-scroll"
        style="background-color: #525659;"
        data-lenis-prevent
      >
        <app-loader *ngIf="loading()"></app-loader>

        <!-- Container de pages PDF -->
        <div *ngIf="!loading()" class="pdf-document-container">
          <!-- Page PDF -->
          <div class="pdf-page">
            <!-- En-tête de page -->
            <div class="pdf-page-header">
              <span>Appel d'Offre - Document Officiel</span>
              <span *ngIf="formattedDate" class="pdf-date">{{
                formattedDate
              }}</span>
            </div>

            <!-- Contenu principal -->
            <div class="pdf-page-content">
              <!-- Numéro du document -->
              <div class="pdf-title-section">
                <h1 class="pdf-main-title">{{ tenderNumberDisplay }}</h1>
              </div>

              <!-- Contenu formaté -->
              <div class="pdf-text-content" [innerHTML]="trustedContent"></div>
            </div>

            <!-- Pied de page -->
            <div class="pdf-page-footer">
              <span class="pdf-page-number">Page 1</span>
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
            class="fas fa-arrow-right text-blue-600 group-hover:translate-x-1 transition-transform duration-200"
          ></i>
        </button>
      </div>
    </aside>
  `,
  styles: [
    `
      // Container principal du document PDF
      .pdf-document-container {
        max-width: 1000px;
        margin: 0 auto;
        padding: 20px 0;
      }

      // Style de page A4
      .pdf-page {
        width: 100%;
        max-width: 820px;
        min-height: auto;
        margin: 10mm auto;
        padding: 20mm;
        background: white;
        box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
        position: relative;
        font-family: 'Times New Roman', Times, serif;
        color: #1a1a1a;
        line-height: 1.6;
        overflow-wrap: break-word;
        word-wrap: break-word;

        @media (max-width: 1024px) {
          width: 100%;
          min-height: auto;
          margin: 0;
          box-shadow: 0 0 5px rgba(0, 0, 0, 0.2);
        }
      }

      // En-tête de page
      .pdf-page-header {
        position: absolute;
        top: 10mm;
        left: 20mm;
        right: 20mm;
        padding-bottom: 5mm;
        border-bottom: 1pt solid #cccccc;
        font-size: 10pt;
        color: #666;
        display: flex;
        justify-content: space-between;
        align-items: center;

        .pdf-date {
          font-style: italic;
        }
      }

      // Pied de page
      .pdf-page-footer {
        position: absolute;
        bottom: 10mm;
        left: 20mm;
        right: 20mm;
        padding-top: 5mm;
        border-top: 1pt solid #cccccc;
        font-size: 10pt;
        color: #666;
        text-align: center;

        .pdf-page-number {
          font-weight: 500;
        }
      }

      // Contenu principal de la page
      .pdf-page-content {
        padding-top: 20mm;
        padding-bottom: 20mm;
        min-height: calc(297mm - 40mm - 30mm);
      }

      // Section titre principal
      .pdf-title-section {
        text-align: center;
        margin-bottom: 20pt;
        padding-bottom: 15pt;
        border-bottom: 2pt solid #2c2c2c;
      }

      .pdf-main-title {
        font-size: 24pt;
        font-weight: bold;
        color: #1a1a1a;
        margin: 0;
        letter-spacing: 0.5pt;
      }

      // Contenu texte avec styles PDF
      .pdf-text-content {
        font-size: 12pt;
        color: #1a1a1a;
        word-wrap: break-word;
        overflow-wrap: break-word;
        word-break: break-word;
        hyphens: auto;

        // Titres
        ::ng-deep h1 {
          font-size: 20pt;
          font-weight: bold;
          margin-top: 18pt;
          margin-bottom: 12pt;
          color: #1a1a1a;
          page-break-after: avoid;
          word-wrap: break-word;
          overflow-wrap: break-word;
        }

        ::ng-deep h2 {
          font-size: 16pt;
          font-weight: bold;
          margin-top: 16pt;
          margin-bottom: 10pt;
          color: #2c2c2c;
          page-break-after: avoid;
          word-wrap: break-word;
          overflow-wrap: break-word;
        }

        ::ng-deep h3 {
          font-size: 14pt;
          font-weight: bold;
          margin-top: 12pt;
          margin-bottom: 8pt;
          color: #3c3c3c;
          page-break-after: avoid;
          word-wrap: break-word;
          overflow-wrap: break-word;
        }

        ::ng-deep h4,
        ::ng-deep h5,
        ::ng-deep h6 {
          font-size: 12pt;
          font-weight: bold;
          margin-top: 10pt;
          margin-bottom: 6pt;
          color: #4c4c4c;
          word-wrap: break-word;
          overflow-wrap: break-word;
        }

        // Paragraphes
        ::ng-deep p {
          font-size: 12pt;
          text-align: justify;
          margin-bottom: 10pt;
          line-height: 1.6;
          color: #1a1a1a;
          orphans: 2;
          widows: 2;
          word-wrap: break-word;
          overflow-wrap: break-word;
          word-break: break-word;
          hyphens: auto;
        }

        // Texte en gras
        ::ng-deep strong,
        ::ng-deep b {
          font-weight: bold;
          color: #000;
        }

        // Texte en italique
        ::ng-deep em,
        ::ng-deep i {
          font-style: italic;
        }

        // Listes
        ::ng-deep ul,
        ::ng-deep ol {
          margin-left: 20pt;
          margin-bottom: 10pt;
          padding-left: 10pt;

          li {
            font-size: 12pt;
            margin-bottom: 5pt;
            line-height: 1.5;
            word-wrap: break-word;
            overflow-wrap: break-word;
            word-break: break-word;
          }
        }

        ::ng-deep ul {
          list-style-type: disc;

          ul {
            list-style-type: circle;

            ul {
              list-style-type: square;
            }
          }
        }

        ::ng-deep ol {
          list-style-type: decimal;

          ol {
            list-style-type: lower-alpha;

            ol {
              list-style-type: lower-roman;
            }
          }
        }

        // Tableaux
        ::ng-deep table {
          width: 100%;
          border-collapse: collapse;
          margin: 12pt 0;
          font-size: 11pt;
          page-break-inside: avoid;

          th {
            background: #f0f0f0;
            border: 1pt solid #666;
            padding: 8pt;
            text-align: left;
            font-weight: bold;
            color: #1a1a1a;
          }

          td {
            border: 1pt solid #999;
            padding: 6pt;
            color: #1a1a1a;
            word-wrap: break-word;
            overflow-wrap: break-word;
          }

          tr:nth-child(even) {
            background: #fafafa;
          }
        }

        // Code et préformaté
        ::ng-deep code {
          font-family: 'Courier New', Courier, monospace;
          background: #f5f5f5;
          padding: 2pt 4pt;
          font-size: 11pt;
          border: 1pt solid #ddd;
          border-radius: 2pt;
        }

        ::ng-deep pre {
          font-family: 'Courier New', Courier, monospace;
          background: #f5f5f5;
          padding: 10pt;
          margin: 10pt 0;
          border: 1pt solid #ddd;
          border-radius: 2pt;
          overflow-x: auto;
          font-size: 10pt;
          line-height: 1.4;

          code {
            background: transparent;
            border: none;
            padding: 0;
          }
        }

        // Citations
        ::ng-deep blockquote {
          margin: 12pt 20pt;
          padding: 10pt 15pt;
          border-left: 3pt solid #ccc;
          background: #f9f9f9;
          font-style: italic;
          color: #4c4c4c;
          word-wrap: break-word;
          overflow-wrap: break-word;
        }

        // Liens
        ::ng-deep a {
          color: #0066cc;
          text-decoration: underline;

          &:hover {
            color: #0052a3;
          }
        }

        // Images
        ::ng-deep img {
          max-width: 100%;
          height: auto;
          display: block;
          margin: 12pt auto;
          page-break-inside: avoid;
        }

        // Lignes horizontales
        ::ng-deep hr {
          border: none;
          border-top: 1pt solid #ccc;
          margin: 15pt 0;
        }

        // Espacement et gestion des sauts de page
        ::ng-deep * {
          max-width: 100%;
          word-wrap: break-word;
          overflow-wrap: break-word;
        }

        // Pour les URLs et liens longs
        ::ng-deep a[href] {
          word-break: break-all;
        }
      }

      // Scroll personnalisé pour la sidebar
      .sidebar-scroll {
        &::-webkit-scrollbar {
          width: 8px;
        }

        &::-webkit-scrollbar-track {
          background: rgba(0, 0, 0, 0.1);
        }

        &::-webkit-scrollbar-thumb {
          background: rgba(0, 0, 0, 0.3);
          border-radius: 4px;

          &:hover {
            background: rgba(0, 0, 0, 0.5);
          }
        }
      }

      // Styles pour l'impression
      @media print {
        .pdf-document-container {
          padding: 0;
        }

        .pdf-page {
          margin: 0;
          box-shadow: none;
          page-break-after: always;

          &:last-child {
            page-break-after: auto;
          }
        }

        .pdf-page-header,
        .pdf-page-footer {
          position: fixed;
        }

        .pdf-page-header {
          top: 0;
        }

        .pdf-page-footer {
          bottom: 0;
        }
      }
    `,
  ],
})
export class TenderReadMoreComponent implements OnDestroy {
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
