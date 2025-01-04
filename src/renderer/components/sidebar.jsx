import React, { useState, useEffect, useCallback } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import * as bootstrap from "bootstrap"; // Importar Bootstrap para los tooltips
import "../Sidebar.css";

const Sidebar = ({ onClose }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [links, setLinks] = useState([
    { id: 1, to: "/", icon: "bi-house-door-fill", label: "Home" },
    { id: 2, to: "/ventas", icon: "bi-cart-fill", label: "Ventas" },
    { id: 3, to: "/inventario", icon: "bi-box-fill", label: "Inventario" },
    { id: 4, to: "/productos", icon: "bi-gift-fill", label: "Productos" },
    { id: 5, to: "/promociones", icon: "bi-tags-fill", label: "Promociones" },
    { id: 6, to: "/creditos", icon: "bi-credit-card-fill", label: "Créditos" },
    { id: 7, to: "/envases", icon: "bi-cup-straw", label: "Envases" },
    { id: 8, to: "/reportes", icon: "bi-file-earmark-spreadsheet-fill", label: "Reportes" },
    { id: 9, to: "/configuracion", icon: "bi-gear-fill", label: "Configuración" },
  ]);
  let tooltips = [];
  let scrollTimeout = null;

  const toggleSidebar = () => setIsOpen((prevState) => !prevState);

  const handleLinkClick = () => {
    tooltips.forEach((tooltip) => tooltip.dispose?.());
    tooltips = [];
  };

  useEffect(() => {
    if (!isOpen) {
      const tooltipTriggerList = Array.from(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
      tooltips = tooltipTriggerList.map((el) => new bootstrap.Tooltip(el));
    } else {
      handleLinkClick();
    }
    return handleLinkClick;
  }, [isOpen]);

  useEffect(() => {
    const currentIndex = links.findIndex((link) => link.to === location.pathname);
    if (currentIndex !== -1 && currentIndex !== activeIndex) {
      setActiveIndex(currentIndex);
    }
  }, [location.pathname, links, activeIndex]);

  const handleScroll = useCallback(
    (e) => {
      if (scrollTimeout) return;

      const delta = e.deltaY;
      let newIndex = activeIndex;

      if (delta > 0 && activeIndex < links.length - 1) {
        newIndex = activeIndex + 1;
      } else if (delta < 0 && activeIndex > 0) {
        newIndex = activeIndex - 1;
      }

      if (newIndex !== activeIndex) {
        setActiveIndex(newIndex);
        navigate(links[newIndex].to);
      }

      scrollTimeout = setTimeout(() => {
        scrollTimeout = null;
      }, 200);
    },
    [activeIndex, links, navigate]
  );

  return (
    <div className={`sidebar ${isOpen ? "open" : "closed"}`} onWheel={handleScroll}>
      <div className="sidebar-content">
        <div className="sidebar-header text-center p-3">
          <i className="bi bi-lightning-fill fs-1 text-primary"></i>
          {isOpen && <h4 className="text-white mt-2">Modelorama Cumbres</h4>}
        </div>
        <nav className="nav flex-column mt-4">
          {links.map(({ id, to, icon, label }, index) => (
            <Link
              key={id}
              to={to}
              className={`nav-link text-light py-3 ${index === activeIndex ? "active" : ""}`}
              onClick={() => {
                setActiveIndex(index);
                navigate(to);
              }}
              {...(!isOpen && { "data-bs-toggle": "tooltip", "data-bs-placement": "right", title: label })}
            >
              <i className={`bi ${icon} fs-5`}></i>
              {isOpen && <span className="ms-2">{label}</span>}
            </Link>
          ))}
        </nav>

        {/* Selector */}
        <div className={`mt-auto p-3 ${isOpen ? "" : "text-center"}`}>
          {isOpen ? (
            <div className="form-group">
              <label htmlFor="selector" className="text-light mb-2">
                Atiende:
              </label>
              <select
                id="selector"
                className="form-select bg-dark text-light border-secondary"
              >
                <option value="1">Yamil</option>
                <option value="2">Aldo</option>
                <option value="3">Consuelo</option>
              </select>
            </div>
          ) : (
            <i className="bi bi-three-dots text-light fs-4"></i>
          )}
        </div>
      </div>
      <button className={`toggle-sidebar-btn ${isOpen ? "open" : "closed"}`} onClick={toggleSidebar}>
        <i className={`bi ${isOpen ? "bi-chevron-left" : "bi-chevron-right"}`}></i>
      </button>
    </div>
  );
};

export default Sidebar;
