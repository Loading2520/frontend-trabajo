
import { createContext } from "react";

// Datos del usuario
export interface Usuario {
  id: string;
  nombre: string;
  email: string;
  rol: string;
}

// Datos de la sesión
interface AuthDatos {
  usuario: Usuario | null;
  token: string | null;
  comprobando: boolean;
  iniciarSesion: (usuario: Usuario, token: string) => void;
  cerrarSesion: () => void;
}

export const AuthContext = createContext<AuthDatos | null>(null);
