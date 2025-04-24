import express from 'express';
import booksController, { bookValidations } from '../controllers/booksController.js';
import { param } from 'express-validator';

const route = express.Router();

// Rutas con validaciones
route.post('/', bookValidations, booksController.create);
route.get('/:id', param("id").isMongoId().withMessage("ID inválido"), booksController.getOne);
route.get('/', booksController.getAll);
route.put('/:id', bookValidations, booksController.update);
route.delete('/:id', param("id").isMongoId().withMessage("ID inválido"), booksController.delete);

// Exportar las rutas
export default route;


