import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.component.html',
  styleUrls: ['./inicio.component.scss']
})
export class InicioComponent {
  rol: string = 'Doctor'; // Rol predeterminado

  constructor(private router: Router) {}

  iniciarSesion() {
    // Guardar el rol seleccionado en localStorage
    const usuario = {
      rol: this.rol
    };
    localStorage.setItem('usuario', JSON.stringify(usuario));

    // Redirigir según el rol seleccionado
    if (this.rol === 'Administrador') {
      this.router.navigate(['/administrador']);
    } else if (this.rol === 'Doctor') {
      this.router.navigate(['/doctor']);
    }
  }
}
