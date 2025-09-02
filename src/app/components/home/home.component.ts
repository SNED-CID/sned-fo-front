import { Component } from '@angular/core';
import {AnchorComponent} from '../anchor/anchor.component';
import {AboutComponent} from '../about/about.component';
import {NgIf} from '@angular/common';

@Component({
  selector: 'app-home',
  imports: [AnchorComponent, AboutComponent, NgIf],
  standalone: true,
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {

}
