import { AngularFirestore } from 'angularfire2/firestore';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Component, ElementRef, Inject, Input, NgModule, PLATFORM_ID, ViewChild } from '@angular/core';
import { Direction } from '@angular/cdk/bidi';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { makeStateKey, StateKey, TransferState } from '@angular/platform-browser';
import { MatAutocompleteModule, MatAutocompleteTrigger, MatButtonModule, MatFormFieldModule,
  MatIconModule, MatInputModule, MatToolbarModule } from '@angular/material';
import { Router } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

import { HeaderService } from './header.service';
import { Product } from '../product/product.model';
import { ProductService } from '../product/product.service';
import { SidenavService } from '../sidenav/sidenav.service';

export interface Autocomplete {
  [groupKey: string]: { // used for order
    label: {
      [lang: string]: string // language keys 'ar' | 'en' | 'de'
    };
    options: {
      [optionKey: string]: { // used for order
        label: {
          [lang: string]: string // language keys 'ar' | 'en' | 'de'
        };
        value: string;
      };
    };
    value: string;
  };
}

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
  autocomplete: Autocomplete;
  autocompleteFiltered: Autocomplete;
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
  @ViewChild('searchInput') searchInput: ElementRef;

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
    this.autocomplete = this.transferState.get(key, null);
    if (this.autocomplete) {
      this.filterAutocomplete();
    } else {
      afs.collection('autocompletes').doc('search-products').valueChanges()
      .subscribe((autocomplete: Autocomplete) => {
        if (!isPlatformBrowser(this.platformId)) { // write transfer state if on the server
          this.transferState.set(key, autocomplete);
        }
        this.autocomplete = autocomplete;
        this.filterAutocomplete();
      });
    }

    translate.onLangChange.subscribe(() => {
      this.currentLang = translate.currentLang;
    });

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
    this.filterAutocomplete();
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

  onSearchChange(input: string | null): void {
    this.productService.search$.next(input ? input.toLocaleLowerCase() : null);
    this.filterAutocomplete();
  }

  searchProducts(value: string): void {
    this.onSearchChange(value);
    void this.router.navigate(['/shop']);
  }

  showProduct(product: Product): void {
    void this.router.navigate(['/shop', product._id]);
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

  private filterAutocomplete(): void {
    const input = this.searchForm.get('searchInput').value.toLowerCase();
    if (input) {
      this.autocompleteFiltered = {};
      Object.keys(this.autocomplete).map(groupKey => {
        const group = this.autocomplete[groupKey];
        const options = {};
        Object.keys(group.options).map(optionKey => {
          Object.keys(group.options[optionKey].label).map(lang => {
            if (group.options[optionKey].label[lang].toLowerCase().indexOf(input) === 0) {
              options[optionKey] = { label: group.options[optionKey].label, value: group.options[optionKey].value };

              return;
            }
          });
        });
        if (Object.keys(options).length > 0) {
          this.autocompleteFiltered[groupKey] = { label: group.label, value: group.value, options };
        }
      });
    } else {
      this.autocompleteFiltered = this.autocomplete;
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
