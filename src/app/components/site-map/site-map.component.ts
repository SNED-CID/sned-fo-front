import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { inject } from '@angular/core';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-site-map',
  imports: [CommonModule , TranslatePipe, RouterModule],
  templateUrl: './site-map.component.html',
  styleUrl: './site-map.component.scss'
})
export class SiteMapComponent {

  private translateService: TranslateService = inject(TranslateService);
}
