import { Component, inject, OnInit, signal, ViewChild } from '@angular/core';
import { TenderService, TenderReadDTO } from '../../services/tender.service';
import { CommonModule, DatePipe } from '@angular/common';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { ScrollAnimationDirective } from '../../directives/scroll-animation.directive';
import { TranslateService } from '@ngx-translate/core';
import { map } from 'rxjs';
import { TenderReadMoreComponent } from '../readmore/TenderReadMore.component';

@Component({
  selector: 'app-tenders',
  imports: [
    CommonModule,
    ScrollAnimationDirective,
    DatePipe,
    TenderReadMoreComponent,
  ],
  providers: [DatePipe],
  templateUrl: './tenders.component.html',
  styleUrl: './tenders.component.scss',
})
export class TendersComponent implements OnInit {
  private service: TenderService = inject(TenderService);
  private translateService: TranslateService = inject(TranslateService);
  tenders = signal<TenderReadDTO[]>([]);

  // Pagination
  currentPage = signal(0);
  pageSize = 5;
  totalPages = signal(0);
  totalElements = signal(0);

  @ViewChild('tenderReadMore') tenderReadMore!: TenderReadMoreComponent;

  constructor(private datePipe: DatePipe) {}

  ngOnInit(): void {
    this.loadTenders();

    this.translateService.onLangChange.subscribe(() => {
      this.loadTenders();
    });
  }

  private loadTenders(): void {
    const currentLang = this.translateService.getCurrentLang();
    this.currentPage.set(0);

    this.service
      .getAllLocalizedTenders(currentLang, 0, this.pageSize)

      .subscribe((tendersList) => {
        this.tenders.set(tendersList.content);
        console.log(tendersList);
        this.totalPages.set(tendersList.totalPages || 0);
        this.totalElements.set(tendersList.totalElements || 0);
      });
  }

  loadMore(): void {
  const nextPage = this.currentPage() + 1;
  const currentLang = this.translateService.getCurrentLang();

  this.service
    .getAllLocalizedTenders(currentLang, nextPage, this.pageSize)
    .subscribe(page => {
      this.tenders.update(existing =>
        [...existing, ...page.content]
      );
      this.currentPage.set(nextPage);
    });
}


  goToPage(page: number): void {
    if (page < 0 || page >= this.totalPages()) {
      return;
    }

    this.currentPage.set(page);
    this.loadTenders();
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
