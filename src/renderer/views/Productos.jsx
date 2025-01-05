import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Modal, Button, Form } from "react-bootstrap";

const Productos = () => {
  const [productos, setProductos] = useState([]);
  const [productoSeleccionado, setProductoSeleccionado] = useState(null);
  const [presentacionSeleccionada, setPresentacionSeleccionada] = useState(null);
  const [mostrarModal, setMostrarModal] = useState(false);

  useEffect(() => {
    cargarProductos();
  }, []);

  const cargarProductos = async () => {
    try {
      const productosDb = await window.electron.dbHandler.obtenerProductos();
      setProductos(productosDb);
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

  const modificarPresentacion = (producto, presentacion) => {
    setProductoSeleccionado(producto);
    setPresentacionSeleccionada({ ...presentacion });
    setMostrarModal(true);
  };

  const guardarCambios = async () => {
    try {
      const nuevasPresentaciones = productoSeleccionado.presentaciones.map((p) =>
        p.tipo === presentacionSeleccionada.tipo &&
        p.capacidad === presentacionSeleccionada.capacidad
          ? presentacionSeleccionada
          : p
      );

      const productoActualizado = {
        ...productoSeleccionado,
        presentaciones: nuevasPresentaciones,
      };

      const exito = await window.electron.dbHandler.actualizarProducto(
        productoSeleccionado._id,
        productoActualizado
      );

      if (exito) {
        cargarProductos();
        setMostrarModal(false);
      } else {
        alert("Error al actualizar el producto.");
      }
    } catch (error) {
      console.error("Error al actualizar producto:", error);
    }
  };

  const agregarProducto = async (nuevoProducto) => {
    try {
      await window.electron.dbHandler.agregarProducto(nuevoProducto);
      cargarProductos();
    } catch (error) {
      console.error("Error al agregar producto:", error);
    }
  };

  const agregarPresentacion = async (idProducto, nuevaPresentacion) => {
    try {
      const producto = productos.find((prod) => prod._id === idProducto);
      if (producto) {
        const productoActualizado = {
          ...producto,
          presentaciones: [...producto.presentaciones, nuevaPresentacion],
        };

        const exito = await window.electron.dbHandler.actualizarProducto(
          idProducto,
          productoActualizado
        );

        if (exito) cargarProductos();
      }
    } catch (error) {
      console.error("Error al agregar presentación:", error);
    }
  };

  const cervezas = productos.filter((prod) => prod.tipo === "Cerveza");

  // Función para filtrar productos por marca
  const filtrarPorMarca = (marca) => {
    return cervezas.filter((producto) => producto.marca === marca);
  };

  // Renderizar tabla para cada marca
  const renderizarTablaPorMarca = (marca) => {
    const productosMarca = filtrarPorMarca(marca);

    return (
      <div key={marca}>
        <h4>{marca}</h4>
        {productosMarca.length === 0 ? (
          <p className="text-muted">No hay productos de {marca} registrados.</p>
        ) : (
          productosMarca.map((producto) => {
            // Detectar columnas necesarias
            const tienePrecioPorCarton = producto.presentaciones.some(
              (p) => p.esRetornable && p.precioPorCarton
            );
            const tienePrecioPorSix = producto.presentaciones.some(
              (p) => p.descuentoSixPack && p.precioPorSix
            );

            return (
              <div key={producto.marca + producto.submarca}>
                <h5>
                  {producto.marca} - {producto.submarca}
                </h5>
                <table className="table table-bordered">
                  <thead>
                    <tr>
                      <th>Presentación</th>
                      <th>Contenido</th>
                      <th>Precio Unitario</th>
                      {tienePrecioPorCarton && <th>Precio por Cartón</th>}
                      {tienePrecioPorSix && <th>Precio por Six-Pack</th>}
                      <th>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {producto.presentaciones.map((presentacion, index) => (
                      <tr key={index}>
                        <td>{presentacion.tipo}</td>
                        <td>{presentacion.capacidad}</td>
                        <td>${presentacion.precioUnitario.toFixed(2)}</td>
                        {tienePrecioPorCarton && (
                          <td>
                            {presentacion.esRetornable
                              ? `$${presentacion.precioPorCarton?.toFixed(2)}`
                              : "-"}
                          </td>
                        )}
                        {tienePrecioPorSix && (
                          <td>
                            {presentacion.descuentoSixPack
                              ? `$${presentacion.precioPorSix?.toFixed(2)}`
                              : "-"}
                          </td>
                        )}
                        <td>
                          <button
                            className="btn btn-warning btn-sm me-2"
                            onClick={() =>
                              modificarPresentacion(producto, presentacion)
                            }
                          >
                            Modificar
                          </button>
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
            );
          })
        )}
      </div>
    );
  };

  return (
    <div className="main-content">
      <h1>Gestión de Productos</h1>

      {/* Tablas para cada marca */}
      {["Victoria", "Corona", "Modelo"].map((marca) =>
        renderizarTablaPorMarca(marca)
      )}

      {/* Modal para modificar presentaciones */}
      <Modal show={mostrarModal} onHide={() => setMostrarModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Modificar Presentación</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {presentacionSeleccionada && (
            <Form>
              <Form.Group className="mb-3">
                <Form.Label>Tipo</Form.Label>
                <Form.Control
                  type="text"
                  value={presentacionSeleccionada.tipo}
                  onChange={(e) =>
                    setPresentacionSeleccionada({
                      ...presentacionSeleccionada,
                      tipo: e.target.value,
                    })
                  }
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Capacidad</Form.Label>
                <Form.Control
                  type="text"
                  value={presentacionSeleccionada.capacidad}
                  onChange={(e) =>
                    setPresentacionSeleccionada({
                      ...presentacionSeleccionada,
                      capacidad: e.target.value,
                    })
                  }
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Precio Unitario</Form.Label>
                <Form.Control
                  type="number"
                  value={presentacionSeleccionada.precioUnitario}
                  onChange={(e) =>
                    setPresentacionSeleccionada({
                      ...presentacionSeleccionada,
                      precioUnitario: parseFloat(e.target.value),
                    })
                  }
                />
              </Form.Group>
              {presentacionSeleccionada.esRetornable && (
                <Form.Group className="mb-3">
                  <Form.Label>Precio por Cartón</Form.Label>
                  <Form.Control
                    type="number"
                    value={presentacionSeleccionada.precioPorCarton || ""}
                    onChange={(e) =>
                      setPresentacionSeleccionada({
                        ...presentacionSeleccionada,
                        precioPorCarton: parseFloat(e.target.value),
                      })
                    }
                  />
                </Form.Group>
              )}
              {presentacionSeleccionada.descuentoSixPack && (
                <Form.Group className="mb-3">
                  <Form.Label>Precio por Six-Pack</Form.Label>
                  <Form.Control
                    type="number"
                    value={presentacionSeleccionada.precioPorSix || ""}
                    onChange={(e) =>
                      setPresentacionSeleccionada({
                        ...presentacionSeleccionada,
                        precioPorSix: parseFloat(e.target.value),
                      })
                    }
                  />
                </Form.Group>
              )}
            </Form>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setMostrarModal(false)}>
            Cancelar
          </Button>
          <Button variant="primary" onClick={guardarCambios}>
            Guardar Cambios
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Productos;
