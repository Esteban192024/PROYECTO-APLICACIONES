import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DashboardService {
  private apiUrl = 'http://localhost:3000/api/dashboard';

  constructor(private http: HttpClient) {}

  /**
   * Obtener el resumen diario de pacientes, especialidades y citas.
   * @returns Observable con los datos del resumen diario.
   */
  getDailySummary(): Observable<any> {
    return this.http.get(`${this.apiUrl}/daily-summary`);
  }

  /**
   * Obtener las últimas atenciones realizadas por el doctor.
   * @returns Observable con los datos de las últimas atenciones.
   */
  getRecentAttentions(): Observable<any> {
    return this.http.get(`${this.apiUrl}/recent-attentions`);
  }

  /**
   * Obtener información detallada de un paciente específico.
   * @param id - ID del paciente a consultar.
   * @returns Observable con los datos del paciente.
   */
  getPatientDetails(id: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/patient-details/${id}`);
  }

  /**
   * Generar un reporte médico basado en criterios específicos.
   * @param criteria - Criterios para generar el reporte.
   * @returns Observable con los datos del reporte generado.
   */
  generateReport(criteria: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/generate-report`, criteria);
  }
}
