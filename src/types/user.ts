export interface User {
  id: string;
  email: string;
  name?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  access_token: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  name?: string;
  username: string;
}

export interface RegisterResponse {
  access_token: string;
  user: User;
}
