import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import * as bootstrap from "bootstrap"; // Importar Bootstrap para los tooltips
import "../Sidebar.css";

const Sidebar = ({ onClose }) => {
  const [isOpen, setIsOpen] = useState(false);
  let tooltips = []; // Almacena referencias de tooltips

  // Alternar el sidebar entre abierto y cerrado
  const toggleSidebar = () => {
    setIsOpen((prevState) => !prevState);
  };

  // Función para cerrar el sidebar
  const closeSidebar = () => {
    setIsOpen(false);
    if (onClose) onClose();
  };

  // Limpiar los tooltips existentes
  const handleLinkClick = () => {
    tooltips.forEach((tooltip) => {
      try {
        tooltip.dispose();
      } catch (error) {
        console.error("Error al destruir tooltip: ", error);
      }
    });
    tooltips = [];
  };

  // Inicializar los tooltips cuando el sidebar está cerrado
  useEffect(() => {
    if (!isOpen) {
      const tooltipTriggerList = Array.from(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
      tooltips = tooltipTriggerList.map((tooltipTriggerEl) => new bootstrap.Tooltip(tooltipTriggerEl));
    } else {
      handleLinkClick(); // Limpiar tooltips si el sidebar se abre
    }

    return () => {
      handleLinkClick(); // Limpiar tooltips al desmontar el componente
    };
  }, [isOpen]);

  return (
    <div className={`sidebar ${isOpen ? "open" : "closed"}`}>
      <div className="sidebar-content">
        {/* Header del Sidebar */}
        <div className="sidebar-header text-center p-3">
          <i className="bi bi-lightning-fill fs-1 text-primary"></i>
          {isOpen && <h4 className="text-white mt-2">Mi Sidebar</h4>}
        </div>

        {/* Links del Sidebar */}
        <nav className="nav flex-column mt-4">
          <Link
            to="/"
            className="nav-link text-light py-3"
            onClick={() => {
              handleLinkClick();
              closeSidebar();
            }}
            {...(!isOpen && { "data-bs-toggle": "tooltip", "data-bs-placement": "right", title: "Home" })}
          >
            <i className="bi bi-house-door-fill fs-5"></i>
            {isOpen && <span className="ms-2">Home</span>}
          </Link>

          <Link
            to="/ventas"
            className="nav-link text-light py-3"
            onClick={() => {
              handleLinkClick();
              closeSidebar();
            }}
            {...(!isOpen && { "data-bs-toggle": "tooltip", "data-bs-placement": "right", title: "Ventas" })}
          >
            <i className="bi bi-cart-fill fs-5"></i>
            {isOpen && <span className="ms-2">Ventas</span>}
          </Link>

          <Link
            to="/inventario"
            className="nav-link text-light py-3"
            onClick={() => {
              handleLinkClick();
              closeSidebar();
            }}
            {...(!isOpen && { "data-bs-toggle": "tooltip", "data-bs-placement": "right", title: "Inventario" })}
          >
            <i className="bi bi-box-fill fs-5"></i>
            {isOpen && <span className="ms-2">Inventario</span>}
          </Link>

          <Link
            to="/productos"
            className="nav-link text-light py-3"
            onClick={() => {
              handleLinkClick();
              closeSidebar();
            }}
            {...(!isOpen && { "data-bs-toggle": "tooltip", "data-bs-placement": "right", title: "Productos" })}
          >
            <i className="bi bi-gift-fill fs-5"></i>
            {isOpen && <span className="ms-2">Productos</span>}
          </Link>

          <Link
            to="/promociones"
            className="nav-link text-light py-3"
            onClick={() => {
              handleLinkClick();
              closeSidebar();
            }}
            {...(!isOpen && { "data-bs-toggle": "tooltip", "data-bs-placement": "right", title: "Promociones" })}
          >
            <i className="bi bi-tags-fill fs-5"></i>
            {isOpen && <span className="ms-2">Promociones</span>}
          </Link>

          <Link
            to="/creditos"
            className="nav-link text-light py-3"
            onClick={() => {
              handleLinkClick();
              closeSidebar();
            }}
            {...(!isOpen && { "data-bs-toggle": "tooltip", "data-bs-placement": "right", title: "Créditos" })}
          >
            <i className="bi bi-credit-card-fill fs-5"></i>
            {isOpen && <span className="ms-2">Créditos a Clientes</span>}
          </Link>

          <Link
            to="/envases"
            className="nav-link text-light py-3"
            onClick={() => {
              handleLinkClick();
              closeSidebar();
            }}
            {...(!isOpen && { "data-bs-toggle": "tooltip", "data-bs-placement": "right", title: "Envases" })}
          >
            <i className="bi bi-cup-straw fs-5"></i>
            {isOpen && <span className="ms-2">Gestión de Envases</span>}
          </Link>

          <Link
            to="/reportes"
            className="nav-link text-light py-3"
            onClick={() => {
              handleLinkClick();
              closeSidebar();
            }}
            {...(!isOpen && { "data-bs-toggle": "tooltip", "data-bs-placement": "right", title: "Reportes" })}
          >
            <i className="bi bi-file-earmark-spreadsheet-fill fs-5"></i>
            {isOpen && <span className="ms-2">Reportes</span>}
          </Link>

          <Link
            to="/configuracion"
            className="nav-link text-light py-3"
            onClick={() => {
              handleLinkClick();
              closeSidebar();
            }}
            {...(!isOpen && { "data-bs-toggle": "tooltip", "data-bs-placement": "right", title: "Configuración" })}
          >
            <i className="bi bi-gear-fill fs-5"></i>
            {isOpen && <span className="ms-2">Configuración</span>}
          </Link>
        </nav>

        {/* Selector */}
        <div className={`mt-auto p-3 ${isOpen ? "" : "text-center"}`}>
          {isOpen ? (
            <div className="form-group">
              <label htmlFor="selector" className="text-light mb-2">
                Atiende:
              </label>
              <select id="selector" className="form-select bg-dark text-light border-secondary">
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

      {/* Toggle Button */}
      <button className={`toggle-sidebar-btn ${isOpen ? "open" : "closed"}`} onClick={toggleSidebar}>
        <i className={`bi ${isOpen ? "bi-chevron-left" : "bi-chevron-right"}`}></i>
      </button>
    </div>
  );
};

export default Sidebar;
