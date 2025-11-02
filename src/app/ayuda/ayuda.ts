import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

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
  selector: 'app-help-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './ayuda.html',
  styleUrls: ['./ayuda.css']
})
export class Ayuda {
  @Input() task!: Task;
  @Output() close = new EventEmitter<void>();
  @Output() submit = new EventEmitter<HelpRequest>();

  tipoAyuda = 'explicacion';
  mensaje = '';

  tiposAyuda = [
    { value: 'explicacion', label: 'Explicación del tema' },
    { value: 'revision', label: 'Revisión de mi trabajo' },
    { value: 'organizacion', label: 'Ayuda con organización' },
    { value: 'recursos', label: 'Recursos adicionales' }
  ];

  onClose(): void {
    this.close.emit();
  }

  onSubmit(event: Event): void {
    event.preventDefault();
    
    if (!this.mensaje.trim()) {
      alert('Por favor describe tu duda o problema');
      return;
    }

    const helpRequest: HelpRequest = {
      task: this.task,
      tipoAyuda: this.tipoAyuda,
      mensaje: this.mensaje
    };

    this.submit.emit(helpRequest);
    
    // Limpiar el formulario después de enviar
    this.mensaje = '';
    this.tipoAyuda = 'explicacion';
  }
}