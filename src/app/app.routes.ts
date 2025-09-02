import { Routes } from '@angular/router';
import {AppComponent} from './app.component';
import {HomeComponent} from './components/home/home.component'; // adapte l'import

export const routes: Routes = [
  { path: '', component: HomeComponent },

  { path: 'sned', redirectTo: '', pathMatch: 'full' },

  { path: '**', redirectTo: '' }
];
