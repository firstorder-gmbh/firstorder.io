import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { Component, Input, OnDestroy } from '@angular/core';
import { Direction } from '@angular/cdk/bidi';
import { of, Subject } from 'rxjs';
import { switchMap, takeUntil } from 'rxjs/operators';
import { TranslateService } from '@ngx-translate/core';

import { FooterService } from '../../shared/footer/footer.service';
import { HeaderService } from '../../shared/header/header.service';
import { LanguageService } from './../../shared/translate/language.service';
import { Product } from '../../shared/product/product';
import { ProductService } from '../../shared/product/product.service';
import { SidenavService } from './../../shared/sidenav/sidenav.service';

@Component({
  selector: 'app-shop',
  templateUrl: './shop.component.html',
  styleUrls: ['./shop.component.scss']
})
export class ShopComponent implements OnDestroy {

  currentLang: string;
  @Input() dir: Direction;
  selectedProduct: Product;
  private ngUnsubscribe = new Subject();

  constructor(
    public productService: ProductService,
    protected translate: TranslateService,
    private footerService: FooterService,
    private headerService: HeaderService,
    private languageService: LanguageService,
    private route: ActivatedRoute,
    private router: Router,
    private sidenavService: SidenavService
  ) {
    this.footerService.footerClass.next(null);
    this.headerService.headerClass.next(null);
    this.headerService.headerTitle.next('SHOP.TITLE');

    this.languageService.dir.subscribe(dir => {
      this.dir = dir;
    });

    this.route.paramMap.pipe(
      switchMap((params: ParamMap) =>
        of(params.get('id'))
      )
    ).subscribe((id: string) => {
      this.productService.productId$.next(id);
      this.sidenavService.contentClass.next(id ? 'position-absolute' : null);
    });

    productService.product$
    .pipe(takeUntil(this.ngUnsubscribe))
    .subscribe((product: Product) => {
      this.selectedProduct = product;
    });

    translate.onLangChange
    .pipe(takeUntil(this.ngUnsubscribe))
    .subscribe(() => {
      this.currentLang = translate.currentLang;
    });
  }

  closeProduct(): void {
    this.sidenavService.contentClass.next(null);
    this.selectedProduct = null;
    void this.router.navigate(['/shop']);
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  openProduct(product: Product): void {
    this.sidenavService.contentClass.next('position-absolute');
    this.selectedProduct = product;
    void this.router.navigate(['/shop', product.id]);
  }
}
