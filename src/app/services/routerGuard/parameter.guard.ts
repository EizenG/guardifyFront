import { CanActivateFn, Router } from "@angular/router";
import { FirebaseService } from "../firebaseService/firebase.service";
import { inject } from "@angular/core";

export const parameterGuard: CanActivateFn = (route, state) => {
  const firebaseService = inject(FirebaseService);
  const router = inject(Router);

  return new Promise<boolean>((resolve) => {
    firebaseService.firebaseAuth.onAuthStateChanged(async (user) => {
      if (!user) {
        router.navigate(['login-logout']);
        resolve(false);
      } else {
        resolve(true);
      }
    });
  });
};