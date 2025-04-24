import React, { useState } from 'react';

type Props = {
  bookId: string | undefined;
  userId: string | null;
  onClose: () => void;
  onLoanRequest: (bookId: string) => void;
  onReservationRequest: (bookId: string | undefined) => void;
};

const BookRequestForm: React.FC<Props> = ({ bookId, userId, onClose, onLoanRequest, onReservationRequest }) => {
  if (!bookId || !userId) {
    return <div>Debes iniciar sesión para realizar una solicitud.</div>;
  }

  return (
    <div className="fixed top-0 left-0 w-full h-full bg-gray-500 bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg shadow-md w-96">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">¿Qué deseas hacer con este libro?</h2>
        <div className="flex flex-col space-y-2">
          <button
            className="w-full text-sm font-semibold bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded shadow"
            onClick={() => {
              onLoanRequest(bookId);
              onClose();
            }}
          >
            Solicitar préstamo
          </button>
          <button
            className="w-full text-sm font-semibold bg-cyan-600 hover:bg-cyan-700 text-white py-2 px-4 rounded shadow"
            onClick={() => {
              onReservationRequest(bookId);
              onClose();
            }}
          >
            Reservar
          </button>
          <button
            className="w-full text-sm font-semibold bg-gray-300 hover:bg-gray-400 text-gray-800 py-2 px-4 rounded"
            onClick={onClose}
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookRequestForm;