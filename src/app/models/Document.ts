import mongoose, { Schema } from 'mongoose';
import { DocumentType } from '@/app/types/document';

const documentSchema = new Schema({
  type: {
    type: String,
    enum: Object.values(DocumentType),
    required: true
  },
  relatedID: {
    type: Schema.Types.ObjectId,
    required: true
  },
  generatedBy: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  data: { type: Map, of: Schema.Types.Mixed },
  generatedAt: { type: Date, default: Date.now }
});

export default mongoose.models.Document || mongoose.model('Document', documentSchema);