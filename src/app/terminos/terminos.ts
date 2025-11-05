import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-terminos',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './terminos.html',
  styleUrls: ['./terminos.css']
})
export class TerminosComponent {
  fechaActualizacion = '01 de Noviembre de 2025';
}
