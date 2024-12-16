import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { AuthComponent } from './auth/auth.component';
import { CameraListComponent } from './camera-list/camera-list.component';
import { AddCameraComponent } from './add-camera/add-camera.component';
import { AuthoriesAccessComponent } from './authories-access/authories-access.component';
import { CameraStreamComponent } from './camera-stream/camera-stream.component';
import { ParamterComponent } from './paramter/paramter.component';
import { OffenceVideoComponent } from './offence-video/offence-video.component';
import { CameraParameterComponent } from './camera-parameter/camera-parameter.component';
import { UnauthorizeComponent } from './unauthorize/unauthorize.component';
import { addCameraGuardAdmin, addCameraGuardNoAdmin } from './services/routerGuard/addCameraGuard';
import { authGuard } from './services/routerGuard/auth.guard';
import { camerasResolver } from './services/resolvers/cameras.resolver';

export const routes: Routes = [
  { path: "", component: HomeComponent, title: "Guardify - Home" },
  { path: "login-logout", component: AuthComponent, title: "Guardify - Login/Logout" },
  { path: ":userUID/camera-list", component: CameraListComponent, title: "Guardify - Camera's list",resolve : {cameras : camerasResolver} },
  {
    path: "add-camera",
    children: [
      { path: "", component: AddCameraComponent, title: "Guardify - Request to add camera", canActivate: [addCameraGuardNoAdmin], },
      { path: ":ownerUID/:name/:idCamera/:location/:status", title: "Guardify - Add camera", component: AddCameraComponent, canActivate: [addCameraGuardAdmin] },
    ]
  },
  { path: "authories-user", component: AuthoriesAccessComponent, title: "Guardify - Access management" },
  { path: "stream", component: CameraStreamComponent, title: "Guardify - camera stream" },
  {
    path: "parameter", component: ParamterComponent, title: "Guardify - parameter",
    canActivate: [authGuard]
  },
  { path: "infraction-videos", component: OffenceVideoComponent, title: "Guardify - Infraction Video" },
  { path: "camera-parameter", component: CameraParameterComponent, title: "Guardify - Camera parameter" },
  { path: "unauthorize", component: UnauthorizeComponent, title: "Guardify - Unauthorize" },
  { path: "**", redirectTo: "" },
];
