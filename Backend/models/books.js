import mongoose from "mongoose";
import Books from "../schemas/books.js";

class booksModel {
    async create(book) {
        try {
            return await Books.create(book);
        } catch (error) {
            throw new Error("Error al crear el libro: " + error.message);
        }
    }

    async update(id, book) {
        try {
            return await Books.findByIdAndUpdate(id, book, { new: true });
        } catch (error) {
            throw new Error("Error al actualizar el libro: " + error.message);
        }
    }

    async delete(id) {
        try {
            return await Books.findByIdAndDelete(id);
        } catch (error) {
            throw new Error("Error al eliminar el libro: " + error.message);
        }
    }

    async getAll() {
        try {
            return await Books.find();
        } catch (error) {
            throw new Error("Error al obtener los libros: " + error.message);
        }
    }

    async getOne(id) {
        try {
            return await Books.findById(id);
        } catch (error) {
            throw new Error("Error al obtener el libro: " + error.message);
        }
    }
}

export default new booksModel();
