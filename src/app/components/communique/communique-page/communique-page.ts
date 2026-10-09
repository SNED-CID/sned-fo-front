import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { catchError, debounceTime, EMPTY, Subject, switchMap } from 'rxjs';
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
  private destroyRef = inject(DestroyRef);

  // Chaque émission déclenche un chargement ; switchMap annule la requête précédente
  private fetchTrigger$ = new Subject<void>();
  // Saisies du filtre, regroupées par debounce avant de lancer la recherche
  private filterChange$ = new Subject<FilterCriteria>();

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
    this.fetchTrigger$
      .pipe(
        switchMap(() =>
          this.communiqueService
            .getFilteredCommunique(this.currentFilter, this.currentPage, this.rows)
            .pipe(
              catchError((err: any) => {
                console.error('HTTP error', err);
                return EMPTY;
              }),
            ),
        ),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe((data: any) => {
        this.filteredCommuniques = data.content ?? [];
        this.totalPages = data.totalPages ?? 0;
      });

    this.filterChange$
      .pipe(debounceTime(300), takeUntilDestroyed(this.destroyRef))
      .subscribe((event) => this.applyFilter(event));

    this.translateService.onLangChange
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        this.fetchCommuniques();
      });

    this.fetchCommuniques();
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

    this.fetchTrigger$.next();
  }

  onFilter(event: FilterCriteria) {
    this.filterChange$.next(event);
  }

  private applyFilter(event: FilterCriteria) {
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
