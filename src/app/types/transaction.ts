export enum TransactionStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
}

export interface Transaction {
  _id: string;
  memberID: string;
  amount: number;
  purpose: string;
  date: Date;
  dueDate: Date;
  status: TransactionStatus;
  interestRate: number;
  createdBy: string;
  updatedBy: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Payment {
  _id: string;
  transactionID: string;
  amount: number;
  date: Date;
  receiptNumber: string;
  createdBy: string;
  createdAt: Date;
}