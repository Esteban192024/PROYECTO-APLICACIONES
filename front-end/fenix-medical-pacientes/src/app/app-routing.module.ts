import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PaginaPrincipalComponent } from './pages/pagina-principal/pagina-principal.component';
import { DoctoresComponent } from './doctores/doctores.component';
import { MedicinaGeneralComponent } from './medicina-general/medicina-general.component';
import { FisioterapiaComponent } from './fisioterapia/fisioterapia.component';

// Definición de rutas
const routes: Routes = [
  { path: '', component: PaginaPrincipalComponent }, // Ruta principal
  { path: 'doctores', component: DoctoresComponent }, // Ruta para doctores
  { path: 'medicina-general', component: MedicinaGeneralComponent }, // Ruta para medicina general
  { path: 'fisioterapia', component: FisioterapiaComponent }, // Ruta para fisioterapia
  { path: '**', redirectTo: '', pathMatch: 'full' } // Redirección a la página principal si la ruta no existe
];

@NgModule({
  imports: [RouterModule.forRoot(routes)], // Configuración de rutas principales
  exports: [RouterModule], // Exportación del módulo de rutas
})
export class AppRoutingModule {}
