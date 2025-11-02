import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

interface Usuario {
  id: number;
  nombre: string;
  apellido: string;
  email: string;
  password: string;
  telefono?: string;
  carrera?: string;
  fechaRegistro: Date;
  rol: 'estudiante';
}

@Component({
  selector: 'app-registro',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './registrar.html',
  styleUrls: ['./registrar.css']
})
export class RegistroComponent {
  nuevoUsuario: Usuario = {
    id: 0,
    nombre: '',
    apellido: '',
    email: '',
    password: '',
    telefono: '',
    carrera: '',
    fechaRegistro: new Date(),
    rol: 'estudiante'
  };

  confirmarPassword: string = '';
  mostrarPassword: boolean = false;
  mostrarConfirmarPassword: boolean = false;
  aceptaTerminos: boolean = false;
  cargando: boolean = false;

  constructor(private router: Router) {}

  registrarEstudiante() {
    const mensajeError = this.validarFormulario();

    if (mensajeError) {
      alert(mensajeError);
      return;
    }

    this.cargando = true;

    // Simulamos carga de datos
    setTimeout(() => {
      let usuarios: Usuario[] = [];

      // 1️⃣ Cargar usuarios existentes del localStorage
      const usuariosGuardados = localStorage.getItem('usuarios');
      if (usuariosGuardados) {
        try {
          usuarios = JSON.parse(usuariosGuardados);
        } catch {
          usuarios = [];
        }
      }

      // 2️⃣ Verificar si el email ya existe
      const emailExiste = usuarios.some(
        (u) => u.email.toLowerCase() === this.nuevoUsuario.email.toLowerCase()
      );

      if (emailExiste) {
        alert('Este correo electrónico ya está registrado. Por favor, usa otro o inicia sesión.');
        this.cargando = false;
        return;
      }

      // 3️⃣ Crear el nuevo usuario
      const usuario: Usuario = {
        ...this.nuevoUsuario,
        id: Date.now(),
        fechaRegistro: new Date(),
        rol: 'estudiante'
      };

      // 4️⃣ Guardar en localStorage
      usuarios.push(usuario);
      localStorage.setItem('usuarios', JSON.stringify(usuarios));

      // 5️⃣ Resetear el formulario
      this.resetFormulario();

      // 6️⃣ Mostrar mensaje y redirigir
      this.cargando = false;
      alert('¡Registro exitoso! Ahora puedes iniciar sesión con tu cuenta.');
      this.router.navigate(['/login']);
    }, 1200);
  }

  validarFormulario(): string | null {
    const nombre = this.nuevoUsuario.nombre.trim();
    const apellido = this.nuevoUsuario.apellido.trim();
    const email = this.nuevoUsuario.email.trim().toLowerCase();
    const password = this.nuevoUsuario.password.trim();

    if (!nombre) return 'Por favor, ingresa tu nombre.';
    if (nombre.length < 2) return 'El nombre debe tener al menos 2 caracteres.';

    if (!apellido) return 'Por favor, ingresa tu apellido.';
    if (apellido.length < 2) return 'El apellido debe tener al menos 2 caracteres.';

    if (!email) return 'Por favor, ingresa tu correo electrónico.';
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(email)) return 'Por favor, ingresa un correo electrónico válido.';

    if (!password) return 'Por favor, ingresa una contraseña.';
    if (password.length < 6) return 'La contraseña debe tener al menos 6 caracteres.';
    if (!/[A-Z]/.test(password)) return 'La contraseña debe tener al menos una letra mayúscula.';
    if (!/[a-z]/.test(password)) return 'La contraseña debe tener al menos una letra minúscula.';
    if (!/[0-9]/.test(password)) return 'La contraseña debe tener al menos un número.';

    if (password !== this.confirmarPassword.trim()) return 'Las contraseñas no coinciden.';
    if (!this.aceptaTerminos) return 'Debes aceptar los términos y condiciones.';

    return null;
  }

  toggleMostrarPassword() {
    this.mostrarPassword = !this.mostrarPassword;
  }

  toggleMostrarConfirmarPassword() {
    this.mostrarConfirmarPassword = !this.mostrarConfirmarPassword;
  }

  irALogin() {
    this.router.navigate(['/login']);
  }

  /** 🧹 Limpia el formulario después del registro */
  private resetFormulario() {
    this.nuevoUsuario = {
      id: 0,
      nombre: '',
      apellido: '',
      email: '',
      password: '',
      telefono: '',
      carrera: '',
      fechaRegistro: new Date(),
      rol: 'estudiante'
    };
    this.confirmarPassword = '';
    this.aceptaTerminos = false;
  }
}
