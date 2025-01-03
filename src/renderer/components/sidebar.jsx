import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import * as bootstrap from "bootstrap"; // Importar Bootstrap para los tooltips
import "../Sidebar.css";

const Sidebar = ({ onClose }) => {
  const [isOpen, setIsOpen] = useState(false);
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

  // Alternar el sidebar entre abierto y cerrado
  const toggleSidebar = () => setIsOpen((prevState) => !prevState);

  // Limpiar los tooltips existentes
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

  // Drag & Drop Handlers
  const handleDragStart = (e, id) => {
    e.dataTransfer.setData("text/plain", id);
    e.currentTarget.classList.add("dragging");
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.currentTarget.classList.add("drag-over");
  };

  const handleDragLeave = (e) => {
    e.currentTarget.classList.remove("drag-over");
  };

  const handleDrop = (e, targetId) => {
    e.preventDefault();
    const draggedId = parseInt(e.dataTransfer.getData("text/plain"), 10);
    const draggedItem = links.find((link) => link.id === draggedId);
    const targetIndex = links.findIndex((link) => link.id === targetId);
    const updatedLinks = links.filter((link) => link.id !== draggedId);
    updatedLinks.splice(targetIndex, 0, draggedItem);
    setLinks(updatedLinks);
    e.currentTarget.classList.remove("drag-over");
  };

  return (
    <div className={`sidebar ${isOpen ? "open" : "closed"}`}>
      <div className="sidebar-content">
        <div className="sidebar-header text-center p-3">
          <i className="bi bi-lightning-fill fs-1 text-primary"></i>
          {isOpen && <h4 className="text-white mt-2">Modelorama Cumbres</h4>}
        </div>
        <nav className="nav flex-column mt-4">
          {links.map(({ id, to, icon, label }) => (
            <Link
              key={id}
              to={to}
              className="nav-link text-light py-3"
              draggable
              onDragStart={(e) => handleDragStart(e, id)}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={(e) => handleDrop(e, id)}
              {...(!isOpen && { "data-bs-toggle": "tooltip", "data-bs-placement": "right", title: label })}
            >
              <i className={`bi ${icon} fs-5`}></i>
              {isOpen && <span className="ms-2">{label}</span>}
            </Link>
          ))}
        </nav>
      </div>
      <button className={`toggle-sidebar-btn ${isOpen ? "open" : "closed"}`} onClick={toggleSidebar}>
        <i className={`bi ${isOpen ? "bi-chevron-left" : "bi-chevron-right"}`}></i>
      </button>
    </div>
  );
};

export default Sidebar;
