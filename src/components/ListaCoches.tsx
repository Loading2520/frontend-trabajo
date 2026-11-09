
import { useEffect, useState } from "react";

interface Coche {
  _id: string;
  name: string;
  marca: string;
  modelo: string;
}

function ListaCoches() {
  const [coches, setCoches] = useState<Coche[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("http://localhost:3000/api/coches?limit=100")
      .then(res => {
        if (!res.ok) {
          throw new Error("Error al obtener coches");
        }
        return res.json();
      })
      .then(datos => setCoches(datos.data.coches))
      .catch(() => setError("No se pudieron cargar los coches"));
  }, []);

  return (
    <div>
      <h2>Listado de coches</h2>

      {error && <p>{error}</p>}

      {coches.map(coche => (
        <div className="coche" key={coche._id}>
          <h3>{coche.name}</h3>
          <p>{coche.marca} - {coche.modelo}</p>
        </div>
      ))}
    </div>
  );
}

export default ListaCoches;
