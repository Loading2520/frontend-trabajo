
import { useState } from "react";
import DetalleCoche from "./DetalleCoche";
import type { CocheDatos } from "./DetalleCoche";

interface Props {
  coche: CocheDatos;
}

function Coche({ coche }: Props) {
  // Controlamos si el modal está abierto
  const [abierto, setAbierto] = useState(false);

  return (
    <div className="coche">
      <h3>{coche.name}</h3>
      <p>Marca: {coche.marca}</p>
      <p>Modelo: {coche.modelo}</p>

      <button onClick={() => setAbierto(true)}>
        Ver detalles
      </button>

      {abierto && (
        <DetalleCoche
          coche={coche}
          cerrar={() => setAbierto(false)}
        />
      )}
    </div>
  );
}

export default Coche;
