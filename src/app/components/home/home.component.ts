import { Component, OnInit, signal, ChangeDetectorRef } from '@angular/core';
import {AnchorComponent} from '../anchor/anchor.component';
import {AboutComponent} from '../about/about.component';
import { Router } from '@angular/router';
import { MenuService, MenuItem } from '../../services/menu.service';
import {TranslatePipe, TranslateService} from '@ngx-translate/core';

@Component({
  selector: 'app-home',
  imports: [AnchorComponent, AboutComponent, TranslatePipe],
  standalone: true,
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit {
  currentRoute: string = '';
  refreshTrigger = signal(0);

  constructor(
    private router: Router,
    private menuService: MenuService,
    private translateService: TranslateService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.router.events.subscribe(() => {
      this.currentRoute = this.router.url.split('?')[0];
      this.refreshTrigger.update(v => v + 1);
    });
    this.currentRoute = this.router.url.split('?')[0];

    // Forcer la mise à jour lors du changement de langue
    this.translateService.onLangChange.subscribe(() => {
      this.refreshTrigger.update(v => v + 1);
      this.cdr.detectChanges();
    });
  }

  get activeMenuItems(): MenuItem[] {
    // Le signal force la réévaluation
    this.refreshTrigger();
    return this.menuService.getMenuItemsForRoute(this.currentRoute);
  }

  get activeMenuTitle(): string {
    // Le signal force la réévaluation
    this.refreshTrigger();
    return this.menuService.getMenuTitleForRoute(this.currentRoute);
  }
}
