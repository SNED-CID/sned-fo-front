import { Component, HostListener, Input, output } from '@angular/core';
import { FormsModule } from '@angular/forms';

export interface FilterCriteria {
  searchText: string;
  sortOrder: 'recent' | 'oldest';
}

@Component({
  selector: 'app-filter',
  imports: [FormsModule],
  templateUrl: './app-filter.component.html',
  styleUrls: ['./app-filter.component.scss']
})
export class AppFilterComponent {
  searchText: string = '';
  sortOrder: 'recent' | 'oldest' = 'recent';
  isSortMenuOpen = false;

  @Input() placeholder: string = "Rechercher...";
  @Input() mostRecent: string = "Plus récents";
  @Input() oldest: string = "Plus anciens";
  
  filterChange = output<FilterCriteria>();

  onFilterChange(): void {
    this.filterChange.emit({
      searchText: this.searchText,
      sortOrder: this.sortOrder
    });
  }

  toggleSortMenu(event: MouseEvent): void {
    event.stopPropagation();
    this.isSortMenuOpen = !this.isSortMenuOpen;
  }

  selectSortOrder(order: 'recent' | 'oldest'): void {
    this.sortOrder = order;
    this.isSortMenuOpen = false;
    this.onFilterChange();
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event): void {
    const target = event.target as HTMLElement;
    if (!target.closest('.sort-dropdown')) {
      this.isSortMenuOpen = false;
    }
  }
}
