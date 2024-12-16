import { MemoryRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { CSSTransition, TransitionGroup } from "react-transition-group";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import Sidebar from "./components/sidebar";
import Home from "./views/Home";
import Ventas from "./views/Ventas";
import Inventario from "./views/Inventario";
import Productos from "./views/Productos";
import Promociones from "./views/Promociones";
import Creditos from "./views/Creditos";
import Envases from "./views/Envases";
import Reportes from "./views/Reportes";
import Configuracion from "./views/Configuracion";

function AnimatedRoutes() {
  const location = useLocation();

  return (
    <TransitionGroup>
      <CSSTransition
        key={location.key}
        classNames="fade"
        timeout={300}
      >
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/ventas" element={<Ventas />} />
        <Route path="/inventario" element={<Inventario />} />
        <Route path="/productos" element={<Productos />} />
        <Route path="/promociones" element={<Promociones />} />
        <Route path="/creditos" element={<Creditos />} />
        <Route path="/envases" element={<Envases />} />
        <Route path="/reportes" element={<Reportes />} />
        <Route path="/configuracion" element={<Configuracion />} />
      </Routes>
      </CSSTransition>
    </TransitionGroup>
  );
}

function Layout() {
  return (
    <div id="app-container" className="d-flex">
      <Sidebar />
      <div className="flex-grow-1 p-3" style={{ marginLeft: "60px" }}>
        <AnimatedRoutes />
      </div>
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <Layout />
    </Router>
  );
}
