// alumnos.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { StatCardComponent } from '../estadisticas/estadisticas';
import { TaskCardComponent } from '../tareas/tareas';
import { Ayuda } from '../ayuda/ayuda';
import { Encabezado } from '../encabezado/encabezado';

interface Task {
  id: number;
  nombre: string;
  materia: string;
  fechaEntrega: string;
  calificacion: number;
  estado: 'completada' | 'pendiente' | 'atrasada';
  prioridad: 'alta' | 'media' | 'baja';
  necesitaAyuda: boolean;
}

interface HelpRequest {
  task: Task;
  tipoAyuda: string;
  mensaje: string;
}

@Component({
  selector: 'app-alumnos',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    StatCardComponent,
    TaskCardComponent,
    Ayuda,
    Encabezado
  ],
  templateUrl: './alumnos.html',
  styleUrls: ['./alumnos.css']
})
export class AlumnosComponent implements OnInit {
  selectedTask: Task | null = null;
  showHelpModal = false;
  
  stats = {
    promedio: 85,
    tareasCompletadas: 12,
    tareasPendientes: 5,
    tareasAtrasadas: 2
  };

  tasks: Task[] = [
    {
      id: 1,
      nombre: 'Ensayo sobre la Revolución Industrial',
      materia: 'Historia',
      fechaEntrega: '2025-11-05',
      calificacion: 72,
      estado: 'pendiente',
      prioridad: 'alta',
      necesitaAyuda: true
    },
    {
      id: 2,
      nombre: 'Problemas de Cálculo Diferencial',
      materia: 'Matemáticas',
      fechaEntrega: '2025-11-03',
      calificacion: 65,
      estado: 'atrasada',
      prioridad: 'alta',
      necesitaAyuda: true
    },
    {
      id: 3,
      nombre: 'Práctica de Laboratorio - Química Orgánica',
      materia: 'Química',
      fechaEntrega: '2025-11-08',
      calificacion: 88,
      estado: 'pendiente',
      prioridad: 'media',
      necesitaAyuda: false
    },
    {
      id: 4,
      nombre: 'Proyecto Final - Desarrollo Web',
      materia: 'Programación',
      fechaEntrega: '2025-11-10',
      calificacion: 92,
      estado: 'pendiente',
      prioridad: 'baja',
      necesitaAyuda: false
    }
  ];

  ngOnInit(): void {
    this.sortTasksByPriority();
  }

  sortTasksByPriority(): void {
    this.tasks.sort((a, b) => {
      const priorityOrder = { 'alta': 1, 'media': 2, 'baja': 3 };
      return priorityOrder[a.prioridad] - priorityOrder[b.prioridad];
    });
  }

  openHelpModal(task: Task): void {
    this.selectedTask = task;
    this.showHelpModal = true;
  }

  closeHelpModal(): void {
    this.showHelpModal = false;
    this.selectedTask = null;
  }

  submitHelpRequest(helpRequest: HelpRequest): void {
    console.log('Solicitud de ayuda:', helpRequest);
    // Aquí integrarías con tu servicio backend
    alert(`Solicitud de ayuda enviada para: ${helpRequest.task.nombre}`);
    this.closeHelpModal();
  }
}