// src/app/app.ts
import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,              // ❌ Falta, necesario para standalone
  imports: [RouterOutlet],       // Correcto
  templateUrl: './app.html',
  styleUrls: ['./app.css']       // ⚠️ era styleUrl, debe ser styleUrls
})
export class App {
  protected readonly title = signal('organizador');
}
