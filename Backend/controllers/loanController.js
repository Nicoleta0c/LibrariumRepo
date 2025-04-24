import Loan from "../schemas/loans.js";
import Books from "../models/books.js";
import UsersModel from "../models/users.js";
import loanModel from "../models/loans.js";
import Reservation from "../schemas/reservations.js";
import { Resend } from 'resend';
/**
 * Registrar un nuevo préstamo de libro
 */
/**
 * Registrar una solicitud de préstamo de libro
 */
export const requestLoan = async (req, res) => {
  try {
      console.log("Solicitud de préstamo recibida:", req.body);

      const userId = req.user?.id || req.body.userId;
      if (!userId) {
          return res.status(401).json({ message: "Acceso denegado, inicia sesión" });
      }

      const { bookId } = req.body;
      if (!bookId) {
          return res.status(400).json({ message: "Falta el ID del libro en la solicitud" });
      }

      // Verificar si el usuario existe
      const user = await UsersModel.getOne(userId);
      if (!user) {
          return res.status(404).json({ message: "Usuario no encontrado" });
      }

      // Verificar si el libro existe y tiene copias disponibles
      const book = await Books.getOne(bookId);
      if (!book) {
          return res.status(404).json({ message: "Libro no encontrado" });
      }
      if (book.availableCopies <= 0) {
          return res.status(400).json({ message: "No hay copias disponibles de este libro para préstamo" });
      }

      // Verificar si ya existe una solicitud pendiente para este libro por este usuario
      const existingPendingRequest = await Loan.findOne({ user: userId, book: bookId, status: "solicitado" });
      if (existingPendingRequest) {
          return res.status(400).json({ message: "Ya has solicitado este libro. Espera la respuesta del administrador." });
      }

      // Verificar préstamos activos y vencidos del usuario (esta lógica podría mantenerse o modificarse según tus requisitos)
      const activeLoans = await Loan.find({ user: userId, status: "activo" });
      const hasOverdue = activeLoans.some(loan => new Date(loan.dueDate) < new Date());
      if (hasOverdue) {
          return res.status(400).json({ message: "Tienes préstamos vencidos. Devuélvelos antes de solicitar uno nuevo." });
      }

      const loan = await Loan.create({
          user: userId,
          book: bookId,
          loanDate: new Date(),
          status: "solicitado" // Cambiamos el estado inicial a "solicitado"
      });

      res.status(201).json({ message: "Solicitud de préstamo enviada con éxito. El administrador la revisará.", loan });
  } catch (error) {
      console.error("Error en requestLoan:", error);
      res.status(500).json({ message: "Error al registrar la solicitud de préstamo", error: error.message });
  }
};

/**
 * Obtener todas las solicitudes de préstamo pendientes
 */
/**
 * Obtener todas las solicitudes de préstamo pendientes
 */
export const getPendingLoans = async (req, res) => {
  console.log("Entrando a getPendingLoans"); // Este log se mostrará cuando se ejecute la función
  try {
    console.log("Buscando préstamos con status: solicitado"); // Este log se mostrará antes de la consulta a la base de datos
    const pendingLoans = await Loan.find({ status: "solicitado" })
      .populate('user', 'name email')
      .populate('book', 'name');
    console.log("Préstamos pendientes encontrados:", pendingLoans); // Este log mostrará los resultados de la consulta
    res.status(200).json(pendingLoans);
  } catch (error) {
    console.error("Error al obtener las solicitudes de préstamo pendientes:", error);
    res.status(500).json({ message: "Error al obtener las solicitudes de préstamo", error: error.message });
  }
};

/**
 * Aprobar una solicitud de préstamo
 */
const resend = new Resend(process.env.RESEND_API_KEY);

export const approveLoan = async (req, res) => {
  const { loanId } = req.params;

  try {
    const loan = await Loan.findById(loanId).populate("user").populate("book");
    if (!loan || loan.status !== "solicitado") {
      return res.status(404).json({ message: "Solicitud de préstamo no encontrada o ya procesada." });
    }

    const book = await Books.getOne(loan.book._id || loan.book);
    if (!book || book.availableCopies <= 0) {
      return res.status(400).json({ message: "No hay copias disponibles de este libro." });
    }

    // Aprobar préstamo
    loan.status = "activo";
    loan.dueDate = new Date();
    loan.dueDate.setDate(loan.dueDate.getDate() + 60);
    await loan.save();

    // Actualizar copias disponibles
    await Books.update(loan.book._id || loan.book, { $inc: { availableCopies: -1 } });

    // Eliminar reservas activas del mismo libro por el mismo usuario
    await Reservation.deleteMany({
      userId: loan.user._id || loan.user,
      bookId: loan.book._id || loan.book,
      status: "activa"
    });

    // Enviar notificación por correo
    try {
      await resend.emails.send({
        from: 'Biblioteca <notificaciones@nicollerosa.com>',
        to: loan.user.email,
        subject: 'Tu préstamo ha sido aprobado',
        html: `
          <h2>Hola ${loan.user.name}!</h2>
          <p>El libro <strong>${loan.book.name}</strong> ya ha sido prestado a tu nombre.</p>
          <p>Gracias por usar nuestra biblioteca virtual.</p>
        `
      });
    } catch (error) {
      console.error("Error al enviar correo con Resend:", error.message);
    }

    res.status(200).json({ message: "Préstamo aprobado y registrado." });
  } catch (error) {
    console.error("Error al aprobar el préstamo:", error);
    res.status(500).json({ message: "Error al aprobar el préstamo", error: error.message });
  }
};


/**
 * Rechazar una solicitud de préstamo
 */
export const rejectLoan = async (req, res) => {
  const { loanId } = req.params;
  try {
      const loan = await Loan.findById(loanId);
      if (!loan || loan.status !== "solicitado") {
          return res.status(404).json({ message: "Solicitud de préstamo no encontrada o ya procesada." });
      }

      await Loan.findByIdAndDelete(loanId); // Eliminamos la solicitud de préstamo

      res.status(200).json({ message: "Solicitud de préstamo rechazada y eliminada." });
  } catch (error) {
      console.error("Error al rechazar el préstamo:", error);
      res.status(500).json({ message: "Error al rechazar el préstamo", error: error.message });
  }
};


/**
 * Registrar devolución de un libro
 */
export const returnBook = async (req, res) => {
    try {
        const { loanId } = req.body;
        console.log(" Devolución recibida con loanId:", loanId);

        if (!loanId) {
            return res.status(400).json({ message: "Falta el ID del préstamo" });
        }

        const loan = await Loan.findById(loanId);
        console.log("Resultado de búsqueda:", loan);
        if (!loan || loan.status !== "activo") {
            return res.status(404).json({ message: "Préstamo no encontrado o ya devuelto." });
        }

        loan.status = "devuelto";
        loan.returnDate = new Date();

        if (!loan.dueDate) {
            const fallbackDueDate = new Date(loan.loanDate || new Date());
            fallbackDueDate.setDate(fallbackDueDate.getDate() + 60);
            loan.dueDate = fallbackDueDate;
        }

        await loan.save();

        // Incrementar la cantidad de copias disponibles
        await Books.update(loan.book, { $inc: { availableCopies: 1 } });
        await Reservation.deleteOne({ user: loan.user, book: loan.book }); // Usar los IDs del préstamo

        res.status(200).json({ message: "Libro devuelto exitosamente." });
    } catch (error) {
        console.error("Error en returnBook:", error);
        res.status(500).json({ message: "Error al devolver el libro", error: error.message });
    }
};

// ... (el resto de las funciones: checkExpiredLoans, getLoansByUser, getLoanById) ...

/**
 * Verificar préstamos vencidos
 */
export const checkExpiredLoans = async (req, res) => {
  try {
    const expiredLoans = await Loan.find({ status: "activo", dueDate: { $lt: new Date() } });

    if (!expiredLoans.length) {
      return res.status(200).json({ message: "No hay préstamos vencidos." });
    }

    for (const loan of expiredLoans) {
      loan.status = "vencido";
      await loan.save();
    }

    res.status(200).json({
      message: `${expiredLoans.length} préstamos vencidos detectados y actualizados.`,
      expiredLoans
    });
  } catch (error) {
    console.error("Error en checkExpiredLoans:", error);
    res.status(500).json({ message: "Error al verificar préstamos vencidos", error: error.message });
  }
};

export const getLoansByUser = async (req, res) => {
  const { userId } = req.params;

  if (!userId || userId === "undefined") {
    return res.status(400).json({ message: "ID de usuario inválido" });
  }

  try {
    const loans = await loanModel.getByUser(userId);
    res.status(200).json(loans);
  } catch (error) {
    console.error("Error al obtener préstamos del usuario:", error);
    res.status(500).json({ message: error.message });
  }
};

export const getLoanById = async (req, res) => {
  try {
    const { loanId } = req.params;
    const loan = await Loan.findById(loanId).populate("book").populate("user");

    if (!loan) {
      return res.status(404).json({ message: "Préstamo no encontrado" });
    }

    res.status(200).json(loan);
  } catch (error) {
    console.error("Error al obtener préstamo por ID:", error);
    res.status(500).json({ message: "Error interno", error: error.message });
  }
};

/**
 * Obtener todos los préstamos
 */
export const getAllLoans = async (req, res) => {
  try {
      const loans = await Loan.find().populate('user', 'name email').populate('book', 'name');
      res.status(200).json(loans);
  } catch (error) {
      console.error("Error al obtener todos los préstamos:", error);
      res.status(500).json({ message: "Error al obtener la lista de préstamos", error: error.message });
  }

  
};