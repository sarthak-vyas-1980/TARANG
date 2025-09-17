export type Role = 'CITIZEN' | 'OFFICIAL' | 'ANALYST';

export interface User {
  id: number;
  name?: string;
  email: string;
  role: Role;
  createdAt: string;
  updatedAt?: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  name?: string;
  email: string;
  password: string;
  role?: Role;
}

export interface UpdateUserRequest {
  name?: string;
  email?: string;
  role?: Role;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export interface UserResponse extends User {
  // Additional fields that might come from API
}
