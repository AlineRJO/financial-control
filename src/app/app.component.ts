import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { PoMenuItem } from '@po-ui/ng-components';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  menus: Array<PoMenuItem> = [
    { label: 'Register user',
     action: () => this.navigateToHome('/register'),
     icon: 'po-icon-user', shortLabel: 'Register' },
  ];

  constructor(
    private route: Router
  ) {}

  navigateToHome(url: string) {
    this.route.navigateByUrl(`/register`);
  }

}
