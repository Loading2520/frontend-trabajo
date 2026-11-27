
import { useState, useContext } from "react";
import { Link, useNavigate } from "react-router";
import { AuthContext } from "../context/AuthContext";
import FormularioCoche from "./FormularioCoche";
import type { DatosFormulario } from "./FormularioCoche";

function CrearCoche() {
  const auth = useContext(AuthContext);
  const navegar = useNavigate();

  const [error, setError] = useState("");
  const [guardando, setGuardando] = useState(false);

  // Crear coche con POST
  async function crear(datos: DatosFormulario) {
    if (!auth?.token || !auth.usuario || guardando) return;

    setGuardando(true);
    setError("");

    try {
      const respuesta = await fetch("http://localhost:3000/api/coches", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${auth.token}`
        },
        body: JSON.stringify({
          ...datos,
          dorsal: Number(datos.dorsal),
          pilotoPrincipal: auth.usuario.id
        })
      });

      const resultado = await respuesta.json();

      if (!respuesta.ok) {
        setError(resultado.errors?.[0]?.msg || resultado.msg || "Error al crear coche");
        return;
      }

      navegar("/coches");
    } catch {
      setError("No se pudo conectar con el servidor");
    } finally {
      setGuardando(false);
    }
  }

  if (auth?.usuario?.rol !== "admin" || !auth.token) {
    return <p>No tienes permisos para crear coches.</p>;
  }

  return (
    <div>
      <h2>Crear coche</h2>

      <FormularioCoche
        onGuardar={crear}
        guardando={guardando}
        textoBoton="Crear coche"
      />

      {error && <p>{error}</p>}

      <Link to="/coches">Volver a los coches</Link>
    </div>
  );
}

export default CrearCoche;
