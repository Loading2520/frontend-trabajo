// Datos que recibe el componente mediante props
interface Props {
  name: string;
  marca: string;
  modelo: string;
  dorsal?: number;
}
// Mostramos la información individual de cada coche
function Coche({ name, marca, modelo, dorsal }: Props) {
  return (
    <div className="coche">
      <h3>{name}</h3>
      <p>Marca: {marca}</p>
      <p>Modelo: {modelo}</p>
      {dorsal !== undefined && <p>Dorsal: {dorsal}</p>}
    </div>
  );
}

export default Coche;
