import express from "express";
import {
  requestLoan,
  returnBook,
  checkExpiredLoans,
  getLoansByUser,
  getLoanById,
  getAllLoans,
  getPendingLoans, // Importamos la nueva función
  approveLoan,     // Importamos la nueva función
  rejectLoan       // Importamos la nueva función
} from "../controllers/loanController.js";

const router = express.Router();

router.post("/request-loan", requestLoan);
router.post("/return-book", returnBook);
router.get("/check-expired", checkExpiredLoans);
router.get("/user/:userId", getLoansByUser);

// Esta ruta debe estar ANTES de la ruta con parámetro ":loanId"
router.get("/pending", getPendingLoans); // Nueva ruta para obtener solicitudes pendientes

router.get("/:loanId", getLoanById);
router.get("/", getAllLoans);
router.post("/approve/:loanId", approveLoan);
router.post("/reject/:loanId", rejectLoan);   // Nueva ruta para rechazar una solicitud

export default router;