import { BehaviorSubject } from 'rxjs';
import { Injectable } from '@angular/core';

@Injectable()
export class HeaderService {
  headerClass: BehaviorSubject<string> = new BehaviorSubject(null);
  headerTitle: BehaviorSubject<string> = new BehaviorSubject(null);
}
