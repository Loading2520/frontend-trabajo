
export interface CocheDatos {
  _id: string;
  name: string;
  imagenUrl?: string;
  marca: string;
  modelo: string;
  dorsal?: number;
  pais?: string;
  peso?: number;
  precio?: string | { $numberDecimal: string };
  activo?: boolean;
  especificaciones?: {
    motor?: string;
    cilindrada?: number;
    potencia?: number;
  };
  carrera?: {
    equipo: string;
    anio: number;
    posicion: number;
    puntos: number;
  }[];
  patrocinadores?: string[];
}

interface Props {
  coche: CocheDatos;
  cerrar: () => void;
}

function DetalleCoche({ coche, cerrar }: Props) {
  const precio = typeof coche.precio === "object"
    ? coche.precio.$numberDecimal
    : coche.precio;

  return (
    <div className="modal-fondo">
      <div className="modal">
        <h2>{coche.name}</h2>

        
        
        {coche.imagenUrl && (
        <img
            src={coche.imagenUrl}
            alt={coche.name}
            className="imagen-coche"
        />
        )}

        <p>Marca: {coche.marca}</p>
        <p>Modelo: {coche.modelo}</p>
        <p>País: {coche.pais || "Sin datos"}</p>
        <p>Dorsal: {coche.dorsal ?? "Sin datos"}</p>
        <p>Peso: {coche.peso ?? "Sin datos"} kg</p>
        <p>Precio: {precio ?? "Sin datos"}</p>
        <p>Estado: {coche.activo ? "Activo" : "Inactivo"}</p>

        <h3>Especificaciones</h3>
        <p>Motor: {coche.especificaciones?.motor || "Sin datos"}</p>
        <p>Cilindrada: {coche.especificaciones?.cilindrada ?? "Sin datos"} cc</p>
        <p>Potencia: {coche.especificaciones?.potencia ?? "Sin datos"}</p>

        <h3>Carrera</h3>
        {coche.carrera?.map((c, i) => (
          <p key={i}>
            {c.equipo} ({c.anio}) -
            Posición: {c.posicion} -
            Puntos: {c.puntos}
          </p>
        ))}

        <h3>Patrocinadores</h3>
        {coche.patrocinadores?.map((p, i) => (
          <p key={i}>{p}</p>
        ))}

        <button onClick={cerrar}>Cerrar</button>
      </div>
    </div>
  );
}

export default DetalleCoche;
