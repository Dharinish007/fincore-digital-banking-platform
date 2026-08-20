export enum Role {
  ADMIN = 'ADMIN',
  EMPLOYEE = 'EMPLOYEE',
  CUSTOMER = 'CUSTOMER'
}

export interface User {
  id: string | number;
  username: string;
  fullName: string;
  email?: string;
  role: Role;
  customerId?: number | null;
  employeeId?: number | null;
  permissions?: string[];
}

export interface LoginRequest {
  username?: string | null;
  password?: string | null;
}

export interface LoginResponse {
  token: string;
  tokenType?: string;
  expiresIn?: number;
  user: User;
}
