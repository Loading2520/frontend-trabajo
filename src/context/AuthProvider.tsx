
import { useState, useEffect } from "react";
import type { ReactNode } from "react";
import { AuthContext } from "./AuthContext";
import type { Usuario } from "./AuthContext";

function AuthProvider({ children }: { children: ReactNode }) {
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [comprobando, setComprobando] = useState(() => !!sessionStorage.getItem("gridline_token"));

  // Recuperar la sesión al cargar la aplicación
  useEffect(() => {
    const guardado = sessionStorage.getItem("gridline_token");
    const controller = new AbortController();

    if (!guardado) {
      return;
    }

    async function comprobarSesion() {
      try {
        const res = await fetch(
          "http://localhost:3000/api/auth/profile",
          {
            headers: {
              Authorization: `Bearer ${guardado}`
            },
            signal: controller.signal
          }
        );

        if (!res.ok) throw new Error("Sesión caducada");

        const datos = await res.json();

        if (!controller.signal.aborted) {
          setUsuario(datos.usuario);
          setToken(guardado);
        }
      } catch {
        if (!controller.signal.aborted) {
          sessionStorage.removeItem("gridline_token");
        }
      } finally {
        if (!controller.signal.aborted) {
          setComprobando(false);
        }
      }
    }

    comprobarSesion();

    return () => controller.abort();
  }, []);

  // Guardar sesión al iniciar sesión
  function iniciarSesion(usuario: Usuario, token: string) {
    sessionStorage.setItem("gridline_token", token);
    setUsuario(usuario);
    setToken(token);
  }

  // Borrar sesión al salir
  function cerrarSesion() {
    sessionStorage.removeItem("gridline_token");
    setUsuario(null);
    setToken(null);
  }

  return (
    <AuthContext.Provider
      value={{ usuario, token, comprobando, iniciarSesion, cerrarSesion }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export default AuthProvider;
