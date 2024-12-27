import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "../Carrito.css";

const Carrito = ({ carrito, eliminarItem, actualizarCantidad }) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => setVisible(true), 100);
    return () => clearTimeout(timeout);
  }, []);

  const calcularTotal = () =>
    carrito.reduce((total, item) => {
      if (item.piezasPorCarton && item.precioPorCarton) {
        // Si el producto se vende por cartón, calcular el total basado en el precio por cartón
        return total + item.precioPorCarton * item.cantidad;
      } else {
        // Caso contrario, usar el precio unitario
        return total + item.precioPorUnidad * item.cantidad;
      }
    }, 0);

  return (
    <div className={`carrito-sidebar ${visible ? "visible" : "hidden"}`}>
      <h5 className="text-center mb-4">🛒 Carrito de Compras</h5>
      {carrito.length === 0 ? (
        <p className="text-muted text-center">El carrito está vacío</p>
      ) : (
        <div>
          {carrito.map((item, index) => {
            const precioTexto = item.piezasPorCarton
              ? `Cartón (${item.piezasPorCarton} piezas): $${item.precioPorCarton.toFixed(2)}`
              : `Unidad: $${item.precioPorUnidad.toFixed(2)}`;

            return (
              <div
                key={index}
                className="cart-item bg-dark text-light rounded p-3 mb-3 shadow"
              >
                <div className="cart-item-header d-flex justify-content-between align-items-center mb-2">
                  <span className="item-type text-uppercase fw-bold">
                    {item.tipo}
                  </span>
                  <button
                    className="btn btn-sm btn-outline-danger rounded-circle"
                    onClick={() => eliminarItem(index)}
                    title="Eliminar"
                  >
                    ✖
                  </button>
                </div>
                <div className="cart-item-body">
                  <p className="mb-1">
                    <span className="item-label">Marca:</span> {item.marca}
                  </p>
                  <p className="mb-1">
                    <span className="item-label">Sub-Marca:</span>{" "}
                    {item.subMarca}
                  </p>
                  {item.tamano && (
                    <p className="mb-1">
                      <span className="item-label">Tamaño:</span> {item.tamano}
                    </p>
                  )}
                  <p className="mb-1">
                    <span className="item-label">Precio:</span> {precioTexto}
                  </p>
                </div>
                <div className="cart-item-footer d-flex justify-content-between align-items-center mt-3">
                  <span className="item-label">Cantidad:</span>
                  <input
                    type="number"
                    min="1"
                    value={item.cantidad}
                    onChange={(e) =>
                      actualizarCantidad(index, parseInt(e.target.value, 10))
                    }
                    className="form-control form-control-sm bg-secondary text-light border-0 w-25 text-center"
                  />
                </div>
              </div>
            );
          })}
          <div className="total-section text-center mt-4">
            <h5 className="text-light">
              Total:{" "}
              <span className="text-success">
                ${calcularTotal().toFixed(2)}
              </span>
            </h5>
          </div>
        </div>
      )}
    </div>
  );
};

export default Carrito;
