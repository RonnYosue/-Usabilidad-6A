import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Encabezado } from '../encabezado/encabezado';
import { Footer } from '../footer/footer';

interface Tarea {
  id: number;
  nombre: string;
  materia: string;
  fechaEntrega: string;
  estado: string;
}

@Component({
  selector: 'app-buscar',
  standalone: true,
  imports: [CommonModule, FormsModule, Encabezado, Footer],
  templateUrl: './buscar.html',
  styleUrls: ['./buscar.css']
})
export class BuscarComponent {
  searchTerm = '';
  selectedFilter = 'todas';
  
  todasLasTareas: Tarea[] = [
    { id: 1, nombre: 'Ensayo sobre la Revolución Industrial', materia: 'Historia', fechaEntrega: '2025-11-05', estado: 'pendiente' },
    { id: 2, nombre: 'Problemas de Cálculo Diferencial', materia: 'Matemáticas', fechaEntrega: '2025-11-03', estado: 'atrasada' },
    { id: 3, nombre: 'Práctica de Laboratorio - Química Orgánica', materia: 'Química', fechaEntrega: '2025-11-08', estado: 'pendiente' },
    { id: 4, nombre: 'Proyecto Final - Desarrollo Web', materia: 'Programación', fechaEntrega: '2025-11-10', estado: 'completada' },
    { id: 5, nombre: 'Informe de Física Cuántica', materia: 'Física', fechaEntrega: '2025-11-12', estado: 'pendiente' }
  ];

  get tareasFiltradas(): Tarea[] {
    let tareas = this.todasLasTareas;

    // Filtrar por estado
    if (this.selectedFilter !== 'todas') {
      tareas = tareas.filter(t => t.estado === this.selectedFilter);
    }

    // Filtrar por búsqueda
    if (this.searchTerm.trim()) {
      const term = this.searchTerm.toLowerCase();
      tareas = tareas.filter(t => 
        t.nombre.toLowerCase().includes(term) ||
        t.materia.toLowerCase().includes(term)
      );
    }

    return tareas;
  }

  limpiarBusqueda(): void {
    this.searchTerm = '';
    this.selectedFilter = 'todas';
  }
}