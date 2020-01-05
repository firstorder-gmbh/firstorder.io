import { BehaviorSubject } from 'rxjs';
import { Injectable } from '@angular/core';

@Injectable()
export class FooterService {
  footerClass$: BehaviorSubject<string> = new BehaviorSubject(null);
}
