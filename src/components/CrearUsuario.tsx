
import { useState, useContext } from "react";
import type { FormEvent } from "react";
import { Link, useNavigate } from "react-router";
import { AuthContext } from "../context/AuthContext";

function CrearUsuario() {
  const auth = useContext(AuthContext);
  const navegar = useNavigate();

  const [nombre, setNombre] = useState("");
  const [apellidos, setApellidos] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [guardando, setGuardando] = useState(false);

  // Crear usuario en MongoDB
  async function crear(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!auth?.token || guardando) return;

    setError("");
    setGuardando(true);

    try {
      const respuesta = await fetch("http://localhost:3000/api/usuarios", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${auth.token}`
        },
        body: JSON.stringify({
          nombre,
          apellidos,
          email,
          password
        })
      });

      const datos = await respuesta.json();

      if (!respuesta.ok) {
        setError(datos.msg || datos.message || "Error al crear usuario");
        return;
      }

      // Volver al listado
      navegar("/usuarios");

    } catch {
      setError("No se pudo conectar con el servidor");
    } finally {
      setGuardando(false);
    }
  }

  return (
    <div>
      <h2>Crear usuario</h2>

      <form onSubmit={crear}>
        <input
          placeholder="Nombre"
          value={nombre}
          onChange={e => setNombre(e.target.value)}
          minLength={2}
          maxLength={50}
          required
        />

        <input
          placeholder="Apellidos (opcional)"
          value={apellidos}
          onChange={e => setApellidos(e.target.value)}
        />

        <input
          type="email"
          placeholder="Correo electrónico"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={e => setPassword(e.target.value)}
          minLength={8}
          maxLength={72}
          required
        />

        <button type="submit" disabled={guardando}>
          {guardando ? "Guardando..." : "Crear usuario"}
        </button>
      </form>

      {error && <p>{error}</p>}

      <Link to="/usuarios">Volver a usuarios</Link>
    </div>
  );
}

export default CrearUsuario;
