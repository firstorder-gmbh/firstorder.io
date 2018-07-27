
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Direction } from '@angular/cdk/bidi';
import { MatSidenav } from '@angular/material';
import { Router, RoutesRecognized } from '@angular/router';

import { LanguageService } from '../translate/language.service';
import { SidenavService } from './sidenav.service';

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.scss']
})
export class SidenavComponent implements OnDestroy, OnInit {

  contentClass: string;
  dir: Direction;
  isDesktop: boolean;
  isDesktop$ = this.breakpointObserver
    .observe([Breakpoints.Large, Breakpoints.XLarge])
    .subscribe(result => {
      this.isDesktop = result.matches;
    });

  @ViewChild('navbar') navbar: MatSidenav;
  navList = [
    { class: 'home', icon: 'home', link: '/home', title: 'HOME' },
    { class: 'shop', icon: 'shop', link: '/shop', title: 'SHOP.TITLE' },
    { class: 'imprint', icon: '§', link: '/imprint', title: 'IMPRINT.TITLE' }
  ];
  selectedTitle: string;

  constructor(
      private breakpointObserver: BreakpointObserver,
      private languageService: LanguageService,
      private router: Router,
      private sidenavService: SidenavService
  ) {
    this.languageService.dir.subscribe(dir => {
      this.dir = dir;
    });

    this.sidenavService.contentClass.subscribe((contentClass: string) => {
      this.contentClass = contentClass;
    });

    this.router.events.subscribe(data => {
      if (data instanceof RoutesRecognized) {
        this.selectedTitle = data.state.root.firstChild.data.title;
      }
    });
  }

  async closeNavbar(): Promise<void> {
    if (!this.isDesktop) {
      await this.sidenavService.closeNavbar();
    }
  }

  detailsOpenedChange(isOpen: boolean): void {
    this.sidenavService.isOpenDetails.next(isOpen);
  }

  navbarOpenedChange(isOpen: boolean): void {
    this.sidenavService.isOpenNavbar.next(isOpen);
  }

  ngOnDestroy(): void {
    // prevent memory leak when component destroyed
    this.languageService.dir.unsubscribe();
  }

  ngOnInit(): void {
    this.sidenavService.setNavbar(this.navbar);
  }

}
