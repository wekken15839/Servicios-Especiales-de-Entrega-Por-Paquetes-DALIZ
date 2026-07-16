// ============================================================
// Auth types — shared between server and client
// ============================================================

export interface AuthUser {
  id: string;
  username: string;
  name: string;
  role: string;
}

export interface AuthResult {
  id: string;
  username: string;
  name: string;
  role: string;
}

// --- Requests ---

export interface SignInRequest {
  username: string;
  password: string;
}

export interface SignUpRequest {
  username: string;
  password: string;
  name: string;
}

// --- Responses ---

export interface AuthResponse {
  message: string;
  user: AuthUser;
  token: string;
}

export interface MeResponse {
  user: AuthUser;
}
