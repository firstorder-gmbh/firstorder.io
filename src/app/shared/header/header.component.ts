import { AngularFirestore } from 'angularfire2/firestore';
import { BehaviorSubject, combineLatest, Observable } from 'rxjs';
import { CommonModule } from '@angular/common';
import { Component, NgModule } from '@angular/core';
import { firestore } from 'firebase';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule, MatButtonModule, MatFormFieldModule,
  MatIconModule, MatInputModule, MatToolbarModule } from '@angular/material';
import { map, startWith, switchMap } from 'rxjs/operators';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

import { HeaderService } from './header.service';
import { SidenavService } from '../sidenav/sidenav.service';

export interface Product {
  _id: string;
  categories: object;
  descriptions: object;
  names: object;
  variants: object;
}

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
  headerClass: string;
  headerTitle: string;
  isOpenNavbar = this.sidenavService.isOpenNavbar.getValue();

  products: Array<Product>;
  products$: Observable<Array<Product>>;

  search$: BehaviorSubject<string | null>;
  searchForm: FormGroup = this.fb.group({
    searchInput: ''
  });
  searchGroupOptions$: Observable<Array<SearchGroup>>;
  searchGroups: Array<SearchGroup> = [];
  searchProductsAutocomplete: any;

  constructor(
      protected afs: AngularFirestore,
      private headerService: HeaderService,
      private fb: FormBuilder,
      private sidenavService: SidenavService,
      private translate: TranslateService
  ) {
    afs.collection<any>('autocompletes').doc('search-products').valueChanges()
    .subscribe(data => {
      this.searchProductsAutocomplete = data;
      this.translateSearchGroups();
    });

    translate.onLangChange.subscribe(() => {
      this.translateSearchGroups();
    });

    if (this.searchForm.get('searchInput') !== undefined) {
      this.searchGroupOptions$ = this.searchForm.get('searchInput').valueChanges
      .pipe(
        startWith(''),
        map(value => this._filterGroup(value))
      );
    }

    this.search$ = new BehaviorSubject(null);

    this.products$ = combineLatest(
      this.search$
    ).pipe(
      switchMap(([search]) =>
        afs.collection('products', ref => {
          let query: firestore.CollectionReference | firestore.Query = ref;

          if (search) { query = query.where(`tags.${search}`, '==', true); }

          return query;
        }).valueChanges() as Observable<Array<Product>>
      )
    );

    this.products$.subscribe(products => {
      this.products = products;
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

  goBack(): void {
    if (this.headerClass) {
      this.headerClass = this.headerClass.replace('search-open', '').trim();
    }
  }

  onSearchChange(search: string | null): void {
    this.search$.next(search.toLocaleLowerCase());
  }

  toggleNavbar(): void {
    this.sidenavService.toggleNavbar();
  }

  toggleSearch(): void {
    if (!this.headerClass) {
      this.headerClass = 'search-open';
    } else if (this.headerClass.indexOf('search-open') === -1) {
      this.headerClass += ' search-open';
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
      // Read and translate groups and options
      Object.keys(this.searchProductsAutocomplete).map(key => {
        const obj = this.searchProductsAutocomplete[key];
        const group = obj[this.translate.currentLang] || obj.en; // translate or default to english
        const options = obj.options[this.translate.currentLang] || obj.options.en;
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
