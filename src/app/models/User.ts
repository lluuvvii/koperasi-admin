import mongoose, { Schema } from 'mongoose';
import { Role } from '@/app/types/user';

const userSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { 
    type: String, 
    enum: Object.values(Role), 
    default: Role.FIELD_OFFICER 
  },
}, { timestamps: true });

export default mongoose.models.User || mongoose.model('User', userSchema);