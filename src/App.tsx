
import { useState } from "react";
import Login from "./components/Login";
import ListaCoches from "./components/ListaCoches";
import "./App.css";

function App() {
  const [login, setLogin] = useState(false);

  return (
    <div className="contenedor">
      {!login ? (
        <Login onLogin={() => setLogin(true)} />
      ) : (
        <>
          <h1>GRIDLINE</h1>

          <button onClick={() => setLogin(false)}>
            Cerrar sesión
          </button>

          <ListaCoches />
        </>
      )}
    </div>
  );
}

export default App;
