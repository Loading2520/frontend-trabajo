
import { useState } from "react";
import type { ReactNode } from "react";
import { AuthContext } from "./AuthContext";
import type { Usuario } from "./AuthContext";

function AuthProvider({ children }: { children: ReactNode }) {
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [token, setToken] = useState<string | null>(null);

  // Guardar usuario y token
  function iniciarSesion(usuario: Usuario, token: string) {
    setUsuario(usuario);
    setToken(token);
  }

  // Cerrar sesión
  function cerrarSesion() {
    setUsuario(null);
    setToken(null);
  }

  return (
    <AuthContext.Provider
      value={{ usuario, token, iniciarSesion, cerrarSesion }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export default AuthProvider;
