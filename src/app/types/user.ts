export enum Role {
  ADMIN = 'ADMIN',
  FIELD_OFFICER = 'FIELD_OFFICER',
  OFFICE_OFFICER = 'OFFICE_OFFICER',
}

export interface User {
  _id: string;
  name: string;
  email: string;
  role: Role;
  createdAt: Date;
  updatedAt: Date;
}