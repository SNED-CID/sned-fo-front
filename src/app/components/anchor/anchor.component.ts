import {Component, ElementRef, OnInit, signal, ViewChild, Input} from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MenuItem } from '../../services/menu.service';

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
  private defaultLinks = [
    { id: 'apropos', label: 'Nous connaitre' },
    { id: 'contexte', label: 'Contexte stratégique' },
    { id: 'missions', label: 'Missions et valeurs' },
    { id: 'cadre', label: 'Cadre institutionnel' },
    { id: 'pdg', label: 'Mot du PDG' },
    { id: 'organigramme', label: 'Organisation' },
    { id: 'sned_secegsa', label: 'SNED & SECEG SA' }
  ];

  // Mapping for different menu sections
  private menuMappings: Record<string, Record<string, string>> = {
    'Projet de liaison fixe': {
      'Composante ingénierie': 'ingenierie',
      'Composante milieu physique': 'milieu-physique',
      'Composante socio-économique': 'socio-economique',
      'Composante promotion du projet': 'promotion',
      'Galerie de reconnaissance': 'galerie'
    }
  };

  constructor(private router: Router) {}

  ngOnInit() {
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
        this.links.set(this.defaultLinks);
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
    // Pour "Découvrez la SNED"
    const snedMapping: Record<string, string> = {
      'Nous connaitre': 'apropos',
      'Contexte stratégique': 'contexte',
      'Missions et valeurs': 'missions',
      'Cadre institutionnel': 'cadre',
      'Mot du PDG': 'pdg',
      'Organisation': 'organigramme',
      'SNED & SECEG SA': 'sned_secegsa'
    };

    // Pour "Projet de liaison fixe"
    const projetMapping: Record<string, string> = {
      'Composante ingénierie': 'ingenierie',
      'Composante milieu physique': 'milieu-physique',
      'Composante socio-économique': 'socio-economique',
      'Composante promotion du projet': 'promotion',
      'Galerie de reconnaissance': 'galerie'
    };

    if (menuTitle === 'Projet de liaison fixe') {
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
