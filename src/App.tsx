
import { useContext } from "react";
import { Routes, Route, Navigate } from "react-router";
import { AuthContext } from "./context/AuthContext";
import Login from "./components/Login";
import ListaCoches from "./components/ListaCoches";
import "./App.css";

function App() {
  const auth = useContext(AuthContext);

  if (!auth) return null;

  // Esperar mientras comprobamos el token
  if (auth.comprobando) {
    return <p>Comprobando sesión...</p>;
  }

  return (
    <div className="contenedor">
      <Routes>
        {/* Página de inicio */}
        <Route
          path="/"
          element={<Navigate to={auth.usuario ? "/coches" : "/login"} replace />}
        />

        {/* Login */}
        <Route
          path="/login"
          element={auth.usuario ? <Navigate to="/coches" replace /> : <Login />}
        />

        {/* Ruta privada */}
        <Route
          path="/coches"
          element={
            auth.usuario ? (
              <>
                <h1>GRIDLINE</h1>
                <p>Bienvenido, {auth.usuario.nombre}</p>

                <button onClick={auth.cerrarSesion}>
                  Cerrar sesión
                </button>

                <ListaCoches />
              </>
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

        {/* Otras direcciones */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}

export default App;
