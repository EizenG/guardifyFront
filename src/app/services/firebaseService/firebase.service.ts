import { Injectable, inject } from '@angular/core';
import { Auth, UserCredential, createUserWithEmailAndPassword,
  signInWithEmailAndPassword, signOut,GoogleAuthProvider, signInWithPopup } from '@angular/fire/auth';
import { Observable, from } from 'rxjs';



@Injectable({
  providedIn: 'root'
})
export class FirebaseService {
  firebaseAuth = inject(Auth);

  constructor() { }

  createNewUser(email : string, password : string) : Observable<UserCredential> {
    let promise = createUserWithEmailAndPassword(this.firebaseAuth,email,password);
    return from(promise);
  }
  
  signIn(email : string, password : string) : Observable<UserCredential>{
    let promise = signInWithEmailAndPassword(this.firebaseAuth,email,password);
    return from(promise);
  }

  signInWithGoogle() : Observable<UserCredential>{
    let promise = signInWithPopup(this.firebaseAuth,new GoogleAuthProvider());
    return from(promise);
  }

  signOut() : Observable<void>{
    let promise = signOut(this.firebaseAuth);
    return from(promise);
  }

}
