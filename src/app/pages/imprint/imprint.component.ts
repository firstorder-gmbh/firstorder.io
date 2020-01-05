import { Component } from '@angular/core';

import { FooterService } from '../../shared/footer/footer.service';
import { HeaderService } from '../../shared/header/header.service';

@Component({
  selector: 'app-imprint',
  templateUrl: './imprint.component.html',
  styleUrls: ['./imprint.component.scss']
})
export class ImprintComponent {
  constructor(
      private footerService: FooterService,
      private headerService: HeaderService
  ) {
    this.footerService.footerClass$.next(null);
    this.headerService.headerClass$.next(null);
    this.headerService.headerTitle$.next('IMPRINT.TITLE');
  }
}
