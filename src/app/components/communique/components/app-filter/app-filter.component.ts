import { Component, output } from '@angular/core';
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
  
  filterChange = output<FilterCriteria>();

  onFilterChange(): void {
    this.filterChange.emit({
      searchText: this.searchText,
      sortOrder: this.sortOrder
    });
}
}
