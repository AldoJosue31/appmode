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
    carrito.reduce((total, item) => total + item.precioPorVenta, 0);

  

  return (
    <div className={`carrito-sidebar ${visible ? "visible" : "hidden"}`}>
      <h5 className="text-center mb-4">🛒 Carrito de Compras</h5>
      {carrito.length === 0 ? (
        <p className="text-muted text-center">El carrito está vacío</p>
      ) : (
        <div>
          {carrito.map((item, index) => {
const precioTexto = item.tipoVenta === "cartón"
? `Precio por Cartón: $${(item.precioUnitario * 24).toFixed(2)}`
: item.tipoVenta === "six"
? `Precio por Six: $${(item.precioUnitario * 6).toFixed(2)}`
: `Precio por Unidad: $${item.precioUnitario.toFixed(2)}`;


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
                    <span className="item-label">Precio por unidad:</span>{" "}
                    {precioTexto}
                  </p>
                </div>
                <div className="cart-item-footer d-flex justify-content-between align-items-center mt-3">
                  <span className="item-label">Cantidad:</span>
                  <input
  type="number"
  min="1"
  value={item.cantidad}
  onChange={(e) => {
    const nuevaCantidad = parseInt(e.target.value, 10);
    if (!isNaN(nuevaCantidad)) {
      actualizarCantidad(index, nuevaCantidad);
    }
  }}
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
