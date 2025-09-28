import { Component, Input } from '@angular/core';
import { LoaderComponent } from '../../loader/loader.component';

@Component({
  selector: 'app-deferred-section',
  standalone: true,
  imports: [LoaderComponent],
  template: `
    @defer (on viewport; prefetch on idle) {
      <div [class]="wrapperClass">
        <ng-content></ng-content>
      </div>
    } @placeholder {
      <div class="flex items-center justify-center py-20" [class]="placeholderClass">
        <div class="text-center">
          <app-loader></app-loader>
          @if (placeholderText) {
            <p class="mt-4 text-gray-500 text-sm">{{ placeholderText }}</p>
          }
        </div>
      </div>
    } @loading (minimum 300ms) {
      <div class="flex items-center justify-center py-20" [class]="loadingClass">
        <div class="text-center">
          <app-loader></app-loader>
          @if (loadingText) {
            <p class="mt-4 text-gray-500 text-sm">{{ loadingText }}</p>
          }
        </div>
      </div>
    } @error {
      <div class="flex items-center justify-center py-20 text-center text-gray-500">
        <div>
          <i class="fas fa-exclamation-triangle text-3xl mb-4 text-orange-500"></i>
          <p>Une erreur est survenue lors du chargement</p>
          <button
            (click)="retry()"
            class="mt-4 px-4 py-2 bg-[var(--sned-orange)] text-white rounded-lg hover:bg-orange-600 transition-colors">
            Réessayer
          </button>
        </div>
      </div>
    }
  `
})
export class DeferredSectionComponent {
  @Input() wrapperClass: string = '';
  @Input() placeholderClass: string = '';
  @Input() loadingClass: string = '';
  @Input() placeholderText: string = '';
  @Input() loadingText: string = 'Chargement...';

  retry() {
    // Force un nouveau rendu en rechargeant la page
    window.location.reload();
  }
}