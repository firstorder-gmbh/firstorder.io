import { AngularFirestore } from 'angularfire2/firestore';
import { Observable } from 'rxjs';
import { CommonModule } from '@angular/common';
import { Component, ElementRef, Input, NgModule, ViewChild } from '@angular/core';
import { map, startWith } from 'rxjs/operators';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
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
  @Input() dir: string;
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
    protected afs: AngularFirestore,
    protected productService: ProductService,
    protected translate: TranslateService,
    private headerService: HeaderService,
    private fb: FormBuilder,
    private router: Router,
    private sidenavService: SidenavService
  ) {
    afs.collection<any>('autocompletes').doc('search-products').valueChanges()
    .subscribe(data => {
      this.searchProductsAutocomplete = data;
      this.translateSearchGroups();
    });

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
    this.productService.tag$.next(search ? search.toLocaleLowerCase() : null);
  }

  searchProducts(option: string): void {
    this.onSearchChange(option);
    this.router.navigate(['/shop']);
  }

  showProduct(product: Product): void {
    this.router.navigate(['/shop', product.id]);
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
      Object.keys(this.searchProductsAutocomplete).map(key => {
        const obj = this.searchProductsAutocomplete[key];
        const group = obj[this.currentLang] || obj.en; // translate or default to english
        const options = obj.options[this.currentLang] || obj.options.en;
        this.searchGroups.push({ group, options });
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
