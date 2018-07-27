import { AngularFirestore } from 'angularfire2/firestore';
import { BehaviorSubject, combineLatest, of } from 'rxjs';
import { debounceTime, map, switchMap } from 'rxjs/operators';
import { firestore } from 'firebase';
import { Injectable } from '@angular/core';

import { Product } from './product';

@Injectable()
export class ProductService {

  id: BehaviorSubject<string | null>;
  products$: BehaviorSubject<Array<Product>>;
  tag$: BehaviorSubject<string | null>;

  constructor(
    protected afs: AngularFirestore
  ) {
    this.tag$ = new BehaviorSubject(null);
    this.products$ = new BehaviorSubject(null);

    combineLatest(
      this.tag$
    ).pipe(
      debounceTime(300), // delay execution to reduce api calls
      switchMap(([tag]) => {
        if (tag) {
          return this.afs.collection('products', ref => {
            let query: firestore.CollectionReference | firestore.Query = ref;

            if (tag) { query = query.where(`tags.${tag}`, '==', true); }

            return query.limit(10);
          }).snapshotChanges()
          .pipe(
            map(actions => actions.map(a => {
              const data = a.payload.doc.data() as Product;
              const id = a.payload.doc.id;

              return { id, ...data };
            }))
          );
        } else {
          return of([]);
        }
      })
    ).subscribe((products: Array<Product>) => {
      console.log(products);
      this.products$.next(products);
    });
  }

  // https://angular.io/guide/template-syntax#ngfor-with-trackby
  trackByProducts(index: number, product: Product): string {
    return product.id;
  }
}
