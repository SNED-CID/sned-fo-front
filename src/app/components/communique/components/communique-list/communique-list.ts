import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { TableModule } from 'primeng/table';
import { Button } from 'primeng/button';
import { MessageModule } from 'primeng/message';
import { DialogModule } from 'primeng/dialog';
import { DatePipe } from '@angular/common';
import { CommuniqueService, CommuniqueReadDTO, PublicationStatus } from '../../../../services/communique.service';
import { parseLocalDateTimeToDate } from '../../../../utils/date-utils';
import { BadgeModule } from 'primeng/badge';
import { OverlayBadgeModule } from 'primeng/overlaybadge';

@Component({
    selector: 'app-communique-list',
    imports: [TableModule, Button, MessageModule, DialogModule, BadgeModule, OverlayBadgeModule, DatePipe],
    templateUrl: './communique-list.html',
    styleUrls: ['./communique-list.scss']
})
export class CommuniqueList implements OnChanges {
    @Input() communiques: CommuniqueReadDTO[] = [];

    @Output() onEdit = new EventEmitter<number>();

    @Output() delete = new EventEmitter<CommuniqueReadDTO>();

    constructor(public communiqueService: CommuniqueService) {}

    displayDialog: boolean = false;
    selectedCommunique: CommuniqueReadDTO | null = null;

    ngOnChanges(changes: SimpleChanges): void {
        if (changes['communiques'] && this.communiques?.length) {
            // Convertit datePosting (string) -> Date pour éviter les problèmes de parsing/fuseau
            this.communiques = this.communiques.map((c) => ({
                ...c,
                datePosting: typeof c.datePosting === 'string' ? parseLocalDateTimeToDate(c.datePosting) : c.datePosting
            }));
            this.loadImages();
        }
    }

    openDialog(communique: CommuniqueReadDTO): void {
        this.selectedCommunique = communique;
        this.displayDialog = true;
    }

    editCommunique(communiqueId: number) {
        this.onEdit.emit(communiqueId);
    }

    deleteCommunique(communique: CommuniqueReadDTO) {
        this.delete.emit(communique);
    }

    get selectedImageSrc(): string | null {
        const uuid = this.selectedCommunique?.imageUUID;
        if (!uuid) return null;
        return this.communiqueService.communiqueImages[uuid] ?? null;
    }

    loadImages() {
        this.communiqueService.communiqueImages = {};
        for (let i = 0; i < this.communiques.length; i++) {
            const communique = this.communiques[i];
            if (communique.publicationStatus === PublicationStatus.PUBLISHED) {
                this.communiqueService.getImageByUUID(communique.imageUUID).subscribe({
                    next: (blob: Blob) => {
                        const imageUrl = URL.createObjectURL(blob);
                        this.communiqueService.communiqueImages = { ...this.communiqueService.communiqueImages, [communique.imageUUID]: imageUrl };
                    },
                    error: (err:any) => {
                        console.error("Erreur lors de la récupération du l'image", err);
                    }
                });
            } else if (communique.publicationStatus === PublicationStatus.DRAFT) {
                this.communiqueService.getImageByUUID(communique.imageUUID, PublicationStatus.DRAFT).subscribe({
                    next: (blob: Blob) => {
                        const imageUrl = URL.createObjectURL(blob);
                        this.communiqueService.communiqueImages = { ...this.communiqueService.communiqueImages, [communique.imageUUID]: imageUrl };
                    },
                    error: (err:any) => {
                        console.error("Erreur lors de la récupération du l'image", err);
                    }
                });
            }
        }
    }
}
