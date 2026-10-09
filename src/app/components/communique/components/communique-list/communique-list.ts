import {
  Component,
  ViewChild,
  Input,
  OnInit,
  OnChanges,
  SimpleChanges,
  inject,
  signal,
  DestroyRef,
  OnDestroy,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { DatePipe, NgIf, NgFor } from '@angular/common';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import {
  CommuniqueService,
  CommuniqueReadDTO,
  PublicationStatus,
} from '../../../../services/communique.service';
import { CommuniqueReadMoreComponent } from '../../../readmore/communiqueReadMore.component';
import { parseLocalDateTimeToDate } from '../../../../utils/date-utils';

@Component({
  selector: 'app-communique-list',
  standalone: true,
  imports: [NgIf, DatePipe, CommuniqueReadMoreComponent, TranslatePipe],
  templateUrl: './communique-list.html',
  styleUrls: ['./communique-list.scss'],
})
export class CommuniqueList implements OnChanges, OnInit, OnDestroy {
  private translate = inject(TranslateService);
  private destroyRef = inject(DestroyRef);
  // Images en cours de téléchargement, pour ne pas les demander deux fois
  private pendingImages = new Set<string>();
  currentLang = signal('fr');
  @Input() communiques: CommuniqueReadDTO[] = [];

  constructor(public communiqueService: CommuniqueService) {}

  selectedCommunique: any | null = null;
  selectedImage: string | null = null;
  nextTitle: string | null = null;

  @ViewChild('readMore')
  readMore!: CommuniqueReadMoreComponent;

  ngOnInit() {
    this.currentLang.set(
      this.translate.currentLang || this.translate.defaultLang || 'fr'
    );

    this.translate.onLangChange
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((event) => {
        this.currentLang.set(event.lang);
      });
  }

  ngOnDestroy(): void {
    // Libère les URLs blob créées pour les images
    Object.values(this.communiqueService.communiqueImages).forEach((url) =>
      URL.revokeObjectURL(url),
    );
    this.communiqueService.communiqueImages = {};
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['communiques'] && this.communiques?.length) {
      // Convertit datePosting (string) -> Date pour éviter les problèmes de parsing/fuseau
      this.communiques = this.communiques.map((c) => ({
        ...c,
        datePosting:
          typeof c.datePosting === 'string'
            ? parseLocalDateTimeToDate(c.datePosting)
            : c.datePosting,
      }));
      this.loadImages();
    }
  }

  // Télécharge uniquement les images absentes du cache ; le cache vit tant que la liste est affichée
  loadImages() {
    for (const communique of this.communiques) {
      const uuid = communique.imageUUID;
      const status = communique.publicationStatus;
      if (
        !uuid ||
        this.communiqueService.communiqueImages[uuid] ||
        this.pendingImages.has(uuid) ||
        (status !== PublicationStatus.PUBLISHED &&
          status !== PublicationStatus.DRAFT)
      ) {
        continue;
      }

      this.pendingImages.add(uuid);
      this.communiqueService
        .getImageByUUID(uuid, status)
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe({
          next: (blob: Blob) => {
            this.pendingImages.delete(uuid);
            this.communiqueService.communiqueImages = {
              ...this.communiqueService.communiqueImages,
              [uuid]: URL.createObjectURL(blob),
            };
          },
          error: (err) => {
            this.pendingImages.delete(uuid);
            console.error("Erreur lors de la récupération du l'image", err);
          },
        });
    }
  }

  openReadMore(c: any, index: number) {
    this.selectedCommunique = c;
    this.selectedImage =
      this.communiqueService.communiqueImages[c.imageUUID] ?? null;

    this.nextTitle = this.communiques[index + 1]?.title ?? null;

    // ouvre le sidebar
    this.readMore.openSidebarFromExternal();
  }

  onReadMoreClosed() {
    this.selectedCommunique = null;
    this.selectedImage = null;
    this.nextTitle = null;
  }
}
