import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Encabezado } from '../encabezado/encabezado';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, Encabezado],
  templateUrl: './login.html',
  styleUrls: ['./login.css']  
})
export class LoginComponent {
  loginForm: FormGroup;
  errores = { usuario: '', contrasena: '' };

  constructor(private fb: FormBuilder, private router: Router) {
    this.loginForm = this.fb.group({
      usuario: ['', Validators.required],
      contrasena: ['', Validators.required],
    });
  }

  public iniciarSesion(): void {
    this.errores = { usuario: '', contrasena: '' };

    const usuario = this.loginForm.get('usuario')?.value.trim();
    const contrasena = this.loginForm.get('contrasena')?.value;

    if (!usuario) {
      this.errores.usuario = 'El usuario es obligatorio';
      return;
    }
    if (!contrasena) {
      this.errores.contrasena = 'La contraseña es obligatoria';
      return;
    }

    // ✅ 1️⃣ Caso especial: administrador
    if (usuario === 'admin' && contrasena === 'admin123') {
      const adminUsuario = { usuario: 'admin', nombre: 'Administrador', rol: 'admin' };
      localStorage.setItem('adminLogged', 'true');
      localStorage.setItem('usuarioActivo', JSON.stringify(adminUsuario));
      console.log('Inicio de sesión como administrador');
      this.router.navigate(['/administrador']);
      return;
    }

    // ✅ 2️⃣ Buscar estudiantes registrados en localStorage
    const usuariosGuardados = localStorage.getItem('usuarios');
    const usuarios = usuariosGuardados ? JSON.parse(usuariosGuardados) : [];

    const estudiante = usuarios.find(
      (u: any) =>
        u.email.trim().toLowerCase() === usuario.toLowerCase()
    );

    // ✅ 3️⃣ Validar existencia y contraseña
    if (!estudiante) {
      this.errores.usuario = 'Usuario no encontrado';
      return;
    }

    if (contrasena !== estudiante.password) {
      this.errores.contrasena = 'Contraseña incorrecta';
      return;
    }

    // ✅ 4️⃣ Guardar sesión activa
    localStorage.setItem('usuarioActivo', JSON.stringify(estudiante));
    console.log('Inicio de sesión exitoso:', estudiante);

    // ✅ 5️⃣ Redirigir a alumnos
    this.router.navigate(['/alumnos']);
  }

  irARegistro() {
    this.router.navigate(['/registro']);
  }
}
