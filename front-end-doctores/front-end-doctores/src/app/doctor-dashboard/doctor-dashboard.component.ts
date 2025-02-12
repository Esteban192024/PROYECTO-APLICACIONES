import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../services/auth.service';
import { DashboardService } from '../services/dashboard.service';

@Component({
  selector: 'app-doctor-dashboard',
  templateUrl: './doctor-dashboard.component.html',
  styleUrls: ['./doctor-dashboard.component.scss'],
})
export class DoctorDashboardComponent implements OnInit {
  doctorName: string = '';
  seccionActual: string = 'inicio'; // Controla la sección activa en el dashboard
  summary: any = {
    pacientesAtendidos: 0,
    especialidadesDemandadas: [],
    proximasCitas: 0,
  };
  attentions: any[] = [];
  filtros = {
    cedula: '',
    nombre: '',
    historial: '',
  };

  nuevoPaciente = {
    nombre: '',
    cedula: '',
    historial: '',
  };

  // Datos para registrar una nueva atención médica
  nuevaAtencion = {
    idAtencion: '',
    nombrePaciente: '',
    cedula: '',
    fecha: '',
    diagnostico: '',
  };

  // Historial de atenciones médicas
  atencionesMedicas: any[] = [];

  // Diagnósticos CIE10
  busquedaCIE10: string = '';
  resultadosCIE10: any[] = [];
  diagnosticosSeleccionados: any[] = [];


  // Certificados Médicos
nuevoCertificado = {
  nombrePaciente: '',
  diagnostico: '',
  reposo: 0,
};

certificadosMedicos: any[] = [];

// Filtros para generar reportes
filtroReporte = {
  especialidad: '',
  fechaInicio: '',
  fechaFin: '',
};

// Detalles del reporte generado
detallesReporte: any[] = [];

// Datos simulados para generación de reportes
reportesSimulados = [
  { especialidad: 'Pediatría', cantidad: 15, fecha: '2024-12-01' },
  { especialidad: 'Cardiología', cantidad: 10, fecha: '2024-12-02' },
  { especialidad: 'Dermatología', cantidad: 8, fecha: '2024-12-03' },
];


  constructor(
    private http: HttpClient,
    private authService: AuthService,
    private dashboardService: DashboardService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const cedula = this.authService.getDoctorCedula(); // Obtener la cédula del AuthService
    if (!cedula) {
      alert('No se encontró la cédula del usuario. Redirigiendo al inicio...');
      this.router.navigate(['/registro']);
      return;
    }

    // Solicitar el nombre del doctor al back-end
    this.http.get(`http://localhost:5000/api/doctores/perfil/${cedula}`).subscribe(
      (data: any) => {
        this.doctorName = data.nombre; // Asignar el nombre del doctor
      },
      (error) => {
        alert('Error al cargar el nombre del doctor: ' + error.message);
      }
    );
  

    // Obtener el resumen diario
    this.dashboardService.getDailySummary().subscribe(
      (data) => {
        this.summary = data;
      },
      (error) => {
        console.error('Error al obtener el resumen diario:', error);
      }
    );

    // Obtener las últimas atenciones
    this.dashboardService.getRecentAttentions().subscribe(
      (data) => {
        this.attentions = data;
      },
      (error) => {
        console.error('Error al obtener las últimas atenciones:', error);
      }
    );

    // Cargar las atenciones médicas iniciales (simulación)
    this.cargarHistorialClinico();
  }

  // Manejar la sección actual para cambiar dinámicamente el cuerpo de la página
  mostrarSeccion(seccion: string): void {
    this.seccionActual = seccion;

  }

  // Buscar pacientes
  buscarPaciente(): void {
    console.log('Búsqueda realizada con filtros:', this.filtros);
    // Aquí puedes conectar con el servicio para buscar pacientes
  }

  // Registrar un nuevo paciente
  registrarPaciente(): void {
    console.log('Nuevo paciente registrado:', this.nuevoPaciente);
    alert('Paciente registrado exitosamente');
    // Aquí puedes conectar con el servicio para registrar pacientes
    this.nuevoPaciente = { nombre: '', cedula: '', historial: '' }; // Resetear el formulario
  }

  // Registrar una nueva atención médica
  registrarAtencion(): void {
    // Validar los datos antes de registrarlos
    if (
      !this.nuevaAtencion.idAtencion ||
      !this.nuevaAtencion.nombrePaciente ||
      !this.nuevaAtencion.cedula ||
      !this.nuevaAtencion.fecha
    ) {
      alert('Por favor, complete todos los campos requeridos.');
      return;
    }

    // Simular registro de la atención médica
    this.atencionesMedicas.push({ ...this.nuevaAtencion });
    alert('Atención médica registrada exitosamente.');

    // Limpiar el formulario
    this.nuevaAtencion = {
      idAtencion: '',
      nombrePaciente: '',
      cedula: '',
      fecha: '',
      diagnostico: '',
    };
  }

  // Cargar el historial clínico (simulación)
  cargarHistorialClinico(): void {
    this.atencionesMedicas = [
      {
        idAtencion: 'A001',
        nombrePaciente: 'Juan Pérez',
        cedula: '1234567890',
        fecha: '2024-12-01',
        diagnostico: 'Gripe común',
      },
      {
        idAtencion: 'A002',
        nombrePaciente: 'María López',
        cedula: '0987654321',
        fecha: '2024-12-02',
        diagnostico: 'Dolor de cabeza persistente',
      },
    ];
  }

  // Datos para crear una nueva receta
nuevaReceta = {
  nombrePaciente: '',
  medicamentos: '',
  indicaciones: '',
};

// Plantillas de recetas médicas frecuentes
plantillasRecetas: any[] = [
  { nombre: 'Antibióticos - Uso General', medicamentos: 'Amoxicilina 500mg', indicaciones: 'Tomar 1 cada 8 horas por 7 días' },
  { nombre: 'Analgésicos - Dolor Moderado', medicamentos: 'Ibuprofeno 400mg', indicaciones: 'Tomar 1 cada 6 horas si es necesario' },
  { nombre: 'Antihistamínicos - Alergias', medicamentos: 'Loratadina 10mg', indicaciones: 'Tomar 1 diaria por 10 días' },
];

// Lista de recetas generadas
recetasMedicas: any[] = [];

// Datos para agendar una nueva cita
nuevaCita = {
  nombrePaciente: '',
  fecha: '',
  hora: '',
};

// Lista de citas programadas
citasProgramadas: any[] = [
  {
    nombrePaciente: 'Juan Pérez',
    fecha: '2024-12-25',
    hora: '10:30',
    estado: 'Confirmada',
  },
  {
    nombrePaciente: 'María López',
    fecha: '2024-12-26',
    hora: '12:00',
    estado: 'Pendiente',
  },
];

// Perfil del usuario
perfilUsuario = {
  nombre: 'Dr. Danny Castillo',
  email: 'danny.castillo@fenixmedical.com',
};

// Contraseña actual y nueva
passwordActual = '';
passwordNueva = '';
confirmarPassword = '';

// Preferencias del sistema
preferenciasSistema = {
  tema: 'claro',
};


  // Ver detalles de una atención médica
  verAtencion(atencion: any): void {
    alert(
      `Detalles de la atención:\n\nID: ${atencion.idAtencion}\nPaciente: ${atencion.nombrePaciente}\nCédula: ${atencion.cedula}\nFecha: ${atencion.fecha}\nDiagnóstico: ${atencion.diagnostico}`
    );
  }

  // Editar una atención médica
  editarAtencion(atencion: any): void {
    const diagnosticoEditado = prompt(
      'Editar diagnóstico:',
      atencion.diagnostico
    );
    if (diagnosticoEditado !== null) {
      atencion.diagnostico = diagnosticoEditado;
      alert('Diagnóstico actualizado.');
    }
  }

  // Eliminar una atención médica
  eliminarAtencion(atencion: any): void {
    const confirmacion = confirm(
      `¿Está seguro de eliminar la atención médica de ${atencion.nombrePaciente}?`
    );
    if (confirmacion) {
      this.atencionesMedicas = this.atencionesMedicas.filter(
        (a) => a.idAtencion !== atencion.idAtencion
      );
      alert('Atención médica eliminada.');
    }
  }

  // Buscar diagnósticos CIE10
  buscarCIE10(): void {
    if (this.busquedaCIE10.trim() === '') {
      this.resultadosCIE10 = [];
      return;
    }

    // Simular resultados de búsqueda
    this.resultadosCIE10 = [
      { codigo: 'A001', descripcion: 'Gripe común' },
      { codigo: 'B002', descripcion: 'Migraña crónica' },
      { codigo: 'C003', descripcion: 'Dolor lumbar' },
    ].filter((item) =>
      item.descripcion.toLowerCase().includes(this.busquedaCIE10.toLowerCase())
    );
  }

  // Seleccionar un diagnóstico CIE10
  seleccionarCIE10(diagnostico: any): void {
    if (
      !this.diagnosticosSeleccionados.some(
        (item) => item.codigo === diagnostico.codigo
      )
    ) {
      this.diagnosticosSeleccionados.push(diagnostico);
    }
    this.busquedaCIE10 = '';
    this.resultadosCIE10 = [];
  }

  // Generar un nuevo certificado médico
generarCertificado(): void {
  if (
    !this.nuevoCertificado.nombrePaciente ||
    !this.nuevoCertificado.diagnostico ||
    this.nuevoCertificado.reposo <= 0
  ) {
    alert('Por favor, complete todos los campos correctamente.');
    return;
  }

  this.certificadosMedicos.push({ ...this.nuevoCertificado });
  alert('Certificado médico generado exitosamente.');

  // Limpiar el formulario
  this.nuevoCertificado = {
    nombrePaciente: '',
    diagnostico: '',
    reposo: 0,
  };
}

// Ver un certificado médico
verCertificado(certificado: any): void {
  alert(
    `Detalles del Certificado:\n\nPaciente: ${certificado.nombrePaciente}\nDiagnóstico: ${certificado.diagnostico}\nDías de Reposo: ${certificado.reposo}`
  );
}

// Editar un certificado médico
editarCertificado(certificado: any): void {
  const nuevoDiagnostico = prompt(
    'Editar Diagnóstico:',
    certificado.diagnostico
  );
  const nuevosDiasReposo = prompt(
    'Editar Días de Reposo:',
    certificado.reposo.toString()
  );

  if (nuevoDiagnostico !== null && nuevosDiasReposo !== null) {
    certificado.diagnostico = nuevoDiagnostico;
    certificado.reposo = parseInt(nuevosDiasReposo, 10);
    alert('Certificado actualizado exitosamente.');
  }
}

// Eliminar un certificado médico
eliminarCertificado(certificado: any): void {
  const confirmacion = confirm(
    `¿Está seguro de eliminar el certificado médico de ${certificado.nombrePaciente}?`
  );
  if (confirmacion) {
    this.certificadosMedicos = this.certificadosMedicos.filter(
      (c) => c !== certificado
    );
    alert('Certificado eliminado exitosamente.');
  }
}

// Crear una nueva receta médica
crearReceta(): void {
  if (
    !this.nuevaReceta.nombrePaciente ||
    !this.nuevaReceta.medicamentos ||
    !this.nuevaReceta.indicaciones
  ) {
    alert('Por favor, complete todos los campos antes de crear la receta.');
    return;
  }

  this.recetasMedicas.push({ ...this.nuevaReceta });
  alert('Receta médica creada exitosamente.');

  // Limpiar el formulario
  this.nuevaReceta = {
    nombrePaciente: '',
    medicamentos: '',
    indicaciones: '',
  };
}

// Aplicar una plantilla de receta
aplicarPlantilla(plantilla: any): void {
  this.nuevaReceta.medicamentos = plantilla.medicamentos;
  this.nuevaReceta.indicaciones = plantilla.indicaciones;
  alert(`Plantilla aplicada: ${plantilla.nombre}`);
}

// Ver detalles de una receta
verReceta(receta: any): void {
  alert(
    `Detalles de la receta:\n\nPaciente: ${receta.nombrePaciente}\nMedicamentos: ${receta.medicamentos}\nIndicaciones: ${receta.indicaciones}`
  );
}

// Editar una receta existente
editarReceta(receta: any): void {
  const nuevosMedicamentos = prompt(
    'Editar Medicamentos:',
    receta.medicamentos
  );
  const nuevasIndicaciones = prompt(
    'Editar Indicaciones:',
    receta.indicaciones
  );

  if (nuevosMedicamentos !== null && nuevasIndicaciones !== null) {
    receta.medicamentos = nuevosMedicamentos;
    receta.indicaciones = nuevasIndicaciones;
    alert('Receta actualizada exitosamente.');
  }
}

// Eliminar una receta médica
eliminarReceta(receta: any): void {
  const confirmacion = confirm(
    `¿Está seguro de eliminar la receta médica de ${receta.nombrePaciente}?`
  );
  if (confirmacion) {
    this.recetasMedicas = this.recetasMedicas.filter(
      (r) => r !== receta
    );
    alert('Receta eliminada exitosamente.');
  }
}

// Generar un reporte médico basado en los filtros
generarReporte(): void {
  // Validar que al menos uno de los filtros esté seleccionado
  if (!this.filtroReporte.especialidad && !this.filtroReporte.fechaInicio && !this.filtroReporte.fechaFin) {
    alert('Por favor, seleccione al menos un filtro para generar el reporte.');
    return;
  }

  // Filtrar los datos simulados en base a los filtros
  this.detallesReporte = this.reportesSimulados.filter((reporte) => {
    const cumpleEspecialidad =
      !this.filtroReporte.especialidad || reporte.especialidad === this.filtroReporte.especialidad;
    const cumpleFechaInicio =
      !this.filtroReporte.fechaInicio || new Date(reporte.fecha) >= new Date(this.filtroReporte.fechaInicio);
    const cumpleFechaFin =
      !this.filtroReporte.fechaFin || new Date(reporte.fecha) <= new Date(this.filtroReporte.fechaFin);

    return cumpleEspecialidad && cumpleFechaInicio && cumpleFechaFin;
  });

  if (this.detallesReporte.length === 0) {
    alert('No se encontraron resultados con los filtros seleccionados.');
  } else {
    alert('Reporte generado exitosamente.');
  }
}

// Simulación para cargar gráficas (integrar librerías como Chart.js)
cargarGraficas(): void {
  console.log('Cargando gráficas...');

  // Aquí puedes integrar lógica de librerías como Chart.js o ng2-charts.
  // Ejemplo: Actualizar datasets para las gráficas de barras, pastel y líneas.
}

// Agendar una nueva cita
agendarCita(): void {
  if (!this.nuevaCita.nombrePaciente || !this.nuevaCita.fecha || !this.nuevaCita.hora) {
    alert('Por favor, complete todos los campos antes de agendar la cita.');
    return;
  }

  this.citasProgramadas.push({ ...this.nuevaCita, estado: 'Pendiente' });
  alert('Cita agendada exitosamente.');

  // Limpiar el formulario
  this.nuevaCita = {
    nombrePaciente: '',
    fecha: '',
    hora: '',
  };
}

// Ver detalles de una cita
verCita(cita: any): void {
  alert(
    `Detalles de la cita:\n\nPaciente: ${cita.nombrePaciente}\nFecha: ${cita.fecha}\nHora: ${cita.hora}\nEstado: ${cita.estado}`
  );
}

// Editar una cita existente
editarCita(cita: any): void {
  const nuevaFecha = prompt('Editar Fecha (YYYY-MM-DD):', cita.fecha);
  const nuevaHora = prompt('Editar Hora (HH:MM):', cita.hora);

  if (nuevaFecha !== null && nuevaHora !== null) {
    cita.fecha = nuevaFecha;
    cita.hora = nuevaHora;
    alert('Cita actualizada exitosamente.');
  }
}

// Eliminar una cita
eliminarCita(cita: any): void {
  const confirmacion = confirm(
    `¿Está seguro de eliminar la cita con ${cita.nombrePaciente}?`
  );
  if (confirmacion) {
    this.citasProgramadas = this.citasProgramadas.filter((c) => c !== cita);
    alert('Cita eliminada exitosamente.');
  }
}

// Guardar los cambios en el perfil del usuario
guardarPerfil(): void {
  if (!this.perfilUsuario.nombre || !this.perfilUsuario.email) {
    alert('Por favor, complete todos los campos del perfil.');
    return;
  }

  // Simulación de guardado
  alert(`Perfil actualizado:\n\nNombre: ${this.perfilUsuario.nombre}\nEmail: ${this.perfilUsuario.email}`);
}

// Cambiar la contraseña
cambiarPassword(): void {
  if (!this.passwordActual || !this.passwordNueva || !this.confirmarPassword) {
    alert('Por favor, complete todos los campos para cambiar la contraseña.');
    return;
  }

  if (this.passwordNueva !== this.confirmarPassword) {
    alert('La nueva contraseña y la confirmación no coinciden.');
    return;
  }

  // Simulación de cambio de contraseña
  alert('Contraseña actualizada exitosamente.');
  this.passwordActual = '';
  this.passwordNueva = '';
  this.confirmarPassword = '';
}

// Guardar las preferencias del sistema
guardarPreferencias(): void {
  alert(`Preferencias guardadas:\n\nTema seleccionado: ${this.preferenciasSistema.tema}`);
}

cerrarSesion(): void {
  // Si tienes un AuthService, realiza la limpieza de datos
  if (this.authService) {
    this.authService.logout();
  }

  // Redirige al registro
  this.router.navigate(['/registro']);
}

  // Navegar a otras secciones desde los atajos rápidos
  goTo(route: string): void {
    this.router.navigate([`/${route}`]);
  }
}



