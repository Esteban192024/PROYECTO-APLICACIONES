const express = require('express');
const Doctor = require('../models/Doctor');
const bcrypt = require('bcrypt'); // Para encriptar contraseñas
const nodemailer = require('nodemailer'); // Para enviar correos electrónicos

const router = express.Router();

// Ruta para crear cuenta
router.post('/crear-cuenta', async (req, res) => {
  try {
    const { nombre, cedula, email, telefono, direccion, especialidad, password } = req.body;

    // Validar campos obligatorios
    if (!nombre || !cedula || !email || !telefono || !direccion || !especialidad || !password) {
      return res.status(400).json({ mensaje: 'Todos los campos son obligatorios.' });
    }

    // Validar formato del correo
    const emailRegex = /^\S+@\S+\.\S+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ mensaje: 'Correo electrónico inválido.' });
    }

    // Verificar si ya existe un doctor con la misma cédula o correo
    const existeDoctor = await Doctor.findOne({ $or: [{ cedula }, { email }] });
    if (existeDoctor) {
      return res.status(400).json({ mensaje: 'La cédula o correo ya están registrados.' });
    }

    // Encriptar contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    // Crear un nuevo doctor
    const nuevoDoctor = new Doctor({
      nombre,
      cedula,
      email,
      telefono,
      direccion,
      especialidad,
      password: hashedPassword,
    });

    await nuevoDoctor.save();
    res.status(201).json({ mensaje: 'Cuenta creada exitosamente.' });
  } catch (error) {
    console.error('Error al crear cuenta:', error);
    res.status(500).json({ mensaje: 'Error interno del servidor.' });
  }
});

// Endpoint para iniciar sesión
router.post('/iniciar-sesion', async (req, res) => {
  try {
    const { cedula, password } = req.body;

    // Validar que ambos campos estén presentes
    if (!cedula || !password) {
      return res.status(400).json({ mensaje: 'Cédula y contraseña son obligatorias.' });
    }

    // Buscar al doctor por cédula
    const doctor = await Doctor.findOne({ cedula });
    if (!doctor) {
      return res.status(404).json({ mensaje: 'No se encontró un usuario con esa cédula.' });
    }

    // Verificar la contraseña
    const esPasswordCorrecta = await bcrypt.compare(password, doctor.password);
    if (!esPasswordCorrecta) {
      return res.status(401).json({ mensaje: 'Contraseña incorrecta.' });
    }

    // Respuesta exitosa
    res.status(200).json({ mensaje: 'Inicio de sesión exitoso.', doctor });
  } catch (error) {
    console.error('Error al iniciar sesión:', error);
    res.status(500).json({ mensaje: 'Error interno del servidor.' });
  }
});

// Endpoint para obtener el perfil del doctor por cédula
router.get('/perfil/:cedula', async (req, res) => {
  try {
    const { cedula } = req.params;

    // Buscar al doctor por cédula
    const doctor = await Doctor.findOne({ cedula });

    if (!doctor) {
      return res.status(404).json({ mensaje: 'Doctor no encontrado' });
    }

    res.status(200).json(doctor); // Enviar la información del doctor
  } catch (error) {
    console.error('Error al obtener el perfil:', error);
    res.status(500).json({ mensaje: 'Error interno del servidor.' });
  }
});

// Endpoint para actualizar el perfil del doctor
router.put('/perfil/:cedula', async (req, res) => {
  try {
    const { cedula } = req.params;
    const datosActualizados = req.body;

    // Buscar al doctor por cédula y actualizar los datos
    const doctorActualizado = await Doctor.findOneAndUpdate(
      { cedula },
      datosActualizados,
      { new: true }
    );

    if (!doctorActualizado) {
      return res.status(404).json({ mensaje: 'Doctor no encontrado.' });
    }

    res.status(200).json({
      mensaje: 'Perfil actualizado correctamente.',
      doctor: doctorActualizado,
    });
  } catch (error) {
    console.error('Error al actualizar el perfil:', error);
    res.status(500).json({ mensaje: 'Error interno del servidor.' });
  }
});

// Endpoint para cambiar contraseña
router.put('/perfil/:cedula/cambiar-password', async (req, res) => {
  try {
    const { cedula } = req.params;
    const { passwordActual, passwordNueva } = req.body;

    if (!passwordActual || !passwordNueva) {
      return res.status(400).json({ mensaje: 'Ambas contraseñas son obligatorias.' });
    }

    // Buscar al doctor por cédula
    const doctor = await Doctor.findOne({ cedula });
    if (!doctor) {
      return res.status(404).json({ mensaje: 'Doctor no encontrado.' });
    }

    // Verificar la contraseña actual
    const esPasswordCorrecta = await bcrypt.compare(passwordActual, doctor.password);
    if (!esPasswordCorrecta) {
      return res.status(401).json({ mensaje: 'La contraseña actual es incorrecta.' });
    }

    // Encriptar la nueva contraseña
    const hashedPassword = await bcrypt.hash(passwordNueva, 10);

    // Actualizar la contraseña en la base de datos
    doctor.password = hashedPassword;
    await doctor.save();

    res.status(200).json({ mensaje: 'Contraseña actualizada exitosamente.' });
  } catch (error) {
    console.error('Error al cambiar la contraseña:', error);
    res.status(500).json({ mensaje: 'Error interno del servidor.' });
  }
});

// Ruta para recuperación de contraseña
router.post('/recuperar-contrasena', async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ mensaje: 'El correo es obligatorio.' });
    }

    // Verificar si el usuario existe
    const doctor = await Doctor.findOne({ email });
    if (!doctor) {
      return res.status(404).json({ mensaje: 'No se encontró un usuario con ese correo.' });
    }

    // Generar una nueva contraseña temporal
    const nuevaPassword = Math.random().toString(36).slice(-8);
    const hashedPassword = await bcrypt.hash(nuevaPassword, 10);

    // Actualizar la contraseña del doctor en la base de datos
    doctor.password = hashedPassword;
    await doctor.save();

    // Configuración del transporte de correo
    const transporter = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
        user: 'mateoheredia2004@gmail.com',
        pass: 'mbzt ijag akmv nbpi',
      },
    });

    // Configuración del correo
    const mailOptions = {
      from: 'tu-correo@gmail.com',
      to: email,
      subject: 'Recuperación de contraseña - Fénix Medical',
      text: `Hola, ${doctor.nombre}.\n\nTu nueva contraseña temporal es: ${nuevaPassword}\n\nPor favor, inicia sesión y cambia tu contraseña lo antes posible.\n\nSaludos,\nEquipo Fénix Medical`,
    };

    // Enviar el correo
    await transporter.sendMail(mailOptions);

    res.json({ mensaje: 'Correo de recuperación enviado exitosamente.' });
  } catch (error) {
    console.error('Error al recuperar contraseña:', error);
    res.status(500).json({ mensaje: 'Error interno del servidor.' });
  }
});

module.exports = router;
