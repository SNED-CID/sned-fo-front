import { Injectable } from '@angular/core';

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
  providedIn: 'root'
})
export class MenuService {

  // Menu: Découvrez la SNED
  snedMenu: MenuSection = {
    label: 'Découvrez la SNED',
    items: [
      {
        label: 'Découvrez la SNED',
        route: '/',
        children: [
          { label: 'Nous connaitre', route: '/' },
          { label: 'Contexte stratégique', route: '/' },
          { label: 'Missions et valeurs', route: '/' },
          { label: 'Cadre institutionnel', route: '/' },
          { label: 'Mot du PDG', route: '/' },
          { label: 'Organisation', route: '/' },
          { label: 'SNED & SECEG SA', route: '/' }
        ]
      }
    ]
  };

  // Menu: Projet de liaison fixe
  projetMenu: MenuSection = {
    label: 'Projet de liaison fixe',
    items: [
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
      }
    ]
  };

  constructor() { }

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
