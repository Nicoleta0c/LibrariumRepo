import { useEffect, useState, useMemo } from "react";
import axios from "axios";
import { BookOpen, Clock } from "lucide-react"; 

type Book = {
  _id: string;
  name: string;
  autor: string;
  genre: string;
  publication_year: number;
  isbn: string;
  disponibility: boolean;
  estadoLocal?: string;
  portada?: string;
  totalCopies?: number;
  availableCopies?: number;
};

type Loan = {
  _id: string;
  book: {
    _id: string;
    name: string;
  };
  loanDate: string;
  dueDate: string;
  status: string;
};

type Reservation = {
  _id: string;
  bookId: string;
  userId: string;
  reservationDate: string;
  status: string;
};

const BookList = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [loans, setLoans] = useState<Loan[]>([]);
  const [reservations, setReservations] = useState<Reservation[]>([]); // Nuevo estado para las reservas
  const [searchTerm, setSearchTerm] = useState("");
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    fetch("http://localhost:4000/books")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setBooks(data);
        } else {
          console.error("Respuesta inválida del servidor:", data);
        }
      })
      .catch((error) => console.error("Error al obtener libros:", error));

    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const parsed = JSON.parse(storedUser);
      const currentUserId = parsed.id || parsed._id;
      setUserId(currentUserId);

      axios
        .get(`http://localhost:4000/loans/user/${currentUserId}`)
        .then((res) => setLoans(res.data))
        .catch((err) => console.error("Error al obtener préstamos:", err));

      // Obtener las reservas del usuario
      axios
        .get(`http://localhost:4000/reservations/user/${currentUserId}`)
        .then((res) => setReservations(res.data))
        .catch((err) => console.error("Error al obtener reservas:", err));
    }
  }, []);

  const librosPrestadosIds = useMemo(() => {
    return loans
      .filter((l) => l.status === "activo")
      .map((l) => l.book._id);
  }, [loans]);

  const librosReservadosIds = useMemo(() => {
    return reservations
      .filter((r) => r.status === "activa" || r.status === "pendiente")
      .map((r) => r.bookId);
  }, [reservations]);

  const handleReservation = async (bookId?: string) => {
    if (!bookId || !userId) return alert("Debes iniciar sesión");

    try {
      const response = await fetch("http://localhost:4000/reservations/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, bookId }),
      });

      if (response.ok) {
        const data = await response.json();
        alert(data.message);
        setReservations((prevReservations) => [...prevReservations, data.reservation]);
      } else {
        const errorData = await response.json();
        alert(errorData.message || "No se pudo realizar la reserva");
      }
    } catch (error) {
      console.error("Error al reservar:", error);
      alert("Ocurrió un error al intentar reservar el libro");
    }
  };

  const handleLoanRequest = async (bookId: string) => {
    if (!userId) return alert("Debes iniciar sesión");

    try {
      const response = await fetch("http://localhost:4000/loans/request-loan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, bookId }),
      });

      const data = await response.json();

      if (response.ok) {
        alert("Solicitud de préstamo enviada con éxito. El administrador la revisará.");
        // Actualizar el estado local del libro a "Solicitado"
        setBooks((prevBooks) =>
          prevBooks.map((book) =>
            book._id === bookId
              ? { ...book, estadoLocal: "Solicitado" }
              : book
          )
        );
      } else {
        alert(data.message || "No se pudo enviar la solicitud de préstamo");
      }
    } catch (error) {
      console.error("Error al solicitar préstamo:", error);
      alert("Ocurrió un error al solicitar el préstamo");
    }
  };

  const filteredBooks = books.filter((book) =>
    book?.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container mx-auto py-6 px-4">
      <h2 className="text-2xl font-bold mb-4 text-cyan-700">Catálogo de Libros</h2>
      <input
        type="text"
        placeholder="Buscar por título"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="mb-6 p-2 border border-gray-300 rounded w-full"
      />
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filteredBooks.map((book) => (
          <div
            key={book._id}
            className="bg-white p-4 rounded-lg shadow hover:shadow-md transition duration-300 flex flex-col justify-between min-h-[350px]"
          >
            <div>
              <div className="relative w-full h-38 mb-2 overflow-hidden rounded">
                {book.portada && (
                  <img
                    src={book.portada}
                    alt={`Portada de ${book.name}`}
                    className="object-cover w-full h-full"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = "https://via.placeholder.com/150?text=Sin+Portada";
                    }}
                  />
                )}
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2 flex items-center justify-between">
                {book.name}
              </h3>
              <p className="text-sm text-gray-600 mb-1">Autor: {book.autor}</p>
              <p className="text-sm text-gray-600 mb-1">Género: {book.genre}</p>
              <p className="text-sm text-gray-600 mb-1">Año: {book.publication_year}</p>
              <p className="text-sm text-gray-600 mb-2">
                Estado:{" "}
                {book.estadoLocal ||
                  (book.disponibility ? "Disponible" : "No disponible")}
                {book.totalCopies && book.availableCopies !== undefined && (
                  <span className="text-gray-500 ml-2">
                    ({book.availableCopies} de {book.totalCopies} disponibles)
                  </span>
                )}
              </p>
            </div>

            <div>
              {librosReservadosIds.includes(book._id) ? (
                <button
                  className="mt-4 w-full text-sm font-semibold bg-gray-400 text-white py-2 px-4 rounded shadow cursor-not-allowed flex items-center justify-center gap-2"
                  disabled
                >
                  <Clock className="w-4 h-4" />
                  Reservado
                </button>
              ) : librosPrestadosIds.includes(book._id) ? (
                <div className="w-full text-sm font-semibold text-yellow-700 bg-yellow-100 py-2 px-4 rounded shadow mt-4 flex items-center justify-center gap-2">
                  <BookOpen className="w-4 h-4" />
                  En tu biblioteca
                </div>
              ) : book?.estadoLocal === "Solicitado" ? (
                <button
                  className="mt-4 w-full text-sm font-semibold bg-yellow-400 text-white py-2 px-4 rounded shadow cursor-not-allowed"
                  disabled
                >
                  Solicitado
                </button>
              ) : book?.disponibility && book?.availableCopies !== undefined && book.availableCopies > 0 ? (
                <button
                  className="w-full text-sm font-semibold bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded shadow mt-4"
                  onClick={() => handleLoanRequest(book._id)}
                >
                  Solicitar Préstamo
                </button>
              ) : (
                <button
                  className="mt-4 w-full text-sm font-semibold bg-orange-500 hover:bg-orange-600 text-white py-2 px-4 rounded shadow"
                  onClick={() => handleReservation(book._id)}
                >
                  Reservar
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BookList;