
import { useContext } from "react";
import { AuthContext } from "./context/AuthContext";
import Login from "./components/Login";
import ListaCoches from "./components/ListaCoches";
import "./App.css";

function App() {
  // Obtener la sesión del contexto
  const auth = useContext(AuthContext);

  if (!auth) return null;

  return (
    <div className="contenedor">
      {!auth.usuario ? (
        <Login />
      ) : (
        <>
          <h1>GRIDLINE</h1>

          <p>Bienvenido, {auth.usuario.nombre}</p>

          <button onClick={auth.cerrarSesion}>
            Cerrar sesión
          </button>

          <ListaCoches />
        </>
      )}
    </div>
  );
}

export default App;
