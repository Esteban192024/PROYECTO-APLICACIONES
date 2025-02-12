import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';

// 📌 Importación de Componentes
import { AppComponent } from './app.component';
import { DoctorDashboardComponent } from './doctor-dashboard/doctor-dashboard.component';
import { PerfilComponent } from './perfil/perfil.component';
import { CrearCuentaComponent } from './crear-cuenta/crear-cuenta.component';
import { InicioComponent } from './inicio/inicio.component';
import { AdministradorComponent } from './administrador/administrador.component';

// 📌 Importación de Servicios
import { AuthService } from './services/auth.service';
import { DoctorComponent } from './doctor/doctor.component';

@NgModule({
  declarations: [
    AppComponent,
    DoctorDashboardComponent,
    PerfilComponent,
    CrearCuentaComponent,
    InicioComponent,
    AdministradorComponent,
    DoctorComponent // ✅ Componente Administrador correctamente registrado
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    CommonModule
  ],
  providers: [AuthService],
  bootstrap: [AppComponent]
})
export class AppModule { }
