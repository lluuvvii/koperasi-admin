export interface Member {
  _id: string;
  name: string;
  idNumber: string;
  address: string;
  phone: string;
  email?: string;
  joinDate: Date;
  createdBy: string;
  updatedBy: string;
  createdAt: Date;
  updatedAt: Date;
}