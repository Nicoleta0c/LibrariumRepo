import express from "express";
import { getReservationsByUser, createReservation, notifyAvailableBooks, deleteReservation } from "../controllers/reservationController.js";
import isAdmin from "../middlewares/adminMiddleware.js";

const router = express.Router();

router.post("/create", createReservation);
router.get("/notify", isAdmin, notifyAvailableBooks);
router.get("/user/:userId", getReservationsByUser);
//router.post("/notifyEmail", isAdmin, notifyAvailableBooks);
// Nueva ruta para eliminar una reserva por su ID
router.delete("/:id", deleteReservation);

export default router;