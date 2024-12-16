import { Injectable, inject } from '@angular/core';
import {
  Auth, UserCredential, createUserWithEmailAndPassword,
  signInWithEmailAndPassword, signOut, GoogleAuthProvider, signInWithPopup, User, updatePassword, reauthenticateWithCredential, AuthCredential, EmailAuthCredential, EmailAuthProvider
} from '@angular/fire/auth';
import { Observable, from } from 'rxjs';
import { Firestore, getDoc, setDoc, collection, doc, getDocs,query,where,or } from '@angular/fire/firestore';
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

  getDocument(collectionName: string,documentId: string): Observable<any>{
    let collectionRef = collection(this.firebaseFirestore, collectionName);
    let docRef = doc(collectionRef, documentId);
    return from(getDoc(docRef))
  }

  getUserCameras(userUid : string): Observable<any>{
    const collectionRef = collection(this.firebaseFirestore, "cameras");
    const q = query(collectionRef, or(where("ownerUID", "==", userUid), where("admins", "array-contains", userUid)));
    let promise = getDocs(q);
    return from(promise);
  }

  updateUserDisplayName(data: IUserNew): Observable<any> {
    const promise = updateProfile(this.firebaseAuth.currentUser as User, data);
    return from(promise);
  }

  reauthenticate(user: User,oldPassword : string): Observable<any>{
    let credential: AuthCredential = EmailAuthProvider.credential(
      user.email as string,
      oldPassword
    );
    let promise = reauthenticateWithCredential(user, credential);
    return from(promise);
    
  }

  updatePassword(newPassword: string, user: User): Observable<any>{
    let promise = updatePassword(user, newPassword);
    return from(promise);
  }


}
