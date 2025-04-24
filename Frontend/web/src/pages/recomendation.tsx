import '../App.css';
import { useEffect, useState, useMemo } from "react";
import axios from "axios";
import Card from "../components/Card";
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import { Navigation } from 'swiper/modules';
import { Link } from "react-router-dom";

type Book = {
  _id: string;
  name: string;
  autor: string;
  genre: string;
  portada?: string;
};

type Reservation = {
  _id: string;
  bookId: string;
  status: string;
};

type Loan = {
  _id: string;
  book: {
    _id: string;
    name: string;
  };
  status: string;
};

const Recomendation = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loans, setLoans] = useState<Loan[]>([]);

  useEffect(() => {
    fetch("http://localhost:4000/books")
      .then((res) => res.json())
      .then((data) => Array.isArray(data) && setBooks(data));

    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const parsed = JSON.parse(storedUser);
      const currentUserId = parsed.id || parsed._id;

      axios
        .get(`http://localhost:4000/reservations/user/${currentUserId}`)
        .then((res) => setReservations(res.data))
        .catch(console.error);

      axios
        .get(`http://localhost:4000/loans/user/${currentUserId}`)
        .then((res) => setLoans(res.data))
        .catch(console.error);
    }
  }, []);

  const reservedAndLoanedBooks = useMemo(() => {
    const activeReservations = reservations.filter((r) => r.status === "activa" || r.status === "pendiente");
    const activeLoans = loans.filter((l) => l.status === "activo" || l.status === "solicitado");

    const reservationBookIds = activeReservations.map((r) => r.bookId);
    const loanBookIds = activeLoans.map((l) => l.book._id);
    const allRelevantIds = [...new Set([...reservationBookIds, ...loanBookIds])];

    return books.filter((book) => allRelevantIds.includes(book._id));
  }, [books, reservations, loans]);

  const recommendedBooks = useMemo(() => {
    const genresReservados = [...new Set(reservedAndLoanedBooks.map((b) => b.genre))];
    const idsUsados = reservedAndLoanedBooks.map((b) => b._id);

    return books.filter(
      (book) =>
        !idsUsados.includes(book._id) &&
        genresReservados.includes(book.genre)
    );
  }, [books, reservedAndLoanedBooks]);

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden py-8">
      <div className="flex justify-between items-center w-full max-w-6xl mb-6">
        <h1 className="text-3xl font-bold text-cyan-700">Recomendaciones</h1>
        {recommendedBooks.length > 0 && (
          <Link to="/books" className="text-red-500 text-sm">
            Ver Libros
          </Link>
        )}
      </div>

      <div className="relative w-full max-w-6xl">
        {recommendedBooks.length > 0 ? (
          <>
            <Swiper
              modules={[Navigation]}
              navigation={{
                nextEl: '.swiper-button-next',
                prevEl: '.swiper-button-prev',
              }}
              spaceBetween={20}
              slidesPerView={1}
              breakpoints={{
                640: { slidesPerView: 1 },
                768: { slidesPerView: 2 },
                1024: { slidesPerView: 3 },
              }}
            >
              {recommendedBooks.map((book, index) => (
                <SwiperSlide key={index}>
                  <div className="flex justify-center">
                    <Card
                      imageUrl={book.portada || "https://via.placeholder.com/150?text=Sin+Portada"}
                      title={book.name}
                      author={book.autor}
                      className="w-full h-auto md:w-[250px] lg:w-[300px] shadow-lg transition-transform duration-300 hover:scale-105"
                      price={""}
                    />
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>

            <div className="swiper-button-prev absolute left-[-30px] top-1/2 transform -translate-y-1/2 z-10 cursor-pointer"></div>
            <div className="swiper-button-next absolute right-[-30px] top-1/2 transform -translate-y-1/2 z-10 cursor-pointer"></div>
          </>
        ) : (
          <p className="text-gray-600 text-center w-full">No hay recomendaciones por ahora.</p>
        )}
      </div>
    </div>
  );
};

export default Recomendation;
