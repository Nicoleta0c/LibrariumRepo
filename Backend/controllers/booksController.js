import booksModel from '../models/books.js';
import { validationResult, body, param } from 'express-validator';

const bookValidations = [
    body("name").notEmpty().withMessage("El nombre es obligatorio"),
    body("autor").notEmpty().withMessage("El autor es obligatorio"),
    body("genre").notEmpty().withMessage("El género es obligatorio"),
    body("publication_year").isInt().withMessage("El año de publicación debe ser un número"),
    body("isbn").notEmpty().withMessage("El ISBN es obligatorio"),
    // body("disponibility").isBoolean().withMessage("Disponibilidad debe ser un booleano"), // Ya no es el principal indicador
    body("totalCopies").isInt({ min: 1 }).withMessage("La cantidad total debe ser un número entero mayor que 0")
];

class booksController {
    constructor() { }

    // Método para crear un libro
    async create(req, res) {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        try {
            const { totalCopies = 1, ...restOfBookData } = req.body;
            const newBookData = { ...restOfBookData, totalCopies, availableCopies: totalCopies };
            const data = await booksModel.create(newBookData);
            res.status(201).json({ message: "Libro agregado con éxito", data });
        } catch (e) {
            res.status(500).json({ error: "Error al agregar libro", details: e.message });
        }
    }

    // Método para actualizar un libro
    async update(req, res) {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        try {
            const { id } = req.params;
            console.log("req.body en update:", req.body); // Agrega esta línea
            const { totalCopies, ...updateData } = req.body;
            const bookDataToUpdate = { ...updateData };
            if (totalCopies !== undefined) {
                bookDataToUpdate.totalCopies = totalCopies;
                // Considerar si también quieres actualizar availableCopies aquí,
                // o dejar que se gestione solo por préstamos/devoluciones.
                // Si permites edición manual de totalCopies, podrías resetear availableCopies.
                // Por ahora, solo actualizamos totalCopies.
            }
            const book = await booksModel.update(id, bookDataToUpdate);
            if (!book) return res.status(404).json({ message: "Libro no encontrado" });
            res.status(200).json({ message: "Libro actualizado con éxito", book });
        } catch (e) {
            res.status(500).json({ error: "Error al actualizar libro", details: e.message });
        }
    }

    // Método para eliminar un libro
    async delete(req, res) {
        try {
            const { id } = req.params;
            const book = await booksModel.delete(id);
            if (!book) return res.status(404).json({ message: "Libro no encontrado" });
            res.status(200).json({ message: "Libro eliminado correctamente" });
        } catch (e) {
            res.status(500).json({ error: "Error al eliminar libro", details: e.message });
        }
    }

    // Método para obtener todos los libros
    async getAll(req, res) {
        try {
            const books = await booksModel.getAll();
            res.status(200).json(books);
        } catch (e) {
            res.status(500).json({ error: "Error al obtener los libros", details: e.message });
        }
    }

    // Método para obtener un libro por ID
    async getOne(req, res) {
        try {
            const { id } = req.params;
            const book = await booksModel.getOne(id);
            if (!book) return res.status(404).json({ message: "Libro no encontrado" });
            res.status(200).json(book);
        } catch (e) {
            res.status(500).json({ error: "Error al obtener el libro", details: e.message });
        }
    }
}

// Exportar la instancia de la clase
export { bookValidations };
export default new booksController();