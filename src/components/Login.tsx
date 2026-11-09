
import { useState } from "react";
import type { FormEvent } from "react";

interface Props {
  onLogin: () => void;
}

function Login({ onLogin }: Props) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  async function entrar(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");

    try {
      const respuesta = await fetch(
        "http://localhost:3000/api/auth/login",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password })
        }
      );

      const datos = await respuesta.json();

      if (!respuesta.ok) {
        setError(datos.msg || "Error al iniciar sesión");
        return;
      }

      onLogin();

    } catch {
      setError("Error al conectar con el servidor");
    }
  }

  return (
    <div className="contenedor">
      <h1>GRIDLINE</h1>
      <h2>Iniciar sesión</h2>

      <form onSubmit={entrar}>
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
          required
        />

        <button type="submit">Entrar</button>
      </form>

      <p>{error}</p>
    </div>
  );
}

export default Login;
