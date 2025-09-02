import {Component, ElementRef, OnInit, signal, ViewChild} from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-anchor',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './anchor.component.html',
  styleUrls: ['./anchor.component.scss']
})
export class AnchorComponent implements OnInit {
  isHomeRoute = signal(false);

  links = [
    { id: 'apropos', label: 'À propos' },
    { id: 'contexte', label: 'Contexte stratégique' },
    { id: 'missions', label: 'Missions et valeurs' },
    { id: 'cadre', label: 'Cadre institutionnel' },
    { id: 'orga', label: 'Organisation' },
    { id: 'pdg', label: 'Mot du PDG' },
    { id: 'snedseceg', label: 'SNED & SECEG SA' }
  ];

  constructor(private router: Router) {}

  ngOnInit() {
    this.router.events.subscribe(() => {
      const url = this.router.url.split('?')[0];
      this.isHomeRoute.set(url === '/' || url === '/sned');
    });

    // init au premier chargement
    const url = this.router.url.split('?')[0];
    this.isHomeRoute.set(url === '/' || url === '/sned');
  }

  scrollTo(id: string) {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }
}
