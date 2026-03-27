/**
 * Authentication domain types
 * Defines interfaces for authentication-related data structures
 */

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface LoginResponse {
  STATUS: string;
  RESULT_DATA?: {
    USER_TOKEN: string;
    [key: string]: any;
  };
  [key: string]: any;
}

export interface RegisterV3Request {
  username: string;
  password: string;
}

export interface AuthService {
  login(credentials: LoginCredentials): Promise<LoginResponse>;
  registerV3(username: string, password: string): Promise<any>;
  logout(): Promise<void>;
  isAuthenticated(): Promise<boolean>;
}

export interface AuthState {
  isAuthenticated: boolean;
  userToken?: string;
  user?: any;
  error?: string;
}
