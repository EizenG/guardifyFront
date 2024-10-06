import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { AuthComponent } from './auth/auth.component';
import { CameraListComponent } from './camera-list/camera-list.component';

export const routes: Routes = [
  {path:"",component:HomeComponent},
  {path:"login-logout",component:AuthComponent},
  {path:"camera-list",component:CameraListComponent},
  {path:"**",component:HomeComponent},
];
