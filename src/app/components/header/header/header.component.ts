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
    { code: 'fr', label: 'Français', flag: 'assets/flags/fr.svg' },
    { code: 'en', label: 'English', flag: 'assets/flags/en.svg' },
    { code: 'es', label: 'Español', flag: 'assets/flags/es.svg' },
    { code: 'ar', label: 'العربية', flag: 'assets/flags/ar.svg' }
  ];
  isVideoPlaying = false;



  menuSections: MenuSection[] = [
    {
      title: 'Navigation Principale',
      items: [
        {
          label: 'SNED',
          route: '/'
        },
        {
          label: 'Projet de Liaison fixe',
          children: [
            { label: 'Composante Ingénierie', route: '/projet/ingenierie', hasPagination: true, description: 'Aspects techniques' },
            { label: 'Historique', route: '/projet/historique', description: 'Conception et études' },
            { label: 'Composante Milieu physique', route: '/projet/milieu-physique', hasModal: true, hasPagination: true, description: 'Études environnementales' },
            { label: 'Composante Socio-économique', route: '/projet/socio-economique', hasPagination: true, description: 'Impact économique' },
            { label: 'Composante promotion de projet', route: '/projet/socio-economique', hasPagination: true, description: 'Impact économique' },
            { label: 'Mentions légales', route: '/projet/geostrategie', description: 'Aspects légaux et stratégiques' },
          ]
        },
        {
          label: 'Galerie de services',
          children: [
            { label: 'Composante Ingénierie', route: '/projet/ingenierie', hasPagination: true, description: 'Aspects techniques' },
            { label: 'Composante Milieu physique', route: '/projet/milieu-physique', hasModal: true, hasPagination: true, description: 'Études environnementales' },
            { label: 'Composante Socio-économique', route: '/projet/socio-economique', hasPagination: true, description: 'Impact économique' },
            { label: 'Composante promotion de projet', route: '/projet/socio-economique', hasPagination: true, description: 'Impact économique' },
          ]
        },
        {
          label: 'Actualités',
          route: '/actualite'
        },
        {
          label: 'Partenariats',
          route: '/partenariat'
        },
        {
          label: 'Notre Travail',
          children: [
            { label: 'Congrès', route: '/travail/congres', description: 'Événements et conférences' },
            { label: 'Activités de communication', route: '/travail/communication', description: 'Actions de sensibilisation' },
            { label: 'Vidéo de lien Physique SNED', route: '/travail/video', description: 'Présentation multimédia' },
            { label: 'Statistiques', route: '/travail/statistiques', description: 'Données et indicateurs' }
          ]
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

  mainHeaderClasses(): string {
    return this.isScrolled()
      ? 'bg-white bg-opacity-98 backdrop-blur-sm shadow-lg'
      : 'bg-transparent';
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
