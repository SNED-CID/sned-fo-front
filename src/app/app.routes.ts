import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { PartnersComponent } from './components/partners/partners.component';
import { CommuniquePage } from './components/communique/communique-page/communique-page';
import { TendersComponent } from './components/tenders/tenders.component';
import { SiteMapComponent } from './components/site-map/site-map.component';
import { MentionsLegalesComponent } from './components/mentions-legales/mentions-legales.component';
import { ContactUsComponent } from './components/contact-us/contact-us.component';

export const routes: Routes = [
  // Home
  { path: '', component: HomeComponent },

  // Projet
  { path: 'projet', component: HomeComponent },
  { path: 'projet/ingenierie', component: HomeComponent },
  { path: 'projet/historique', component: HomeComponent },
  { path: 'projet/milieu-physique', component: HomeComponent },
  { path: 'projet/socio-economique', component: HomeComponent },
  { path: 'projet/geostrategie', component: HomeComponent },

  // Galerie
  { path: 'galerie', component: HomeComponent },
  { path: 'galerie/ingenierie', component: HomeComponent },
  { path: 'galerie/milieu-physique', component: HomeComponent },
  { path: 'galerie/socio-economique', component: HomeComponent },

  // Publications
  { path: 'publication', component: CommuniquePage },
  // Partenariats
  { path: 'partenariat', component: PartnersComponent },
  // Appels d'offres
  { path: 'appels-offres', component: TendersComponent },

  // Travail
  { path: 'travail', component: HomeComponent },
  { path: 'travail/congres', component: HomeComponent },
  { path: 'travail/communication', component: HomeComponent },
  { path: 'travail/video', component: HomeComponent },
  { path: 'travail/statistiques', component: HomeComponent },

  { path: 'site-map', component: SiteMapComponent },
  { path: 'mentions-legales', component: MentionsLegalesComponent },
  { path: 'contact', component: ContactUsComponent },

  // Alias
  { path: 'sned', redirectTo: '', pathMatch: 'full' },

  // Fallback
  { path: '**', redirectTo: '' },
];
