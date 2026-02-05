import { Component, Input, output } from '@angular/core';
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
}
