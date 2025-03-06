export enum DocumentType {
  LOAN_AGREEMENT = 'LOAN_AGREEMENT',
  PAYMENT_RECEIPT = 'PAYMENT_RECEIPT',
  MEMBER_REGISTRATION = 'MEMBER_REGISTRATION',
}

export interface Document {
  _id: string;
  type: DocumentType;
  relatedID: string; // Transaction ID or Member ID
  generatedBy: string;
  generatedAt: Date;
  data: Record<string, any>;
}