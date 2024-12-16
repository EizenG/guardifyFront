import { inject } from "@angular/core";
import { ResolveFn } from "@angular/router";
import { FirebaseService } from "../firebaseService/firebase.service";
import { QuerySnapshot } from "@angular/fire/firestore";


export const camerasResolver: ResolveFn<Object> = (route, state) => {
  const userUID = route.paramMap.get("userUID");
  const firebaseService = inject(FirebaseService);
  return firebaseService.getUserCameras(userUID as string);
}