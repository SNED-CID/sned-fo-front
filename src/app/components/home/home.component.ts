import { Component, OnInit } from '@angular/core';
import {AnchorComponent} from '../anchor/anchor.component';
import {AboutComponent} from '../about/about.component';
import { Router } from '@angular/router';
import { MenuService, MenuItem } from '../../services/menu.service';
import {TranslatePipe} from '@ngx-translate/core';

@Component({
  selector: 'app-home',
  imports: [AnchorComponent, AboutComponent, TranslatePipe],
  standalone: true,
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit {
  currentRoute: string = '';

  constructor(private router: Router, private menuService: MenuService) {}

  ngOnInit() {
    this.router.events.subscribe(() => {
      this.currentRoute = this.router.url.split('?')[0];
    });
    this.currentRoute = this.router.url.split('?')[0];
  }

  get activeMenuItems(): MenuItem[] {
    return this.menuService.getMenuItemsForRoute(this.currentRoute);
  }

  get activeMenuTitle(): string {
    return this.menuService.getMenuTitleForRoute(this.currentRoute);
  }
}
