import { Component, OnInit, inject, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { CareerService, CareerReadDTO } from '../../services/career.service';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import DOMPurify from 'dompurify';

@Component({
  selector: 'app-career',
  standalone: true,
  imports: [CommonModule, TranslatePipe],
  template: `
    <div class="w-full">
      <!-- Date en haut à droite -->
      <div class="flex justify-end mb-6">
        <time
          class="inline-flex items-center gap-2 px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-600 text-sm font-medium md:text-xs md:px-3.5 md:py-1.5"
        >
          <svg
            class="w-4 h-4 text-orange-500 md:w-3.5 md:h-3.5"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
          >
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
            <line x1="16" y1="2" x2="16" y2="6" stroke-linecap="round" />
            <line x1="8" y1="2" x2="8" y2="6" stroke-linecap="round" />
            <line x1="3" y1="10" x2="21" y2="10" />
          </svg>
          <span
            >{{ 'careers.last_updated_on' | translate }}
            {{ career?.datePosting | date : 'dd/MM/yyyy' }}</span
          >
        </time>
      </div>

      <!-- Contenu -->
      <div
        class="text-base lg:text-lg text-gray-700 leading-relaxed whitespace-pre-wrap"
        [innerHTML]="sanitizedContent"
      ></div>
    </div>
  `,
})
export class CareerComponent implements OnInit {
  private translateService: TranslateService = inject(TranslateService);
  private sanitizer: DomSanitizer = inject(DomSanitizer);

  career: CareerReadDTO | null = null;
  sanitizedContent: SafeHtml = '';

  constructor(private careerService: CareerService) {}

  ngOnInit(): void {
    this.fetchCareer();
    this.translateService.onLangChange.subscribe(() => {
      this.fetchCareer();
    });
  }

  fetchCareer() {
    const currentLang = this.translateService.getCurrentLang();
    this.careerService.getCareer(currentLang).subscribe({
      next: (career) => {
        this.career = career;
        this.sanitizedContent = this.sanitizeContent(career?.content || '');
      },
      error: (err) => console.error(err),
    });
  }

  private sanitizeContent(raw: string): SafeHtml {
    if (!raw) return '';

    // Remplacer les &nbsp; par des espaces normaux
    const normalized = raw.replace(/&nbsp;/g, ' ').replace(/\u00A0/g, ' ');

    // Nettoyer le HTML
    const clean = DOMPurify.sanitize(normalized, {
      FORBID_ATTR: ['style'],
    });

    return this.sanitizer.bypassSecurityTrustHtml(clean);
  }
}
