import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';

export const routes: Routes = [
  // Home
  { path: '', component: HomeComponent },

  // About
  { path: 'about', 
    loadComponent: () => import('./components/about/about.component').then(m => m.AboutComponent)
  },

  // Projet
  { path: 'projet', 
    loadComponent: () => import('./components/projet/projet.component').then(m => m.ProjetComponent)
  },

  // Galerie
  { path: 'galerie', component: HomeComponent },
  { path: 'galerie/ingenierie', component: HomeComponent },
  { path: 'galerie/milieu-physique', component: HomeComponent },
  { path: 'galerie/socio-economique', component: HomeComponent },

  // Publications
  { 
  path: 'publication', 
  loadComponent: () => import('./components/communique/communique-page/communique-page').then(m => m.CommuniquePage)
},
  // Partenariats
  { 
  path: 'partenariat', 
  loadComponent: () => import('./components/partners/partners.component').then(m => m.PartnersComponent)
},
  // Appels d'offres
  { 
  path: 'appels-offres', 
  loadComponent: () => import('./components/tenders/tenders.component').then(m => m.TendersComponent)
},

  // Travail
  { path: 'travail', component: HomeComponent },
  { path: 'travail/congres', component: HomeComponent },
  { path: 'travail/communication', component: HomeComponent },
  { path: 'travail/video', component: HomeComponent },
  { path: 'travail/statistiques', component: HomeComponent },

  { 
  path: 'site-map', 
  loadComponent: () => import('./components/site-map/site-map.component').then(m => m.SiteMapComponent)
},
  { 
  path: 'mentions-legales', 
  loadComponent: () => import('./components/mentions-legales/mentions-legales.component').then(m => m.MentionsLegalesComponent)
},
  { 
  path: 'contact', 
  loadComponent: () => import('./components/contact-us/contact-us.component').then(m => m.ContactUsComponent)
},

  // Alias
  { path: 'sned', redirectTo: '', pathMatch: 'full' },

  // Fallback
  { path: '**', redirectTo: '' },
];
