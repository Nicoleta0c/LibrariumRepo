import React, { useEffect, useState } from "react";
import axios from "axios";
import { UserCircle, BookMarked, CheckCircle, XCircle } from "lucide-react"; // Importamos iconos

type Book = {
  _id: string;
  name: string;
  autor: string;
  genre: string;
  publication_year: number;
  isbn: string;
  portada: string;
  totalCopies: number;
  availableCopies: number;
};

type User = {
  _id: string;
  name: string;
  email: string;
};

type Loan = {
  _id: string;
  user: User;
  book: { _id: string; name: string };
  loanDate: string;
  status: "solicitado" | "activo" | "rechazado" | "devuelto" | "vencido";
  // Puedes incluir dueDate si quieres mostrarla en la lista de pendientes
  dueDate?: string;
};

const AdminProfile: React.FC = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [books, setBooks] = useState<Book[]>([]);
  const [editingBook, setEditingBook] = useState<Book | null>(null);
  const [newBook, setNewBook] = useState({
    name: "",
    autor: "",
    genre: "",
    publication_year: 0,
    isbn: "",
    totalCopies: 1,
    portada: "",
  });
  const [pendingLoans, setPendingLoans] = useState<Loan[]>([]); // Cambiamos el nombre a pendingLoans

  useEffect(() => {
    fetchUsers();
    fetchBooks();
    fetchPendingLoans(); // Ahora fetchPendingLoans
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await axios.get("http://localhost:4000/users");
      setUsers(res.data);
    } catch (err) {
      console.error("Error fetching users:", err);
    }
  };

  const fetchBooks = async () => {
    try {
      const res = await axios.get("http://localhost:4000/books");
      setBooks(res.data);
    } catch (err) {
      console.error("Error fetching books:", err);
    }
  };

  const fetchPendingLoans = async () => {
    try {
      const res = await axios.get("http://localhost:4000/loans/pending");
      setPendingLoans(res.data);
    } catch (err) {
      console.error("Error fetching pending loans:", err);
    }
  };

  const handleDeleteUser = async (id: string) => {
    const confirmar = window.confirm("¿Estás seguro de que deseas eliminar este usuario?");
    if (!confirmar) return;

    try {
      await axios.delete(`http://localhost:4000/users/${id}`);
      fetchUsers();
    } catch (err) {
      console.error("Error deleting user:", err);
      alert("No se pudo eliminar el usuario.");
    }
  };

  const handleDeleteBook = async (id: string) => {
    try {
      await axios.delete(`http://localhost:4000/books/${id}`);
      fetchBooks();
    } catch (err) {
      console.error("Error deleting book:", err);
    }
  };

  const handleSaveBook = async () => {
    try {
      if (editingBook) {
        await axios.put(`http://localhost:4000/books/${editingBook._id}`, newBook);
      } else {
        await axios.post("http://localhost:4000/books", newBook);
      }
      fetchBooks();
      setEditingBook(null);
      setNewBook({
        name: "",
        autor: "",
        genre: "",
        publication_year: 0,
        isbn: "",
        totalCopies: 1,
        portada: "",
      });
    } catch (err) {
      console.error("Error saving book:", err);
    }
  };

  const handleApproveLoan = async (loanId: string) => {
    try {
      await axios.post(`http://localhost:4000/loans/approve/${loanId}`);
      fetchPendingLoans(); // Recargar la lista de solicitudes pendientes
      alert("Préstamo aprobado con éxito.");
    } catch (err) {
      console.error("Error approving loan:", err);
      alert("No se pudo aprobar el préstamo.");
    }
  };

  const handleRejectLoan = async (loanId: string) => {
    const confirmar = window.confirm("¿Estás seguro de que deseas rechazar esta solicitud de préstamo?");
    if (!confirmar) return;
    try {
      await axios.post(`http://localhost:4000/loans/reject/${loanId}`);
      fetchPendingLoans(); 
      alert("Solicitud de préstamo rechazada y eliminada.");
    } catch (err) {
      console.error("Error rejecting loan:", err);
      alert("No se pudo rechazar la solicitud de préstamo.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 pt-24 px-6 space-y-12">
      {/* Usuarios */}
      <section className="bg-white rounded-xl shadow p-6">
        <div className="flex items-center gap-2 mb-4">
          <UserCircle className="w-6 h-6 text-cyan-700" />
          <h2 className="text-xl font-semibold text-cyan-700">Gestión de Usuarios</h2>
        </div>
        <div className="overflow-x-auto max-h-80 overflow-y-auto">
          <table className="w-full text-sm">
            <thead className="bg-cyan-100 text-cyan-800">
              <tr>
                <th className="p-2 text-left">Nombre</th>
                <th className="p-2 text-left">Correo</th>
                <th className="p-2 text-left">Rol</th>
                <th className="p-2 text-left">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user._id} className="border-b hover:bg-gray-50">
                  <td className="p-2">{user.name}</td>
                  <td className="p-2">{user.email}</td>
                  <td className="p-2">{user.admin_user ? "Admin" : "Usuario"}</td>
                  <td className="p-2">
                    <button
                      className="text-red-600 hover:text-red-800 font-medium"
                      onClick={() => handleDeleteUser(user._id)}
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Formulario de Libros */}
      <section className="bg-white rounded-xl shadow p-6">
        <div className="flex items-center gap-2 mb-4">
          <BookMarked className="w-6 h-6 text-cyan-700" />
          <h2 className="text-xl font-semibold text-cyan-700">
            {editingBook ? "Editar Libro" : "Agregar Nuevo Libro"}
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <input
            type="text"
            placeholder="Título"
            value={newBook.name}
            onChange={(e) => setNewBook({ ...newBook, name: e.target.value })}
            className="p-2 border rounded"
          />
          <input
            type="text"
            placeholder="Autor"
            value={newBook.autor}
            onChange={(e) => setNewBook({ ...newBook, autor: e.target.value })}
            className="p-2 border rounded"
          />
          <input
            type="text"
            placeholder="Género"
            value={newBook.genre}
            onChange={(e) => setNewBook({ ...newBook, genre: e.target.value })}
            className="p-2 border rounded"
          />
          <input
            type="number"
            placeholder="Año"
            value={newBook.publication_year}
            onChange={(e) => setNewBook({ ...newBook, publication_year: parseInt(e.target.value) })}
            className="p-2 border rounded"
          />
          <input
            type="text"
            placeholder="ISBN"
            value={newBook.isbn}
            onChange={(e) => setNewBook({ ...newBook, isbn: e.target.value })}
            className="p-2 border rounded"
          />
          <input
            type="text"
            placeholder="Portada"
            value={newBook.portada}
            onChange={(e) => setNewBook({ ...newBook, portada: e.target.value })}
            className="p-2 border rounded"
          />

          <input
            type="number"
            placeholder="Cantidad Total"
            value={newBook.totalCopies}
            onChange={(e) => setNewBook({ ...newBook, totalCopies: parseInt(e.target.value) })}
            className="p-2 border rounded"
          />
        </div>
        <button
          onClick={handleSaveBook}
          className="mt-4 bg-cyan-700 hover:bg-cyan-800 text-white px-4 py-2 rounded shadow"
        >
          {editingBook ? "Guardar Cambios" : "Agregar Libro"}
        </button>
      </section>

      {/* Lista de Libros */}
      <section className="bg-white rounded-xl shadow p-6">
        <div className="flex items-center gap-2 mb-4">
          <BookMarked className="w-6 h-6 text-cyan-700" />
          <h2 className="text-xl font-semibold text-cyan-700">Gestión de Libros</h2>
        </div>
        <div className="overflow-x-auto max-h-80 overflow-y-auto">
          <table className="w-full text-sm">
            <thead className="bg-cyan-100 text-cyan-800">
              <tr>
                <th className="p-2 text-left">Título</th>
                <th className="p-2 text-left">Autor</th>
                <th className="p-2 text-left">Género</th>
                <th className="p-2 text-left">Año</th>
                <th className="p-2 text-left">ISBN</th>
                <th className="p-2 text-left">Portada</th>
                <th className="p-2 text-left">Total</th>
                <th className="p-2 text-left">Disponibles</th>
                <th className="p-2 text-left">Estado</th>
                <th className="p-2 text-left">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {books.map((book) => (
                <tr key={book._id} className="border-b hover:bg-gray-50">
                  <td className="p-2">{book.name}</td>
                  <td className="p-2">{book.autor}</td>
                  <td className="p-2">{book.genre}</td>
                  <td className="p-2">{book.publication_year}</td>
                  <td className="p-2">{book.isbn}</td>
                  <td className="p-2">{book.portada}</td>
                  <td className="p-2">{book.totalCopies}</td>
                  <td className="p-2">{book.availableCopies}</td>
                  <td className="p-2">{book.availableCopies > 0 ? "Disponible" : "No disponible"}</td>
                  <td className="p-2">
                    <button
                      onClick={() => {
                        setEditingBook(book);
                        setNewBook(book);
                      }}
                      className="text-cyan-600 hover:text-cyan-800 mr-3"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => handleDeleteBook(book._id)}
                      className="text-red-600 hover:text-red-800"
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {}
      <section className="bg-white rounded-xl shadow p-6">
        <div className="flex items-center gap-2 mb-4">
          <BookMarked className="w-6 h-6 text-cyan-700" />
          <h2 className="text-xl font-semibold text-cyan-700">Solicitudes de Préstamo Pendientes</h2>
        </div>
        <div className="overflow-x-auto max-h-80 overflow-y-auto">
          <table className="w-full text-sm">
            <thead className="bg-cyan-100 text-cyan-800">
              <tr>
                <th className="p-2 text-left">Usuario</th>
                <th className="p-2 text-left">Libro</th>
                <th className="p-2 text-left">Fecha de Solicitud</th>
                <th className="p-2 text-left">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {pendingLoans.map((loan) => (
                <tr key={loan._id} className="border-b hover:bg-gray-50">
                  <td className="p-2">{loan.user?.name} ({loan.user?.email})</td>
                  <td className="p-2">{loan.book?.name}</td>
                  <td className="p-2">{new Date(loan.loanDate).toLocaleDateString()}</td>
                  <td className="p-2 flex gap-2">
                  <button
                      onClick={async () => {
                        try {
                          await axios.post(`http://localhost:4000/loans/approve/${loan._id}`);
                          //await axios.post(`http://localhost:4000/loans/approve/${loan._id}`);
                          fetchPendingLoans();
                          alert("Préstamo aprobado y usuarios notificados.");
                        } catch (err) {
                          console.error("Error al aprobar o notificar:", err);
                          alert("No se pudo completar la acción.");
                        }
                      }}
                      className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
                    >
                      <CheckCircle className="w-4 h-4 inline-block mr-1" /> Aceptar
                    </button>
                    <button
                      onClick={() => handleRejectLoan(loan._id)}
                      className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                    >
                      <XCircle className="w-4 h-4 inline-block mr-1" /> Rechazar
                    </button>
                  </td>
                </tr>
              ))}
              {pendingLoans.length === 0 && (
                <tr>
                  <td className="p-2 text-center" colSpan={4}>No hay solicitudes de prestamo pendientes.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};

export default AdminProfile;