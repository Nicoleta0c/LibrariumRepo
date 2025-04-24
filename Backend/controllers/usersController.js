import bcrypt from "bcryptjs";
import userModel from "../models/users.js";

const controller = {
  // Registrar usuario
  async register(req, res) {
    try {
      const { email, password, name, admin_user = false, profilePicture } = req.body;

      const usuarioExiste = await userModel.getOneByEmail(email);
      if (usuarioExiste) {
        return res.status(400).json({ error: "El usuario ya está registrado" });
      }

      const salt = await bcrypt.genSalt(10);
      const hash = await bcrypt.hash(password, salt);

      const nuevoUsuario = await userModel.create({
        email,
        password: hash,
        name,
        admin_user,
        profilePicture
      });

      res.status(201).json({
        msg: "Usuario registrado exitosamente",
        user: {
          id: nuevoUsuario._id,
          name: nuevoUsuario.name,
          email: nuevoUsuario.email,
          admin_user: nuevoUsuario.admin_user,
          profilePicture: nuevoUsuario.profilePicture || ""
        }
      });
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  },

  // Login de usuario (sin token)
  async login(req, res) {
    try {
      const { email, password } = req.body;

      const usuarioExiste = await userModel.getOneByEmail(email);
      if (!usuarioExiste) {
        return res.status(400).json({ error: "El usuario no existe" });
      }

      const claveValida = await bcrypt.compare(password, usuarioExiste.password);
      if (!claveValida) {
        return res.status(400).json({ error: "Contraseña no válida" });
      }

      res.status(200).json({
        msg: "Usuario autenticado",
        user: {
          id: usuarioExiste._id,
          name: usuarioExiste.name,
          email: usuarioExiste.email,
          admin_user: usuarioExiste.admin_user,
          profilePicture: usuarioExiste.profilePicture || ""
        }
      });
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  },

  // Obtener todos los usuarios (uso admin)
  async getAllUsers(req, res) {
    try {
      const usuarios = await userModel.getAll();
      res.status(200).json(usuarios);
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  },

  // Obtener usuario por ID
  async getUserById(req, res) {
    try {
      const { id } = req.params;
      const user = await userModel.getOne(id);
      if (!user) return res.status(404).json({ error: "Usuario no encontrado" });
      res.status(200).json(user);
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  },

  // Actualizar un usuario (por el mismo o admin)
  async updateUser(req, res) {
    try {
      const { id } = req.params;
      const { name, email, password, admin_user, profilePicture } = req.body;

      const user = await userModel.getOne(id);
      if (!user) return res.status(404).json({ error: "Usuario no encontrado" });

      const updatedData = {
        name: name || user.name,
        email: email || user.email,
        admin_user: admin_user !== undefined ? admin_user : user.admin_user,
        profilePicture: profilePicture !== undefined ? profilePicture : user.profilePicture
      };

      if (password && password.trim() !== "") {
        const salt = await bcrypt.genSalt(10);
        updatedData.password = await bcrypt.hash(password, salt);
      }

      const updatedUser = await userModel.update(id, updatedData);

      const userObject = updatedUser.toObject();
      userObject.id = userObject._id;
      delete userObject._id;

      res.status(200).json({ msg: "Usuario actualizado", user: userObject });
    } catch (e) {
      console.error("Error al actualizar usuario:", e);
      res.status(500).json({ error: e.message });
    }
  },

  // Eliminar un usuario
  async deleteUser(req, res) {
    try {
      const { id } = req.params;
      const user = await userModel.getOne(id);
      if (!user) return res.status(404).json({ error: "Usuario no encontrado" });

      await userModel.delete(id);
      res.status(200).json({ msg: "Usuario eliminado correctamente" });
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  }
};

export default controller;
