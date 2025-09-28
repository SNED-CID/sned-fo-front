import {Component, HostListener, signal, OnInit, inject} from '@angular/core';
import { CommonModule } from '@angular/common';
import {NavigationEnd, Router, RouterModule} from '@angular/router';
import {LoaderComponent} from '../../loader/loader.component';
import {filter} from 'rxjs';
import {LocaleService} from '../../../services/locale.service';
import {TranslatePipe} from '@ngx-translate/core';
import { LanguageSelectorComponent, Language } from '../language-selector/language-selector.component';
import { NavigationMenuComponent, MenuSection } from '../navigation-menu/navigation-menu.component';
import { LazyImageComponent } from '../../shared/lazy-image/lazy-image.component';
// Les interfaces sont maintenant importées des composants

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    LoaderComponent,
    TranslatePipe,
    NavigationMenuComponent,
    LazyImageComponent
  ],
  templateUrl: "./header.component.html",
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit{
  isScrolled = signal(false);
  isMobileMenuOpen = signal(false);
  currentLang = signal('fr');
  mobileDropdowns = signal<Set<string>>(new Set());
  showLangDropdown = signal(false);
  showMobileLangDropdown = false;

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
  private readonly localeService = inject(LocaleService);

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

  languages: Language[] = [
    { code: 'fr', label: 'Français', flag: 'assets/flags/fr.svg' },
    { code: 'en', label: 'English', flag: 'assets/flags/en.svg' },
    { code: 'es', label: 'Español', flag: 'assets/flags/es.svg' },
    { code: 'ar', label: 'العربية', flag: 'assets/flags/ar.svg' }
  ];
  isVideoPlaying = false;


  switchLanguage(langCode: string) {
    this.currentLang.set(langCode);
    this.showLangDropdown.set(false);
    this.localeService.setLanguage(langCode);
  }

  menuSections: MenuSection[] = [
    {
      title: 'Navigation Principale',
      items: [
        {
          label: 'Découvrez le projet de liaison fixe',
          route: '/',
          children: [
            { label: 'À propos', route: '/about', description: 'Qui sommes-nous' },
            { label: 'Mission', route: '/mission', description: 'Notre mission et vision' },
            { label: 'Équipe', route: '/team', description: 'Notre équipe' },
            { label: 'Contact', route: '/contact', description: 'Nous contacter' }
          ]
        },
        {
          label: 'Projet de Liaison fixe',
          route: '/projet',
          children: [
            { label: 'Composante Ingénierie', route: '/projet/ingenierie', description: 'Aspects techniques' },
            { label: 'Historique', route: '/projet/historique', description: 'Conception et études' },
            { label: 'Composante Milieu physique', route: '/projet/milieu-physique', description: 'Études environnementales' },
            { label: 'Composante Socio-économique', route: '/projet/socio-economique', description: 'Impact économique' },
            { label: 'Composante promotion de projet', route: '/projet/socio-economique', description: 'Impact économique' },
            { label: 'Mentions légales', route: '/projet/geostrategie', description: 'Aspects légaux et stratégiques' },
          ]
        },
        {
          label: 'Galerie de reconnaissance',
          route: '/galerie',
          children: [
            { label: 'Composante Ingénierie', route: '/galerie/ingenierie', description: 'Aspects techniques' },
            { label: 'Composante Milieu physique', route: '/galerie/milieu-physique', description: 'Études environnementales' },
            { label: 'Composante Socio-économique', route: '/galerie/socio-economique', description: 'Impact économique' },
            { label: 'Composante promotion de projet', route: '/galerie/socio-economique', description: 'Impact économique' },
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
      this.showLangDropdown.set(false);
    }
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event) {
    const target = event.target as HTMLElement;

    // Close language dropdown if clicked outside
    if (!target.closest('.language-selector')) {
      this.showLangDropdown.set(false);
    }
  }

  @HostListener('document:keydown.escape', ['$event'])
  onEscapeKeydown(event: KeyboardEvent) {
    if (this.isMobileMenuOpen()) {
      this.closeMobileMenu();
      event.preventDefault();
    }
    if (this.showLangDropdown()) {
      this.showLangDropdown.set(false);
      event.preventDefault();
    }
  }

  toggleMobileMenu() {
    this.isMobileMenuOpen.update(value => !value);
    if (!this.isMobileMenuOpen()) {
      this.mobileDropdowns.set(new Set());
    }

    // Prevent body scroll when mobile menu is open
    if (this.isMobileMenuOpen()) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  }

  closeMobileMenu() {
    this.isMobileMenuOpen.set(false);
    this.mobileDropdowns.set(new Set());
    document.body.style.overflow = '';
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


  onMenuItemClick() {
    this.closeMobileMenu();
  }

  mainHeaderClasses(): string {
    const base = 'transition-all duration-500 ease-in-out';
    return this.isScrolled()
      ? `${base} bg-white/95 backdrop-blur-md shadow-lg border-b border-white/20`
      : `${base} bg-white/10 backdrop-blur-sm`;
  }

  currentLangData(): Language {
    return this.languages.find(l => l.code === this.currentLang())!;
  }

  toggleLangDropdown(open: boolean) {
    this.showLangDropdown.set(open);
  }

  onLanguageChange(language: Language) {
    this.currentLang.set(language.code);
    this.showLangDropdown.set(false);
    this.localeService.setLanguage(language.code);
  }

  selectMobileLanguage(language: Language) {
    this.currentLang.set(language.code);
    this.showMobileLangDropdown = false;
    this.localeService.setLanguage(language.code);
  }

  playVideo() {
    this.isVideoPlaying = true;
  }

  getLogoPath(): string {
    const isArabic = this.currentLang() === 'ar';
    const hasScrolled = this.isScrolled();

    if (isArabic) {
      return hasScrolled ? 'assets/logos/arstdr.png' : 'assets/logos/arwhite.png';
    } else {
      return hasScrolled ? 'assets/logos/frstdr.png' : 'assets/logos/frwhite.png';
    }
  }
}
