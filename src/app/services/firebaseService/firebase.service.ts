import { Injectable, inject } from '@angular/core';
import {
  Auth, UserCredential, createUserWithEmailAndPassword,
  signInWithEmailAndPassword, signOut, GoogleAuthProvider, signInWithPopup, User, updatePassword
} from '@angular/fire/auth';
import { Observable, from } from 'rxjs';
import { Firestore, addDoc, setDoc, collection, doc } from '@angular/fire/firestore';
import { updateProfile } from '@angular/fire/auth';
import { IUserNew } from './INewUser';




@Injectable({
  providedIn: 'root'
})
export class FirebaseService {
  firebaseAuth = inject(Auth);
  firebaseFirestore = inject(Firestore);


  constructor() { }

  createNewUser(email: string, password: string): Observable<UserCredential> {
    let promise = createUserWithEmailAndPassword(this.firebaseAuth, email, password);
    return from(promise);
  }

  signIn(email: string, password: string): Observable<UserCredential> {
    let promise = signInWithEmailAndPassword(this.firebaseAuth, email, password);
    return from(promise);
  }

  signInWithGoogle(): Observable<UserCredential> {
    let promise = signInWithPopup(this.firebaseAuth, new GoogleAuthProvider());
    return from(promise);
  }

  signOut(): Observable<void> {
    let promise = signOut(this.firebaseAuth);
    return from(promise);
  }

  addDocument(collectionName: string, data: any, documentID : string): Observable<any> {
    let promise;
    let collectionRef = collection(this.firebaseFirestore, collectionName);
    let docRef = doc(collectionRef, documentID)
    promise = setDoc(docRef, data);

    return from(promise);
  }

  updateUserDisplayName(data: IUserNew): Observable<any> {
    const promise = updateProfile(this.firebaseAuth.currentUser as User, data);
    return from(promise);
  }

  updatePassword(newPassword: string, user : User): Observable<any>{
    let promise = updatePassword(user, newPassword);
    return from(promise);
  }


}
