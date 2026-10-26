import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';

export const routes: Routes = [
  // Home
  { path: '', component: HomeComponent, data: { seo: 'home' } },

  // About
  { path: 'about', 
    loadComponent: () => import('./components/about/about.component').then(m => m.AboutComponent),
    data: { seo: 'about' },
  },

  // Projet
  { path: 'projet', 
    loadComponent: () => import('./components/projet/projet.component').then(m => m.ProjetComponent),
    data: { seo: 'projet' },
  },

  // Galerie
  { path: 'galerie', component: HomeComponent, data: { seo: 'galerie' } },
  { path: 'galerie/ingenierie', component: HomeComponent, data: { seo: 'galerie_ingenierie' } },
  { path: 'galerie/milieu-physique', component: HomeComponent, data: { seo: 'galerie_milieu_physique' } },
  { path: 'galerie/socio-economique', component: HomeComponent, data: { seo: 'galerie_socio_economique' } },

  // Publications
  { 
  path: 'publication', 
  loadComponent: () => import('./components/communique/communique-page/communique-page').then(m => m.CommuniquePage),
  data: { seo: 'publication' },
},
  // Partenariats
  { 
  path: 'partenariat', 
  loadComponent: () => import('./components/partners/partners.component').then(m => m.PartnersComponent),
  data: { seo: 'partenariat' },
},
  // Appels d'offres
  { 
  path: 'appels-offres', 
  loadComponent: () => import('./components/tenders/tenders.component').then(m => m.TendersComponent),
  data: { seo: 'appels_offres' },
},

  // Travail
  { path: 'travail', component: HomeComponent, data: { seo: 'travail' } },
  { path: 'travail/congres', component: HomeComponent, data: { seo: 'travail_congres' } },
  { path: 'travail/communication', component: HomeComponent, data: { seo: 'travail_communication' } },
  { path: 'travail/video', component: HomeComponent, data: { seo: 'travail_video' } },
  { path: 'travail/statistiques', component: HomeComponent, data: { seo: 'travail_statistiques' } },

  { 
  path: 'site-map', 
  loadComponent: () => import('./components/site-map/site-map.component').then(m => m.SiteMapComponent),
  data: { seo: 'site_map' },
},
  { 
  path: 'mentions-legales', 
  loadComponent: () => import('./components/mentions-legales/mentions-legales.component').then(m => m.MentionsLegalesComponent),
  data: { seo: 'mentions_legales' },
},
  { 
  path: 'contact', 
  loadComponent: () => import('./components/contact-us/contact-us.component').then(m => m.ContactUsComponent),
  data: { seo: 'contact' },
},

  // Alias
  { path: 'sned', redirectTo: '', pathMatch: 'full' },

  // Fallback
  { path: '**', redirectTo: '' },
];
