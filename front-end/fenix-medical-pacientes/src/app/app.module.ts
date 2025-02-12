import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { PaginaPrincipalComponent } from './pages/pagina-principal/pagina-principal.component';
import { DoctoresComponent } from './doctores/doctores.component';
import { MedicinaGeneralComponent } from './medicina-general/medicina-general.component';
import { FisioterapiaComponent } from './fisioterapia/fisioterapia.component';

@NgModule({
  declarations: [
    AppComponent,
    PaginaPrincipalComponent,
    DoctoresComponent,
    MedicinaGeneralComponent,
    FisioterapiaComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
