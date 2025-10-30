
// administrador.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Encabezado } from '../encabezado/encabezado';

interface Estudiante {
  id: number;
  nombre: string;
  email: string;
  fechaRegistro: Date;
  telefono?: string;
  carrera?: string;
}

@Component({
  selector: 'app-administrador',
  standalone: true,
  imports: [CommonModule, FormsModule, Encabezado],
  templateUrl: './administrador.html',
  styleUrls: ['./administrador.css']
})
export class AdministradorComponent implements OnInit {
  estudiantes: Estudiante[] = [];
  estudiantesFiltrados: Estudiante[] = [];
  nuevoEstudiante: Estudiante = { 
    id: 0, 
    nombre: '', 
    email: '', 
    fechaRegistro: new Date(),
    telefono: '',
    carrera: ''
  };
  editando: Estudiante | null = null;
  busqueda: string = '';
  mostrarFormulario: boolean = false;
  ordenarPor: 'nombre' | 'email' | 'fecha' = 'nombre';
  ordenAscendente: boolean = true;
  fechaActual: Date = new Date();

  constructor(private router: Router) {}

  ngOnInit(): void {
    if (typeof localStorage !== 'undefined') {
      const usuarioActivo = JSON.parse(localStorage.getItem('usuarioActivo') || 'null');
      const adminLogged = localStorage.getItem('adminLogged') === 'true';
      const esAdminPorUsuario = usuarioActivo && usuarioActivo.rol === 'admin';

      if (!esAdminPorUsuario && !adminLogged) {
        alert('Acceso denegado. Solo el administrador puede ingresar aquí.');
        this.router.navigate(['/login']);
        return;
      }

      // Cargar estudiantes desde localStorage
      const estudiantesGuardados = localStorage.getItem('estudiantes');
      if (estudiantesGuardados) {
        this.estudiantes = JSON.parse(estudiantesGuardados);
      }
      this.actualizarFiltro();
    }
  }

  toggleFormulario() {
    this.mostrarFormulario = !this.mostrarFormulario;
    if (!this.mostrarFormulario) {
      this.limpiarFormulario();
    }
  }

  agregarEstudiante() {
    if (!this.nuevoEstudiante.nombre || !this.nuevoEstudiante.email) {
      alert('Por favor complete los campos obligatorios (Nombre y Email)');
      return;
    }

    // Validar email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(this.nuevoEstudiante.email)) {
      alert('Por favor ingrese un email válido');
      return;
    }

    const nuevo: Estudiante = { 
      ...this.nuevoEstudiante, 
      id: Date.now(),
      fechaRegistro: new Date()
    };
    
    this.estudiantes.push(nuevo);
    this.guardarEnLocalStorage();
    this.limpiarFormulario();
    this.mostrarFormulario = false;
    this.actualizarFiltro();
    
    alert('¡Estudiante agregado exitosamente!');
  }

  limpiarFormulario() {
    this.nuevoEstudiante = { 
      id: 0, 
      nombre: '', 
      email: '', 
      fechaRegistro: new Date(),
      telefono: '',
      carrera: ''
    };
  }

  editarEstudiante(est: Estudiante) {
    this.editando = { ...est };
  }

  guardarEdicion() {
    if (!this.editando) return;

    // Validar email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(this.editando.email)) {
      alert('Por favor ingrese un email válido');
      return;
    }

    const index = this.estudiantes.findIndex(e => e.id === this.editando!.id);
    if (index !== -1) {
      this.estudiantes[index] = this.editando!;
      this.guardarEnLocalStorage();
      this.actualizarFiltro();
    }
    this.editando = null;
  }

  cancelarEdicion() {
    this.editando = null;
  }

  eliminarEstudiante(id: number) {
    if (confirm('¿Está seguro de que desea eliminar este estudiante?')) {
      this.estudiantes = this.estudiantes.filter(e => e.id !== id);
      this.guardarEnLocalStorage();
      this.actualizarFiltro();
    }
  }

  buscarEstudiantes() {
    if (!this.busqueda.trim()) {
      this.estudiantesFiltrados = [...this.estudiantes];
    } else {
      const termino = this.busqueda.toLowerCase();
      this.estudiantesFiltrados = this.estudiantes.filter(e => 
        e.nombre.toLowerCase().includes(termino) ||
        e.email.toLowerCase().includes(termino) ||
        e.carrera?.toLowerCase().includes(termino)
      );
    }
    this.aplicarOrden();
  }

  ordenarTabla(campo: 'nombre' | 'email' | 'fecha') {
    if (this.ordenarPor === campo) {
      this.ordenAscendente = !this.ordenAscendente;
    } else {
      this.ordenarPor = campo;
      this.ordenAscendente = true;
    }
    this.aplicarOrden();
  }

  aplicarOrden() {
    this.estudiantesFiltrados.sort((a, b) => {
      let comparacion = 0;
      
      switch(this.ordenarPor) {
        case 'nombre':
          comparacion = a.nombre.localeCompare(b.nombre);
          break;
        case 'email':
          comparacion = a.email.localeCompare(b.email);
          break;
        case 'fecha':
          comparacion = new Date(a.fechaRegistro).getTime() - new Date(b.fechaRegistro).getTime();
          break;
      }
      
      return this.ordenAscendente ? comparacion : -comparacion;
    });
  }

  actualizarFiltro() {
    this.buscarEstudiantes();
  }

  guardarEnLocalStorage() {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('estudiantes', JSON.stringify(this.estudiantes));
    }
  }

  exportarCSV() {
    const headers = ['Nombre', 'Email', 'Teléfono', 'Carrera', 'Fecha de Registro'];
    const rows = this.estudiantes.map(e => [
      e.nombre,
      e.email,
      e.telefono || '',
      e.carrera || '',
      new Date(e.fechaRegistro).toLocaleDateString()
    ]);

    let csv = headers.join(',') + '\n';
    rows.forEach(row => {
      csv += row.map(cell => `"${cell}"`).join(',') + '\n';
    });

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `estudiantes_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  }
}