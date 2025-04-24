import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import UserForm from "../components/UserForm";

import {
  UserCircle,
  BookOpenCheck,
  BookMinus,
  Clock,
  BookOpen,
  ArrowRightCircle,
  Trash2, 
} from "lucide-react";

type Book = {
  _id: string;
  name: string;
};

type User = {
  id: string;
  name: string;
  email: string;
  password?: string;
  profilePicture?: string;
};

type UserWithMongoId = User & { _id?: string };

type Loan = {
  _id: string;
  book: Book;
  loanDate: string;
  dueDate: string;
  status: string;
};

type Reservation = {
  _id: string;
  bookId: string;
  bookTitle: string;
  disponibility: boolean;
  status: string;
};

const UserProfile: React.FC = () => {
  const [user, setUser] = useState<UserWithMongoId | null>(null);
  const [loans, setLoans] = useState<Loan[]>([]);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [showEditForm, setShowEditForm] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const parsedUser: UserWithMongoId = JSON.parse(storedUser);
      setUser(parsedUser);
      fetchLoans(parsedUser.id);
      fetchReservations(parsedUser.id);
    }
  }, []);

  const fetchLoans = async (userId: string) => {
    try {
      const response = await axios.get(`http://localhost:4000/loans/user/${userId}`);
      setLoans(response.data);
    } catch (error) {
      console.error("Error al obtener los préstamos:", error);
    }
  };

  const fetchReservations = async (userId: string) => {
    try {
      const response = await axios.get(`http://localhost:4000/reservations/user/${userId}`);
      setReservations(response.data);
    } catch (error) {
      console.error("Error al obtener reservas:", error);
    }
  };

  const solicitarPrestamoDesdeReserva = async (bookId: string) => {
    try {
      const userId = user?.id || user?._id;
      const response = await axios.post("http://localhost:4000/loans/request-loan", {
        userId,
        bookId,
      });

      if (response.status === 201) {
        alert("Préstamo realizado con éxito");
        fetchLoans(userId!);
        fetchReservations(userId!);
      } else {
        alert("No se pudo realizar el préstamo");
      }
    } catch (error) {
      console.error("Error al prestar libro:", error);
      alert("Error al solicitar préstamo");
    }
  };

  const handleDeleteReservation = async (reservationId: string) => {
    const confirmar = window.confirm("¿Estás seguro de que deseas eliminar esta reserva?");
    if (!confirmar) return;

    try {
      await axios.delete(`http://localhost:4000/reservations/${reservationId}`);
      alert("Reserva eliminada con éxito");
      fetchReservations(user?.id || user?._id!);
    } catch (error) {
      console.error("Error al eliminar la reserva:", error);
      alert("No se pudo eliminar la reserva.");
    }
  };

  const librosPrestadosIds = loans
    .filter((l) => l.status === "activo")
    .map((l) => l.book._id);

  const reservasFiltradas = reservations.filter(
    (res) => !librosPrestadosIds.includes(res.bookId)
  );

  return (
    <div className="min-h-screen bg-gray-100 py-10 pt-24 px-6 flex flex-col items-center">
      <div className="bg-white shadow-md rounded-2xl w-full max-w-4xl p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <img
              src={user?.profilePicture || "https://bootdey.com/img/Content/avatar/avatar7.png"}
              alt="avatar"
              className="w-16 h-16 rounded-full border"
            />
            <div>
              <h2 className="text-xl font-bold text-cyan-700">Bienvenido, {user?.name}</h2>
              <p className="text-sm text-gray-600">{user?.email}</p>
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => setShowEditForm(!showEditForm)}
              className="px-4 py-2 border border-cyan-600 text-cyan-600 rounded hover:bg-cyan-100 transition"
            >
              {showEditForm ? "Cancelar" : "Editar perfil"}
            </button>
            <button
              onClick={() => alert("Aquí podrás ver el historial completo de préstamos")}
              className="px-4 py-2 bg-cyan-600 text-white rounded hover:bg-cyan-700 transition"
            >
              Ver historial
            </button>
          </div>
        </div>

        {showEditForm && user && (
          <div className="mb-6">
            <UserForm
              initialData={user}
              onSubmit={async (updatedUser) => {
                try {
                  const currentId = user.id || user._id;
                  const response = await axios.put(
                    `http://localhost:4000/users/${currentId}`,
                    updatedUser
                  );
                  const updated = {
                    ...response.data.user,
                    id: response.data.user.id || response.data.user._id || currentId,
                  };
                  setUser(updated);
                  localStorage.setItem("user", JSON.stringify(updated));
                  fetchLoans(updated.id);
                  fetchReservations(updated.id);
                  setShowEditForm(false);
                  alert("Perfil actualizado con éxito");
                } catch (err) {
                  console.error("Error al actualizar perfil:", err);
                  alert("Error al actualizar el perfil");
                }
              }}
              mode="edit"
            />
          </div>
        )}

        {/* 📊 Contadores */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <StatCard icon={<UserCircle className="w-5 h-5" />} label="Total préstamos" value={loans.length} />
          <StatCard icon={<BookOpenCheck className="w-5 h-5" />} label="Activos" value={loans.filter((l) => l.status === "activo").length} />
          <StatCard icon={<BookMinus className="w-5 h-5" />} label="Devueltos" value={loans.filter((l) => l.status === "devuelto").length} />
          <StatCard icon={<Clock className="w-5 h-5" />} label="Vencidos" value={loans.filter((l) => l.status === "vencido").length} />
        </div>

        {/* 📚 Préstamos activos */}
        <div className="bg-white p-5 rounded-xl shadow mb-8 border">
          <h3 className="text-lg font-semibold text-cyan-800 mb-3 flex items-center gap-2">
            <BookOpen className="w-5 h-5" />
            Libros en tu inventario
          </h3>
          {loans.filter((l) => l.status === "activo").length > 0 ? (
            <ul className="space-y-3">
              {loans.filter((l) => l.status === "activo").map((l) => (
                <li key={l._id} className="flex justify-between bg-gray-50 border rounded-lg p-4">
                  <div>
                    <p className="font-semibold text-gray-800">{l.book.name}</p>
                    <p className="text-sm text-gray-600">
                      Vence el: {new Date(l.dueDate).toLocaleDateString()}
                    </p>
                  </div>
                  <Link
                    to={`/loan/${l._id}`}
                    className="text-sm bg-cyan-600 text-white px-3 py-1 rounded hover:bg-cyan-700 flex items-center gap-1"
                  >
                    Detalles <ArrowRightCircle className="w-4 h-4" />
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-gray-500">No tienes libros en tu inventario.</p>
          )}
        </div>

        {/* 📌 Reservas */}
        <div className="bg-gray-50 p-5 rounded-xl shadow-inner border">
          <h3 className="text-lg font-semibold text-cyan-800 mb-3">Mis Reservas</h3>
          {reservasFiltradas.length > 0 ? (
            <ul className="space-y-3">
              {reservasFiltradas.map((res) => (
                <li
                  key={res._id}
                  className="bg-white rounded-lg shadow-sm p-4 border flex justify-between items-center"
                >
                  <div>
                    <p className="font-medium text-gray-800">{res.bookTitle}</p>
                    <p className="text-sm text-gray-500">
                      Estado: {res.status} | Disponibilidad:{" "}
                      {res.disponibility ? "Disponible" : "No disponible"}
                    </p>
                  </div>

                  {res.status === "pendiente" && (
                    <button
                      className="text-sm bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded flex items-center gap-1"
                      onClick={() => handleDeleteReservation(res._id)}
                    >
                      <Trash2 className="w-4 h-4" /> Eliminar reserva
                    </button>
                  )}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-gray-500">No tienes reservas pendientes.</p>
          )}
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ icon, label, value }: { icon: React.ReactNode; label: string; value: number }) => (
  <div className="bg-white shadow rounded-lg p-4 flex items-center gap-4">
    <div className="p-2 bg-cyan-100 text-cyan-700 rounded">{icon}</div>
    <div>
      <p className="text-2xl font-bold">{value}</p>
      <p className="text-sm text-gray-600">{label}</p>
    </div>
  </div>
);

export default UserProfile;