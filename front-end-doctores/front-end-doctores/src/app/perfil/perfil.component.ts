import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.scss'],
})
export class PerfilComponent implements OnInit {
  // Información del usuario
  perfilUsuario = {
    nombre: '',
    cedula: '',
    email: '',
    telefono: '',
    direccion: '',
    especialidad: '',
  };

  // Control para los campos en edición
  editando: Record<keyof typeof this.perfilUsuario, boolean> = {
    nombre: false,
    cedula: false,
    email: false,
    telefono: false,
    direccion: false,
    especialidad: false,
  };

  // Contraseñas
  passwordActual = '';
  passwordNueva = '';
  confirmarPassword = '';

  constructor(
    private authService: AuthService,
    private router: Router,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    const cedula = this.authService.getDoctorCedula(); // Obtener la cédula desde AuthService
    if (!cedula) {
      alert('No se encontró la cédula del usuario. Redirigiendo al inicio...');
      this.router.navigate(['/registro']);
      return;
    }

    // Cargar datos del perfil desde el back-end
    this.http
      .get(`http://localhost:5000/api/doctores/perfil/${cedula}`) // URL completa
      .subscribe(
        (data: any) => {
          this.perfilUsuario = data; // Asigna los datos al perfil
        },
        (error) => {
          alert('Error al cargar el perfil: ' + error.message);
          console.error(error);
        }
      );
  }

  // Método para cerrar sesión
  cerrarSesion(): void {
    this.authService.logout(); // Llama al método logout del servicio AuthService
    this.router.navigate(['/registro']); // Redirige al registro
  }

  // Método para volver al dashboard
  volver(): void {
    this.router.navigate(['/doctor-dashboard']);
  }

  // Alternar entre editar y guardar para un campo específico
  toggleEditar(campo: keyof typeof this.perfilUsuario): void {
    if (this.editando[campo]) {
      // Guardar los cambios al back-end
      const cedula = this.authService.getDoctorCedula();
      this.http
        .put(`http://localhost:5000/api/doctores/perfil/${cedula}`, {
          [campo]: this.perfilUsuario[campo],
        })
        .subscribe(
          (response: any) => {
            alert(
              `${campo.charAt(0).toUpperCase() + campo.slice(1)} actualizado exitosamente.`
            );
          },
          (error) => {
            alert('Error al actualizar los datos: ' + error.message);
            console.error(error);
          }
        );
    }
    this.editando[campo] = !this.editando[campo];
  }

  // Cambiar la contraseña del usuario
  cambiarPassword(): void {
    if (!this.passwordActual || !this.passwordNueva || !this.confirmarPassword) {
      alert('Por favor, completa todos los campos.');
      return;
    }

    if (this.passwordNueva !== this.confirmarPassword) {
      alert('La nueva contraseña y su confirmación no coinciden.');
      return;
    }

    const cedula = this.authService.getDoctorCedula(); // Obtener la cédula desde AuthService
    if (!cedula) {
      alert('No se encontró la cédula del usuario.');
      return;
    }

    this.http
      .put(`http://localhost:5000/api/doctores/perfil/${cedula}/cambiar-password`, {
        passwordActual: this.passwordActual,
        passwordNueva: this.passwordNueva,
      })
      .subscribe(
        (response: any) => {
          alert(response.mensaje || 'Contraseña actualizada correctamente.');
          this.passwordActual = '';
          this.passwordNueva = '';
          this.confirmarPassword = '';
        },
        (error: any) => {
          alert(
            error.error?.mensaje || 'Error desconocido al intentar cambiar la contraseña.'
          );
        }
      );
  }

  // Actualizar todo el perfil en el back-end
  actualizarPerfil(): void {
    const cedula = this.authService.getDoctorCedula(); // Obtener la cédula
    if (!cedula) {
      alert('No se encontró la cédula del usuario.');
      return;
    }

    this.http
      .put(`http://localhost:5000/api/doctores/perfil/${cedula}`, this.perfilUsuario)
      .subscribe(
        (response: any) => {
          alert('Perfil actualizado correctamente.');
        },
        (error: any) => {
          alert('Error al actualizar el perfil: ' + error.message);
          console.error(error);
        }
      );
  }
}
