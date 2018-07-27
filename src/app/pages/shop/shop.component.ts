import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

import { FooterService } from '../../shared/footer/footer.service';
import { HeaderService } from '../../shared/header/header.service';
import { Product } from '../../shared/product/product';
import { ProductService } from '../../shared/product/product.service';

@Component({
  selector: 'app-shop',
  templateUrl: './shop.component.html',
  styleUrls: ['./shop.component.scss']
})
export class ShopComponent {

  currentLang: string;
  selectedProduct: Product;

  constructor(
    protected productService: ProductService,
    protected translate: TranslateService,
    private footerService: FooterService,
    private headerService: HeaderService,
    private router: Router
  ) {
    this.footerService.footerClass.next(null);
    this.headerService.headerClass.next(null);
    this.headerService.headerTitle.next('SHOP.TITLE');

    translate.onLangChange.subscribe(() => {
      this.currentLang = translate.currentLang;
    });
  }

  hideProduct(): void {
    this.router.navigate(['/shop']);
    this.selectedProduct = null;
  }

  showProduct(product: Product): void {
    this.selectedProduct = product;
    this.router.navigate(['/shop', product.id]);
  }
}
