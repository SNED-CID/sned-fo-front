import { Injectable, inject } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

export interface MenuItem {
  label: string;
  route?: string;
  children?: MenuItem[];
  description?: string;
  isExternal?: boolean;
}

export interface MenuSection {
  label: string;
  items: MenuItem[];
}

@Injectable({
  providedIn: 'root',
})
export class MenuService {
  private readonly translateService = inject(TranslateService);

  constructor() {
    // S'abonner aux changements de langue pour rafraîchir les menus
    this.translateService.onLangChange.subscribe(() => {
      // Les menus seront regénérés à la prochaine demande
    });
  }

  // Générer le menu SNED de manière dynamique
  private get snedMenu(): MenuSection {
    return {
      label: this.translateService.instant('header.menu.discover_sned'),
      items: [
        {
          label: this.translateService.instant('header.menu.discover_sned'),
          route: '/',
          children: [
            { label: this.translateService.instant('header.menu.institutional_framework'), route: '/' },
            { label: this.translateService.instant('header.menu.missions_values'), route: '/' },
            { label: this.translateService.instant('header.menu.sned_secegsa'), route: '/' },
            { label: this.translateService.instant('header.menu.organization'), route: '/' },
            { label: this.translateService.instant('header.menu.partners'), route: '/partenaires' },
            { label: this.translateService.instant('header.menu.call_for_tenders'), route: '/' }
            
          ]
        }
      ]
    };
  }

  // Générer le menu Projet de manière dynamique
  private get projetMenu(): MenuSection {
    return {
      label: this.translateService.instant('header.menu.fixed_link_project'),
      items: [
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
              label: this.translateService.instant('header.menu.legal_aspect'),
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
      ],
    };
  }

  /**
   * Récupère le menu actif basé sur la route
   */
  getMenuForRoute(route: string): MenuSection | null {
    if (route === '/' || route === '/sned' || route === '/about') {
      return this.snedMenu;
    } else if (route.startsWith('/projet') || route.startsWith('/galerie')) {
      return this.projetMenu;
    }
    return null;
  }

  /**
   * Récupère les items du menu pour un route donnée
   */
  getMenuItemsForRoute(route: string): MenuItem[] {
    const menu = this.getMenuForRoute(route);
    return menu ? menu.items : [];
  }

  /**
   * Récupère le label du menu pour une route donnée
   */
  getMenuTitleForRoute(route: string): string {
    const menu = this.getMenuForRoute(route);
    return menu ? menu.label : '';
  }
}
