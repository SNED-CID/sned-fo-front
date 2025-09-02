// src/app/shared/components/loader/loader.component.ts
import { Component } from '@angular/core';

@Component({
  selector: 'app-loader',
  standalone: true,
  styleUrls: ['loader.component.scss'],
  template: `
    <div class="flex justify-center items-center h-32">
      <div class="loader__item w-10 h-10 rounded-full"></div>
    </div>
  `
})
export class LoaderComponent {}
