import { BehaviorSubject } from 'rxjs';
import { Injectable } from '@angular/core';
import { MatDrawerToggleResult, MatSidenav } from '@angular/material';

@Injectable()
export class SidenavService {

  contentClass: BehaviorSubject<string> = new BehaviorSubject(null);
  isOpenDetails: BehaviorSubject<boolean> = new BehaviorSubject(false);
  isOpenNavbar: BehaviorSubject<boolean> = new BehaviorSubject(false);

  private details: MatSidenav;
  private navbar: MatSidenav;

  closeDetails(): Promise<MatDrawerToggleResult> {
    this.isOpenDetails.next(false);

    return this.details.close();
  }

  closeNavbar(): Promise<MatDrawerToggleResult> {
    this.isOpenNavbar.next(false);

    return this.navbar.close();
  }

  openDetails(): Promise<MatDrawerToggleResult> {
    this.isOpenDetails.next(true);

    return this.navbar.open();
  }

  openNavbar(): Promise<MatDrawerToggleResult> {
    this.isOpenNavbar.next(true);

    return this.navbar.open();
  }

  setDetails(details: MatSidenav): void {
    this.details = details;
  }

  setNavbar(navbar: MatSidenav): void {
    this.navbar = navbar;
  }

  toggleDetails(): Promise<MatDrawerToggleResult> {
    return this.details.toggle(!this.isOpenDetails.value);
  }

  toggleNavbar(): Promise<MatDrawerToggleResult> {
    return this.navbar.toggle(!this.isOpenNavbar.value);
  }
}
