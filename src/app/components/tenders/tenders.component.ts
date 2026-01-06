import { Component, inject, OnInit, signal, ViewChild } from '@angular/core';
import { TenderService, TenderReadDTO } from '../../services/tender.service';
import { CommonModule, DatePipe } from '@angular/common';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { ScrollAnimationDirective } from '../../directives/scroll-animation.directive';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { map } from 'rxjs';
import { TenderReadMoreComponent } from '../readmore/TenderReadMore.component';

@Component({
  selector: 'app-tenders',
  imports: [
    CommonModule,
    ScrollAnimationDirective,
    DatePipe,
    TenderReadMoreComponent,
    TranslatePipe,
  ],
  providers: [DatePipe],
  templateUrl: './tenders.component.html',
  standalone: true,
  styleUrl: './tenders.component.scss',
})
export class TendersComponent implements OnInit {
  private service: TenderService = inject(TenderService);
  private translateService: TranslateService = inject(TranslateService);
  tenders = signal<TenderReadDTO[]>([]);
  @ViewChild('tenderReadMore') tenderReadMore!: TenderReadMoreComponent;

  currentPage = signal(0);
  totalPages = signal(1);
  readonly PAGE_SIZE = 5;
  sortOrder = 'desc';

  searchNumber = signal<string>('');
  private searchTimeout?: any;

  constructor() {}

  ngOnInit(): void {
    this.loadNextPage();
  }

  loadNextPage(): void {
    const currentLang = this.translateService.getCurrentLang();
    const search = this.searchNumber();

    this.service
      .getAllLocalizedTenders(
        currentLang,
        search && search.length > 0 ? search : undefined,
        this.currentPage(),
        this.PAGE_SIZE,
        this.sortOrder
      )
      .subscribe((page) => {
        this.tenders.update((old) => [...old, ...page.content]);
        this.totalPages.set(page.totalPages ?? 1);
        this.currentPage.update((p) => p + 1);
      });
  }

  onSortChange(event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    this.sortOrder = selectElement.value;
    const currentLang = this.translateService.getCurrentLang();
    const search = this.searchNumber();
    this.currentPage.set(0);
    this.service
      .getAllLocalizedTenders(
        currentLang,
        search && search.length > 0 ? search : undefined,
        this.currentPage(),
        this.PAGE_SIZE,
        this.sortOrder
      )
      .subscribe((page) => {
        this.tenders.set(page.content);
        this.totalPages.set(page.totalPages ?? 1);
        // this.currentPage.set(page.number ?? 0);
        this.currentPage.update((p) => p + 1);
      });
  }

  onSearchNumber(value: string): void {
    clearTimeout(this.searchTimeout);

    this.searchTimeout = setTimeout(() => {
      const trimmed = value.trim();

      if (this.searchNumber() === trimmed) return;

      this.searchNumber.set(trimmed);
      this.resetAndReload();
    }, 300);
  }

  resetAndReload(): void {
    this.tenders.set([]);
    this.currentPage.set(0);
    this.loadNextPage();
  }

  stripHtml(html: string): string {
    return html.replace(/<[^>]*>/g, '').trim();
  }

  openTenderDetails(tender: {
    id: number;
    number: string;
    datePosting: Date | null;
    content: string;
  }) {
    this.tenderReadMore.openSidebarFromExternal(tender);
  }

  onNavigateToTender(nextId: number) {
    const el = document.getElementById(String(nextId));

    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }
}
