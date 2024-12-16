import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class loaderService {

  _loader$ = new BehaviorSubject<boolean>(false);
 

  changeLoaderStatus(status: boolean) {
    this._loader$.next(status);
  }
}