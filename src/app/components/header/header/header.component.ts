import {Component, HostListener, signal, OnInit, inject} from '@angular/core';
import { CommonModule } from '@angular/common';
import {NavigationEnd, Router, RouterModule} from '@angular/router';
import {LoaderComponent} from '../../loader/loader.component';
import {filter} from 'rxjs';
import {LocaleService} from '../../../services/locale.service';
import {TranslatePipe} from '@ngx-translate/core';
import { LanguageSelectorComponent, Language } from '../language-selector/language-selector.component';
import { NavigationMenuComponent, MenuSection } from '../navigation-menu/navigation-menu.component';
import { BackgroundParticleAnimationDirective } from '../../../directives/background-particle-animation.directive';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    LoaderComponent,
    TranslatePipe,
    NavigationMenuComponent,
    LanguageSelectorComponent,
    BackgroundParticleAnimationDirective
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
  isBackgroundLoading = signal(false);

  constructor(private router: Router) {}
  private readonly localeService = inject(LocaleService);

  ngOnInit() {
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: any) => {
        const url = event.urlAfterRedirects || event.url;
        const newBackground = this.getBackgroundForUrl(url);

        if (newBackground && newBackground !== this.currentBackground) {
          this.loadBackgroundImage(newBackground);
        } else {
          this.currentBackground = newBackground;
        }
      });
  }

  getBackgroundForUrl(url: string): string | null {
    const urlWithoutFragment = url.split('#')[0];

    if ((urlWithoutFragment === '/' || urlWithoutFragment === '') && this.menuBackgrounds['/']) {
      return this.menuBackgrounds['/'];
    }

    const segments = urlWithoutFragment.split('/').filter(Boolean);

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
    { code: 'fr', label: 'Français', initials: 'FR' },
    { code: 'en', label: 'English', initials: 'EN' },
    { code: 'es', label: 'Español', initials: 'ES' },
    { code: 'ar', label: 'العربية', initials: 'AR' }
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
          label: 'Découvrez la SNED',
          route: '/about',
          children: [
            { label: 'Nous connaitre', route: '/about', sectionId: 'apropos' },
            { label: 'Contexte stratégique', route: '/about', sectionId: 'contexte' },
            { label: 'Missions et valeurs', route: '/about', sectionId: 'missions' },
            { label: 'Cadre institutionnel', route: '/about', sectionId: 'cadre' },
            { label: 'Mot du PDG', route: '/about', sectionId: 'pdg' },
            { label: 'SNED & SECEG SA', route: '/about', sectionId: 'sned_secegsa' },
            { label: 'Organisation', route: '/about', sectionId: 'organigramme' },
          ]
        },
        {
          label: 'Projet de liaison fixe',
          route: '/projet',
          children: [
            { label: 'Composante ingénierie', route: '/projet/ingenierie' },
            { label: 'Composante milieu physique', route: '/projet/milieu-physique' },
            { label: 'Composante socio-économique', route: '/projet/socio-economique' },
            { label: 'Composante promotion du projet', route: '/projet/promotion' },
            { label: 'Galerie de reconnaissance', route: '/galerie' }
          ]
        },
        {
          label: 'Actualités',
          route: '/actualite'
        },
        {
          label: 'Partenaires',
          route: '/partenariat'
        },
        {
          label: 'Appel d\'offres',
          route: '/appels-offres'
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
    return `${base} bg-white/95 backdrop-blur-md shadow-lg border-b border-white/20`;
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

  private loadBackgroundImage(imagePath: string) {
    this.isBackgroundLoading.set(true);

    const img = new Image();
    img.onload = () => {
      this.currentBackground = imagePath;
      this.isBackgroundLoading.set(false);
    };
    img.onerror = () => {
      console.warn('Failed to load background image:', imagePath);
      this.isBackgroundLoading.set(false);
    };
    img.src = imagePath;
  }

  getLogoPath(): string {
    const isArabic = this.currentLang() === 'ar';

    if (isArabic) {
      return 'assets/logos/arstdr.png';
    } else {
      return 'assets/logos/frstdr.png';
    }
  }
}
