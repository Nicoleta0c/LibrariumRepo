import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { BookOpenCheck } from "lucide-react"; // Opcional si usas íconos

type LoanDetail = {
  _id: string;
  book: {
    _id: string;
    name: string;
    autor: string;
    genre: string;
    publication_year: number;
    isbn: string;
  };
  user: {
    _id: string;
    name: string;
    email: string;
  };
  loanDate: string;
  dueDate: string;
  status: string;
};

const LoanDetail: React.FC = () => {
  const { loanId } = useParams<{ loanId: string }>();
  const navigate = useNavigate();
  const [loan, setLoan] = useState<LoanDetail | null>(null);

  useEffect(() => {
    const fetchLoan = async () => {
      try {
        const response = await axios.get(`http://localhost:4000/loans/${loanId}`);
        setLoan(response.data);
      } catch (error) {
        console.error("Error al obtener detalles del préstamo:", error);
        alert("No se pudo cargar el préstamo.");
      }
    };

    fetchLoan();
  }, [loanId]);

  const calcularDiasRestantes = (fechaFin: string) => {
    const hoy = new Date();
    const vencimiento = new Date(fechaFin);
    const diff = vencimiento.getTime() - hoy.getTime();
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  };

  const devolverLibro = async () => {
    try {
      await axios.post("http://localhost:4000/loans/return-book", {
        loanId: loan?._id,
      });
      alert("Libro devuelto exitosamente");
      navigate("/userProfile");
    } catch (error) {
      console.error("Error al devolver el libro:", error);
      alert("No se pudo devolver el libro.");
    }
  };

  if (!loan) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-gray-600 text-lg">Cargando detalles del préstamo...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white shadow-lg rounded-2xl p-6 max-w-xl w-full">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-semibold text-cyan-700 flex items-center gap-2">
            <BookOpenCheck className="w-6 h-6" />
            Detalles del Préstamo
          </h2>
        </div>
        <div className="space-y-2 text-gray-700">
          <p><strong>Título:</strong> {loan.book.name}</p>
          <p><strong>Autor:</strong> {loan.book.autor}</p>
          <p><strong>Género:</strong> {loan.book.genre}</p>
          <p><strong>Año de publicación:</strong> {loan.book.publication_year}</p>
          <p><strong>ISBN:</strong> {loan.book.isbn}</p>
          <hr className="my-4" />
          <p><strong>Fecha de préstamo:</strong> {new Date(loan.loanDate).toLocaleDateString()}</p>
          <p><strong>Fecha de vencimiento:</strong>
            {loan.dueDate && !isNaN(Date.parse(loan.dueDate))
              ? new Date(loan.dueDate).toLocaleDateString()
              : "Fecha inválida"}
          </p>
          <p><strong>Días restantes:</strong>
            {loan.dueDate && !isNaN(Date.parse(loan.dueDate))
              ? calcularDiasRestantes(loan.dueDate) + " días"
              : "Fecha inválida"}
          </p>
          <p><strong>Estado:</strong> {loan.status}</p>
        </div>

        <div className="flex justify-between mt-6">
          <button
            className="bg-gray-500 hover:bg-gray-600 text-white font-semibold py-2 px-4 rounded"
            onClick={() => navigate(-1)}
          >
            ← Volver
          </button>

          {loan.status === "activo" && (
            <button
              className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded"
              onClick={devolverLibro}
            >
              Devolver libro
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default LoanDetail;
