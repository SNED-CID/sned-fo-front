import {AfterViewInit, Component, OnInit, signal, inject} from '@angular/core';
import {HeaderComponent} from './components/header/header/header.component';
import Lenis from 'lenis';
import {AboutComponent} from './components/about/about.component';
import {AnchorComponent} from './components/anchor/anchor.component';
import {RouterOutlet} from '@angular/router';
import {FooterComponent} from './components/footer/footer.component';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';

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

  ngOnInit() {
    // Initialiser la langue courante
    this.currentLang.set(this.translateService.currentLang || this.translateService.defaultLang || 'fr');

    // S'abonner aux changements de langue
    this.translateService.onLangChange.subscribe((event) => {
      this.currentLang.set(event.lang);
    });
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
