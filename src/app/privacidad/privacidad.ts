import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-privacidad',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './privacidad.html',
  styleUrls: ['./privacidad.css']
})
export class PrivacidadComponent {
  fechaActualizacion = '01 de Noviembre de 2025';
}