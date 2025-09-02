import {Component, HostListener, signal, OnInit, AfterViewInit} from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import {LoaderComponent} from '../../loader/loader.component';
interface MenuItem {
  label: string;
  route?: string;
  children?: MenuItem[];
  description?: string;
  isExternal?: boolean;
  hasModal?: boolean;
  hasPagination?: boolean;
}

interface MenuSection {
  title: string;
  items: MenuItem[];
}

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule, LoaderComponent],
  templateUrl: "./header.component.html",
  styleUrls: ['./header.component.scss'],
  styles: [`
    :host {
      display: block;
    }
  `]
})
export class HeaderComponent implements OnInit, AfterViewInit {
  isScrolled = signal(false);
  isMobileMenuOpen = signal(false);
  currentLang = signal('fr');
  mobileDropdowns = signal<Set<string>>(new Set());

  languages = [
    { code: 'fr', label: 'FR' },
    { code: 'ar', label: 'العربية' }
  ];
  isVideoPlaying = false;



  menuSections: MenuSection[] = [
    {
      title: 'Navigation Principale',
      items: [
        {
          label: 'À propos de la SNED',
          children: [
            { label: 'Cadre Institutionnel', route: '/apropos/cadre-institutionnel', description: 'Structure et organisation' },
            { label: 'Historique', route: '/apropos/historique', description: 'Création et lois' },
            { label: 'Organisation', route: '/apropos/organisation', description: 'Structure organisationnelle' },
            { label: 'Mot du PDG', route: '/apropos/pdg', description: 'Message du directeur général' },
            { label: 'SNED et SECEG SA', route: '/apropos/seceg', description: 'Partenariat stratégique' }
          ]
        },
        {
          label: 'Projet de Liaison fixe',
          children: [
            { label: 'Solution Pont', route: '/projet/pont', description: 'Conception et études' },
            { label: 'Solution Tunnel', route: '/projet/tunnel', description: 'Alternative souterraine' },
            { label: 'Composante Ingénierie', route: '/projet/ingenierie', hasPagination: true, description: 'Aspects techniques' },
            { label: 'Composante Milieu physique', route: '/projet/milieu-physique', hasModal: true, hasPagination: true, description: 'Études environnementales' },
            { label: 'Composante Socio-économique', route: '/projet/socio-economique', hasPagination: true, description: 'Impact économique' },
            { label: 'Environnement', route: '/projet/environnement', description: 'Études environnementales' },
            { label: 'Géostratégie et Juridique', route: '/projet/geostrategie', description: 'Aspects légaux et stratégiques' },
            { label: 'Composante Promotion de Projet', route: '/projet/promotion', description: 'Communication et promotion' }
          ]
        },
        {
          label: 'Galerie de services',
          route: '/galerie'
        },
        {
          label: 'Actualités',
          children: [
            { label: 'Dernières actualités', route: '/actualites/dernieres', hasPagination: true, description: 'Les plus récentes' },
            { label: 'Communiqués nationaux', route: '/actualites/communiques-nationaux', description: 'Communications officielles' },
            { label: 'Communiqués internationaux', route: '/actualites/communiques-internationaux', description: 'Communications internationales' },
            { label: 'Classification par composante', route: '/actualites/classification', hasPagination: true, description: 'Organisées par thème' },
            { label: 'Presse', route: '/actualites/presse', description: 'Revue de presse' }
          ]
        },
        {
          label: 'Partenariats',
          children: [
            { label: 'ADM', route: '/partenariats/adm', description: 'Autoroutes du Maroc' },
            { label: 'ANGSPE', route: '/partenariats/angspe', description: 'Agence Nationale de Gestion Stratégique' },
            { label: 'ONCF', route: '/partenariats/oncf', description: 'Office National des Chemins de Fer' },
            { label: 'SECEG SA', route: '/partenariats/seceg', description: 'Société d\'Études' }
          ]
        },
        {
          label: 'Notre Travail',
          children: [
            { label: 'Congrès', route: '/travail/congres', description: 'Événements et conférences' },
            { label: 'Activités de communication', route: '/travail/communication', description: 'Actions de sensibilisation' },
            { label: 'Vidéo de lien Physique SNED', route: '/travail/video', description: 'Présentation multimédia' },
            { label: 'Statistiques', route: '/travail/statistiques', description: 'Données et indicateurs' }
          ]
        },
        {
          label: 'Contact',
          route: '/contact'
        },
        {
          label: 'Missions et Valeurs',
          route: '/missions-valeurs'
        }
      ]
    }
  ];

  ngOnInit() {
    // Initialisation si nécessaire
  }

  @HostListener('window:scroll', [])
  onWindowScroll() {
    this.isScrolled.set(window.pageYOffset > 50);
  }

  @HostListener('window:resize', [])
  onWindowResize() {
    if (window.innerWidth >= 1024) {
      this.isMobileMenuOpen.set(false);
      this.mobileDropdowns.set(new Set());
    }
  }

  toggleMobileMenu() {
    this.isMobileMenuOpen.update(value => !value);
    if (!this.isMobileMenuOpen()) {
      this.mobileDropdowns.set(new Set());
    }
  }

  closeMobileMenu() {
    this.isMobileMenuOpen.set(false);
    this.mobileDropdowns.set(new Set());
  }

  toggleMobileDropdown(itemLabel: string) {
    this.mobileDropdowns.update(dropdowns => {
      const newDropdowns = new Set(dropdowns);
      if (newDropdowns.has(itemLabel)) {
        newDropdowns.delete(itemLabel);
      } else {
        newDropdowns.add(itemLabel);
      }
      return newDropdowns;
    });
  }

  isMobileDropdownOpen(itemLabel: string): boolean {
    return this.mobileDropdowns().has(itemLabel);
  }

  switchLanguage(langCode: string) {
    this.currentLang.set(langCode);
    // Logique de changement de langue
    console.log(`Langue changée vers: ${langCode}`);
  }

  getPaginationCount(itemLabel: string): number {
    // Logique pour retourner le nombre d'éléments selon le menu
    const counts: { [key: string]: number } = {
      'Dernières actualités': 8,
      'Composante Ingénierie': 15,
      'Composante Milieu physique': 12,
      'Composante Socio-économique': 10,
      'Classification par composante': 6
    };
    return counts[itemLabel] || 8;
  }

  headerClasses(): string {
    return this.isScrolled()
      ? 'bg-white bg-opacity-95 backdrop-blur-md shadow-xl'
      : 'bg-transparent';
  }

  topBarClasses(): string {
    return this.isScrolled()
      ? 'max-h-0 overflow-hidden py-0'
      : 'max-h-20 py-3';
  }

  mainHeaderClasses(): string {
    return this.isScrolled()
      ? 'bg-white bg-opacity-98 backdrop-blur-sm shadow-lg'
      : 'bg-white bg-opacity-90 backdrop-blur-sm';
  }

  getLangButtonClasses(langCode: string): string {
    return this.currentLang() === langCode
      ? 'bg-red-600 text-white shadow-md'
      : 'text-gray-600 hover:text-red-600 hover:bg-red-50';
  }
  playVideo() {
    this.isVideoPlaying = true;
  }

  ngAfterViewInit(): void {

  }
}
