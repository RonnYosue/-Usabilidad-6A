import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PreferenciasService } from '../services/preferencias.service';
import { IdiomaService } from '../services/idioma.service';

@Component({
  selector: 'app-encabezado',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './encabezado.html',
  styleUrls: ['./encabezado.css']
})
export class Encabezado implements OnInit {
  currentLang = 'es';
  menuOpen = false;
  darkMode = false;

  constructor(
    private preferencias: PreferenciasService,
    private idioma: IdiomaService
  ) {}

  ngOnInit() {
    // Inicializamos idioma desde el servicio
    this.currentLang = this.idioma.currentLang;

    // Suscribirse a cambios de idioma global
    this.idioma.currentLang$.subscribe(lang => {
      this.currentLang = lang;
    });

    // Suscribirse a cambios de modo oscuro
    this.preferencias.darkMode$.subscribe(dark => {
      this.darkMode = dark;
    });
  }

  // Mostrar / ocultar menú
  toggleMenu() {
    this.menuOpen = !this.menuOpen;
    console.log('Menú', this.menuOpen ? 'abierto' : 'cerrado');
  }

  // Activar / desactivar modo oscuro
  toggleDarkMode() {
    this.preferencias.toggleDarkMode();
  }

  // Abrir perfil
  openProfile() {
    console.log('Abrir perfil');
    // this.router.navigate(['/perfil']);
  }

  // Cambiar idioma
  changeLanguage(event: Event) {
    const select = event.target as HTMLSelectElement;
    this.idioma.changeLang(select.value);
  }

  // Cerrar sesión
  logout() {
    console.log('Cerrando sesión...');
    if (typeof window !== 'undefined') {
      localStorage.removeItem('usuarioActivo');
    }
    window.location.href = '/login';
  }

  // Función para obtener texto según idioma
  
  t(key: string) {
    const textos: any = {
      es: {
        menu: 'Menú',
        modoOscuro: 'Modo oscuro',
        perfil: 'Perfil',
        cerrarSesion: 'Cerrar sesión'
      },
      en: {
        menu: 'Menu',
        modoOscuro: 'Dark mode',
        perfil: 'Profile',
        cerrarSesion: 'Logout'
      }
    };
    return textos[this.currentLang][key];
  }
}
