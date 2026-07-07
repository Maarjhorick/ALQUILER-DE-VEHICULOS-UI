export type RolUsuario = 'ADMIN' | 'EMPLEADO';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface UsuarioSesion {
  id: number;
  nombres: string;
  email: string;
  rol: RolUsuario;
}

export interface LoginResponse {
  token: string;
  usuario: UsuarioSesion;
}