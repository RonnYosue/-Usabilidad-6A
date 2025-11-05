import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Encabezado } from '../encabezado/encabezado';

interface Usuario {
  nombre: string;
  apellido: string;
  email: string;
  telefono: string;
  direccion: string;
  fechaNacimiento: string;
  carrera: string;
  semestre: number;
  avatar: string;
}

@Component({
  selector: 'app-perfil',
  standalone: true,
  imports: [CommonModule, FormsModule, Encabezado],
  templateUrl: './perfil.html',
  styleUrls: ['./perfil.css']
})
export class PerfilComponent implements OnInit {
  usuario: Usuario = {
    nombre: 'Juan',
    apellido: 'Pérez',
    email: 'juan.perez@universidad.edu',
    telefono: '+593 99 123 4567',
    direccion: 'Quito, Ecuador',
    fechaNacimiento: '2002-05-15',
    carrera: 'Ingeniería en Sistemas',
    semestre: 5,
    avatar: ''
  };

  editMode = false;
  passwordMode = false;
  
  // Datos temporales para edición
  usuarioTemp: Usuario = { ...this.usuario };
  
  // Cambio de contraseña
  passwordData = {
    actual: '',
    nueva: '',
    confirmar: ''
  };

  estadisticas = {
    tareasCompletadas: 45,
    promedio: 85,
    materiasActivas: 6,
    horasEstudio: 120
  };

  ngOnInit(): void {
    // Cargar datos del usuario desde localStorage o servicio
    this.cargarUsuario();
  }

  cargarUsuario(): void {
    // Aquí cargarías los datos reales del usuario
    const usuarioGuardado = localStorage.getItem('usuarioActivo');
    if (usuarioGuardado) {
      const datosUsuario = JSON.parse(usuarioGuardado);
      this.usuario = { ...this.usuario, ...datosUsuario };
      this.usuarioTemp = { ...this.usuario };
    }
  }

  activarEdicion(): void {
    this.editMode = true;
    this.usuarioTemp = { ...this.usuario };
  }

  cancelarEdicion(): void {
    this.editMode = false;
    this.usuarioTemp = { ...this.usuario };
  }

  guardarCambios(): void {
    this.usuario = { ...this.usuarioTemp };
    this.editMode = false;
    
    // Guardar en localStorage o enviar al backend
    localStorage.setItem('usuarioActivo', JSON.stringify(this.usuario));
    
    alert('Perfil actualizado correctamente');
  }

  activarCambioPassword(): void {
    this.passwordMode = true;
    this.passwordData = { actual: '', nueva: '', confirmar: '' };
  }

  cancelarCambioPassword(): void {
    this.passwordMode = false;
    this.passwordData = { actual: '', nueva: '', confirmar: '' };
  }

  cambiarPassword(): void {
    if (this.passwordData.nueva !== this.passwordData.confirmar) {
      alert('Las contraseñas no coinciden');
      return;
    }

    if (this.passwordData.nueva.length < 6) {
      alert('La contraseña debe tener al menos 6 caracteres');
      return;
    }

    // Aquí enviarías la solicitud al backend
    console.log('Cambiar contraseña');
    alert('Contraseña actualizada correctamente');
    this.passwordMode = false;
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.usuarioTemp.avatar = e.target.result;
      };
      reader.readAsDataURL(input.files[0]);
    }
  }
}
