import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent implements OnInit {

  public readonly menuItems: Array<{label: string, url: string, icon: string}> = [
    { label: 'Adicionar Ordem', url: 'register', icon: 'po-icon-money' },
    { label: 'Estatisticas', url: 'statistic', icon: 'po-icon-money' },
  ];

  constructor(private router: Router) { }

  ngOnInit(): void {
  }

  changePage(url: string) {
    return this.router.navigateByUrl(url);
  }
}
