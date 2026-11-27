
import { useState, useEffect, useContext } from "react";
import type { FormEvent } from "react";
import { useParams, useNavigate, Link } from "react-router";
import { AuthContext } from "../context/AuthContext";

interface Usuario {
  _id: string;
  nombre: string;
  apellidos: string;
  email: string;
}

function EditarUsuario() {
  const { id } = useParams();
  const navegar = useNavigate();
  const auth = useContext(AuthContext);

  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [error, setError] = useState("");
  const [guardando, setGuardando] = useState(false);

  // Cargar el usuario
  useEffect(() => {
    const controller = new AbortController();

    fetch(`http://localhost:3000/api/usuarios/${id}`, {
      headers: {
        Authorization: `Bearer ${auth?.token}`
      },
      signal: controller.signal
    })
      .then(res => {
        if (!res.ok) throw new Error();
        return res.json();
      })
      .then(datos => {
        setUsuario({
          ...datos.data,
          apellidos: datos.data.apellidos || ""
        });
        setError("");
      })
      .catch(() => {
        if (!controller.signal.aborted) {
          setError("No se pudo cargar el usuario");
        }
      });

    return () => controller.abort();
  }, [id, auth?.token]);

  // Guardar cambios
  async function guardar(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!usuario || !auth?.token || guardando) return;

    setGuardando(true);
    setError("");

    try {
      const respuesta = await fetch(
        `http://localhost:3000/api/usuarios/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${auth.token}`
          },
          body: JSON.stringify({
            nombre: usuario.nombre,
            apellidos: usuario.apellidos,
            email: usuario.email
          })
        }
      );

      const datos = await respuesta.json();

      if (!respuesta.ok) {
        setError(datos.msg || "No se pudo editar el usuario");
        return;
      }

      navegar("/usuarios");
    } catch {
      setError("Error al conectar con el servidor");
    } finally {
      setGuardando(false);
    }
  }

  if (!usuario || usuario._id !== id) {
    return <p>{error || "Cargando usuario..."}</p>;
  }

  return (
    <div>
      <h2>Editar usuario</h2>

      <form onSubmit={guardar}>
        <input
          placeholder="Nombre"
          value={usuario.nombre}
          onChange={e => setUsuario({
            ...usuario, nombre: e.target.value
          })}
          required
        />

        <input
          placeholder="Apellidos"
          value={usuario.apellidos}
          onChange={e => setUsuario({
            ...usuario, apellidos: e.target.value
          })}
        />

        <input
          type="email"
          placeholder="Correo"
          value={usuario.email}
          onChange={e => setUsuario({
            ...usuario, email: e.target.value
          })}
          required
        />

        <button type="submit" disabled={guardando}>
          {guardando ? "Guardando..." : "Guardar cambios"}
        </button>
      </form>

      {error && <p>{error}</p>}

      <Link to="/usuarios">Volver a usuarios</Link>
    </div>
  );
}

export default EditarUsuario;
