import mongoose from "mongoose";

const reservationSchema = new mongoose.Schema({
  
    user: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "User", required: true 
    },
    book: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "Book", required: true 
    },
    status: { 
        type: String, enum: ["pendiente", "notificado", "cancelado"], 
        default: "pendiente" 
    },
    createdAt: { 
    type: Date, default: Date.now 
    }
});

export default mongoose.model("Reservation", reservationSchema);
