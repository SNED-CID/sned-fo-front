import {Component, inject, OnInit, signal, ViewChild} from '@angular/core';
import {TenderService, TenderReadDTO} from '../../services/tender.service';
import {CommonModule, DatePipe} from '@angular/common';
import {DomSanitizer, SafeUrl} from '@angular/platform-browser';
import {ScrollAnimationDirective} from '../../directives/scroll-animation.directive';
import {TranslatePipe, TranslateService} from '@ngx-translate/core';
import { map } from 'rxjs';
import { TenderReadMoreComponent } from '../readmore/TenderReadMore.component';

@Component({
  selector: 'app-tenders',
  imports: [CommonModule, ScrollAnimationDirective, DatePipe, TenderReadMoreComponent, TranslatePipe],
  providers: [DatePipe],
  templateUrl: './tenders.component.html',
  standalone: true,
  styleUrl: './tenders.component.scss'
})
export class TendersComponent implements OnInit{
  private service: TenderService = inject(TenderService);
  private translateService: TranslateService = inject(TranslateService);
  tenders = signal<TenderReadDTO[]>([]);
  @ViewChild('tenderReadMore') tenderReadMore!: TenderReadMoreComponent;



  constructor(private datePipe: DatePipe) {}

  ngOnInit(): void {
    this.loadTenders();
    this.translateService.onLangChange.subscribe(() => {
      this.loadTenders();
    });
  }

  private loadTenders(): void {

      const currentLang = this.translateService.getCurrentLang();

      this.service.getAllLocalizedTenders(currentLang)
        .subscribe(tendersList => {
          this.tenders.set(tendersList);
        });

  }

  stripHtml(html: string): string {
    return html.replace(/<[^>]*>/g, '').trim();
  }

  openTenderDetails(tender: { id: number; number: string; datePosting: Date | null; content: string }) {

    this.tenderReadMore.openSidebarFromExternal(tender);

  }

  onNavigateToTender(nextId: number) {

    const el = document.getElementById(String(nextId));

    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });

  }



}
