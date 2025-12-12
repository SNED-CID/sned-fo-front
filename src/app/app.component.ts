import {AfterViewInit, Component, OnInit, PLATFORM_ID, inject} from '@angular/core';
import {HeaderComponent} from './components/header/header/header.component';
import Lenis from 'lenis';
import {RouterOutlet} from '@angular/router';
import {FooterComponent} from './components/footer/footer.component';
import { TranslatePipe } from '@ngx-translate/core';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-root',
  imports: [HeaderComponent, RouterOutlet, FooterComponent, TranslatePipe],
  templateUrl: './app.component.html',
  standalone: true,
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements AfterViewInit{
  title = 'sned-fo-front';
  private isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

  ngAfterViewInit() {
    if (!this.isBrowser) return;

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
