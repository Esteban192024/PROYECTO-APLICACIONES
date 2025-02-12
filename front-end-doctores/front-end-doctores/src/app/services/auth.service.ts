import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root', // Hace que el servicio sea inyectable en toda la aplicación
})
export class AuthService {
  private doctorName: string = '';
  private doctorCedula: string = '';

  // Método para establecer el nombre del doctor
  setDoctorName(name: string): void {
    this.doctorName = name;
    localStorage.setItem('doctorName', name); // Guardar en localStorage
  }

  // Método para obtener el nombre del doctor
  getDoctorName(): string {
    if (!this.doctorName) {
      this.doctorName = localStorage.getItem('doctorName') || '';
    }
    return this.doctorName;
  }

  // Método para establecer la cédula del doctor
  setDoctorCedula(cedula: string): void {
    this.doctorCedula = cedula;
    localStorage.setItem('doctorCedula', cedula); // Guardar en localStorage
  }

  // Método para obtener la cédula del doctor
  getDoctorCedula(): string {
    if (!this.doctorCedula) {
      this.doctorCedula = localStorage.getItem('doctorCedula') || '';
    }
    return this.doctorCedula;
  }

  // Método para cerrar sesión
  logout(): void {
    localStorage.clear(); // Limpia el almacenamiento local
    sessionStorage.clear(); // Limpia el almacenamiento de sesión
    this.doctorName = '';
    this.doctorCedula = '';
  }
}
