import mongoose from "mongoose";

const bookSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    autor: {
        type: String,
        required: true,
    },
    genre: {
        type: String,
        required: true,
    },
    publication_year: {
        type: Number,
        required: true,
    },
    isbn: {
        type: String,
        required: true,
    },
    disponibility: {
        type: Boolean,
        required: true,
    },
    calcification: {
        type: Number,
    },
    totalCopies: { // Renombramos 'quantity' a 'totalCopies'
        type: Number,
        default: 1,
    },
    availableCopies: { // Nuevo campo para la cantidad disponible
        type: Number,
        default: 1,
    },
    portada: {
        type: String,
        default: "",
    }
}, { timestamps: true }
);

export default mongoose.model('Book', bookSchema);