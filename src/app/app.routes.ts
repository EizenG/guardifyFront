import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { AuthComponent } from './auth/auth.component';
import { CameraListComponent } from './camera-list/camera-list.component';

export const routes: Routes = [
  {path:"",component:HomeComponent,title : "Guardify - Home"},
  { path: "login-logout", component: AuthComponent, title: "Guardify - Login/Logout" },
  {path:"camera-list",component:CameraListComponent, title : "Guardify - Camera's list"},
  { path: "**", component: HomeComponent, title: "Guardify - Home" },
];
