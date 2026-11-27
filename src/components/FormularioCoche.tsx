
import { useState } from "react";
import type { ChangeEvent, FormEvent } from "react";

// Datos del formulario
export interface DatosFormulario {
  name: string;
  marca: string;
  modelo: string;
  dorsal: string;
  imagenUrl: string;
}

interface Props {
  inicial?: DatosFormulario;
  onGuardar: (datos: DatosFormulario) => Promise<void>;
  guardando: boolean;
  textoBoton: string;
}

function FormularioCoche({ inicial, onGuardar, guardando, textoBoton }: Props) {
  const [datos, setDatos] = useState<DatosFormulario>(
    inicial || {
      name: "",
      marca: "ferrari",
      modelo: "",
      dorsal: "",
      imagenUrl: ""
    }
  );

  const marcas = [
    "mercedes", "ferrari", "red bull", "mclaren",
    "alpine", "aston martin", "williams", "haas",
    "alfa romeo", "alphatauri", "lotus", "renault"
  ];

  // Actualizar los campos
  function cambiar(e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    setDatos({ ...datos, [e.target.name]: e.target.value });
  }

  // Enviar los datos al componente padre
  async function enviar(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    await onGuardar(datos);
  }

  return (
    <form onSubmit={enviar}>
      <input name="name" placeholder="Nombre del coche" value={datos.name} onChange={cambiar} minLength={2}required/>

      <select name="marca" value={datos.marca} onChange={cambiar}>
        {marcas.map(m => (
          <option key={m} value={m}>{m}</option>
        ))}
      </select>

      <input name="modelo" placeholder="Modelo" value={datos.modelo} onChange={cambiar} required/>

      <input name="dorsal" type="number" placeholder="Dorsal" value={datos.dorsal} onChange={cambiar} min={1} max={999} required/>

      <input name="imagenUrl" type="url" placeholder="URL de la imagen" value={datos.imagenUrl} onChange={cambiar}/>

      {datos.imagenUrl && (
        <img src={datos.imagenUrl} alt="Vista previa del coche" width="200" />
      )}

      <button type="submit" disabled={guardando}>
        {guardando ? "Guardando..." : textoBoton}
      </button>
    </form>
  );
}

export default FormularioCoche;
