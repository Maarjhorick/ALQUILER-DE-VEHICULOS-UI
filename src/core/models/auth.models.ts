export type RolUsuario = 'ADMIN' | 'CLIENTE' | 'EMPLEADO';

export interface LoginRequest {
  username: string;
  password: string;
}

export interface UsuarioSesion {
  username: string;
  rol: RolUsuario;
}

export interface LoginResponse {
  token: string;
  tipo: string;
  username: string;
  rol: RolUsuario;
}