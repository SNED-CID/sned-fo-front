import {Component, ElementRef, OnInit, signal, ViewChild, Input} from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MenuItem } from '../../services/menu.service';
import { TranslateService, TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-anchor',
  standalone: true,
  imports: [CommonModule, TranslatePipe],
  templateUrl: './anchor.component.html',
  styleUrls: ['./anchor.component.scss']
})
export class AnchorComponent implements OnInit {
  isHomeRoute = signal(false);
  showAnchor = signal(false);
  @Input() menuItems: MenuItem[] = [];
  @Input() menuTitle: string = '';

  links = signal<Array<{ id: string; labelKey: string }>>([]);

  // Default links for home/about page
  private getDefaultLinks() {
    return [
      // { id: 'apropos', labelKey: 'header.menu.know_us' },
      // { id: 'contexte', labelKey: 'header.menu.strategic_context' },
       { id: 'cadre', labelKey: 'header.menu.institutional_framework' },
      { id: 'missions', labelKey: 'header.menu.missions_values' },
     
      // { id: 'pdg', labelKey: 'header.menu.ceo_message' },
      { id: 'sned_secegsa', labelKey: 'header.menu.sned_secegsa' },
      { id: 'organigramme', labelKey: 'header.menu.organization' },
      { id: 'partenaires', labelKey: 'header.menu.partners' },
      { id: 'carrieres', labelKey: 'header.menu.careers' },
      { id: 'appels_offres', labelKey: 'header.menu.call_for_tenders' },
    ];
  }


  constructor(private router: Router, private translateService: TranslateService) {}

  ngOnInit() {
    // S'abonner aux changements de langue
    this.translateService.onLangChange.subscribe(() => {
      this.updateAnchorVisibility();
    });

    this.router.events.subscribe(() => {
      this.updateAnchorVisibility();
    });

    // init au premier chargement
    this.updateAnchorVisibility();
  }

  private updateAnchorVisibility() {
    const url = this.router.url.split('?')[0];

    // Si menuItems est fourni, afficher l'anchor
    if (this.menuItems && this.menuItems.length > 0) {
      this.showAnchor.set(true);
      this.initializeLinks();
    } else {
      // Sinon, afficher seulement si on est sur la home
      this.isHomeRoute.set(url === '/' || url === '/sned');
      this.showAnchor.set(url === '/' || url === '/sned');
      if (this.showAnchor()) {
        this.links.set(this.getDefaultLinks());
      }
    }
  }

  private initializeLinks() {
    if (this.menuItems && this.menuItems.length > 0) {
      const children = this.menuItems[0].children || [];
      this.links.set(
        children.map((child) => ({
          id: this.mapLabelToId(child.label, this.menuTitle),
          labelKey: this.getLabelKeyFromLabel(child.label)
        }))
      );
    }
  }

  private getLabelKeyFromLabel(label: string): string {
    // Créer un mapping simple basé sur la langue actuelle
    const labelToKeyMap: Record<string, string> = {
      [this.translateService.instant('header.menu.know_us')]: 'header.menu.know_us',
      [this.translateService.instant('header.menu.strategic_context')]: 'header.menu.strategic_context',
      [this.translateService.instant('header.menu.missions_values')]: 'header.menu.missions_values',
      [this.translateService.instant('header.menu.institutional_framework')]: 'header.menu.institutional_framework',
      [this.translateService.instant('header.menu.ceo_message')]: 'header.menu.ceo_message',
      [this.translateService.instant('header.menu.sned_secegsa')]: 'header.menu.sned_secegsa',
      [this.translateService.instant('header.menu.organization')]: 'header.menu.organization',
      [this.translateService.instant('header.menu.engineering_component')]: 'header.menu.engineering_component',
      [this.translateService.instant('header.menu.physical_environment_component')]: 'header.menu.physical_environment_component',
      [this.translateService.instant('header.menu.socioeconomic_component')]: 'header.menu.socioeconomic_component',
      [this.translateService.instant('header.menu.project_promotion_component')]: 'header.menu.project_promotion_component',
      [this.translateService.instant('header.menu.recognition_gallery')]: 'header.menu.recognition_gallery',
      [this.translateService.instant('header.menu.partners')]: 'header.menu.partners'
    };

    return labelToKeyMap[label] || label;
  }

  private mapLabelToId(label: string, menuTitle: string = ''): string {
    // Créer des mappings dynamiques basés sur les traductions actuelles
    const snedMapping: Record<string, string> = {
      [this.translateService.instant('header.menu.know_us')]: 'apropos',
      [this.translateService.instant('header.menu.strategic_context')]: 'contexte',
      [this.translateService.instant('header.menu.missions_values')]: 'missions',
      [this.translateService.instant('header.menu.institutional_framework')]: 'cadre',
      [this.translateService.instant('header.menu.ceo_message')]: 'pdg',
      [this.translateService.instant('header.menu.organization')]: 'organigramme',
      [this.translateService.instant('header.menu.sned_secegsa')]: 'sned_secegsa',
      [this.translateService.instant('header.menu.partners')]: 'partenaires',
      [this.translateService.instant('header.menu.careers')]: 'carrieres'
    };

    // Pour "Projet de liaison fixe"
    const projetMapping: Record<string, string> = {
      [this.translateService.instant('header.menu.engineering_component')]: 'ingenierie',
      [this.translateService.instant('header.menu.physical_environment_component')]: 'milieu-physique',
      [this.translateService.instant('header.menu.socioeconomic_component')]: 'socio-economique',
      [this.translateService.instant('header.menu.project_promotion_component')]: 'promotion',
      [this.translateService.instant('header.menu.recognition_gallery')]: 'galerie'
    };

    const fixedLinkProjectTranslation = this.translateService.instant('header.menu.fixed_link_project');
    if (menuTitle === fixedLinkProjectTranslation) {
      return projetMapping[label] || label.toLowerCase().replace(/\s+/g, '-');
    }

    return snedMapping[label] || label.toLowerCase().replace(/\s+/g, '-');
  }

  scrollTo(id: string) {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }
}
