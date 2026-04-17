import { Component, ElementRef, ViewChild, inject, OnInit, signal } from '@angular/core';
import { PartnerService, PartnerReadDTO } from '../../services/partner.service';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { forkJoin, map } from 'rxjs';
import { ScrollAnimationDirective } from '../../directives/scroll-animation.directive';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';

interface PartnerWithLogo extends PartnerReadDTO {
  logoUrl: SafeUrl;
}

interface PocCorporateImage {
  title: string;
  imageUrl: string;
}

@Component({
  selector: 'app-partners',
  imports: [
    CommonModule,
    ScrollAnimationDirective,
    TranslatePipe,
  ],
  templateUrl: './partners.component.html',
  standalone: true,
  styleUrl: './partners.component.scss',
})
export class PartnersComponent implements OnInit {
  private service: PartnerService = inject(PartnerService);
  private sanitizer: DomSanitizer = inject(DomSanitizer);
  private translateService: TranslateService = inject(TranslateService);
  partners = signal<PartnerWithLogo[]>([]);
  trackTransform = signal('translateX(0px)');
  trackTransition = signal('transform 500ms ease-out');

  @ViewChild('partnersViewport')
  partnersViewport?: ElementRef<HTMLDivElement>;

  @ViewChild('partnersTrack')
  partnersTrack?: ElementRef<HTMLDivElement>;
  pocCorporateImages: PocCorporateImage[] = [
    {
      title: 'Global Infrastructure Team',
      imageUrl:
        'https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=1000&q=70',
    },
    {
      title: 'Engineering Collaboration',
      imageUrl:
        'https://images.unsplash.com/photo-1521791136064-7986c2920216?auto=format&fit=crop&w=1000&q=70',
    },
    {
      title: 'Corporate Board Room',
      imageUrl:
        'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=1000&q=70',
    },
    {
      title: 'Project Planning Office',
      imageUrl:
        'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1000&q=70',
    },
    {
      title: 'Business Meeting',
      imageUrl:
        'https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&w=1000&q=70',
    },
    {
      title: 'Transport Logistics Team',
      imageUrl:
        'https://images.unsplash.com/photo-1560179707-f14e90ef3623?auto=format&fit=crop&w=1000&q=70',
    },
    {
      title: 'International Partnership',
      imageUrl:
        'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=1000&q=70',
    },
    {
      title: 'Construction Management',
      imageUrl:
        'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=1000&q=70',
    },
  ];

  ngOnInit(): void {
    this.loadPartners();

    this.translateService.onLangChange.subscribe(() => {
      this.loadPartners();
    });
  }

  private loadPartners(): void {
    const currentLang = this.translateService.getCurrentLang();
    this.service
      .getAllLocalizedPartners(currentLang)
      .subscribe((partnersList) => {
        console.log('Fetched partners:', partnersList);
        const logoRequests = partnersList.map((partner) =>
          this.service.getLogoByPartnerId(partner.logoUUID).pipe(
            map((blob) => {
              const blobUrl = URL.createObjectURL(blob);
              return {
                ...partner,
                logoUrl: this.sanitizer.bypassSecurityTrustUrl(blobUrl),
              } as PartnerWithLogo;
            })
          )
        );

        if (logoRequests.length > 0) {
          forkJoin(logoRequests).subscribe((partnersWithLogos) => {
            this.partners.set(partnersWithLogos);
          });
        } else {
          this.partners.set([]);
        }
      }, () => {
        this.partners.set([]);
      });
  }

  private normalizeUrl(url: string): string | null {
    let formattedUrl = url.trim();

    // Ajouter le protocole si absent
    if (!/^https?:\/\//i.test(formattedUrl)) {
      formattedUrl = 'https://' + formattedUrl;
    }

    try {
      // Validation réelle de l’URL
      new URL(formattedUrl);
      return formattedUrl;
    } catch {
      return null;
    }
  }

  openPartnerUrl(url?: string): void {
    if (!url) {
      console.warn('URL partenaire absente');
      return;
    }

    const normalizedUrl = this.normalizeUrl(url);

    if (!normalizedUrl) {
      console.error('URL partenaire invalide :', url);
      return;
    }

    window.open(normalizedUrl, '_blank', 'noopener,noreferrer');
  }

  onPartnersHoverStart(): void {
    const viewportEl = this.partnersViewport?.nativeElement;
    const trackEl = this.partnersTrack?.nativeElement;

    if (!viewportEl || !trackEl) {
      return;
    }

    const maxShift = Math.max(0, trackEl.scrollWidth - viewportEl.clientWidth);
    if (maxShift <= 0) {
      return;
    }

    const durationSeconds = Math.max(8, Math.min(24, maxShift / 90));
    this.trackTransition.set(`transform ${durationSeconds}s linear`);
    this.trackTransform.set(`translateX(-${maxShift}px)`);
  }

  onPartnersHoverEnd(): void {
    this.trackTransition.set('transform 550ms ease-out');
    this.trackTransform.set('translateX(0px)');
  }
}
