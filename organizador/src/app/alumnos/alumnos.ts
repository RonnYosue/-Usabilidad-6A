import { Component, OnInit } from '@angular/core';
import { CommonModule, NgFor, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Encabezado } from '../encabezado/encabezado';

interface Calificacion {
  materia: string;
  nota: number;
}

@Component({
  selector: 'app-alumnos',
  standalone: true,
  imports: [CommonModule, FormsModule, Encabezado, NgIf, NgFor],
  templateUrl: './alumnos.html',
  styleUrls: ['./alumnos.css']
})
export class AlumnosComponent implements OnInit {
  usuario: any = {};
  calificaciones: Calificacion[] = [];
  mensajeAyuda = '';
  respuestaAyuda = '';

  constructor(private router: Router) {}

  ngOnInit() {
    // 🔒 Comprobar que estamos en el navegador
    if (typeof window === 'undefined') return;

    const userData = window.localStorage.getItem('usuarioActivo');
    if (!userData) {
      alert('Debe iniciar sesión para acceder.');
      this.router.navigate(['/login']);
      return;
    }

    this.usuario = JSON.parse(userData);

    // Calificaciones de ejemplo
    this.calificaciones = [
      { materia: 'Matemáticas', nota: 8.5 },
      { materia: 'Lengua', nota: 6.8 },
      { materia: 'Historia', nota: 9.1 },
      { materia: 'Ciencias', nota: 5.9 }
    ];
  }

  cerrarSesion() {
    if (typeof window === 'undefined') return;
    window.localStorage.removeItem('usuarioActivo');
    this.router.navigate(['/login']);
  }

  solicitarAyuda() {
    if (!this.mensajeAyuda.trim()) {
      alert('Por favor, describe brevemente con qué necesitas ayuda.');
      return;
    }

    this.respuestaAyuda = `
      Tu solicitud ha sido enviada con éxito, ${this.usuario.nombre || 'estudiante'}.
      Un tutor revisará tus calificaciones y se pondrá en contacto contigo.`;
    this.mensajeAyuda = '';
  }
}
