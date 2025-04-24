import Loan from "../schemas/loans.js";
import mongoose from "mongoose";

class LoanModel {
    // Crear un préstamo asegurando que el usuario no tenga préstamos vencidos
    async create(loanData) {
        try {
            const userLoans = await Loan.find({ user: loanData.user, status: "activo" });
            if (userLoans.length >= 3) throw new Error("El usuario ya tiene el máximo de préstamos permitidos.");

            const newLoan = await Loan.create(loanData);
            return newLoan;
        } catch (error) {
            throw new Error("Error al registrar préstamo: " + error.message);
        }
    }

    // Actualizar préstamo
    async update(id, loanData) {
        try {
            if (!mongoose.Types.ObjectId.isValid(id)) throw new Error("ID de préstamo inválido");
            const updatedLoan = await Loan.findByIdAndUpdate(id, loanData, { new: true }).populate("user").populate("book");
            if (!updatedLoan) throw new Error("Préstamo no encontrado");
            return updatedLoan;
        } catch (error) {
            throw new Error("Error al actualizar préstamo: " + error.message);
        }
    }

    // Eliminar préstamo
    async delete(id) {
        try {
            if (!mongoose.Types.ObjectId.isValid(id)) throw new Error("ID de préstamo inválido");
            const deletedLoan = await Loan.findByIdAndDelete(id);
            if (!deletedLoan) throw new Error("Préstamo no encontrado");
            return { message: "Préstamo eliminado correctamente" };
        } catch (error) {
            throw new Error("Error al eliminar préstamo: " + error.message);
        }
    }

    // Obtener todos los préstamos
    async getAll() {
        try {
            return await Loan.find().populate("user").populate("book");
        } catch (error) {
            throw new Error("Error al obtener los préstamos: " + error.message);
        }
    }

    // Obtener un préstamo por ID
    async getOne(id) {
        try {
            if (!mongoose.Types.ObjectId.isValid(id)) throw new Error("ID de préstamo inválido");
            const loan = await Loan.findById(id).populate("user").populate("book");
            if (!loan) throw new Error("Préstamo no encontrado");
            return loan;
        } catch (error) {
            throw new Error("Error al obtener el préstamo: " + error.message);
        }
    }

    async getByUser(userId) {
        try {
          return await Loan.find({ user: userId }).populate("book");
        } catch (error) {
          throw new Error("Error al obtener préstamos del usuario: " + error.message);
        }
    }
      
}

export default new LoanModel();
