import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { getAnalytics, provideAnalytics, ScreenTrackingService, UserTrackingService } from '@angular/fire/analytics';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { getStorage, provideStorage } from '@angular/fire/storage';

let firebaseConfig = {
  "projectId": "guardify-backend",
  "appId": "1:1086957650871:web:866060f9622acee4649e32",
  "storageBucket": "guardify-backend.appspot.com",
  "apiKey": "AIzaSyClGUs8mzCxHj1M_QXOaRGkzSKS8_RIqhs",
  "authDomain": "guardify-backend.firebaseapp.com",
  "messagingSenderId": "1086957650871",
  "measurementId": "G-NCSZ5XEL52"
}

export const appConfig: ApplicationConfig = {
  providers: [provideRouter(routes), provideFirebaseApp(() => initializeApp(firebaseConfig)), provideAuth(() => getAuth()), provideAnalytics(() => getAnalytics()), ScreenTrackingService, UserTrackingService, provideFirestore(() => getFirestore()), provideStorage(() => getStorage())]
};
