import type { User, LoginCredentials, RegisterData } from './user';
import type { ApiResponse } from './common';

export interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<ApiResponse>;
  register: (userData: RegisterData) => Promise<ApiResponse>;
  logout: () => void;
  updateUser: (updatedUser: User) => void; 
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface LoginRequest extends LoginCredentials {}

export interface RegisterRequest extends RegisterData {}

export interface RefreshTokenRequest {
  refreshToken: string;
}

export interface RefreshTokenResponse {
  token: string;
  refreshToken: string;
}
