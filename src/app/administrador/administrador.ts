// ============================================
// administrador.ts - ACTUALIZADO
// ============================================
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Encabezado } from '../encabezado/encabezado';

interface Estudiante {
  id: number;
  nombres: string;
  apellidos: string;
  nombreUsuario: string;
  email: string;
  password: string;
  carrera: string;
  semestre: number;
  fechaRegistro: Date;
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
    nombres: '', 
    apellidos: '',
    nombreUsuario: '',
    email: '', 
    password: '',
    carrera: '',
    semestre: 1,
    fechaRegistro: new Date()
  };
  editando: Estudiante | null = null;
  busqueda: string = '';
  mostrarFormulario: boolean = false;
  ordenarPor: 'nombres' | 'email' | 'fecha' = 'nombres';
  ordenAscendente: boolean = true;
  fechaActual: Date = new Date();
  mostrarPassword: boolean = false;

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
      this.cargarEstudiantes();
      this.actualizarFiltro();
    }
  }

  cargarEstudiantes(): void {
    const estudiantesGuardados = localStorage.getItem('estudiantes');
    if (estudiantesGuardados) {
      try {
        this.estudiantes = JSON.parse(estudiantesGuardados);
        console.log('Estudiantes cargados:', this.estudiantes.length);
      } catch (error) {
        console.error('Error al cargar estudiantes:', error);
        this.estudiantes = [];
      }
    } else {
      // Si no hay estudiantes, crear un array vacío
      this.estudiantes = [];
      console.log('No hay estudiantes guardados');
    }
  }

  toggleFormulario() {
    this.mostrarFormulario = !this.mostrarFormulario;
    if (!this.mostrarFormulario) {
      this.limpiarFormulario();
    }
  }

  togglePasswordVisibility() {
    this.mostrarPassword = !this.mostrarPassword;
  }

  agregarEstudiante() {
    // Validaciones
    if (!this.nuevoEstudiante.nombres || !this.nuevoEstudiante.apellidos || 
        !this.nuevoEstudiante.nombreUsuario || !this.nuevoEstudiante.email || 
        !this.nuevoEstudiante.password || !this.nuevoEstudiante.carrera) {
      alert('Por favor complete todos los campos obligatorios');
      return;
    }

    // Validar email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(this.nuevoEstudiante.email)) {
      alert('Por favor ingrese un email válido');
      return;
    }

    // Validar contraseña
    if (this.nuevoEstudiante.password.length < 6) {
      alert('La contraseña debe tener al menos 6 caracteres');
      return;
    }

    // Validar semestre
    if (this.nuevoEstudiante.semestre < 1 || this.nuevoEstudiante.semestre > 10) {
      alert('El semestre debe estar entre 1 y 10');
      return;
    }

    // Verificar si el nombre de usuario ya existe
    if (this.estudiantes.some(e => e.nombreUsuario === this.nuevoEstudiante.nombreUsuario)) {
      alert('El nombre de usuario ya está en uso');
      return;
    }

    // Verificar si el email ya existe
    if (this.estudiantes.some(e => e.email === this.nuevoEstudiante.email)) {
      alert('El email ya está registrado');
      return;
    }

    const nuevo: Estudiante = { 
      ...this.nuevoEstudiante, 
      id: Date.now(),
      fechaRegistro: new Date()
    };
    
    this.estudiantes.push(nuevo);
    console.log('Estudiante agregado:', nuevo);
    console.log('Total estudiantes ahora:', this.estudiantes.length);
    
    this.guardarEnLocalStorage();
    this.limpiarFormulario();
    this.mostrarFormulario = false;
    this.actualizarFiltro();
    
    alert('¡Estudiante agregado exitosamente!');
  }

  limpiarFormulario() {
    this.nuevoEstudiante = { 
      id: 0, 
      nombres: '', 
      apellidos: '',
      nombreUsuario: '',
      email: '', 
      password: '',
      carrera: '',
      semestre: 1,
      fechaRegistro: new Date()
    };
    this.mostrarPassword = false;
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

    // Validar semestre
    if (this.editando.semestre < 1 || this.editando.semestre > 10) {
      alert('El semestre debe estar entre 1 y 10');
      return;
    }

    // Verificar nombre de usuario único (excepto el actual)
    if (this.estudiantes.some(e => e.nombreUsuario === this.editando!.nombreUsuario && e.id !== this.editando!.id)) {
      alert('El nombre de usuario ya está en uso');
      return;
    }

    // Verificar email único (excepto el actual)
    if (this.estudiantes.some(e => e.email === this.editando!.email && e.id !== this.editando!.id)) {
      alert('El email ya está registrado');
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
    console.log('Buscando:', this.busqueda);
    console.log('Total estudiantes:', this.estudiantes.length);
    
    if (!this.busqueda || !this.busqueda.trim()) {
      this.estudiantesFiltrados = [...this.estudiantes];
      console.log('Sin búsqueda, mostrando todos');
    } else {
      const termino = this.busqueda.toLowerCase().trim();
      this.estudiantesFiltrados = this.estudiantes.filter(e => 
        (e.nombres && e.nombres.toLowerCase().includes(termino)) ||
        (e.apellidos && e.apellidos.toLowerCase().includes(termino)) ||
        (e.nombreUsuario && e.nombreUsuario.toLowerCase().includes(termino)) ||
        (e.email && e.email.toLowerCase().includes(termino)) ||
        (e.carrera && e.carrera.toLowerCase().includes(termino))
      );
      console.log('Resultados filtrados:', this.estudiantesFiltrados.length);
    }
    this.aplicarOrden();
  }

  ordenarTabla(campo: 'nombres' | 'email' | 'fecha') {
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
        case 'nombres':
          comparacion = (a.nombres + ' ' + a.apellidos).localeCompare(b.nombres + ' ' + b.apellidos);
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
    const headers = ['Nombres', 'Apellidos', 'Usuario', 'Email', 'Carrera', 'Semestre', 'Fecha de Registro'];
    const rows = this.estudiantes.map(e => [
      e.nombres,
      e.apellidos,
      e.nombreUsuario,
      e.email,
      e.carrera,
      e.semestre.toString(),
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

  // Método para agregar datos de prueba (útil para testing)
  agregarDatosPrueba() {
    const datosPrueba: Estudiante[] = [
      {
        id: Date.now() + 1,
        nombres: 'Juan Carlos',
        apellidos: 'Pérez García',
        nombreUsuario: 'jperez',
        email: 'juan.perez@universidad.edu',
        password: '123456',
        carrera: 'Ingeniería en Sistemas',
        semestre: 5,
        fechaRegistro: new Date()
      },
      {
        id: Date.now() + 2,
        nombres: 'María José',
        apellidos: 'González López',
        nombreUsuario: 'mgonzalez',
        email: 'maria.gonzalez@universidad.edu',
        password: '123456',
        carrera: 'Medicina',
        semestre: 3,
        fechaRegistro: new Date()
      },
      {
        id: Date.now() + 3,
        nombres: 'Pedro Luis',
        apellidos: 'Martínez Ruiz',
        nombreUsuario: 'pmartinez',
        email: 'pedro.martinez@universidad.edu',
        password: '123456',
        carrera: 'Derecho',
        semestre: 7,
        fechaRegistro: new Date()
      }
    ];

    this.estudiantes.push(...datosPrueba);
    this.guardarEnLocalStorage();
    this.actualizarFiltro();
    alert('Se agregaron 3 estudiantes de prueba');
  }
}