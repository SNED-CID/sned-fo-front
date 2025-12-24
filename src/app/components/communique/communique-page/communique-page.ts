import { Component, inject, OnInit } from '@angular/core';
import { CommuniqueList } from '../components/communique-list/communique-list';
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
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-communique-page',
  imports: [CommuniqueList, AppFilterComponent],
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
  totalRecords: number = 0; // total des communiqués , recuperer dans le backend
  currentFilter: CommuniqueFilterClass = {}; // filtre actif pour garder le filtre si je change la page

  isPublishing = false;

  constructor(private communiqueService: CommuniqueService) {}

  ngOnInit(): void {
    this.fetchCommuniques();
  }

  fetchCommuniques(
    filter: CommuniqueFilterClass = this.currentFilter,
    page: number = this.currentPage,
    size: number = this.rows
  ) {
    const currentLang = this.translateService.getCurrentLang();
    this.currentFilter = { ...filter, lang: currentLang };
    this.currentPage = page;
    this.rows = size;

    this.communiqueService
      .getFilteredCommunique(this.currentFilter, this.currentPage, this.rows)
      .subscribe({
        next: (data: any) => {
          this.filteredCommuniques = data.content ?? [];
          this.totalRecords = data.page?.totalElements ?? 0;
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

    this.fetchCommuniques(filter, 0, this.rows);
  }

  onPageChange(event: any) {
    this.fetchCommuniques(this.currentFilter, event.page, event.rows);
  }

  showDialog() {
    this.visible = true;
  }

  handleClose() {
    this.visible = false;
    this.currentCommuniqueId = null;
    this.fetchCommuniques(this.currentFilter, this.currentPage);
  }
}
