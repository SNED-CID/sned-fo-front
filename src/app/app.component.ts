import {AfterViewInit, Component, OnInit} from '@angular/core';
import {HeaderComponent} from './components/header/header/header.component';
import Lenis from 'lenis';
import {AboutComponent} from './components/about/about.component';

@Component({
  selector: 'app-root',
  imports: [HeaderComponent, AboutComponent],
  templateUrl: './app.component.html',
  standalone: true,
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements AfterViewInit{
  title = 'sned-fo-front';

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
