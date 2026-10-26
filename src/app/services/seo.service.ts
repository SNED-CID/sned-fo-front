import { DOCUMENT } from '@angular/common';
import { inject, Injectable } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { ActivatedRouteSnapshot, NavigationEnd, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { filter, map, merge, switchMap } from 'rxjs';
import { environment } from '../../environments/environment';

const DEFAULT_PAGE = 'home';
const OG_IMAGE = 'assets/logos/snednotext.png';
const OG_LOCALES: Record<string, string> = {
  fr: 'fr_FR',
  en: 'en_US',
  ar: 'ar_MA',
};

/**
 * Met à jour <title>, meta description, Open Graph, Twitter, lien canonical
 * et l'attribut lang à chaque navigation / changement de langue.
 * La clé de page est lue dans `data.seo` de la route (voir app.routes.ts).
 */
@Injectable({ providedIn: 'root' })
export class SeoService {
  private readonly router = inject(Router);
  private readonly translate = inject(TranslateService);
  private readonly title = inject(Title);
  private readonly meta = inject(Meta);
  private readonly document = inject(DOCUMENT);

  init(): void {
    merge(
      this.router.events.pipe(filter((event) => event instanceof NavigationEnd)),
      this.translate.onLangChange,
    )
      .pipe(
        switchMap(() => {
          const page = this.getPageKey(this.router.routerState.snapshot.root);
          return this.translate
            .get([`seo.pages.${page}.title`, `seo.pages.${page}.description`, 'seo.site_name'])
            .pipe(
              map((t: Record<string, string>) => ({
                page,
                title: t[`seo.pages.${page}.title`],
                description: t[`seo.pages.${page}.description`],
                siteName: t['seo.site_name'],
              })),
            );
        }),
      )
      .subscribe(({ page, title, description, siteName }) => {
        this.updateTags(
          page === DEFAULT_PAGE ? title : `${title} | ${siteName}`,
          description,
          siteName,
        );
      });
  }

  private updateTags(title: string, description: string, siteName: string): void {
    const lang = this.translate.getCurrentLang() || 'fr';
    const path = this.router.url.split('#')[0].split('?')[0];
    const url = `${environment.siteUrl}${path === '/' ? '/' : path}`;
    const image = `${environment.siteUrl}/${OG_IMAGE}`;

    this.title.setTitle(title);
    this.meta.updateTag({ name: 'description', content: description });

    this.meta.updateTag({ property: 'og:type', content: 'website' });
    this.meta.updateTag({ property: 'og:site_name', content: siteName });
    this.meta.updateTag({ property: 'og:title', content: title });
    this.meta.updateTag({ property: 'og:description', content: description });
    this.meta.updateTag({ property: 'og:url', content: url });
    this.meta.updateTag({ property: 'og:image', content: image });
    this.meta.updateTag({ property: 'og:locale', content: OG_LOCALES[lang] ?? OG_LOCALES['fr'] });

    this.meta.updateTag({ name: 'twitter:card', content: 'summary_large_image' });
    this.meta.updateTag({ name: 'twitter:title', content: title });
    this.meta.updateTag({ name: 'twitter:description', content: description });
    this.meta.updateTag({ name: 'twitter:image', content: image });

    this.setCanonical(url);
    this.document.documentElement.lang = lang;
  }

  private setCanonical(url: string): void {
    let link = this.document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!link) {
      link = this.document.createElement('link');
      link.setAttribute('rel', 'canonical');
      this.document.head.appendChild(link);
    }
    link.setAttribute('href', url);
  }

  private getPageKey(route: ActivatedRouteSnapshot): string {
    let current: ActivatedRouteSnapshot | null = route;
    let page = DEFAULT_PAGE;
    while (current) {
      page = current.data['seo'] ?? page;
      current = current.firstChild;
    }
    return page;
  }
}
