
import { useEffect, useState } from "react";
import Coche from "./Coche";

interface CocheDatos {
  _id: string;
  name: string;
  marca: string;
  modelo: string;
  dorsal?: number;
}

function ListaCoches() {
  const [coches, setCoches] = useState<CocheDatos[]>([]);
  const [busqueda, setBusqueda] = useState("");
  const [marca, setMarca] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("http://localhost:3000/api/coches?limit=100")
      .then(res => {
        if (!res.ok) throw new Error("Error al cargar coches");
        return res.json();
      })
      .then(datos => setCoches(datos.data.coches))
      .catch(() => setError("No se pudieron cargar los coches"));
  }, []);

  // Obtener las marcas disponibles
  const marcas = [...new Set(coches.map(coche => coche.marca))]
    .filter(Boolean)
    .sort();

  // Aplicar buscador y filtro de marca
  const cochesFiltrados = coches.filter(coche =>
    (coche.name.toLowerCase().includes(busqueda.toLowerCase()) ||
     coche.marca.toLowerCase().includes(busqueda.toLowerCase())) &&
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
          name={coche.name}
          marca={coche.marca}
          modelo={coche.modelo}
          dorsal={coche.dorsal}
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
