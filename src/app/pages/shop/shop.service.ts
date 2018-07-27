import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

import { Product } from '../../shared/product/product';

@Injectable({
  providedIn: 'root'
})
export class ShopService {

  getProducts(): Observable<Array<Product>> {

    return of([]);
  }
}
