
import { useContext } from "react";
import { Routes, Route, Navigate, Link } from "react-router";
import { AuthContext } from "./context/AuthContext";
import Login from "./components/Login";
import ListaCoches from "./components/ListaCoches";
import CrearCoche from "./components/CrearCoche";
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

        {/* Listado de coches */}
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

                {/* Solo administradores */}
                {auth.usuario.rol === "admin" && (
                  <p>
                    <Link to="/coches/nuevo">Crear coche</Link>
                  </p>
                )}

                <ListaCoches />
              </>
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

        {/* Crear coche */}
        <Route
          path="/coches/nuevo"
          element={
            auth.usuario?.rol === "admin" ? (
              <CrearCoche />
            ) : (
              <Navigate to="/coches" replace />
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
