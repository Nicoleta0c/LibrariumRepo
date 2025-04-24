import { Router } from "express";
import usersController from "../controllers/usersController.js";

const route = Router();

// Registro y login
route.post('/register', usersController.register);
route.post('/login', usersController.login);

// Administración de usuarios
route.get('/', usersController.getAllUsers);           // Ver todos
route.get('/:id', usersController.getUserById);        // Ver uno por ID
route.put('/:id', usersController.updateUser);         // Actualizar por ID
route.delete('/:id', usersController.deleteUser);      // Eliminar por ID

export default route;
