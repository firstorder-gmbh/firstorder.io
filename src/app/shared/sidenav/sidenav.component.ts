
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Direction } from '@angular/cdk/bidi';
import { MatSidenav } from '@angular/material';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Router, RoutesRecognized } from '@angular/router';

import { LanguageService } from './../translate/language.service';
import { SidenavService } from './../sidenav/sidenav.service';

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.scss']
})
export class SidenavComponent implements OnDestroy, OnInit {

  dir: Direction;
  isHandset$: Observable<boolean> = this.breakpointObserver
    .observe(Breakpoints.Handset)
    .pipe(map(result => result.matches));
  @ViewChild('navbar') navbar: MatSidenav;
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

    this.router.events.subscribe(data => {
      if (data instanceof RoutesRecognized) {
        this.selectedTitle = data.state.root.firstChild.data.title;
      }
    });
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
