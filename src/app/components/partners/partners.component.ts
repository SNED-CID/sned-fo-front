import {Component, inject, OnInit, signal} from '@angular/core';
import {PartnerService, PartnerReadDTO} from '../../services/partner.service';
import {CommonModule} from '@angular/common';
import {DomSanitizer, SafeUrl} from '@angular/platform-browser';
import {forkJoin, map} from 'rxjs';
import {LazyImageComponent} from '../shared/lazy-image/lazy-image.component';
import {ScrollAnimationDirective} from '../../directives/scroll-animation.directive';
import {TranslateService} from '@ngx-translate/core';

interface PartnerWithLogo extends PartnerReadDTO {
  logoUrl: SafeUrl;
}

@Component({
  selector: 'app-partners',
  imports: [CommonModule, ScrollAnimationDirective],
  templateUrl: './partners.component.html',
  standalone: true,
  styleUrl: './partners.component.scss'
})
export class PartnersComponent implements OnInit{

  private service: PartnerService = inject(PartnerService);
  private sanitizer: DomSanitizer = inject(DomSanitizer);
  private translateService: TranslateService = inject(TranslateService);
  partners = signal<PartnerWithLogo[]>([]);


  ngOnInit(): void {
    this.loadPartners();

    this.translateService.onLangChange.subscribe(() => {
      this.loadPartners();
    });
  }

  private loadPartners(): void {

    const currentLang = this.translateService.getCurrentLang();
    this.service.getAllLocalizedPartners(currentLang).subscribe(partnersList => {

      const logoRequests = partnersList.map(partner =>
        this.service.getLogoByPartnerId(partner.logoUUID).pipe(
          map(blob => {
            const blobUrl = URL.createObjectURL(blob);
            return {
              ...partner,
              logoUrl: this.sanitizer.bypassSecurityTrustUrl(blobUrl)
            } as PartnerWithLogo;
          })
        )
      );

      if (logoRequests.length > 0) {
        forkJoin(logoRequests).subscribe(partnersWithLogos => {
          this.partners.set(partnersWithLogos);
        });
      }
    });
    
  }

}
