import {Component, HostListener, signal, OnInit, AfterViewInit} from '@angular/core';
import { CommonModule } from '@angular/common';
import {NavigationEnd, Router, RouterModule} from '@angular/router';
import {LoaderComponent} from '../../loader/loader.component';
import {filter} from 'rxjs';
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
export class HeaderComponent implements OnInit{
  isScrolled = signal(false);
  isMobileMenuOpen = signal(false);
  currentLang = signal('fr');
  mobileDropdowns = signal<Set<string>>(new Set());

  menuBackgrounds: Record<string, string> = {
    '/': 'assets/images/tunnel.png',
    '/projet': 'assets/images/liaison_fixe.png',
    '/galerie': 'assets/images/galerie_services.png',
    '/actualite': 'assets/images/actualites.png',
    '/partenariat': 'assets/images/partenariats.png',
    '/travail': 'assets/images/notre_travail.png'
  };
  currentBackground: string | null = null;

  constructor(private router: Router) {}

  ngOnInit() {
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: any) => {
        const url = event.urlAfterRedirects || event.url;
        this.currentBackground = this.getBackgroundForUrl(url);
      });
  }

  getBackgroundForUrl(url: string): string | null {
    // si c'est exactement la home
    if (url === '/' && this.menuBackgrounds['/']) {
      return this.menuBackgrounds['/'];
    }

    const segments = url.split('/').filter(Boolean); // ex: "/projet/ingenierie" → ["projet","ingenierie"]

    while (segments.length > 0) {
      const candidate = '/' + segments.join('/');
      if (this.menuBackgrounds[candidate]) {
        return this.menuBackgrounds[candidate];
      }
      segments.pop(); // remonte au parent
    }

    return null;
  }

  languages = [
    { code: 'fr', label: 'Français', flag: 'assets/flags/fr.svg' },
    { code: 'en', label: 'English', flag: 'assets/flags/en.svg' },
    { code: 'es', label: 'Español', flag: 'assets/flags/es.svg' },
    { code: 'ar', label: 'العربية', flag: 'assets/flags/ar.svg' }
  ];
  isVideoPlaying = false;

  showLangDropdown = signal(false);

  currentLangData() {
    return this.languages.find(l => l.code === this.currentLang())!;
  }

  toggleLangDropdown(open: boolean) {
    this.showLangDropdown.set(open);
  }

  switchLanguage(langCode: string) {
    this.currentLang.set(langCode);
    this.showLangDropdown.set(false);
  }

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
          route: '/projet',
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
          route: '/galerie',
          children: [
            { label: 'Composante Ingénierie', route: '/galerie/ingenierie', hasPagination: true, description: 'Aspects techniques' },
            { label: 'Composante Milieu physique', route: '/galerie/milieu-physique', hasModal: true, hasPagination: true, description: 'Études environnementales' },
            { label: 'Composante Socio-économique', route: '/galerie/socio-economique', hasPagination: true, description: 'Impact économique' },
            { label: 'Composante promotion de projet', route: '/galerie/socio-economique', hasPagination: true, description: 'Impact économique' },
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
          route: '/travail',
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

  mainHeaderClasses(): string {
    return this.isScrolled()
      ? 'bg-white bg-opacity-98 backdrop-blur-sm shadow-lg'
      : 'bg-transparent';
  }

  playVideo() {
    this.isVideoPlaying = true;
  }
}
