import mongoose, { Schema } from 'mongoose';

const paymentSchema = new Schema({
  transactionID: { 
    type: Schema.Types.ObjectId, 
    ref: 'Transaction', 
    required: true 
  },
  amount: { type: Number, required: true },
  date: { type: Date, required: true },
  receiptNumber: { type: String, required: true, unique: true },
  createdBy: { 
    type: Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
}, { timestamps: true });

export default mongoose.models.Payment || mongoose.model('Payment', paymentSchema);