import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

const Productos = () => {
  const [cervezas, setCervezas] = useState([]);
  const [otrosProductos, setOtrosProductos] = useState([]);

  useEffect(() => {
    cargarProductos();
  }, []);

  const cargarProductos = async () => {
    try {
      const productosDb = await window.electron.dbHandler.obtenerProductos();
      const cervezasFiltradas = productosDb.filter(
        (producto) => producto.tipo.toLowerCase() === "cerveza"
      );
      const otrosProductosFiltrados = productosDb.filter(
        (producto) => producto.tipo.toLowerCase() !== "cerveza"
      );
      setCervezas(cervezasFiltradas);
      setOtrosProductos(otrosProductosFiltrados);
    } catch (error) {
      console.error("Error al cargar productos:", error);
    }
  };

  const eliminarProducto = async (id) => {
    try {
      await window.electron.dbHandler.eliminarProducto(id);
      cargarProductos();
    } catch (error) {
      console.error("Error al eliminar producto:", error);
    }
  };
  

  return (
    <div className="main-content">
      <h1>Gestión de Productos</h1>

      <h4>Lista de Cervezas</h4>
      {cervezas.length === 0 ? (
        <p className="text-muted">No hay cervezas registradas.</p>
      ) : (
        cervezas.map((cerveza) => (
          <div key={cerveza._id}>
            <h5>Marca: {cerveza.marca}</h5>
            <table className="table table-striped">
              <thead>
                <tr>
                  <th>Sub-Marca</th>
                  <th>Precio Unidad</th>
                  <th>Precio Six-Pack</th>
                  <th>Precio Cartón</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {cerveza.subMarcas.map((subMarca) => (
                  <tr key={`${cerveza._id}-${subMarca}`}>
                    <td>{subMarca}</td>
                    <td>
                      {Object.entries(cerveza.precios[subMarca] || {}).map(
                        ([tamano, precio]) => (
                          <div key={tamano}>
                            {tamano}: ${precio.toFixed(2)}
                          </div>
                        )
                      )}
                    </td>
                    <td>
                      {Object.entries(cerveza.porSix || {}).map(
                        ([tamano, precio]) => (
                          <div key={tamano}>
                            {tamano}: ${precio.toFixed(2)}
                          </div>
                        )
                      )}
                    </td>
                    <td>
                      {Object.entries(cerveza.porCarton || {}).map(
                        ([tamano, datos]) => (
                          <div key={tamano}>
                            {tamano}: {datos.piezas} piezas - ${datos.precioPorCarton.toFixed(2)}
                          </div>
                        )
                      )}
                    </td>
                    <td>
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => eliminarProducto(cerveza._id)}
                      >
                        Eliminar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ))
      )}

      <h4>Lista de Otros Productos</h4>
      {otrosProductos.length === 0 ? (
        <p className="text-muted">No hay otros productos registrados.</p>
      ) : (
        otrosProductos.map((producto) => (
          <div key={producto._id}>
            <h5>Marca: {producto.marca}</h5>
            <table className="table table-striped">
              <thead>
                <tr>
                  <th>Sub-Marca</th>
                  <th>Precio Unidad</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {producto.subMarcas.map((subMarca) => (
                  <tr key={`${producto._id}-${subMarca}`}>
                    <td>{subMarca}</td>
                    <td>${producto.precios[subMarca].toFixed(2)}</td>
                    <td>
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => eliminarProducto(producto._id)}
                      >
                        Eliminar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ))
      )}
    </div>
  );
};

export default Productos;