import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { AuthComponent } from './auth/auth.component';
import { CameraListComponent } from './camera-list/camera-list.component';
import { AddCameraComponent } from './add-camera/add-camera.component';
import { AuthoriesAccessComponent } from './authories-access/authories-access.component';
import { CameraStreamComponent } from './camera-stream/camera-stream.component';
import { NavbarComponent } from './navbar/navbar.component';
import { ParamterComponent } from './paramter/paramter.component';

export const routes: Routes = [
  {path:"",component:HomeComponent,title : "Guardify - Home"},
  { path: "login-logout", component: AuthComponent, title: "Guardify - Login/Logout" },
  {path:"camera-list",component:CameraListComponent, title : "Guardify - Camera's list"},
  { path: "add-camera", component: AddCameraComponent, title: "Guardify - Add camera"},
  { path: "authories-user",component: AuthoriesAccessComponent,title: "Guardify - Access management"},
  { path: "stream", component: CameraStreamComponent, title: "Guardify - camera stream" },
  { path: "parameter", component: ParamterComponent, title: "Guardify - parameter" },
  { path: "**", redirectTo: "" },
];
