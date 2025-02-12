import { Component, OnInit } from '@angular/core';
import Chart from 'chart.js/auto';

@Component({
  selector: 'app-doctor',
  templateUrl: './doctor.component.html',
  styleUrls: ['./doctor.component.scss']
})
export class DoctorComponent implements OnInit {
  
  // ✅ Página inicial por defecto
  seccionActual: string = 'dashboard';

  // ✅ Estado del Modo Oscuro
  modoOscuro: boolean = false;

    // ✅ Variables de control para "Ver más"
    verMasCitas: boolean = false;
    verMasAtenciones: boolean = false;
    verMasDocumentos: boolean = false;

      // ✅ Variables de gestión de pacientes
  mostrarFormularioPaciente: boolean = false;
  mostrarHistorialPaciente: boolean = false;
  pestanaActiva: string = 'info';
  historialActivo: string = 'atenciones';

  // ✅ Datos de paciente para edición o nuevo registro
  nuevoPaciente: any = {
    cedula: '',
    nombre: '',
    apellido: '',
    fechaNacimiento: '',
    sexo: '',
    etnia: '',
    telefono: '',
    direccion: '',
    email: '',
    ocupacion: '',
    sangre: '',
    enfermedades: '',
    alergias: '',
    antecedentes: '',
    facturacionNombre: '',
    facturacionApellido: '',
    facturacionCedula: '',
    facturacionEmail: '',
    facturacionCelular: '',
    facturacionDireccion: ''
  };

  // ✅ Datos simulados de pacientes
  pacientes = [
    { cedula: '1723456789', nombre: 'Carlos Ramírez', fechaNacimiento: '1990-05-14', sexo: 'Masculino', telefono: '0999999999', direccion: 'Av. Siempre Viva', historial: [], recetas: [], citas: [], documentos: [], facturas: [] },
    { cedula: '1809876543', nombre: 'María López', fechaNacimiento: '1985-10-20', sexo: 'Femenino', telefono: '0988888888', direccion: 'Calle Principal', historial: [], recetas: [], citas: [], documentos: [], facturas: [] }
  ];
  
  pacienteSeleccionado: any = null;
  filtroPaciente: string = '';
  filtroFechaIngreso: string = '';
  filtroDoctor: string = '';
  fechasIngreso: string[] = ['2024-02-01', '2024-02-05', '2024-02-10']; // Fechas de ingreso simuladas
  doctores = ['Dr. Juan Pérez', 'Dra. Ana Torres'];
    

  // ✅ Datos de atenciones médicas
  atenciones = [
    { id: 1, paciente: 'Carlos Ramírez', cedula: '1723456789', fecha: '2024-02-10', diagnostico: 'Hipertensión' },
    { id: 2, paciente: 'María López', cedula: '1809876543', fecha: '2024-02-11', diagnostico: 'Diabetes' },
    { id: 3, paciente: 'Pedro Castillo', cedula: '1701122334', fecha: '2024-02-12', diagnostico: 'Alergia' },
    { id: 4, paciente: 'Laura Méndez', cedula: '1801234567', fecha: '2024-02-13', diagnostico: 'Gripe' },
    { id: 5, paciente: 'Miguel Ángel', cedula: '1705678912', fecha: '2024-02-14', diagnostico: 'Asma' },
    { id: 6, paciente: 'Elena Ríos', cedula: '1720987654', fecha: '2024-02-15', diagnostico: 'Covid-19' }
  ];

  // ✅ Filtros de búsqueda
  filtroFecha: string = '';
  filtroCitas: string = '';
  filtroDocumentos: string = '';

  // ✅ Datos de citas médicas
  citas = [
    { paciente: 'Ana Torres', fecha: '2024-02-15', hora: '10:00 AM', consultorio: 'Consultorio 1', especialidad: 'Cardiología', medico: 'Dr. Pérez' },
    { paciente: 'Luis Fernández', fecha: '2024-02-16', hora: '11:00 AM', consultorio: 'Consultorio 2', especialidad: 'Neurología', medico: 'Dra. Ramírez' },
    { paciente: 'Sofía Pérez', fecha: '2024-02-17', hora: '09:00 AM', consultorio: 'Consultorio 3', especialidad: 'Pediatría', medico: 'Dr. Gómez' },
  ];
  

  citasHoy = this.citas.filter(cita => cita.fecha === '2024-02-10');
  citasProximas = this.citas.filter(cita => cita.fecha > '2024-02-10');
  citasPasadas = this.citas.filter(cita => cita.fecha < '2024-02-10');


  reprogramarCita(cita: any): void {
    alert(`Reprogramando cita con ${cita.paciente} el ${cita.fecha}`);
  }

  cancelarCita(cita: any): void {
    if (confirm(`¿Estás seguro de cancelar la cita de ${cita.paciente}?`)) {
      this.citas = this.citas.filter(c => c !== cita);
      this.citasHoy = this.citas.filter(cita => cita.fecha === '2024-02-10');
      this.citasProximas = this.citas.filter(cita => cita.fecha > '2024-02-10');
      this.citasPasadas = this.citas.filter(cita => cita.fecha < '2024-02-10');
    }
  }

  // ✅ Notificaciones
  notificaciones = [
    { mensaje: 'Nueva cita programada para hoy a las 10:00 AM' },
    { mensaje: 'Resultado de laboratorio disponible para revisión' },
    { mensaje: 'Paciente Juan Pérez ha enviado un mensaje' }
  ];
  mostrarNotificaciones: boolean = false;

  // ✅ Documentos médicos
  documentos = [
    { nombre: 'Análisis de sangre - Juan Pérez.pdf', fecha: '2024-02-05' },
    { nombre: 'Radiografía de tórax - Ana Torres.png', fecha: '2024-02-07' },
    { nombre: 'Informe médico - Pedro Castillo.docx', fecha: '2024-02-09' },
    { nombre: 'Resonancia Magnética - Carlos Ramírez.pdf', fecha: '2024-02-10' },
    { nombre: 'Electrocardiograma - Sofía Pérez.png', fecha: '2024-02-12' },
    { nombre: 'Ecografía - Miguel Ángel.pdf', fecha: '2024-02-14' }
  ];

  facturas = [
    { fecha: '2024-01-30', detalles: 'Consulta médica', monto: '$50', estado: 'Pagado' },
    { fecha: '2024-01-10', detalles: 'Laboratorio clínico', monto: '$30', estado: 'Pendiente' }
  ];

  verDocumento(doc: any): void {
    alert(`Abriendo documento: ${doc.nombre}`);
  }

  
  subirDocumento(): void {
    alert('Función para subir documentos en desarrollo...');
  }

  constructor() {}

  ngOnInit(): void {
    this.modoOscuro = localStorage.getItem('modoOscuro') === 'true';
    document.body.classList.toggle('modo-oscuro', this.modoOscuro);
    this.cargarGraficos();
    document.addEventListener('click', this.cerrarNotificaciones.bind(this));
  }

// ✅ Cierra las notificaciones si se hace clic fuera del botón o del menú
cerrarNotificaciones(event: Event): void {
  const notificacionesElemento = document.querySelector('.notifications');
  
  if (notificacionesElemento && !notificacionesElemento.contains(event.target as Node)) {
    this.mostrarNotificaciones = false;
  }
}

  // ✅ Cambiar sección
  mostrarSeccion(seccion: string): void {
    this.seccionActual = seccion;
    if (seccion === 'dashboard') {
      setTimeout(() => this.cargarGraficos(), 500);
    }
  
    // Si se vuelve a "Inicio", recargar gráficos
    if (seccion === 'dashboard') {
      setTimeout(() => {
        this.cargarGraficos();
      }, 500);
    }
  }
  
  // ✅ Cerrar sesión
  cerrarSesion(): void {
    if (confirm('¿Está seguro de que desea cerrar sesión?')) {
      console.log('Sesión cerrada');
    }
  }

  // ✅ Alternar Modo Oscuro
  toggleModoOscuro(): void {
    this.modoOscuro = !this.modoOscuro;
    document.body.classList.toggle('modo-oscuro', this.modoOscuro);
    localStorage.setItem('modoOscuro', this.modoOscuro.toString());
  }

// ✅ Método para filtrar pacientes dinámicamente sin necesidad de un Pipe
get pacientesFiltrados() {
  return this.pacientes.filter(paciente => {
    return (
      (!this.filtroPaciente || 
        paciente.nombre.toLowerCase().includes(this.filtroPaciente.toLowerCase()) || 
        paciente.cedula.includes(this.filtroPaciente)) &&
      (!this.filtroFechaIngreso || paciente.fechaNacimiento === this.filtroFechaIngreso)
    );
  });
}

  // ✅ Alternar Notificaciones (Solo se abren con el botón)
toggleNotificaciones(event: Event): void {
  event.stopPropagation(); // Evita que el evento se propague y cierre inmediatamente
  this.mostrarNotificaciones = !this.mostrarNotificaciones;
}

// ✅ Manejo del botón "Ver más"
get citasFiltradas() {
  return this.citas.slice(0, this.verMasCitas ? this.citas.length : 5);
}

get atencionesFiltradas() {
  return this.atenciones.slice(0, this.verMasAtenciones ? this.atenciones.length : 5);
}

get documentosFiltrados() {
  return this.documentos.slice(0, this.verMasDocumentos ? this.documentos.length : 5);
}

  // ✅ Métodos de gestión de pacientes
  abrirFormularioPaciente(): void {
    this.mostrarFormularioPaciente = true;
    this.nuevoPaciente = { 
      cedula: '', nombre: '', apellido: '', fechaNacimiento: '', sexo: '', etnia: '',
      telefono: '', direccion: '', email: '', ocupacion: '', sangre: '', 
      enfermedades: '', alergias: '', antecedentes: '', 
      facturacionNombre: '', facturacionApellido: '', facturacionCedula: '', 
      facturacionEmail: '', facturacionCelular: '', facturacionDireccion: ''
    };
  }

// ✅ Cerrar formulario de paciente
cerrarFormularioPaciente(): void {
  this.mostrarFormularioPaciente = false;
}

  // ✅ Editar paciente
  editarPaciente(paciente: any): void {
    this.nuevoPaciente = { ...paciente }; // Clonamos el paciente seleccionado
    this.mostrarFormularioPaciente = true;
  }

    // ✅ Guardar paciente (Simulado)
    guardarPaciente(): void {
      if (this.nuevoPaciente.cedula) {
        this.pacientes.push({ ...this.nuevoPaciente }); // Agrega nuevo paciente
        console.log('Paciente guardado');
        this.cerrarFormularioPaciente();
      }
    }

// ✅ Cambiar pestaña en formulario de paciente
cambiarPestana(pestana: string): void {
  this.pestanaActiva = pestana;
}

// ✅ Eliminar paciente
eliminarPaciente(paciente: any): void {
  this.pacientes = this.pacientes.filter(p => p !== paciente);
}

// ✅ Ver historial del paciente
verHistorial(paciente: any): void {
  this.pacienteSeleccionado = paciente;
  this.mostrarHistorialPaciente = true;
}

// ✅ Cerrar historial
cerrarHistorialPaciente(): void {
  this.mostrarHistorialPaciente = false;
  this.pacienteSeleccionado = null;
}

// ✅ Cambiar pestaña en historial médico
cambiarHistorial(seccion: string): void {
  this.historialActivo = seccion;
}


  // ✅ Marcar cita como atendida
  marcarComoAtendida(cita: any): void {
    this.citas = this.citas.filter(c => c !== cita);
  }

  // ✅ Descargar documento
  descargarDocumento(doc: any): void {
    console.log(`Descargando: ${doc.nombre}`);
  }

    // ✅ Subir nuevo documento
    subirNuevoDocumento(): void {
      console.log('Subiendo un nuevo documento...');
      // Aquí puedes agregar la lógica para abrir un modal o formulario de carga
    }  

  // ✅ Cargar gráficos
  cargarGraficos(): void {
    setTimeout(() => {
      new Chart('barChart', {
        type: 'bar',
        data: {
          labels: ['Cardiología', 'Neurología', 'Pediatría'],
          datasets: [{ label: 'Pacientes Atendidos', data: [40, 30, 20], backgroundColor: ['#1abc9c', '#3498db', '#e74c3c'] }]
        }
      });

      new Chart('lineChart', {
        type: 'line',
        data: {
          labels: ['Enero', 'Febrero', 'Marzo', 'Abril'],
          datasets: [{ label: 'Pacientes Atendidos', data: [10, 20, 30, 25], borderColor: '#f39c12', fill: false }]
        }
      });

      new Chart('pieChart', {
        type: 'pie',
        data: {
          labels: ['Hipertensión', 'Diabetes', 'Alergia'],
          datasets: [{ data: [50, 30, 20], backgroundColor: ['#e67e22', '#8e44ad', '#2ecc71'] }]
        }
      });

      new Chart('appointmentsChart', {
        type: 'doughnut',
        data: {
          labels: ['Confirmadas', 'Pendientes'],
          datasets: [{ data: [10, 5], backgroundColor: ['#27ae60', '#c0392b'] }]
        }
      });
    }, 500);
  }
}
