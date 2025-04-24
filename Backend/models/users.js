import mongoose from "mongoose";
import User from "../schemas/users.js";
import bcrypt from "bcrypt";

class UsersModel {
    // Crear un nuevo usuario con validación
    async create(userData) {
        try {
            // Verificar si el usuario ya existe
            const userExists = await User.findOne({ email: userData.email });
            if (userExists) throw new Error("El usuario ya está registrado");

            const newUser = await User.create(userData);
            return newUser;
        } catch (error) {
            throw new Error("Error al registrar el usuario: " + error.message);
        }
    }

    // Actualizar usuario
    async update(id, userData) {
        try {
            if (!mongoose.Types.ObjectId.isValid(id)) throw new Error("ID de usuario inválido");
            const updatedUser = await User.findByIdAndUpdate(id, userData, { new: true });
            if (!updatedUser) throw new Error("Usuario no encontrado");
            return updatedUser;
        } catch (error) {
            throw new Error("Error al actualizar usuario: " + error.message);
        }
    }

    // Eliminar usuario
    async delete(id) {
        try {
            if (!mongoose.Types.ObjectId.isValid(id)) throw new Error("ID de usuario inválido");
            const deletedUser = await User.findByIdAndDelete(id);
            if (!deletedUser) throw new Error("Usuario no encontrado");
            return { message: "Usuario eliminado correctamente" };
        } catch (error) {
            throw new Error("Error al eliminar usuario: " + error.message);
        }
    }

    // Obtener todos los usuarios con paginación
    async getAll(page = 1, limit = 50) {
        try {
            const users = await User.find()
                .limit(limit)
                .skip((page - 1) * limit);
            return users;
        } catch (error) {
            throw new Error("Error al obtener usuarios: " + error.message);
        }
    }

    // Obtener un usuario por ID
    async getOne(id) {
        try {
            if (!mongoose.Types.ObjectId.isValid(id)) throw new Error("ID de usuario inválido");
            const user = await User.findById(id);
            if (!user) throw new Error("Usuario no encontrado");
            return user;
        } catch (error) {
            throw new Error("Error al obtener usuario: " + error.message);
        }
    }


    async getOneByEmail(email) {
        try {
            return await User.findOne({ email });
        } catch (error) {
            throw new Error("Error al obtener usuario por email: " + error.message);
        }
    }

    async getOneById(id) {
        return await User.findById(id);
    }
    
}

export default new UsersModel();

