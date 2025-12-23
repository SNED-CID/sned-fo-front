import {AfterViewInit, Component, OnInit, signal, inject} from '@angular/core';
import {HeaderComponent} from './components/header/header/header.component';
import Lenis from 'lenis';
import {AboutComponent} from './components/about/about.component';
import {AnchorComponent} from './components/anchor/anchor.component';
import {Router, NavigationEnd, RouterOutlet} from '@angular/router';
import {FooterComponent} from './components/footer/footer.component';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { AnalyticsService } from './services/analytics.service';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  imports: [HeaderComponent, RouterOutlet, FooterComponent, TranslatePipe],
  templateUrl: './app.component.html',
  standalone: true,
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements AfterViewInit, OnInit{
  title = 'sned-fo-front';
  currentLang = signal('fr');
  private readonly translateService = inject(TranslateService);
  private readonly analytics = inject(AnalyticsService);
  private readonly router = inject(Router);
  private pageLoadTime: number = Date.now();

  ngOnInit() {
    // Initialiser la langue courante
    this.currentLang.set(this.translateService.currentLang || this.translateService.defaultLang || 'fr');

    this.translateService.onLangChange.subscribe((event) => {
      const previousLang = this.currentLang();
      this.currentLang.set(event.lang);

      this.analytics.trackLanguageChange(previousLang, event.lang);
    });

    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        const pagePath = event.urlAfterRedirects;
        const pageTitle = this.getPageTitle(pagePath);

        const timeSpent = Math.floor((Date.now() - this.pageLoadTime) / 1000);
        if (timeSpent > 0) {
          this.analytics.trackTimeOnPage(pagePath, timeSpent);
        }

        this.analytics.trackPageView(pagePath, pageTitle);

        this.pageLoadTime = Date.now();
      });
  }

  private getPageTitle(path: string): string {
    const pathWithoutFragment = path.split('#')[0].split('?')[0];

    const titleMap: Record<string, string> = {
      '/': 'Accueil',
      '/about': 'À propos - SNED',
      '/projet': 'Projet de liaison fixe',
      '/projet/ingenierie': 'Composante Ingénierie',
      '/projet/milieu-physique': 'Composante Milieu Physique',
      '/projet/socio-economique': 'Composante Socio-économique',
      '/galerie': 'Galerie de reconnaissance',
      '/actualite': 'Actualités',
      '/partenariat': 'Partenariats',
      '/appels-offres': 'Appels d\'offres'
    };

    return titleMap[pathWithoutFragment] || document.title || 'SNED';
  }

  ngAfterViewInit() {
    const lenis = new Lenis({
      lerp: 0.1,
      smoothWheel: true,
    });

    (window as any).lenis = lenis;

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);
  }







}
