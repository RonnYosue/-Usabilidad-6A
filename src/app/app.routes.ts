import { Routes } from '@angular/router';
import { LoginComponent } from './login/login';
import { AdministradorComponent } from './administrador/administrador';
import { RegistroComponent } from './registrar/registrar';
import { AlumnosComponent } from './alumnos/alumnos';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'administrador', component: AdministradorComponent },
  { path: 'registro', component: RegistroComponent },
  { path: 'alumnos', component: AlumnosComponent },
];
