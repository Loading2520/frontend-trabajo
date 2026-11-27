
import { useState, useContext } from "react";
import { Link } from "react-router";
import { AuthContext } from "../context/AuthContext";
import DetalleCoche from "./DetalleCoche";
import type { CocheDatos } from "./DetalleCoche";

interface Props {
  coche: CocheDatos;
  onEliminar: () => void;
}

function Coche({ coche, onEliminar }: Props) {
  const [abierto, setAbierto] = useState(false);
  const auth = useContext(AuthContext);

  return (
    <div className="coche">
      <h3>{coche.name}</h3>
      <p>Marca: {coche.marca}</p>
      <p>Modelo: {coche.modelo}</p>

      <button onClick={() => setAbierto(true)}>
        Ver detalles
      </button>

      {/* Opciones para administradores */}
      {auth?.usuario?.rol === "admin" && (
        <>
          <Link to={`/coches/${coche._id}/editar`}>
            Editar
          </Link>

          <button onClick={onEliminar}>
            Eliminar
          </button>
        </>
      )}

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
