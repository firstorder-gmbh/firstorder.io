import { CommonModule } from '@angular/common';
import { Component, NgModule } from '@angular/core';
import { MatButtonModule, MatIconModule, MatToolbarModule } from '@angular/material';
import { TranslateModule } from '@ngx-translate/core';

import { HeaderService } from './../header/header.service';
import { SidenavService } from './../sidenav/sidenav.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
  headerClass: string;
  headerTitle: string;
  isOpenNavbar = this.sidenavService.isOpenNavbar.getValue();

  constructor(
      private headerService: HeaderService,
      private sidenavService: SidenavService
  ) {
    this.headerService.headerClass.subscribe((headerClass: string) => {
      this.headerClass = headerClass;
    });

    this.headerService.headerTitle.subscribe((headerTitle: string) => {
      this.headerTitle = headerTitle;
    });

    this.sidenavService.isOpenNavbar.subscribe((isOpen: boolean) => {
      this.isOpenNavbar = isOpen;
    });
  }

  toggleNavbar(): void {
    this.sidenavService.toggleNavbar();
  }
}

@NgModule({
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatToolbarModule,
    TranslateModule.forChild()
  ],
  exports: [HeaderComponent],
  declarations: [HeaderComponent]
})
export class HeaderModule {}
