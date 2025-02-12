const mongoose = require('mongoose');

const doctorSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  cedula: { type: String, unique: true, required: true },
  email: { type: String, unique: true, required: true },
  telefono: { type: String, required: true },
  direccion: { type: String, required: true },
  especialidad: { type: String, required: true },
  password: { type: String, required: true },
});

module.exports = mongoose.model('Doctor', doctorSchema);
