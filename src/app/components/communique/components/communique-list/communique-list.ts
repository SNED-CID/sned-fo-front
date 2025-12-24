import {
  Component,
  ViewChild,
  Input,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { DatePipe, NgIf, NgFor } from '@angular/common';
import {
  CommuniqueService,
  CommuniqueReadDTO,
  PublicationStatus,
} from '../../../../services/communique.service';
import { CommuniqueReadMoreComponent } from '../../../readmore/communiqueReadMore.component';
import { parseLocalDateTimeToDate } from '../../../../utils/date-utils';

@Component({
  selector: 'app-communique-list',
  imports: [NgIf, NgFor, DatePipe, CommuniqueReadMoreComponent],
  templateUrl: './communique-list.html',
  styleUrls: ['./communique-list.scss'],
})
export class CommuniqueList implements OnChanges {
  @Input() communiques: CommuniqueReadDTO[] = [];

  constructor(public communiqueService: CommuniqueService) {}

  selectedCommunique: any | null = null;
  selectedImage: string | null = null;
  nextTitle: string | null = null;

  @ViewChild('readMore')
  readMore!: CommuniqueReadMoreComponent;

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

  loadImages() {
    this.communiqueService.communiqueImages = {};
    for (let i = 0; i < this.communiques.length; i++) {
      const communique = this.communiques[i];
      if (communique.publicationStatus === PublicationStatus.PUBLISHED) {
        this.communiqueService.getImageByUUID(communique.imageUUID).subscribe({
          next: (blob: Blob) => {
            const imageUrl = URL.createObjectURL(blob);
            this.communiqueService.communiqueImages = {
              ...this.communiqueService.communiqueImages,
              [communique.imageUUID]: imageUrl,
            };
          },
          error: (err) => {
            console.error("Erreur lors de la récupération du l'image", err);
          },
        });
      } else if (communique.publicationStatus === PublicationStatus.DRAFT) {
        this.communiqueService
          .getImageByUUID(communique.imageUUID, PublicationStatus.DRAFT)
          .subscribe({
            next: (blob: Blob) => {
              const imageUrl = URL.createObjectURL(blob);
              this.communiqueService.communiqueImages = {
                ...this.communiqueService.communiqueImages,
                [communique.imageUUID]: imageUrl,
              };
            },
            error: (err) => {
              console.error("Erreur lors de la récupération du l'image", err);
            },
          });
      }
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
