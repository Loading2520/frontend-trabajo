
import { useState, useContext } from "react";
import type { FormEvent } from "react";
import { Link, useNavigate } from "react-router";
import { AuthContext } from "../context/AuthContext";

function CrearCoche() {
  const auth = useContext(AuthContext);
  const navegar = useNavigate();

  const [nombre, setNombre] = useState("");
  const [marca, setMarca] = useState("ferrari");
  const [modelo, setModelo] = useState("");
  const [dorsal, setDorsal] = useState("");
  const [error, setError] = useState("");
  const [cargando, setCargando] = useState(false);

  const usuario = auth?.usuario;
  const token = auth?.token;

  // Marcas permitidas por el backend
  const marcas = [
    "mercedes", "ferrari", "red bull", "mclaren",
    "alpine", "aston martin", "williams", "haas",
    "alfa romeo", "alphatauri", "lotus", "renault"
  ];

  async function guardar(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!usuario || !token || cargando) return;

    setError("");
    setCargando(true);

    try {
      const respuesta = await fetch("http://localhost:3000/api/coches", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          name: nombre,
          marca,
          modelo,
          dorsal: Number(dorsal),
          pilotoPrincipal: usuario.id
        })
      });

      const datos = await respuesta.json();

      if (!respuesta.ok) {
        setError(datos.errors?.[0]?.msg || datos.msg || "Error al crear el coche");
        return;
      }

      // Volver al listado
      navegar("/coches");
    } catch {
      setError("No se pudo conectar con el servidor");
    } finally {
      setCargando(false);
    }
  }

  if (!usuario || !token) return <p>Debes iniciar sesión.</p>;

  if (usuario.rol !== "admin") {
    return <p>Solo los administradores pueden crear coches.</p>;
  }

  return (
    <div>
      <h2>Crear coche</h2>

      <form onSubmit={guardar}>
        <input
          placeholder="Nombre del coche"
          value={nombre}
          onChange={e => setNombre(e.target.value)}
          minLength={2}
          required
        />

        <select value={marca} onChange={e => setMarca(e.target.value)}>
          {marcas.map(m => <option key={m} value={m}>{m}</option>)}
        </select>

        <input
          placeholder="Modelo"
          value={modelo}
          onChange={e => setModelo(e.target.value)}
          required
        />

        <input
          type="number"
          placeholder="Dorsal"
          value={dorsal}
          onChange={e => setDorsal(e.target.value)}
          min={1}
          max={999}
          required
        />

        <button type="submit" disabled={cargando}>
          {cargando ? "Guardando..." : "Guardar coche"}
        </button>
      </form>

      {error && <p>{error}</p>}

      <Link to="/coches">Volver a los coches</Link>
    </div>
  );
}

export default CrearCoche;
