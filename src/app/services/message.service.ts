import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
@Injectable({
  providedIn: 'root',
})
export class MessageService {

   _messageError$ = new Subject<string>();
   _messageSuccess$ = new Subject<string>();

  changeErrorMessage(message: string) {
    this._messageError$.next(message);
  }

  changeSuccessMessage(message: string) {
    this._messageSuccess$.next(message);
  }
 }