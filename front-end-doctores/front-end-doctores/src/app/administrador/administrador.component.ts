import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-administrador',
  templateUrl: './administrador.component.html',
  styleUrls: ['./administrador.component.scss']
})
export class AdministradorComponent implements OnInit {
  usuario: any = {}; // Datos del usuario autenticado
  seccionActual: string = 'dashboard';
  cargando: boolean = true; // Simulación de carga
  notificaciones: number = 3; // Número de notificaciones no leídas

  // 🔹 Gestión de Médicos
  mostrarFormulario: boolean = false; // Controla si se muestra el formulario de registro
  filtroMedico: string = ''; // Búsqueda en tabla de médicos
  filtroEstado: string = ''; // Filtro por estado (Activo/Inactivo)
  medicoSeleccionado: any = null; // Médico que se está editando

  // 🔹 Variables para cambio de contraseña de médicos
  medicoSeleccionadoParaContrasena: any = null;
  nuevaContrasena: string = '';
  confirmarContrasena: string = '';

  // 🔹 Lista de médicos (simulación)
  medicos: any[] = [
    { id: 1, nombre: 'Dr. Juan Pérez', especialidad: 'Cardiología', correo: 'juanperez@hospital.com', cedula: '12345678', telefono: '0999999999', estado: 'Activo', foto: '/assets/img/doctor1.jpg' },
    { id: 2, nombre: 'Dra. María López', especialidad: 'Neurología', correo: 'marialopez@hospital.com', cedula: '87654321', telefono: '0988888888', estado: 'Inactivo', foto: '/assets/img/doctor2.jpg' }
  ];
  medicosFiltrados: any[] = [];

  // 🔹 Nuevo médico (Formulario de Registro)
  nuevoMedico = { nombre: '', especialidad: '', correo: '', cedula: '', telefono: '', contrasena: '', estado: 'Activo', foto: '' };

  constructor(private router: Router) {}

  ngOnInit() {
    this.verificarAutenticacion();
    this.cargarDatos();
    this.filtrarMedicos(); // Inicializar con todos los médicos visibles
  }

  // 🔹 Verifica si el usuario está autenticado como Administrador
  verificarAutenticacion() {
    const usuarioData = localStorage.getItem('usuario');
    if (usuarioData) {
      this.usuario = JSON.parse(usuarioData);
      if (this.usuario.rol !== 'Administrador') {
        console.warn("⚠ Acceso denegado. Redirigiendo al inicio...");
        this.router.navigate(['/inicio']);
      }
    } else {
      console.warn("⚠ No se encontró usuario en localStorage. Redirigiendo al inicio...");
      this.router.navigate(['/inicio']);
    }
  }

  // 🔹 Simula la carga de datos en el dashboard
  cargarDatos() {
    setTimeout(() => {
      this.cargando = false;
    }, 2000); // Simulación de carga de 2 segundos
  }

  mostrarSeccion(seccion: string) {
    this.seccionActual = seccion;
  }
  
  

  // 🔹 Cierra sesión y regresa al inicio
  cerrarSesion() {
    localStorage.removeItem('usuario');
    this.router.navigate(['/inicio']);
  }

  // -------------------------- 🏥 GESTIÓN DE MÉDICOS --------------------------

  // 🔹 Abre el formulario de registro
  abrirFormularioRegistro() {
    this.mostrarFormulario = true;
    this.nuevoMedico = { nombre: '', especialidad: '', correo: '', cedula: '', telefono: '', contrasena: '', estado: 'Activo', foto: '' };
  }

  // 🔹 Cierra el formulario de registro
  cerrarFormularioRegistro() {
    this.mostrarFormulario = false;
  }

  // 🔹 Agrega un nuevo médico a la lista
  registrarMedico() {
    if (this.nuevoMedico.nombre && this.nuevoMedico.especialidad && this.nuevoMedico.correo && this.nuevoMedico.cedula && this.nuevoMedico.telefono && this.nuevoMedico.contrasena) {
      const nuevoId = this.medicos.length + 1;
      const nuevoRegistro = { id: nuevoId, ...this.nuevoMedico };
      this.medicos.push(nuevoRegistro);
      this.filtrarMedicos();
      this.mostrarFormulario = false;
      alert(`✅ Médico ${this.nuevoMedico.nombre} registrado con éxito.`);
    } else {
      alert("⚠ Todos los campos son obligatorios.");
    }
  }

  // 🔹 Filtra médicos por nombre y estado
  filtrarMedicos() {
    this.medicosFiltrados = this.medicos.filter(medico =>
      medico.nombre.toLowerCase().includes(this.filtroMedico.toLowerCase()) &&
      (this.filtroEstado === '' || medico.estado === this.filtroEstado)
    );
  }

  // 🔹 Abre el modal de edición con los datos del médico seleccionado
  editarMedico(medico: any) {
    this.medicoSeleccionado = { ...medico };
  }

  // 🔹 Guarda los cambios realizados en el médico editado
  guardarEdicionMedico() {
    const index = this.medicos.findIndex(m => m.id === this.medicoSeleccionado.id);
    if (index !== -1) {
      this.medicos[index] = { ...this.medicoSeleccionado };
      this.filtrarMedicos();
      this.medicoSeleccionado = null;
      alert(`✅ Información de ${this.medicos[index].nombre} actualizada.`);
    }
  }

  // 🔹 Cierra el modal de edición
  cerrarModalEdicion() {
    this.medicoSeleccionado = null;
  }

  // 🔹 Elimina un médico de la lista
  eliminarMedico(id: number) {
    if (confirm("¿Seguro que quieres eliminar este médico?")) {
      this.medicos = this.medicos.filter(medico => medico.id !== id);
      this.filtrarMedicos();
    }
  }

  // 🔹 Subir imagen y previsualizarla
  subirImagen(event: any) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        this.nuevoMedico.foto = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  }

  // -------------------------- 🔑 CAMBIO DE CONTRASEÑA DE MÉDICOS --------------------------

  // 🔹 Método para abrir el modal de cambio de contraseña
  abrirCambioContrasena(medico: any) {
    this.medicoSeleccionadoParaContrasena = medico;
    this.nuevaContrasena = '';
    this.confirmarContrasena = '';
  }

  // 🔹 Método para guardar el cambio de contraseña
  guardarCambioContrasena() {
    if (!this.nuevaContrasena || !this.confirmarContrasena) {
      alert("⚠ La nueva contraseña y su confirmación son obligatorias.");
      return;
    }

    if (this.nuevaContrasena !== this.confirmarContrasena) {
      alert("⚠ Las contraseñas no coinciden.");
      return;
    }

    // 🔹 Simulación de cambio de contraseña
    const index = this.medicos.findIndex(m => m.id === this.medicoSeleccionadoParaContrasena.id);
    if (index !== -1) {
      this.medicos[index].contrasena = this.nuevaContrasena;
      alert(`✅ Contraseña de ${this.medicos[index].nombre} actualizada.`);
      this.medicoSeleccionadoParaContrasena = null;
    }
  }

  // 🔹 Método para cerrar el modal de cambio de contraseña
  cerrarCambioContrasena() {
    this.medicoSeleccionadoParaContrasena = null;
  }

  // -------------------------- 📅 GESTIÓN DE CITAS --------------------------

mostrarFormularioCita: boolean = false;
filtroCita: string = '';
filtroEstadoCita: string = '';
citaSeleccionada: any = null;

citas: any[] = [
  { id: 1, paciente: 'Carlos Mendoza', medico: 'Dr. Juan Pérez', fecha: '2024-02-15T10:00', estado: 'Pendiente' },
  { id: 2, paciente: 'Ana Torres', medico: 'Dra. María López', fecha: '2024-02-16T14:30', estado: 'Confirmada' }
];
citasFiltradas: any[] = [];

nuevaCita = { paciente: '', medico: '', fecha: '', estado: 'Pendiente' };

// 🔹 Método para abrir el formulario de citas
abrirFormularioCita() {
  this.mostrarFormularioCita = true;
  this.nuevaCita = { paciente: '', medico: '', fecha: '', estado: 'Pendiente' };
}

// 🔹 Método para cerrar el formulario de citas
cerrarFormularioCita() {
  this.mostrarFormularioCita = false;
}

// 🔹 Método para registrar una nueva cita
registrarCita() {
  if (this.nuevaCita.paciente && this.nuevaCita.medico && this.nuevaCita.fecha) {
    const nuevoId = this.citas.length + 1;
    this.citas.push({ id: nuevoId, ...this.nuevaCita });
    this.filtrarCitas();
    this.mostrarFormularioCita = false;
    alert(`✅ Cita programada para ${this.nuevaCita.paciente}.`);
  } else {
    alert("⚠ Todos los campos son obligatorios.");
  }
}

// 🔹 Método para filtrar citas por paciente o estado
filtrarCitas() {
  this.citasFiltradas = this.citas.filter(cita =>
    cita.paciente.toLowerCase().includes(this.filtroCita.toLowerCase()) &&
    (this.filtroEstadoCita === '' || cita.estado === this.filtroEstadoCita)
  );
}

// 🔹 Método para editar una cita
editarCita(cita: any) {
  this.citaSeleccionada = { ...cita };
}

// 🔹 Método para guardar cambios en la edición de una cita
guardarEdicionCita() {
  const index = this.citas.findIndex(c => c.id === this.citaSeleccionada.id);
  if (index !== -1) {
    this.citas[index] = { ...this.citaSeleccionada };
    this.filtrarCitas();
    this.citaSeleccionada = null;
    alert("✅ Cita actualizada correctamente.");
  }
}

// 🔹 Método para cerrar el modal de edición de citas
cerrarModalEdicionCita() {
  this.citaSeleccionada = null;
}

// 🔹 Método para eliminar una cita
eliminarCita(id: number) {
  if (confirm("⚠ ¿Seguro que quieres eliminar esta cita?")) {
    this.citas = this.citas.filter(cita => cita.id !== id);
    this.filtrarCitas();
    alert("✅ Cita eliminada correctamente.");
  }
}

// -------------------------- 📊 GESTIÓN DE REPORTES --------------------------

tipoReporte: string = 'todas';
fechaReporte: string = '';
filtroReporte: string = '';
reporteSeleccionado: any = null;

reportes: any[] = [
  { id: 1, fecha: '2024-02-15', tipo: 'Citas', descripcion: 'Reporte de citas médicas por especialidad.', imagen: '/assets/img/chart-example1.png' },
  { id: 2, fecha: '2024-02-16', tipo: 'Médicos', descripcion: 'Reporte de estado de cuentas médicas.', imagen: '/assets/img/chart-example2.png' },
  { id: 3, fecha: '2024-02-17', tipo: 'Pacientes', descripcion: 'Pacientes atendidos en el último mes.', imagen: '/assets/img/chart-example3.png' }
];

reportesFiltrados: any[] = [];

// 🔹 Método para filtrar reportes por tipo y fecha
filtrarReportes() {
  this.reportesFiltrados = this.reportes.filter(reporte =>
    (this.tipoReporte === 'todas' || reporte.tipo.toLowerCase().includes(this.tipoReporte.toLowerCase())) &&
    (this.fechaReporte === '' || reporte.fecha === this.fechaReporte) &&
    (this.filtroReporte === '' || reporte.descripcion.toLowerCase().includes(this.filtroReporte.toLowerCase()))
  );
}

// 🔹 Método para ver un reporte en detalle (Abre el modal)
verReporte(reporte: any) {
  this.reporteSeleccionado = { ...reporte };
}

// 🔹 Método para cerrar el modal de reportes
cerrarModalReporte() {
  this.reporteSeleccionado = null;
}

// 🔹 Método para simular la descarga de un reporte
descargarReporte(reporte: any) {
  alert(`📥 Descargando ${reporte.tipo} - ${reporte.fecha}`);
}

// -------------------------- ⚙️ GESTIÓN DE CONFIGURACIÓN --------------------------

seccionConfig: string = '';
actualContrasena: string = '';
nuevaContrasena1: string = '';
confirmarContrasena1: string = '';
temaActual: string = 'light';
colorHeader: string = '#7e3b8f'; // Morado oscuro
colorFooter: string = '#60978d'; // Verde oscuro
colorSidebar: string = '#60978d'; // Verde oscuro
notificacionesCorreo: boolean = true;
notificacionesApp: boolean = true;

usuarios: any[] = [
  { id: 1, nombre: 'Administrador', rol: 'Administrador' },
  { id: 2, nombre: 'Dr. Juan Pérez', rol: 'Médico' },
  { id: 3, nombre: 'Ana Torres', rol: 'Recepcionista' }
];

// 🔹 Datos del perfil del administrador
perfilAdmin = { 
  nombre: 'Admin', 
  apellido: 'Principal', 
  correo: 'admin@hospital.com', 
  telefono: '0999999999' 
};

// 🔹 Métodos para cambiar entre secciones de configuración
mostrarSeccionPerfil() {
  this.seccionConfig = 'perfil';
}

mostrarSeccionTema() {
  this.seccionConfig = 'tema';
}

mostrarSeccionNotificaciones() {
  this.seccionConfig = 'notificaciones';
}

mostrarSeccionPermisos() {
  this.seccionConfig = 'permisos';
}

// -------------------------- 🏥 PERFIL Y SEGURIDAD --------------------------

// 🔹 Método para guardar los cambios en el perfil del administrador
guardarPerfilAdmin() {
  if (!this.perfilAdmin.nombre || !this.perfilAdmin.apellido || !this.perfilAdmin.correo || !this.perfilAdmin.telefono) {
    alert("⚠ Todos los campos son obligatorios.");
    return;
  }
  alert(`✅ Perfil actualizado: ${this.perfilAdmin.nombre} ${this.perfilAdmin.apellido}`);
}

// 🔹 Método para cambiar la contraseña del administrador
cambiarContrasena() {
  if (!this.actualContrasena || !this.nuevaContrasena || !this.confirmarContrasena) {
    alert("⚠ Todos los campos son obligatorios.");
    return;
  }

  if (this.nuevaContrasena.length < 6) {
    alert("⚠ La contraseña debe tener al menos 6 caracteres.");
    return;
  }

  if (this.nuevaContrasena !== this.confirmarContrasena) {
    alert("⚠ Las contraseñas no coinciden.");
    return;
  }

  alert("✅ Contraseña cambiada con éxito.");
  this.actualContrasena = '';
  this.nuevaContrasena = '';
  this.confirmarContrasena = '';
}

// -------------------------- 🎨 TEMAS Y APARIENCIA --------------------------

// 🔹 Método para cambiar el tema del sistema
cambiarTema(tema: string) {
  this.temaActual = tema;
  document.body.setAttribute('data-theme', tema);
  localStorage.setItem('tema', tema);
  alert(`🎨 Tema cambiado a ${tema}.`);
}

// 🔹 Método para actualizar colores personalizados del sitio
actualizarColores() {
  document.documentElement.style.setProperty('--header-color', this.colorHeader);
  document.documentElement.style.setProperty('--footer-color', this.colorFooter);
  document.documentElement.style.setProperty('--sidebar-color', this.colorSidebar);
  alert("✅ Colores actualizados con éxito.");
}

// -------------------------- 🔔 NOTIFICACIONES --------------------------

// 🔹 Método para guardar las preferencias de notificación
guardarNotificaciones() {
  alert("✅ Preferencias de notificaciones guardadas.");
}

// -------------------------- 🔑 PERMISOS DE USUARIOS --------------------------

// 🔹 Método para actualizar el rol de un usuario
actualizarPermiso(usuario: any) {
  alert(`✅ Permiso actualizado para ${usuario.nombre}: ${usuario.rol}`);
}

}