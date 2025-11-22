export interface ApiResponse<T> {
  count?: number;
  next?: string | null;
  previous?: string | null;
  results: T[];
}

export interface ApiError {
  error: string;
  detail?: string;
  field_errors?: Record<string, string[]>;
}

export interface LoginRequest {
  username: string;
  password: string;
  remember?: boolean;
}

export interface LoginResponse {
  user: {
    id: number;
    username: string;
    email: string;
    first_name: string;
    last_name: string;
    is_staff: boolean;
  };
  token: string;
  session_id: string;
}

export interface User {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  is_staff: boolean;
  is_active: boolean;
  date_joined: string;
  last_login?: string;
}

export interface SecretRevealRequest {
  token: string;
}

export interface SecretRevealResponse {
  message: string;
  memories: Memory[];
}