import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Modal, Button, Form } from "react-bootstrap";
import AccionMarcaModal from "../components/AccionMarcaModal";

const Productos = () => {
  const [productos, setProductos] = useState([]);
  const [productoSeleccionado, setProductoSeleccionado] = useState(null);
  const [presentacionSeleccionada, setPresentacionSeleccionada] = useState(null);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [mostrarModalEliminar, setMostrarModalEliminar] = useState(false);
  const [productoAEliminar, setProductoAEliminar] = useState(null);

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

  const confirmarEliminarProducto = (producto) => {
    setProductoAEliminar(producto);
    setMostrarModalEliminar(true);
  };

  const eliminarProducto = async () => {
    if (productoAEliminar) {
      try {
        await window.electron.dbHandler.eliminarProducto(productoAEliminar._id);
        cargarProductos();
        setMostrarModalEliminar(false);
        setProductoAEliminar(null);
      } catch (error) {
        console.error("Error al eliminar producto:", error);
      }
    }
  };

  const modificarPresentacion = (producto, presentacion) => {
    setProductoSeleccionado(producto);
    setPresentacionSeleccionada({ ...presentacion });
    setMostrarModal(true);
  };

  const validarPresentacion = (presentacion) => ({
    ...presentacion,
    precioPorCarton: presentacion.precioPorCarton || 0,
    precioPorSix: presentacion.precioPorSix || 0,
  });

  const guardarCambios = async () => {
    try {
      const nuevasPresentaciones = productoSeleccionado.presentaciones.map((p) =>
        p.tipo === presentacionSeleccionada.tipo &&
        p.capacidad === presentacionSeleccionada.capacidad
          ? validarPresentacion(presentacionSeleccionada)
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

  const obtenerMarcasUnicas = () => [...new Set(productos.map((producto) => producto.marca))];

  const filtrarPorMarca = (marca) => productos.filter((producto) => producto.marca === marca);

  const renderizarTablaPorMarca = (marca) => {
    const productosMarca = filtrarPorMarca(marca);

    return (
      <div key={marca}>
        <h4>{marca}</h4>
        {productosMarca.length === 0 ? (
          <p className="text-muted">No hay productos de {marca} registrados.</p>
        ) : (
          productosMarca.map((producto) => {
            const tienePrecioPorCarton = producto.presentaciones.some(
              (p) => p.precioPorCarton && p.precioPorCarton !== 0
            );
            const tienePrecioPorSix = producto.presentaciones.some(
              (p) => p.precioPorSix && p.precioPorSix !== 0
            );

            return (
              <div key={`${producto.marca}-${producto.submarca}`}>
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
                          <td className="text-center">
                            {presentacion.precioPorCarton && presentacion.precioPorCarton !== 0
                              ? `$${presentacion.precioPorCarton.toFixed(2)}`
                              : "-"}
                          </td>
                        )}
                        {tienePrecioPorSix && (
                          <td className="text-center">
                            {presentacion.precioPorSix && presentacion.precioPorSix !== 0
                              ? `$${presentacion.precioPorSix.toFixed(2)}`
                              : "-"}
                          </td>
                        )}
                        <td>
                          <button
                            className="btn btn-warning btn-sm me-2"
                            onClick={() => modificarPresentacion(producto, presentacion)}
                          >
                            Modificar
                          </button>
                          <button
                            className="btn btn-danger btn-sm"
                            onClick={() => confirmarEliminarProducto(producto)}
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
      <AccionMarcaModal productos={productos} cargarProductos={cargarProductos} />

      {/* Tablas dinámicas por marca */}
      {obtenerMarcasUnicas().map((marca) => renderizarTablaPorMarca(marca))}

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
            value={presentacionSeleccionada.precioUnitario || ""}
            onChange={(e) =>
              setPresentacionSeleccionada({
                ...presentacionSeleccionada,
                precioUnitario: parseFloat(e.target.value),
              })
            }
          />
        </Form.Group>
        {/* Campo para el precio por cartón */}
        <Form.Group className="mb-3">
          <Form.Label>Precio por Cartón</Form.Label>
          <Form.Control
            type="number"
            value={presentacionSeleccionada.precioPorCarton || ""}
            onChange={(e) =>
              setPresentacionSeleccionada({
                ...presentacionSeleccionada,
                precioPorCarton: parseFloat(e.target.value) || 0,
              })
            }
          />
        </Form.Group>
        {/* Campo para el precio por six-pack */}
        <Form.Group className="mb-3">
          <Form.Label>Precio por Six-Pack</Form.Label>
          <Form.Control
            type="number"
            value={presentacionSeleccionada.precioPorSix || ""}
            onChange={(e) =>
              setPresentacionSeleccionada({
                ...presentacionSeleccionada,
                precioPorSix: parseFloat(e.target.value) || 0,
              })
            }
          />
        </Form.Group>
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


      {/* Modal de confirmación para eliminar producto */}
      <Modal show={mostrarModalEliminar} onHide={() => setMostrarModalEliminar(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirmar Eliminación</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>¿Estás seguro de que deseas eliminar este producto?</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setMostrarModalEliminar(false)}>
            Cancelar
          </Button>
          <Button variant="danger" onClick={eliminarProducto}>
            Eliminar
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Productos;
