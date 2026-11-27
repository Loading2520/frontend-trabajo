
import { useState, useEffect, useContext } from "react";
import { Link } from "react-router";
import { AuthContext } from "../context/AuthContext";

// Datos de un usuario
interface Usuario {
  _id: string;
  nombre: string;
  email: string;
  rol: string;
}

function ListaUsuarios() {
  const auth = useContext(AuthContext);
  const token = auth?.token;

  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");

  // Cargar usuarios del backend
  useEffect(() => {
    const controller = new AbortController();

    async function cargar() {
      try {
        const respuesta = await fetch(
          "http://localhost:3000/api/usuarios?limit=100",
          {
            headers: {
              Authorization: `Bearer ${token}`
            },
            signal: controller.signal
          }
        );

        if (!respuesta.ok) throw new Error();

        const datos = await respuesta.json();

        if (!controller.signal.aborted) {
          setUsuarios(datos.data.usuarios);
        }
      } catch {
        if (!controller.signal.aborted) {
          setError("No se pudieron cargar los usuarios");
        }
      } finally {
        if (!controller.signal.aborted) {
          setCargando(false);
        }
      }
    }

    if (token) {
      cargar();
    }

    return () => controller.abort();
  }, [token]);

  if (cargando) return <p>Cargando usuarios...</p>;

  return (
    <div>
      <h2>Listado de usuarios</h2>
      <p>
       <Link to="/usuarios/nuevo">Crear usuario</Link>
      </p>

      {error && <p>{error}</p>}

      <p>Usuarios mostrados: {usuarios.length}</p>

        {usuarios.map(usuario => (
        <div className="coche" key={usuario._id}>
            <h3>{usuario.nombre}</h3>
            <p>Correo: {usuario.email}</p>
            <p>Rol: {usuario.rol}</p>

            <Link to={`/usuarios/${usuario._id}/editar`}>
            Editar
            </Link>
        </div>
        ))}

      {!error && usuarios.length === 0 && (
        <p>No hay usuarios registrados.</p>
      )}

      <Link to="/coches">Volver a los coches</Link>
    </div>
  );
}

export default ListaUsuarios;
