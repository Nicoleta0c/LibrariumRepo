// Importar dependencias
import 'dotenv/config';
import express from 'express';
import dbClient from './config/dbClient.js';
import cors from 'cors'; 

// Importar las rutas
import routeUsers from './routes/users.js';
import routeBooks from './routes/books.js';
import loanRoutes from "./routes/loanRoutes.js";
import reservRoutes from "./routes/reservRoutes.js"
import bodyParser from 'body-parser';

// Crear instancia de express
const app = express();

// Configurar CORS
app.use(cors({
  origin: 'http://localhost:5173', // Permite solicitudes desde tu frontend
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // Métodos HTTP permitidos
  allowedHeaders: ['Content-Type', 'Authorization'], // Encabezados permitidos
}));

// Middlewares para interpretar JSON
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Usar las rutas
app.use('/books', routeBooks);
app.use('/users', routeUsers);
app.use('/loans', loanRoutes);
app.use("/reservations", reservRoutes)

console.log("Rutas cargadas:");
console.log(app._router.stack.map(r => r.route?.path).filter(Boolean));

//try-catch para conexión
try {
    const PORT = process.env.PORT || 3000; 
    app.listen(PORT, () => console.log('Servidor activo en el puerto: ' + PORT));
} catch (e) {
    console.log(e);
}

// Cerrar conexión a la base de datos al apagar el servidor
process.on('SIGINT', async () => {
    dbClient.closeConexion();
    process.exit(0);
});

