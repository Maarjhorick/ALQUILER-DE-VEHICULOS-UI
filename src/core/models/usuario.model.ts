export interface Rol {
  idRol: number;
  nombreRol: string;
  descripcion?: string;
}

export interface Usuario {
  idUsuario?: number;
  username: string;
  emailRecuperacion?: string;
  rol: Rol;
  estado: boolean;
  fechaCreacion?: string;
  ultimoAcceso?: string;
}

export interface CrearUsuarioRequest {
  username: string;
  password: string;
  rolNombre: string;
  emailRecuperacion?: string;
}