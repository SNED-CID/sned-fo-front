import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-load-more-paginator',
  template: `
    @if (canLoadMore) {
    <div class="load-more-container mb-10">
      <button class="btn-load-more" (click)="onLoadNext()">
        <span>{{ label }}</span>

        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>
    </div>
    }
  `,
  styleUrl: './app-loadMore-paginator.scss',
})
export class LoadMorePaginatorComponent {
  @Input() currentPage!: number;
  @Input() totalPages!: number;
  @Input() label = 'Charger plus';

  @Output() loadNext = new EventEmitter<void>();

  onLoadNext(): void {
    this.loadNext.emit();
  }

  get canLoadMore(): boolean {
    return this.currentPage + 1 < this.totalPages;
  }
}
