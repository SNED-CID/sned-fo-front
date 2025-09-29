import { Component, Input, signal, OnInit } from '@angular/core';
import { LoaderComponent } from '../../loader/loader.component';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-lazy-image',
  standalone: true,
  imports: [LoaderComponent, TranslatePipe],
  template: `
    <div class="relative inline-block" [style.width]="width" [style.height]="height">
      @defer (on viewport) {
        <img
          [src]="src"
          [alt]="alt"
          [class]="imageClass"
          (load)="onImageLoad()"
          (error)="onImageError()"
          [style.display]="isLoaded() ? 'block' : 'none'"
        />
      } @placeholder {
        <div class="flex items-center justify-center w-full h-full bg-gray-100 rounded-lg animate-pulse">
          <div class="w-8 h-8">
            <app-loader></app-loader>
          </div>
        </div>
      } @loading {
        <div class="flex items-center justify-center w-full h-full bg-gray-100 rounded-lg">
          <div class="w-8 h-8">
            <app-loader></app-loader>
          </div>
        </div>
      } @error {
        <div class="flex items-center justify-center w-full h-full bg-gray-200 rounded-lg text-gray-500">
          <div class="text-center">
            <i class="fas fa-image text-2xl mb-2"></i>
            <p class="text-sm">{{ 'shared.lazy_image.image_unavailable' | translate }}</p>
          </div>
        </div>
      }

      <!-- Overlay loader pendant le chargement de l'image -->
      @if (!isLoaded() && !hasError()) {
        <div class="absolute inset-0 flex items-center justify-center bg-gray-100 rounded-lg">
          <div class="w-6 h-6">
            <app-loader></app-loader>
          </div>
        </div>
      }
    </div>
  `,
  styles: [`
    :host {
      display: inline-block;
    }

    img {
      transition: opacity 0.3s ease-in-out;
    }

    .animate-pulse {
      animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
    }

    @keyframes pulse {
      0%, 100% {
        opacity: 1;
      }
      50% {
        opacity: .5;
      }
    }
  `]
})
export class LazyImageComponent implements OnInit {
  @Input({ required: true }) src!: string;
  @Input() alt: string = '';
  @Input() imageClass: string = '';
  @Input() width: string = 'auto';
  @Input() height: string = 'auto';
  @Input() priority: boolean = false; // Pour les images importantes (logo, hero)

  isLoaded = signal(false);
  hasError = signal(false);

  ngOnInit() {
    // Si priorité haute, précharger l'image
    if (this.priority) {
      this.preloadImage();
    }
  }

  private preloadImage() {
    const img = new Image();
    img.onload = () => this.onImageLoad();
    img.onerror = () => this.onImageError();
    img.src = this.src;
  }

  onImageLoad() {
    this.isLoaded.set(true);
    this.hasError.set(false);
  }

  onImageError() {
    this.isLoaded.set(false);
    this.hasError.set(true);
  }
}
