import { AngularFirestore } from 'angularfire2/firestore';
import { Observable } from 'rxjs';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Component, ElementRef, Inject, Input, NgModule, PLATFORM_ID, ViewChild } from '@angular/core';
import { Direction } from '@angular/cdk/bidi';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { makeStateKey, StateKey, TransferState } from '@angular/platform-browser';
import { map, startWith } from 'rxjs/operators';
import { MatAutocompleteModule, MatAutocompleteTrigger, MatButtonModule, MatFormFieldModule,
  MatIconModule, MatInputModule, MatToolbarModule } from '@angular/material';
import { Router } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

import { HeaderService } from './header.service';
import { Product } from '../product/product';
import { ProductService } from '../product/product.service';
import { SidenavService } from '../sidenav/sidenav.service';

export interface SearchGroup {
  group: string;
  key: string;
  options: Array<string>;
}

export const _filter = (options: Array<string>, value: string): Array<string> => {
  const filterValue = value.toLowerCase();
  if (options) {
    return options.filter(option => option.toLowerCase().indexOf(filterValue) === 0);
  } else {
    return [];
  }
};

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
  @ViewChild(MatAutocompleteTrigger) autocompleteTrigger: MatAutocompleteTrigger;
  currentLang: string;
  @Input() dir: Direction;
  headerClass: string;
  headerTitle: string;
  isOpenNavbar = this.sidenavService.isOpenNavbar.getValue();

  products: Array<Product>;

  searchForm: FormGroup = this.fb.group({
    searchInput: ''
  });
  searchGroupOptions$: Observable<Array<SearchGroup>>;
  searchGroups: Array<SearchGroup> = [];
  @ViewChild('searchInput') searchInput: ElementRef;
  searchProductsAutocomplete: any;

  constructor(
    public productService: ProductService,
    protected afs: AngularFirestore,
    protected translate: TranslateService,
    private headerService: HeaderService,
    private fb: FormBuilder,
    private router: Router,
    private sidenavService: SidenavService,
    private transferState: TransferState,
    @Inject(PLATFORM_ID) private platformId: string
  ) {
    const key: StateKey<number> = makeStateKey<number>('transfer-state-search-products');

    // First we are looking in transfer-state, if nothing found we read from firestore
    this.searchProductsAutocomplete = this.transferState.get(key, null);
    if (this.searchProductsAutocomplete) {
      this.translateSearchGroups();
    } else {
      afs.collection<any>('autocompletes').doc('search-products').valueChanges()
      .subscribe(data => {
        if (!isPlatformBrowser(this.platformId)) { // write transfer state if on the server
          this.transferState.set(key, data);
        }
        this.searchProductsAutocomplete = data;
        this.translateSearchGroups();
      });
    }

    translate.onLangChange.subscribe(() => {
      this.currentLang = translate.currentLang;
      this.translateSearchGroups();
    });

    if (this.searchForm.get('searchInput') !== undefined) {
      this.searchGroupOptions$ = this.searchForm.get('searchInput').valueChanges
      .pipe(
        startWith(''),
        map(value => this._filterGroup(value))
      );
    }

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

  clearSearch(): void {
    this.searchForm.get('searchInput').setValue('');
    this.productService.search$.next(null); // reset search list
    setTimeout(() => {
      this.searchInput.nativeElement.focus();
      this.autocompleteTrigger.openPanel();
    });
  }

  closeSearch(): void {
    if (this.headerClass) {
      this.headerClass = this.headerClass.replace('search-open', '').trim();
      this.autocompleteTrigger.closePanel();
    }
  }

  onSearchChange(search: string | null): void {
    this.productService.search$.next(search ? search.toLocaleLowerCase() : null);
  }

  searchProducts(option: string): void {
    this.onSearchChange(option);
    void this.router.navigate(['/shop']);
  }

  showProduct(product: Product): void {
    void this.router.navigate(['/shop', product.id]);
  }

  async toggleNavbar(): Promise<void> {
    await this.sidenavService.toggleNavbar();
  }

  toggleSearch(): void {
    if (!this.headerClass) {
      this.headerClass = 'search-open';
      setTimeout(() => {
        this.searchInput.nativeElement.focus();
      });
    } else if (this.headerClass.indexOf('search-open') === -1) {
      this.headerClass += ' search-open';
      setTimeout(() => {
        this.searchInput.nativeElement.focus();
      });
    } else {
      this.headerClass = this.headerClass.replace('search-open', '').trim();
    }
  }

  private _filterGroup(value: string): Array<SearchGroup> {
    if (value) {
      return this.searchGroups
        .map(searchGroup => ({
          key: searchGroup.key,
          group: searchGroup.group,
          options: _filter(searchGroup.options, value)
        }))
        .filter(searchGroup => searchGroup.options.length > 0);
    }

    return this.searchGroups;
  }

  private translateSearchGroups(): void {
    if (this.searchProductsAutocomplete) {
      this.searchGroups = [];
      // Add predefined options
      Object.keys(this.searchProductsAutocomplete).map(index => {
        const obj = this.searchProductsAutocomplete[index];
        const group = obj.group[this.currentLang] || obj.group.en; // translate or default to english
        const options = obj.options[this.currentLang] || obj.options.en;
        this.searchGroups.push({ key: obj.key, group, options });
      });
      this.searchForm.get('searchInput').updateValueAndValidity(); // trigger filtering
    }
  }
}

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    MatAutocompleteModule,
    MatButtonModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatToolbarModule,
    ReactiveFormsModule,
    TranslateModule.forChild()
  ],
  exports: [HeaderComponent],
  declarations: [HeaderComponent]
})
export class HeaderModule {}
