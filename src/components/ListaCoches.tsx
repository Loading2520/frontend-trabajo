
import { useEffect, useState } from "react";

interface Coche {
  _id: string;
  name: string;
  marca: string;
  modelo: string;
}

function ListaCoches() {
  const [coches, setCoches] = useState<Coche[]>([]);
  const [busqueda, setBusqueda] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("http://localhost:3000/api/coches?limit=100")
      .then(res => {
        if (!res.ok) throw new Error("Error al obtener coches");
        return res.json();
      })
      .then(datos => setCoches(datos.data.coches))
      .catch(() => setError("No se pudieron cargar los coches"));
  }, []);

  // Filtrar coches por nombre o marca
  const cochesFiltrados = coches.filter(coche =>
    coche.name.toLowerCase().includes(busqueda.toLowerCase()) ||
    coche.marca.toLowerCase().includes(busqueda.toLowerCase())
  );

  return (
    <div>
      <h2>Listado de coches</h2>

      <input
        type="text"
        placeholder="Buscar por nombre o marca..."
        value={busqueda}
        onChange={e => setBusqueda(e.target.value)}
      />

      {error && <p>{error}</p>}

      <p>Resultados: {cochesFiltrados.length}</p>

      {cochesFiltrados.map(coche => (
        <div className="coche" key={coche._id}>
          <h3>{coche.name}</h3>
          <p>{coche.marca} - {coche.modelo}</p>
        </div>
      ))}

      {!error && cochesFiltrados.length === 0 && (
        <p>No se encontraron coches.</p>
      )}
    </div>
  );
}

export default ListaCoches;
