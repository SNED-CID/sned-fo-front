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
          label: 'header.navigation.discover_project',
          route: '/',
          children: [
            { label: 'header.navigation.about', route: '/about', description: 'header.navigation.about_desc' },
            { label: 'header.navigation.mission', route: '/mission', description: 'header.navigation.mission_desc' },
            { label: 'header.navigation.team', route: '/team', description: 'header.navigation.team_desc' },
            { label: 'header.navigation.contact', route: '/contact', description: 'header.navigation.contact_desc' }
          ]
        },
        {
          label: 'header.navigation.project',
          route: '/projet',
          children: [
            { label: 'header.navigation.engineering', route: '/projet/ingenierie', description: 'header.navigation.engineering_desc' },
            { label: 'header.navigation.history', route: '/projet/historique', description: 'header.navigation.history_desc' },
            { label: 'header.navigation.physical', route: '/projet/milieu-physique', description: 'header.navigation.physical_desc' },
            { label: 'header.navigation.socioeconomic', route: '/projet/socio-economique', description: 'header.navigation.socioeconomic_desc' },
            { label: 'header.navigation.promotion', route: '/projet/socio-economique', description: 'header.navigation.promotion_desc' },
            { label: 'header.navigation.legal', route: '/projet/geostrategie', description: 'header.navigation.legal_desc' },
          ]
        },
        {
          label: 'header.navigation.gallery',
          route: '/galerie',
          children: [
            { label: 'header.navigation.engineering', route: '/galerie/ingenierie', description: 'header.navigation.engineering_desc' },
            { label: 'header.navigation.physical', route: '/galerie/milieu-physique', description: 'header.navigation.physical_desc' },
            { label: 'header.navigation.socioeconomic', route: '/galerie/socio-economique', description: 'header.navigation.socioeconomic_desc' },
            { label: 'header.navigation.promotion', route: '/galerie/socio-economique', description: 'header.navigation.promotion_desc' },
          ]
        },
        {
          label: 'header.navigation.news',
          route: '/actualite'
        },
        {
          label: 'header.navigation.partnerships',
          route: '/partenariat'
        },
        {
          label: 'header.navigation.work',
          route: '/travail',
          children: [
            { label: 'header.navigation.congress', route: '/travail/congres', description: 'header.navigation.congress_desc' },
            { label: 'header.navigation.communication', route: '/travail/communication', description: 'header.navigation.communication_desc' },
            { label: 'header.navigation.video', route: '/travail/video', description: 'header.navigation.video_desc' },
            { label: 'header.navigation.statistics', route: '/travail/statistiques', description: 'header.navigation.statistics_desc' }
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
