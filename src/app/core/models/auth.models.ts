export enum Role {
  ADMIN = 'ADMIN',
  EMPLOYEE = 'EMPLOYEE',
  CUSTOMER = 'CUSTOMER'
}

export interface User {
  id: string;
  username: string;
  fullName: string;
  role: Role;
}

export interface LoginRequest {
  username?: string | null;
  password?: string | null;
}

export interface LoginResponse {
  token: string;
  user: User;
}
