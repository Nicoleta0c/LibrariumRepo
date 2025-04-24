import Reservation from "../schemas/reservations.js";
import Book from "../schemas/books.js";
import User from "../schemas/users.js";
import { sendNotificationEmail } from '../utils/emailService.js';


// Notificar a los usuarios que el libro reservado está disponible.

export const notifyAvailableBooks = async (req, res) => {
  try {
    const { bookId } = req.body;

    // Verificar si el libro está disponible
    const book = await Book.findById(bookId);
    if (!book || !book.disponibility) {
      return res.status(400).json({ message: "El libro no está disponible o no existe" });
    }

    // Buscar reservas pendientes
    const reservasPendientes = await Reservation.find({
      book: bookId,
      status: "pendiente"
    }).populate("user");

    if (reservasPendientes.length === 0) {
      return res.status(200).json({ message: "No hay reservas pendientes para este libro" });
    }

    // Enviar notificación real a cada usuario
    for (const res of reservasPendientes) {
      if (res.user?.email && res.user?.name) {
        try {
          // Enviar correo personalizado
          await sendNotificationEmail({
            to: res.user.email,
            userName: res.user.name,
            bookName: book.name,
            type: 'reservation'
          });

          // También mantener el log por consola
          console.log(`📬 Notificación enviada a ${res.user.email}: El libro "${book.name}" ya está disponible.`);
        } catch (error) {
          console.error(`❌ Error al enviar correo a ${res.user.email}:`, error.message);
        }
      }
    }

    // (Opcional) Marcar reservas como notificadas
    await Reservation.updateMany(
      { book: bookId, status: "pendiente" },
      { $set: { status: "notificado" } }
    );

    res.status(200).json({ message: "Usuarios notificados exitosamente" });
  } catch (error) {
    console.error("Error en notifyAvailableBooks:", error);
    res.status(500).json({ message: "Error al notificar usuarios" });
  }
};

/**
 * Crear una nueva reserva
 */
export const createReservation = async (req, res) => {
  try {
    const { userId, bookId } = req.body;

    // Verificar si ya existe una reserva para ese libro y usuario
    const existing = await Reservation.findOne({ user: userId, book: bookId, status: "pendiente" });

    if (existing) {
      return res.status(400).json({ message: "Ya tienes una reserva pendiente para este libro" });
    }

    const reservation = new Reservation({ user: userId, book: bookId });
    await reservation.save();

    res.status(201).json({ message: "Reserva creada con éxito", reservation });
  } catch (error) {
    console.error("Error al crear reserva:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
};

/**
 * Obtener todas las reservas de un usuario
 */
export const getReservationsByUser = async (req, res) => {
  try {
    const { userId } = req.params;

    const reservations = await Reservation.find({ user: userId }).populate("book");

    const formatted = reservations.map((res) => ({
      _id: res._id,
      bookId: res.book?._id,
      bookTitle: res.book?.name || "Título no disponible",
      disponibility: res.book?.disponibility ?? false,
      status: res.status,
    }));
    
    res.status(200).json(formatted);
  } catch (error) {
    console.error("Error al obtener reservas:", error);
    res.status(500).json({ message: "Error al obtener reservas" });
  }
};

/**
 * Eliminar una reserva por ID
 */
export const deleteReservation = async (req, res) => {
  try {
    const { id } = req.params;

    // Buscar la reserva por su ID y eliminarla
    const deletedReservation = await Reservation.findByIdAndDelete(id);

    if (!deletedReservation) {
      return res.status(404).json({ message: "Reserva no encontrada" });
    }

    res.status(200).json({ message: "Reserva eliminada con éxito" });
  } catch (error) {
    console.error("Error al eliminar reserva:", error);
    res.status(500).json({ message: "Error al eliminar la reserva" });
  }
};
