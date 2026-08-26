import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NAV_ITEMS } from '../../layout/nav-items';

@Component({
  selector: 'page-home',
  imports: [RouterLink],
  templateUrl: './home.html',
})
export default class Home {
  protected readonly navItems = NAV_ITEMS;
}
