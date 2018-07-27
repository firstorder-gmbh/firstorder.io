import { Component } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { FooterService } from './../../shared/footer/footer.service';
import { HeaderService } from '../../shared/header/header.service';

@Component({
  selector: 'app-shop',
  templateUrl: './shop.component.html',
  styleUrls: ['./shop.component.scss']
})
export class ShopComponent {

  isHandset$: Observable<boolean> = this.breakpointObserver
    .observe(Breakpoints.Handset)
    .pipe(
      map(result => {
        return result.matches;
      })
    );

  constructor(
      private breakpointObserver: BreakpointObserver,
      private footerService: FooterService,
      private headerService: HeaderService
  ) {
    this.footerService.footerClass.next(null);
    this.headerService.headerClass.next(null);
    this.headerService.headerTitle.next('SHOP.TITLE');
  }
}
