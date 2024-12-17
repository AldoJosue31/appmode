import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "../Carrito.css";

const Carrito = ({ carrito, eliminarItem, actualizarCantidad }) => {
  const [visible, setVisible] = useState(false);

  // Simula la carga completa del carrito
  useEffect(() => {
    const timeout = setTimeout(() => setVisible(true), 100);
    return () => clearTimeout(timeout);
  }, []);

  return (
    <div className={`carrito-sidebar ${visible ? "visible" : "hidden"}`}>
      <h5 className="text-center mb-4">🛒 Carrito de Compras</h5>
      {carrito.length === 0 ? (
        <p className="text-muted text-center">El carrito está vacío</p>
      ) : (
        <div>
          {carrito.map((item, index) => (
            <div
              key={index}
              className="bg-secondary text-light rounded p-2 mb-3 shadow-sm"
            >
              <div className="d-flex justify-content-between align-items-center">
                <strong>{item.tipo}</strong>
                <button
                  className="btn btn-sm btn-danger"
                  onClick={() => eliminarItem(index)}
                >
                  ✖
                </button>
              </div>
              <p className="mb-1">
                <small>
                  <strong>Marca:</strong> {item.marca}
                </small>
              </p>
              <p className="mb-1">
                <small>
                  <strong>Sub-Marca:</strong> {item.subMarca}
                </small>
              </p>
              <p className="mb-1">
                <small>
                  <strong>Tamaño:</strong> {item.tamano}
                </small>
              </p>
              <div className="d-flex justify-content-between align-items-center">
                <small>
                  <strong>Cantidad:</strong>
                </small>
                <input
                  type="number"
                  min="1"
                  value={item.cantidad}
                  onChange={(e) =>
                    actualizarCantidad(index, parseInt(e.target.value, 10))
                  }
                  className="form-control form-control-sm w-50"
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Carrito;
