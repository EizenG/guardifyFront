import { CanActivateFn, Router } from "@angular/router";
import { FirebaseService } from "../firebaseService/firebase.service";
import { inject } from "@angular/core";


export const addCameraGuardAdmin: CanActivateFn = (route, state) => {
  const firebaseService = inject(FirebaseService);
  const router = inject(Router);

  return new Promise<boolean>((resolve) => {
    firebaseService.firebaseAuth.onAuthStateChanged(async (user) => {
      if (!user) {
        router.navigate(['login-logout']);
        resolve(false);
      } else {
        const token = await user.getIdTokenResult();
        if (token?.claims['role'] === 'admin') {
          resolve(true);
        } else {
          router.navigate(['unauthorize']);
          resolve(false);
        }
      }
    });
  });
};

export const addCameraGuardNoAdmin: CanActivateFn =  (route, state) => {
  const firebaseService = inject(FirebaseService);
  const router = inject(Router);

  return new Promise<boolean>((resolve) => {
    firebaseService.firebaseAuth.onAuthStateChanged(async (user) => {
      if (!user) {
        router.navigate(["./", "login-logout"]);
        return resolve(false);
      } else {
        const token = await user.getIdTokenResult();
        if (token.claims['role'] === "admin") {
          router.navigate(["./", "unauthorize"]);
          return resolve(false);
        } else {
          return resolve(true);
        }
      }
    });
  });
}