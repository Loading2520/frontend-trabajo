
import { useEffect, useState, useContext } from "react";
import Coche from "./Coche";
import type { CocheDatos } from "./DetalleCoche";
import { AuthContext } from "../context/AuthContext";

function ListaCoches() {
  const [coches, setCoches] = useState<CocheDatos[]>([]);
  const [busqueda, setBusqueda] = useState("");
  const [marca, setMarca] = useState("");
  const [error, setError] = useState("");
  const [recargar, setRecargar] = useState(0);

  const auth = useContext(AuthContext);

  // Cargar coches del backend
  useEffect(() => {
    const controller = new AbortController();

    fetch("http://localhost:3000/api/coches?limit=100", {
      signal: controller.signal
    })
      .then(res => {
        if (!res.ok) throw new Error("Error al cargar coches");
        return res.json();
      })
      .then(datos => {
        setCoches(datos.data.coches);
        setError("");
      })
      .catch(() => {
        if (!controller.signal.aborted) {
          setError("No se pudieron cargar los coches");
        }
      });

    return () => controller.abort();
  }, [recargar]);

  // Eliminar coche
  async function eliminarCoche(coche: CocheDatos) {
    if (!auth?.token || auth.usuario?.rol !== "admin") return;

    if (!window.confirm(`¿Eliminar ${coche.name}?`)) return;

    try {
      const respuesta = await fetch(
        `http://localhost:3000/api/coches/${coche._id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${auth.token}`
          }
        }
      );

      if (!respuesta.ok) throw new Error();

      // Volver a cargar los coches
      setRecargar(valor => valor + 1);
      setError("");

    } catch {
      setError("No se pudo eliminar el coche");
    }
  }

  // Obtener las marcas disponibles
  const marcas = [...new Set(coches.map(coche => coche.marca))]
    .filter(Boolean)
    .sort();

  // Aplicar buscador y filtro de marca
  const cochesFiltrados = coches.filter(coche =>
    ((coche.name ?? "").toLowerCase().includes(busqueda.toLowerCase()) ||
     (coche.marca ?? "").toLowerCase().includes(busqueda.toLowerCase())) &&
    (marca === "" || coche.marca === marca)
  );

  return (
    <div>
      <h2>Listado de coches</h2>

      <input
        type="text"
        placeholder="Buscar coche..."
        value={busqueda}
        onChange={e => setBusqueda(e.target.value)}
      />

      <select
        value={marca}
        onChange={e => setMarca(e.target.value)}
      >
        <option value="">Todas las marcas</option>

        {marcas.map(m => (
          <option key={m} value={m}>
            {m}
          </option>
        ))}
      </select>

      {error && <p>{error}</p>}

      <p>Resultados: {cochesFiltrados.length}</p>

      {cochesFiltrados.map(coche => (
        <Coche
          key={coche._id}
          coche={coche}
          onEliminar={() => eliminarCoche(coche)}
        />
      ))}

      {!error && coches.length > 0 &&
        cochesFiltrados.length === 0 && (
          <p>No se encontraron coches.</p>
        )}
    </div>
  );
}

export default ListaCoches;
