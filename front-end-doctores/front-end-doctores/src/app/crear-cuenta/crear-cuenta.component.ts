import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-crear-cuenta',
  templateUrl: './crear-cuenta.component.html',
  styleUrls: ['./crear-cuenta.component.scss'],
})
export class CrearCuentaComponent {
  nuevoDoctor = {
    nombre: '',
    cedula: '',
    email: '',
    telefono: '',
    direccion: '',
    especialidad: '',
    password: '',
  };

  cargando: boolean = false; // Para mostrar un spinner mientras se procesa la solicitud

  constructor(private http: HttpClient, private router: Router) {}

  crearCuenta(): void {
    if (!this.validarCampos()) {
      return;
    }

    this.cargando = true;
    this.http.post('/api/doctores/crear-cuenta', this.nuevoDoctor).subscribe(
      (response: any) => {
        alert(response.mensaje || 'Cuenta creada exitosamente.');
        this.router.navigate(['/registro']); // Redirige al registro después de crear la cuenta
      },
      (error: any) => {
        if (error.error?.mensaje) {
          alert('Error al crear la cuenta: ' + error.error.mensaje);
        } else {
          alert('Error desconocido al crear la cuenta.');
        }
      },
      () => {
        this.cargando = false;
      }
    );
  }

  private validarCampos(): boolean {
    const { nombre, cedula, email, telefono, direccion, especialidad, password } = this.nuevoDoctor;

    if (!nombre || !cedula || !email || !telefono || !direccion || !especialidad || !password) {
      alert('Todos los campos son obligatorios.');
      return false;
    }

    const emailRegex = /^\S+@\S+\.\S+$/;
    if (!emailRegex.test(email)) {
      alert('El correo electrónico no tiene un formato válido.');
      return false;
    }

    const passwordRegex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordRegex.test(password)) {
      alert(
        'La contraseña debe tener al menos 8 caracteres, una letra mayúscula, una letra minúscula, un número y un carácter especial.'
      );
      return false;
    }

    return true;
  }
}
