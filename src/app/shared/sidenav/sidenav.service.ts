import { BehaviorSubject } from 'rxjs';
import { Injectable } from '@angular/core';
import { MatDrawerToggleResult, MatSidenav } from '@angular/material';

@Injectable()
export class SidenavService {

  isOpenNavbar: BehaviorSubject<boolean> = new BehaviorSubject(false);
  private navbar: MatSidenav;

  closeNavbar(): Promise<MatDrawerToggleResult> {
    this.isOpenNavbar.next(false);

    return this.navbar.close();
  }

  openNavbar(): Promise<MatDrawerToggleResult> {
    this.isOpenNavbar.next(true);

    return this.navbar.open();
  }

  setNavbar(navbar: MatSidenav): void {
    this.navbar = navbar;
  }

  toggleNavbar(): Promise<MatDrawerToggleResult> {
    return this.navbar.toggle(!this.isOpenNavbar.value);
  }
}
