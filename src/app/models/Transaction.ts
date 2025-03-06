import mongoose, { Schema } from 'mongoose';
import { TransactionStatus } from '@/app/types/transaction';

const transactionSchema = new Schema({
  memberID: { 
    type: Schema.Types.ObjectId, 
    ref: 'Member', 
    required: true 
  },
  amount: { type: Number, required: true },
  purpose: { type: String, required: true },
  date: { type: Date, required: true },
  dueDate: { type: Date, required: true },
  status: { 
    type: String, 
    enum: Object.values(TransactionStatus), 
    default: TransactionStatus.PENDING 
  },
  interestRate: { type: Number, default: 0 },
  createdBy: { 
    type: Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  updatedBy: { 
    type: Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
}, { timestamps: true });

export default mongoose.models.Transaction || mongoose.model('Transaction', transactionSchema);