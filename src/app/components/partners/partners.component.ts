import {
  AfterViewInit,
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
  inject,
  signal,
} from '@angular/core';
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
  standalone: true,
  imports: [
    CommonModule,
    ScrollAnimationDirective,
    TranslatePipe,
  ],
  templateUrl: './partners.component.html',
  styleUrls: ['./partners.component.scss'],
})
export class PartnersComponent implements OnInit, AfterViewInit, OnDestroy {
  private service: PartnerService = inject(PartnerService);
  private sanitizer: DomSanitizer = inject(DomSanitizer);
  private translateService: TranslateService = inject(TranslateService);

  partners = signal<PartnerWithLogo[]>([]);

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

  @ViewChild('partnersViewport')
  partnersViewport?: ElementRef<HTMLDivElement>;

  @ViewChild('partnersTrack')
  partnersTrack?: ElementRef<HTMLDivElement>;

  isDragging = signal(false);

  private animationFrameId: number | null = null;
  private lastFrameTime = 0;
  private currentOffset = 0;
  private singleSetWidth = 0;
  private readonly autoSpeedPxPerSec = 60;

  private isHovered = false;
  private pointerDown = false;
  private dragMoved = false;
  private dragStartX = 0;
  private dragStartOffset = 0;

  ngOnInit(): void {
    this.loadPartners();

    this.translateService.onLangChange.subscribe(() => {
      this.loadPartners();
    });
  }

  ngAfterViewInit(): void {
    this.measureTrack();
    this.startAutoScroll();
  }

  ngOnDestroy(): void {
    if (this.animationFrameId !== null) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
  }

  private loadPartners(): void {
    const currentLang = this.translateService.getCurrentLang();
    this.service.getAllLocalizedPartners(currentLang).subscribe((partnersList) => {
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
          requestAnimationFrame(() => this.measureTrack());
        });
      } else {
        this.partners.set([]);
        requestAnimationFrame(() => this.measureTrack());
      }
    }, () => {
      this.partners.set([]);
      requestAnimationFrame(() => this.measureTrack());
    });
  }

  private normalizeUrl(url: string): string | null {
    let formattedUrl = url.trim();

    if (!/^https?:\/\//i.test(formattedUrl)) {
      formattedUrl = 'https://' + formattedUrl;
    }

    try {
      new URL(formattedUrl);
      return formattedUrl;
    } catch {
      return null;
    }
  }

  getPartnerHref(url?: string): string | null {
    if (!url) {
      return null;
    }

    return this.normalizeUrl(url);
  }

  onViewportMouseEnter(): void {
    this.isHovered = true;
  }

  onViewportMouseLeave(): void {
    if (!this.pointerDown) {
      this.isHovered = false;
    }
  }

  onPointerDown(event: PointerEvent): void {
    if (event.button !== 0) {
      return;
    }

    const target = event.target as HTMLElement | null;
    if (target?.closest('.partner-tooltip-link')) {
      return;
    }

    const viewport = this.partnersViewport?.nativeElement;
    if (!viewport) {
      return;
    }

    viewport.setPointerCapture(event.pointerId);
    this.pointerDown = true;
    this.dragMoved = false;
    this.isHovered = true;
    this.isDragging.set(true);
    this.dragStartX = event.clientX;
    this.dragStartOffset = this.currentOffset;
  }

  onPointerMove(event: PointerEvent): void {
    if (!this.pointerDown) {
      return;
    }

    const deltaX = event.clientX - this.dragStartX;
    if (Math.abs(deltaX) > 5) {
      this.dragMoved = true;
    }
    this.currentOffset = this.normalizeOffset(this.dragStartOffset + deltaX);
    this.applyTrackTransform();
  }

  onPointerUp(event: PointerEvent): void {
    const viewport = this.partnersViewport?.nativeElement;
    if (viewport?.hasPointerCapture(event.pointerId)) {
      viewport.releasePointerCapture(event.pointerId);
    }

    this.pointerDown = false;
    this.isDragging.set(false);
  }

  private startAutoScroll(): void {
    const step = (timestamp: number) => {
      if (this.lastFrameTime === 0) {
        this.lastFrameTime = timestamp;
      }

      const elapsed = (timestamp - this.lastFrameTime) / 1000;
      this.lastFrameTime = timestamp;

      if (!this.isHovered && !this.pointerDown && this.singleSetWidth > 0) {
        this.currentOffset = this.normalizeOffset(
          this.currentOffset + this.autoSpeedPxPerSec * elapsed
        );
        this.applyTrackTransform();
      }

      this.animationFrameId = requestAnimationFrame(step);
    };

    this.animationFrameId = requestAnimationFrame(step);
  }

  private measureTrack(): void {
    const track = this.partnersTrack?.nativeElement;
    if (!track) {
      return;
    }

    this.singleSetWidth = track.scrollWidth / 2;
    this.currentOffset = this.normalizeOffset(this.currentOffset || -this.singleSetWidth);
    this.applyTrackTransform();
  }

  private normalizeOffset(offset: number): number {
    if (this.singleSetWidth <= 0) {
      return offset;
    }

    let normalized = offset;

    while (normalized >= 0) {
      normalized -= this.singleSetWidth;
    }

    while (normalized < -this.singleSetWidth) {
      normalized += this.singleSetWidth;
    }

    return normalized;
  }

  private applyTrackTransform(): void {
    const track = this.partnersTrack?.nativeElement;
    if (!track) {
      return;
    }

    track.style.transform = `translate3d(${this.currentOffset}px, 0, 0)`;
  }
}
