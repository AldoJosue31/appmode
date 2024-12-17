import React, { useState } from "react";
import Carrito from "../components/Carrito";
import "bootstrap/dist/css/bootstrap.min.css";

const Ventas = () => {
  const [tipo, setTipo] = useState("");
  const [marcaSeleccionada, setMarcaSeleccionada] = useState("");
  const [subMarcaSeleccionada, setSubMarcaSeleccionada] = useState("");
  const [tamanoSeleccionado, setTamanoSeleccionado] = useState("");
  const [cantidad, setCantidad] = useState(1);
  const [carrito, setCarrito] = useState([]);

  const cervezas = {
    Victoria: ["Normal", "Chamoy", "Cempasúchil"],
    Corona: ["Extra", "Light", "Cero"],
    Modelo: ["Especial", "Negra"],
  };

  const productos = {
    Sabritas: ["Rancheritos", "Doritos", "Tostitos"],
    Marinela: ["Gansito", "Chocorroles"],
  };

  const tamanos = ["Lata 330", "Lata 473", "Vidrio 355", "Vidrio 940"];

  const agregarAlCarrito = () => {
    if (tipo && marcaSeleccionada && subMarcaSeleccionada && cantidad > 0) {
      const nuevoItem = {
        tipo,
        marca: marcaSeleccionada,
        subMarca: subMarcaSeleccionada,
        tamano: tamanoSeleccionado,
        cantidad,
      };
      setCarrito([...carrito, nuevoItem]);
      limpiarSeleccion();
    }
  };

  const limpiarSeleccion = () => {
    setMarcaSeleccionada("");
    setSubMarcaSeleccionada("");
    setTamanoSeleccionado("");
    setCantidad(1);
  };

  const eliminarItem = (index) => {
    const nuevoCarrito = carrito.filter((_, i) => i !== index);
    setCarrito(nuevoCarrito);
  };

  const actualizarCantidad = (index, nuevaCantidad) => {
    const nuevoCarrito = [...carrito];
    nuevoCarrito[index].cantidad = nuevaCantidad;
    setCarrito(nuevoCarrito);
  };

  return (
    <div className="main-content">
      <h1>Registro de Ventas</h1>

      {/* Formulario para seleccionar productos */}
      <div className="mb-4">
        <select
          className="form-select mb-2"
          value={tipo}
          onChange={(e) => setTipo(e.target.value)}
        >
          <option value="">Seleccionar Tipo</option>
          <option value="Cerveza">Cerveza</option>
          <option value="Producto">Producto</option>
        </select>

        {tipo === "Cerveza" && (
          <div>
            <select
              className="form-select mb-2"
              value={marcaSeleccionada}
              onChange={(e) => setMarcaSeleccionada(e.target.value)}
            >
              <option value="">Seleccionar Marca</option>
              {Object.keys(cervezas).map((marca) => (
                <option key={marca} value={marca}>
                  {marca}
                </option>
              ))}
            </select>

            {marcaSeleccionada && (
              <>
                <select
                  className="form-select mb-2"
                  value={subMarcaSeleccionada}
                  onChange={(e) => setSubMarcaSeleccionada(e.target.value)}
                >
                  <option value="">Seleccionar Sub-Marca</option>
                  {cervezas[marcaSeleccionada].map((subMarca, index) => (
                    <option key={index} value={subMarca}>
                      {subMarca}
                    </option>
                  ))}
                </select>

                <select
                  className="form-select mb-2"
                  value={tamanoSeleccionado}
                  onChange={(e) => setTamanoSeleccionado(e.target.value)}
                >
                  <option value="">Seleccionar Tamaño</option>
                  {tamanos.map((tamano, index) => (
                    <option key={index} value={tamano}>
                      {tamano}
                    </option>
                  ))}
                </select>

                <input
                  type="number"
                  className="form-control mb-2"
                  min="1"
                  value={cantidad}
                  onChange={(e) => setCantidad(parseInt(e.target.value, 10))}
                />
                <button
                  className="btn btn-success"
                  onClick={agregarAlCarrito}
                >
                  Agregar al Carrito
                </button>
              </>
            )}
          </div>
        )}
      </div>

      {/* Renderiza el carrito solo si hay productos */}
      {carrito.length > 0 && (
        <Carrito
          carrito={carrito}
          eliminarItem={eliminarItem}
          actualizarCantidad={actualizarCantidad}
        />
      )}
    </div>
  );
};

export default Ventas;