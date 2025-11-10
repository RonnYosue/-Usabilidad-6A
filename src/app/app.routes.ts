import { Routes } from '@angular/router';
import { LoginComponent } from './login/login';
import { AdministradorComponent } from './administrador/administrador';
import { RegistroComponent } from './registrar/registrar';
import { AlumnosComponent } from './alumnos/alumnos';
import { PerfilComponent } from './perfil/perfil';
import { BuscarComponent } from './buscar/buscar';
import { AyuditaComponent } from './ayudita/ayudita';
import { TerminosComponent } from './terminos/terminos';
import { PrivacidadComponent } from './privacidad/privacidad';
import { MateriasComponent } from './materias/materias';
import { TareasComponent } from './tareitas/tareitas';
import { CalendarioComponent } from './calendario/calendario';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'administrador', component: AdministradorComponent },
  { path: 'registro', component: RegistroComponent },
  { path: 'alumnos', component: AlumnosComponent },
  { path: 'perfil', component: PerfilComponent },
  { path: 'buscar', component: BuscarComponent },
  { path: 'ayudita', component: AyuditaComponent },
  { path: 'terminos', component: TerminosComponent },
  { path: 'privacidad', component: PrivacidadComponent },
  { path: 'materias', component: MateriasComponent },
  { path: 'tareas', component: TareasComponent },
  { path: 'calendario', component: CalendarioComponent },
];
