import { AngularFirestore, AngularFirestoreDocument } from 'angularfire2/firestore';
import { BehaviorSubject, combineLatest, of, Subject } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';
import { debounceTime, map, switchMap, takeUntil } from 'rxjs/operators';
import { firestore } from 'firebase';
import { Inject, Injectable, OnDestroy, PLATFORM_ID } from '@angular/core';
import { makeStateKey, StateKey, TransferState } from '@angular/platform-browser';

import { Product } from './product';

@Injectable()
export class ProductService implements OnDestroy {

  product$: BehaviorSubject<Product>; // selected product
  productId$: BehaviorSubject<string | null>; // selected product id
  products$: BehaviorSubject<Array<Product>>; // products list
  search$: BehaviorSubject<string | null>; // current search tag

  private ngUnsubscribe = new Subject();
  private productDoc: AngularFirestoreDocument<Product>;

  constructor(
    protected afs: AngularFirestore,
    private transferState: TransferState,
    @Inject(PLATFORM_ID) private platformId: string
  ) {
    const keyProducts: StateKey<number> = makeStateKey<number>('transfer-state-products');
    const keyProduct: StateKey<number> = makeStateKey<number>('transfer-state-product');
    const stateProduct = this.transferState.get(keyProduct, null);
    const stateProducts = this.transferState.get(keyProducts, null);

    this.product$ = new BehaviorSubject(null);
    this.productId$ = new BehaviorSubject(null);
    this.products$ = new BehaviorSubject(null);
    this.search$ = new BehaviorSubject(null);

    // First we are looking in transfer-state, if nothing found we read from firestore
    if (stateProducts) {
      this.products$.next(stateProducts);
    } else {
      // Get product list by current search tag
      combineLatest(
        this.search$
      ).pipe(
        debounceTime(300), // delay execution to reduce api calls
        switchMap(([search]) => {
          // if (tag) {
            return this.afs.collection('products', ref => {
              let query: firestore.CollectionReference | firestore.Query = ref;
              if (search) {
                // query all search words (or tags),
                // only client sorting is feasible as we don't want to create a composite index for each tag
                for (const tag of search.split(' ')) {
                  query = query.where(`tags.${tag}`, '==', true);
                }
              } else {
                // search empty, so we can sort results after creating only one composite index
                query = query.orderBy('rating', 'desc').orderBy('updated', 'desc');
              }

              // return only first 100 results
              return query.limit(100);
            }).snapshotChanges()
            .pipe(
              takeUntil(this.ngUnsubscribe),
              map(actions => actions.map(a => {
                const id = a.payload.doc.id;
                const data = a.payload.doc.data() as Product;

                return { id, ...data };
              }))
            );
          // } else {
            // return of([]);
          // }
        })
      ).subscribe((products: Array<Product>) => {
        if (!isPlatformBrowser(this.platformId)) { // write transfer state if on the server
          this.transferState.set(keyProducts, products);
        }
        this.products$.next(products);
      });
    }

    // First we are looking in transfer-state, if nothing found we read from firestore
    if (stateProduct) {
      this.product$.next(stateProduct);
    } else {
      // Get current product by productId
      combineLatest(
        this.productId$
      ).pipe(
        debounceTime(300), // delay execution to reduce api calls
        switchMap(([productId]) => {
          if (productId) {
            this.productDoc = this.afs.doc<Product>(`products/${productId}`);

            return this.productDoc.snapshotChanges()
            .pipe(
              takeUntil(this.ngUnsubscribe),
              map(a => {
                const id = a.payload.id;
                const data = a.payload.data();

                return { id, ...data };
              })
            );
          } else {
            this.productDoc = null;

            return of(null);
          }
        })
      ).subscribe((product: Product) => {
        this.product$.next(product);
        if (!isPlatformBrowser(this.platformId)) { // write transfer state if on the server
          this.transferState.set(keyProduct, product);
        }
      });
    }

  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  // https://angular.io/guide/template-syntax#ngfor-with-trackby
  trackByProducts(index: number, product: Product): string {
    return product.id;
  }
}
