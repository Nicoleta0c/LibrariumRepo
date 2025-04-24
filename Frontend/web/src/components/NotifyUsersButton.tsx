import axios from "axios";
import React from "react";

interface NotifyUsersButtonProps {
  bookId: string;
  className?: string;
}

const NotifyUsersButton: React.FC<NotifyUsersButtonProps> = ({ bookId, className }) => {
  const handleNotify = async () => {
    try {
      const res = await axios.post("http://localhost:4000/reservations/notify", {
        bookId,
      });
      alert(res.data.message); 
    } catch (error) {
      console.error("Error al notificar usuarios:", error);
      alert("Error al notificar usuarios");
    }
  };

  return (
    <button
      onClick={handleNotify}
      className={`bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded ${className || ""}`}
    >
      Disponibilidad
    </button>
  );
};

export default NotifyUsersButton;
