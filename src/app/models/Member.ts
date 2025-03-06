import mongoose, { Schema } from 'mongoose';

const memberSchema = new Schema({
  name: { type: String, required: true },
  idNumber: { type: String, required: true, unique: true },
  address: { type: String, required: true },
  phone: { type: String, required: true },
  email: { type: String },
  joinDate: { type: Date, required: true, default: Date.now },
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

export default mongoose.models.Member || mongoose.model('Member', memberSchema);