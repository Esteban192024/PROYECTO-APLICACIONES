const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const doctorRoutes = require('./routes/doctorRoutes'); // Importa las rutas de los doctores
require('dotenv').config(); // Carga las variables de entorno desde .env

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware para registrar solicitudes entrantes
app.use((req, res, next) => {
  console.log(`Nueva solicitud: ${req.method} ${req.url}`);
  console.log('Cuerpo:', req.body);
  res.on('finish', () => {
    console.log(`Estado de respuesta: ${res.statusCode}`);
  });
  next();
});

// Configuración de CORS
const corsOptions = {
  origin: ['http://localhost:4200', 'http://localhost:4201'], // Dominios permitidos
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true, // Habilitar credenciales si es necesario
};
app.use(cors(corsOptions)); // Habilita CORS con opciones detalladas

// Middleware para analizar JSON
app.use(express.json()); // Habilita el análisis de JSON en el cuerpo de las solicitudes

// Conexión a MongoDB
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('Conexión a MongoDB exitosa'))
  .catch((error) => console.error('Error al conectar a MongoDB:', error));

// Rutas
app.use('/api/doctores', doctorRoutes); // Rutas para las solicitudes de doctores

// Ruta para el endpoint raíz
app.get('/', (req, res) => {
  res.send('Bienvenido a la API de Fénix Medical');
});

// Inicio del servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
