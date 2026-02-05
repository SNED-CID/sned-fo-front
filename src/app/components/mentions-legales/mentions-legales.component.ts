import { Component } from '@angular/core';
import { inject, OnInit, signal } from '@angular/core';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-mentions-legales',
  imports: [TranslatePipe],
  templateUrl: './mentions-legales.component.html',
  styleUrl: './mentions-legales.component.scss'
})
export class MentionsLegalesComponent {
  
  private translateService: TranslateService = inject(TranslateService);

}
