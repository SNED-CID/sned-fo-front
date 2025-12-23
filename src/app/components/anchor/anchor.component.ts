import {Component, ElementRef, OnInit, signal, ViewChild, Input} from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MenuItem } from '../../services/menu.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-anchor',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './anchor.component.html',
  styleUrls: ['./anchor.component.scss']
})
export class AnchorComponent implements OnInit {
  isHomeRoute = signal(false);
  showAnchor = signal(false);
  @Input() menuItems: MenuItem[] = [];
  @Input() menuTitle: string = '';

  links = signal<Array<{ id: string; label: string }>>([]);

  // Default links for home/about page
  private getDefaultLinks() {
    return [
      { id: 'apropos', label: this.translateService.instant('header.menu.know_us') },
      { id: 'contexte', label: this.translateService.instant('header.menu.strategic_context') },
      { id: 'missions', label: this.translateService.instant('header.menu.missions_values') },
      { id: 'cadre', label: this.translateService.instant('header.menu.institutional_framework') },
      { id: 'pdg', label: this.translateService.instant('header.menu.ceo_message') },
      { id: 'sned_secegsa', label: this.translateService.instant('header.menu.sned_secegsa') },
      { id: 'organigramme', label: this.translateService.instant('header.menu.organization') }
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
          label: child.label
        }))
      );
    }
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
      [this.translateService.instant('header.menu.sned_secegsa')]: 'sned_secegsa'
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
