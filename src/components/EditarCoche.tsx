
import { useState, useEffect, useContext } from "react";
import { useParams, useNavigate, Link } from "react-router";
import { AuthContext } from "../context/AuthContext";
import FormularioCoche from "./FormularioCoche";
import type { DatosFormulario } from "./FormularioCoche";

function EditarCoche() {
  const { id } = useParams();
  const navegar = useNavigate();
  const auth = useContext(AuthContext);

  const [inicial, setInicial] = useState<DatosFormulario | null>(null);
  const [cargando, setCargando] = useState(true);
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState("");

  // Cargar el coche por su ID
  useEffect(() => {
    const controller = new AbortController();

    async function cargar() {
      setCargando(true);
      setInicial(null);
      setError("");

      try {
        const respuesta = await fetch(
          `http://localhost:3000/api/coches/${id}`,
          { signal: controller.signal }
        );

        if (!respuesta.ok) throw new Error("Error al cargar");

        const resultado = await respuesta.json();
        const coche = resultado.data;

        if (controller.signal.aborted) return;

        setInicial({
          name: coche.name,
          marca: coche.marca,
          modelo: coche.modelo,
          dorsal: String(coche.dorsal),
          imagenUrl: coche.imagenUrl || ""
        });
      } catch {
        if (!controller.signal.aborted) {
          setError("No se pudo cargar el coche");
        }
      } finally {
        if (!controller.signal.aborted) {
          setCargando(false);
        }
      }
    }

    cargar();

    return () => controller.abort();
  }, [id]);

  // Actualizar coche con PUT
  async function editar(datos: DatosFormulario) {
    if (!auth?.token || guardando) return;

    setGuardando(true);
    setError("");

    try {
      const respuesta = await fetch(
        `http://localhost:3000/api/coches/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${auth.token}`
          },
          body: JSON.stringify({
            ...datos,
            dorsal: Number(datos.dorsal)
          })
        }
      );

      const resultado = await respuesta.json();

      if (!respuesta.ok) {
        setError(resultado.errors?.[0]?.msg || resultado.msg || "Error al editar");
        return;
      }

      navegar("/coches");
    } catch {
      setError("No se pudo conectar con el servidor");
    } finally {
      setGuardando(false);
    }
  }

  if (auth?.usuario?.rol !== "admin") {
    return <p>No tienes permisos para editar coches.</p>;
  }

  if (cargando) return <p>Cargando coche...</p>;

  if (!inicial) return <p>{error || "Coche no encontrado"}</p>;

  return (
    <div>
      <h2>Editar coche</h2>

      <FormularioCoche
        inicial={inicial}
        onGuardar={editar}
        guardando={guardando}
        textoBoton="Guardar cambios"
      />

      {error && <p>{error}</p>}

      <Link to="/coches">Volver a los coches</Link>
    </div>
  );
}

export default EditarCoche;
