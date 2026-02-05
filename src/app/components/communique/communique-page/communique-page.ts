import { Component, inject, OnInit } from '@angular/core';
import { CommuniqueList } from '../components/communique-list/communique-list';
import { LoadMorePaginatorComponent } from '../components/app-loadMore-paginator/app-loadMore-paginator';
import {
  AppFilterComponent,
  FilterCriteria,
} from '../components/app-filter/app-filter.component';
import {
  CommuniqueService,
  CommuniqueFilterClass,
  CommuniqueReadDTO,
  SortDirection,
} from '../../../services/communique.service';
import { TranslateService, TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-communique-page',
  imports: [
    CommuniqueList,
    AppFilterComponent,
    LoadMorePaginatorComponent,
    TranslatePipe,
  ],
  templateUrl: './communique-page.html',
  styleUrl: './communique-page.scss',
})
export class CommuniquePage implements OnInit {
  private translateService: TranslateService = inject(TranslateService);

  filteredCommuniques: CommuniqueReadDTO[] = [];

  currentCommuniqueId: number | null = null;

  visible: boolean = false;

  confirmVisible: boolean = false;

  toDelete: CommuniqueReadDTO = {} as CommuniqueReadDTO;

  currentPage: number = 0; // page actuelle
  rows: number = 5; // nombre de lignes par page
  totalPages: number = 0; // total des communiqués , recuperer dans le backend
  currentFilter: CommuniqueFilterClass = {}; // filtre actif pour garder le filtre si je change la page

  isPublishing = false;

  constructor(private communiqueService: CommuniqueService) {}

  ngOnInit(): void {
    this.fetchCommuniques();
    this.translateService.onLangChange.subscribe(() => {
      this.fetchCommuniques();
    });
  }

  fetchCommuniques(options?: {
    filter?: CommuniqueFilterClass;
    page?: number;
    size?: number;
  }) {
    const currentLang = this.translateService.getCurrentLang();
    this.currentFilter = options?.filter
      ? { ...options?.filter, lang: currentLang }
      : { ...this.currentFilter, lang: currentLang };
    this.currentPage = options?.page ?? this.currentPage;
    this.rows = options?.size ?? this.rows;

    this.communiqueService
      .getFilteredCommunique(this.currentFilter, this.currentPage, this.rows)
      .subscribe({
        next: (data: any) => {
          this.filteredCommuniques = data.content ?? [];
          this.totalPages = data.totalPages ?? 0;
        },
        error: (err: any) => console.error('HTTP error', err),
      });
  }

  onFilter(event: FilterCriteria) {
    const filter: CommuniqueFilterClass = {
      title: event.searchText,
      sortDirection:
        event.sortOrder === 'oldest' ? SortDirection.ASC : SortDirection.DESC,
    };

    this.currentPage = 0;

    this.fetchCommuniques({ filter, page: 0, size: this.rows });
  }

  onPageChange(event: any) {
    this.fetchCommuniques({
      filter: this.currentFilter,
      page: event.page,
      size: event.rows,
    });
  }

  showDialog() {
    this.visible = true;
  }

  handleClose() {
    this.visible = false;
    this.currentCommuniqueId = null;
    this.fetchCommuniques({
      filter: this.currentFilter,
      page: this.currentPage,
    });
  }
}
