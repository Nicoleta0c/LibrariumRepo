import mongoose from 'mongoose';

const LoanSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    book: { type: mongoose.Schema.Types.ObjectId, ref: 'Book', required: true },
    loanDate: { type: Date, default: Date.now },
    dueDate: { type: Date }, // Ya no es requerido inicialmente
    returnDate: { type: Date },
    status: {
        type: String,
        enum: ['activo', 'devuelto', 'vencido', 'solicitado', 'rechazado'], // Añadimos 'solicitado' y 'rechazado'
        default: 'solicitado' // El estado por defecto ahora es 'solicitado' al crear la solicitud
    }
});

const Loan = mongoose.model('Loan', LoanSchema);

export default Loan;