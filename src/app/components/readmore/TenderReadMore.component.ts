import {
  Component,
  Input,
  Output,
  EventEmitter,
  HostListener,
  inject,
  OnDestroy,
  signal
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
        animate('500ms cubic-bezier(0.4, 0, 0.2, 1)', style({ transform: 'translateX(0%)' }))
      ]),
      transition(':leave', [
        animate('500ms cubic-bezier(0.4, 0, 0.2, 1)', style({ transform: 'translateX(100%)' }))
      ])
    ])
  ],
  template: `
    <!-- Overlay -->
    <div *ngIf="sidebarOpen()" class="fixed inset-0 bg-black/50" style="z-index: 9998;" (click)="closeSidebar()"></div>
    
    <!-- Sidebar -->
    <aside *ngIf="sidebarOpen()"
           @slideInOut
           class="fixed top-0 right-0 w-1/2 h-full bg-white shadow-2xl flex flex-col"
           style="z-index: 99999;">
      
      <!-- Header -->
      <div
  class="flex justify-between items-center p-6 border-b"
  style="
    background-image: linear-gradient(135deg, var(--sned-blue, #667eea) 0%, var(--sned-orange, #f59e0b) 100%);
  "
>

        <h2 class="text-2xl font-bold text-white">À propos de l'appel d'offre</h2>
        <div class="flex items-center gap-3">
          <button (click)="shareContent()" 
                  class="cursor-pointer text-white hover:text-blue-200 text-xl transition-colors" 
                  [title]="'shared.readmore.share' | translate">
            <i class="fas fa-share-alt"></i>
          </button>
          <button (click)="closeSidebar()" 
                  class="cursor-pointer text-white hover:text-blue-200 text-xl transition-colors" 
                  [title]="'shared.readmore.close' | translate">
            <i class="fas fa-times"></i>
          </button>
        </div>
      </div>
      
      <!-- Contenu -->
      <div class="flex-1 overflow-y-auto p-8 sidebar-scroll bg-gray-50" data-lenis-prevent>
        <app-loader *ngIf="loading()"></app-loader>
        
        <div *ngIf="!loading()" class="max-w-4xl mx-auto">
          <!-- Document Header Card -->
          <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
            <!-- Date alignée à gauche -->
            <div class="mb-4">
              <div class="inline-flex items-center gap-2 text-sm text-gray-600 bg-gray-100 px-3 py-1.5 rounded">
                <i class="far fa-calendar-alt"></i>
                <span *ngIf="formattedDate">{{ formattedDate }}</span>
              </div>
            </div>
            
            <!-- Numéro centré -->
            <div class="text-center mb-6 pb-4 border-b border-gray-200">
              <h2 class="text-3xl font-bold text-gray-900">{{ tenderNumberDisplay }}</h2>
            </div>
            
            <!-- Contenu avec contrôle de largeur -->
            <div class="prose prose-sm max-w-none 
                        prose-headings:text-gray-900 
                        prose-p:text-gray-700 
                        prose-p:leading-relaxed
                        prose-p:text-justify
                        prose-strong:text-gray-900
                        prose-ul:text-gray-700
                        prose-ol:text-gray-700" 
                 [innerHTML]="trustedContent"
                 style="word-wrap: break-word; overflow-wrap: break-word; max-width: 100%;">
            </div>
          </div>
        </div>
      </div>
      
      <!-- Footer -->
      <div class="border-t bg-white p-4 shadow-lg" *ngIf="nextTenderId !== null && nextTenderTitle">
        <button (click)="navigateToNextTender()" 
                class="cursor-pointer w-full flex items-center justify-between p-4 rounded-lg 
                       bg-gradient-to-r from-blue-50 to-blue-100 
                       hover:from-blue-100 hover:to-blue-200 
                       transition-all duration-200 group border border-blue-200">
          <div class="flex items-center gap-3">
            <span class="text-sm text-gray-600 font-medium">{{ 'shared.readmore.next_section' | translate }}</span>
            <span class="font-semibold text-gray-900">{{ nextTenderTitle }}</span>
          </div>
          <i class="fas fa-arrow-right text-blue-600 group-hover:translate-x-1 transition-transform duration-200"></i>
        </button>
      </div>
    </aside>
  `
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
      return new Intl.DateTimeFormat('fr-FR').format(d);
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

  openSidebarFromExternal(tender?: { id?: number; number?: string; datePosting?: Date | null; content?: string }) {
    if (tender) {
      if (typeof tender.id === 'number') this.tenderId = tender.id;
      if (typeof tender.number === 'string') this.numberText = tender.number;
      if (tender.datePosting !== undefined) this.datePosting = tender.datePosting ?? null;
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

  async shareContent() {
    const text = (this.content || '').replace(/<\/?[^>]+(>|$)/g, '');
    const shareData = {
      title: this.tenderNumberDisplay,
      text,
      url: window.location.href
    };

    if ((navigator as any).share) {
      try {
        await (navigator as any).share(shareData);
        console.log(this.translate.instant('shared.readmore.share_success'));
      } catch (err) {
        console.warn(this.translate.instant('shared.readmore.share_error'), err);
      }
    } else {
      await navigator.clipboard.writeText(`${this.tenderNumberDisplay} - ${window.location.href}`);
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
