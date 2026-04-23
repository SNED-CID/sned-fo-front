import {
  Component,
  HostListener,
  signal,
  OnInit,
  OnDestroy,
  inject,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavigationEnd, Router, RouterModule } from '@angular/router';
import { LoaderComponent } from '../../loader/loader.component';
import { filter } from 'rxjs';
import { LocaleService } from '../../../services/locale.service';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import {
  LanguageSelectorComponent,
  Language,
} from '../language-selector/language-selector.component';
import {
  NavigationMenuComponent,
  MenuSection,
} from '../navigation-menu/navigation-menu.component';
import { AnalyticsService } from '../../../services/analytics.service';

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
  ],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit, OnDestroy {
  isScrolled = signal(false);
  isMobileMenuOpen = signal(false);
  currentLang = signal('fr');
  mobileDropdowns = signal<Set<string>>(new Set());
  showLangDropdown = signal(false);
  showMobileLangDropdown = false;
  currentSection = signal<string>('default');
  showHero = signal(true);

  private currentImageIndex = 0;

  // Mappe les routes et fragments sur les clés de traduction
  routeToSectionMap: Record<string, Record<string, string>> = {
    // Routes principales
    routes: {
      '': 'default',
      '/': 'default',
      '/projet': 'ingenierie',
      '/galerie': 'galerie',
      '/publication': 'publication',
      '/partenariat': 'partenariat',
      '/travail': 'travail',
      '/appels-offres': 'appels_offres',
    },
    // Fragments (ancres)
    fragments: {
      apropos: 'apropos',
      contexte: 'contexte',
      missions: 'missions',
      cadre: 'cadre',
      pdg: 'pdg',
      sned_secegsa: 'sned_secegsa',
      organigramme: 'organigramme',
      partenaires: 'partenaires',
      ingenierie: 'ingenierie',
      'milieu-physique': 'milieu_physique',
      'socio-economique': 'socio_economique',
      promotion: 'promotion',
    },
  };

  menuBackgrounds: Record<string, string> = {
    '/': 'assets/images/roi-mohammed-vi.jpg',
    '/projet': 'assets/images/norway-underwater-tunnel.jpg',
    '/galerie': 'assets/images/roi-mohammed-vi.jpg',
    '/publication': 'assets/images/m6_esp.jpg',
    '/partenariat': 'assets/images/m6_esp.jpg',
    '/travail': 'assets/images/gibraltar05.gif',
    '/appels-offres': 'assets/images/gibraltar05.gif',
  };

  heroImages: string[] = [
    'assets/images/gibraltar05.gif',
    'assets/images/roi-mohammed-vi.jpg',
    'assets/images/m6_esp.jpg',
    'assets/images/norway-underwater-tunnel.jpg',
  ];

  currentBackground: string | null = null;
  transitionBackground: string | null = null;
  isBackgroundLoading = signal(false);
  isBackgroundTransitioning = signal(false);

  private readonly transitionDurationMs = 900;
  private heroRotationInterval: ReturnType<typeof setInterval> | null = null;
  private transitionTimeout: ReturnType<typeof setTimeout> | null = null;

  constructor(
    private router: Router,
    private translateService: TranslateService
  ) {}
  private readonly localeService = inject(LocaleService);
  private readonly analytics = inject(AnalyticsService);

  ngOnInit() {
    // Charger les menus traduits
    this.loadTranslatedMenus();

    // S'abonner aux changements de langue
    this.translateService.onLangChange.subscribe(() => {
      this.loadTranslatedMenus();
    });

    const initialBackground = this.getBackgroundForUrl(this.router.url);
    if (initialBackground) {
      this.loadBackgroundImage(initialBackground, false);
    }
    this.showHero.set(this.shouldShowHeroForUrl(this.router.url));

    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((event: any) => {
        const url = event.urlAfterRedirects || event.url;
        this.showHero.set(this.shouldShowHeroForUrl(url));
        const newBackground = this.getBackgroundForUrl(url);

        if (newBackground && newBackground !== this.currentBackground) {
          this.loadBackgroundImage(newBackground, true);
        } else {
          this.currentBackground = newBackground;
        }

        // Mettre à jour la section actuelle
        this.updateCurrentSection(url);
      });

    this.startHeroImageRotation();
  }

  private shouldShowHeroForUrl(url: string): boolean {
    const urlWithoutFragment = (url || '').split('#')[0].split('?')[0];
    return urlWithoutFragment !== '/contact';
  }

  ngOnDestroy() {
    if (this.heroRotationInterval) {
      clearInterval(this.heroRotationInterval);
      this.heroRotationInterval = null;
    }

    if (this.transitionTimeout) {
      clearTimeout(this.transitionTimeout);
      this.transitionTimeout = null;
    }
  }

  private startHeroImageRotation(): void {
    if (this.heroRotationInterval) {
      clearInterval(this.heroRotationInterval);
    }

    this.heroRotationInterval = setInterval(() => {
      this.currentImageIndex =
        (this.currentImageIndex + 1) % this.heroImages.length;

      const nextImage = this.heroImages[this.currentImageIndex];
      this.loadBackgroundImage(nextImage, true);
    }, 3000);
  }

  private loadTranslatedMenus() {
    this.menuSections = [
      {
        title: this.translateService.instant('header.menu.main_navigation'),
        items: [
          {
            label: this.translateService.instant('header.menu.discover_sned'),
            route: '/about',
            children: [
              {
                label: this.translateService.instant(
                  'header.menu.institutional_framework'
                ),
                route: '/about',
                sectionId: 'cadre',
              },
              {
                label: this.translateService.instant(
                  'header.menu.missions_values'
                ),
                route: '/about',
                sectionId: 'missions',
              },
              {
                label: this.translateService.instant(
                  'header.menu.sned_secegsa'
                ),
                route: '/about',
                sectionId: 'sned_secegsa',
              },
              {
                label: this.translateService.instant(
                  'header.menu.organization'
                ),
                route: '/about',
                sectionId: 'organigramme',
              },
              {
                label: this.translateService.instant('header.menu.partners'),
                route: '/about',
                sectionId: 'partenaires',
              },
              {
                label: this.translateService.instant('header.menu.careers'),
                route: '/about',
                sectionId: 'carrieres',
              },
              {
                label: this.translateService.instant(
                  'header.menu.call_for_tenders'
                ),
                route: '/about',
                sectionId: 'appels_offres',
              },
            ],
          },
          {
            label: this.translateService.instant(
              'header.menu.fixed_link_project'
            ),
            route: '/projet',
            children: [
              {
                label: this.translateService.instant(
                  'header.menu.project_history'
                ),
                route: '/projet/ingenierie',
              },
              {
                label: this.translateService.instant(
                  'header.menu.physical_environment'
                ),
                route: '/projet/milieu-physique',
              },
              {
                label: this.translateService.instant('header.menu.engineering'),
                route: '/projet/ingenierie',
              },
              {
                label: this.translateService.instant(
                  'header.menu.legal_aspect'
                ),
                route: '/projet/ingenierie',
              },
              {
                label: this.translateService.instant(
                  'header.menu.socioeconomic_aspect'
                ),
                route: '/projet/socio-economique',
              },
              {
                label: this.translateService.instant(
                  'header.menu.geostrategic_component'
                ),
                route: '/projet/ingenierie',
              },
            ],
          },
          {
            label: this.translateService.instant('header.menu.publication'),
            route: '/publication',
          },
          {
            label: this.translateService.instant('header.menu.contact'),
            route: '/contact',
          },
        ],
      },
    ];
  }

  private updateCurrentSection(url: string): void {
    const parts = url.split('#');
    const route = parts[0];
    const fragment = parts[1] || '';

    // Chercher la section via le fragment d'abord (prioritaire pour les ancres)
    if (fragment && this.routeToSectionMap['fragments'][fragment]) {
      this.currentSection.set(this.routeToSectionMap['fragments'][fragment]);
      return;
    }

    // Sinon, chercher la section via la route
    if (this.routeToSectionMap['routes'][route]) {
      this.currentSection.set(this.routeToSectionMap['routes'][route]);
      return;
    }

    // Par défaut
    this.currentSection.set('default');
  }

  getBackgroundForUrl(url: string): string | null {
    const urlWithoutFragment = url.split('#')[0];

    if (
      (urlWithoutFragment === '/' || urlWithoutFragment === '') &&
      this.menuBackgrounds['/']
    ) {
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
    { code: 'ar', label: 'العربية', initials: 'AR' },
  ];
  isVideoPlaying = false;

  switchLanguage(langCode: string) {
    this.currentLang.set(langCode);
    this.showLangDropdown.set(false);
    this.localeService.setLanguage(langCode);
  }

  menuSections: MenuSection[] = [];

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
    this.isMobileMenuOpen.update((value) => !value);
    if (!this.isMobileMenuOpen()) {
      this.mobileDropdowns.set(new Set());
    }

    // Track mobile menu toggle
    this.analytics.trackMobileMenuToggle(
      this.isMobileMenuOpen() ? 'open' : 'close'
    );

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
    const isCurrentlyOpen = this.mobileDropdowns().has(itemLabel);

    this.mobileDropdowns.update((dropdowns) => {
      const newDropdowns = new Set(dropdowns);
      if (newDropdowns.has(itemLabel)) {
        newDropdowns.delete(itemLabel);
      } else {
        newDropdowns.add(itemLabel);
      }
      return newDropdowns;
    });

    this.analytics.trackMobileDropdownToggle(
      itemLabel,
      isCurrentlyOpen ? 'close' : 'open'
    );
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
    return this.languages.find((l) => l.code === this.currentLang())!;
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

  private loadBackgroundImage(imagePath: string, withTransition = true) {
    // this.isBackgroundLoading.set(true);

    const img = new Image();
    img.onload = () => {
      const shouldTransition =
        withTransition &&
        !!this.currentBackground &&
        this.currentBackground !== imagePath;

      if (!shouldTransition) {
        this.currentBackground = imagePath;
        this.transitionBackground = null;
        this.isBackgroundTransitioning.set(false);
        return;
      }

      this.transitionBackground = imagePath;
      this.isBackgroundTransitioning.set(true);

      if (this.transitionTimeout) {
        clearTimeout(this.transitionTimeout);
      }

      this.transitionTimeout = setTimeout(() => {
        this.currentBackground = imagePath;
        this.transitionBackground = null;
        this.isBackgroundTransitioning.set(false);
      }, this.transitionDurationMs);
      // this.isBackgroundLoading.set(false);
    };
    img.onerror = () => {
      console.warn('Failed to load background image:', imagePath);
      // this.isBackgroundLoading.set(false);
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

  getTitleTranslationKey(): string {
    const section = this.currentSection();
    if (section === 'default') {
      return 'home.discover.title';
    }
    return `home.sections.${section}.title`;
  }

  getDescTranslationKey(): string {
    const section = this.currentSection();
    if (section === 'default') {
      return 'home.discover.desc';
    }
    return `home.sections.${section}.desc`;
  }

  getSubtitleTranslationKey(): string {
    const section = this.currentSection();
    if (section === 'default') {
      return '';
    }
    return `home.sections.${section}.subtitle`;
  }

  /**
   * Obtient tous les éléments de menu principaux (sans enfants, ou les parents avec enfants)
   */
  private getMainMenuItems() {
    if (!this.menuSections || this.menuSections.length === 0) {
      return [];
    }
    // Retourne tous les items du premier menuSection
    return this.menuSections[0].items || [];
  }

  /**
   * Trouve l'index du menu courant basé sur la route actuelle
   */
  private getCurrentMenuIndex(): number {
    const currentUrl = this.router.url.split('#')[0].split('?')[0];
    const mainItems = this.getMainMenuItems();

    for (let i = 0; i < mainItems.length; i++) {
      const item = mainItems[i];
      if (item.route === currentUrl) {
        return i;
      }
      // Vérifier aussi si l'URL correspond au début de la route (pour les sous-routes)
      if (currentUrl.startsWith(item.route || '')) {
        return i;
      }
    }

    // Si on est sur la home page, retourner l'index de "Découvrez la SNED"
    if (currentUrl === '/' || currentUrl === '' || currentUrl === '/about') {
      return 0;
    }

    return -1;
  }

  /**
   * Obtient le menu suivant (avec boucle)
   */
  getNextMenuItem() {
    const mainItems = this.getMainMenuItems();
    if (mainItems.length === 0) {
      return null;
    }

    const currentIndex = this.getCurrentMenuIndex();
    const nextIndex =
      currentIndex === -1 ? 0 : (currentIndex + 1) % mainItems.length;

    return mainItems[nextIndex];
  }

  /**
   * Obtient le titre du menu suivant (pour l'afficher dans le bouton)
   */
  getNextMenuTitle(): string {
    const nextItem = this.getNextMenuItem();
    if (!nextItem) {
      return this.translateService.instant(
        'header.navigation.discover_project_button'
      );
    }
    return nextItem.label;
  }

  /**
   * Navigue vers le menu suivant
   */
  navigateToNextMenu() {
    const currentIndex = this.getCurrentMenuIndex();
    const mainItems = this.getMainMenuItems();
    const currentItem = mainItems[currentIndex] || null;

    const nextItem = this.getNextMenuItem();
    if (nextItem && nextItem.route) {
      // Track dynamic navigation
      this.analytics.trackDynamicNavigation(
        currentItem?.label || 'Unknown',
        nextItem.label
      );

      this.router.navigate([nextItem.route]);
    }
  }
}
