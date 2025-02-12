import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DoctorComponent } from './doctor/doctor.component'; // 📌 Importamos el nuevo componente Doctor
import { DoctorDashboardComponent } from './doctor-dashboard/doctor-dashboard.component';
import { CrearCuentaComponent } from './crear-cuenta/crear-cuenta.component';
import { InicioComponent } from './inicio/inicio.component';
import { AdministradorComponent } from './administrador/administrador.component';

const routes: Routes = [
  { path: '', redirectTo: 'inicio', pathMatch: 'full' }, // Página por defecto
  { path: 'inicio', component: InicioComponent }, // Página principal
  { path: 'doctor', component: DoctorComponent }, // 📌 Conectamos el nuevo componente Doctor
  { path: 'doctor-dashboard', component: DoctorDashboardComponent },
  { path: 'crear-cuenta', component: CrearCuentaComponent },
  { path: 'administrador', component: AdministradorComponent }, // Panel del Administrador
  { path: 'admin', redirectTo: 'administrador', pathMatch: 'full' }, // Alias para acceder a administrador
  { path: '**', redirectTo: 'inicio', pathMatch: 'full' } // Redirección en caso de rutas inválidas
];

@NgModule({
  imports: [RouterModule.forRoot(routes)], 
  exports: [RouterModule]
})
export class AppRoutingModule {}
