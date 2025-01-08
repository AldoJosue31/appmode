import React, { useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";

const AccionMarcaModal = ({ productos, cargarProductos }) => {
  const [mostrarModal, setMostrarModal] = useState(false);
  const [accion, setAccion] = useState("");
  const [tipoCreacion, setTipoCreacion] = useState("");
  const [marcaSeleccionada, setMarcaSeleccionada] = useState("");
  const [submarcaSeleccionada, setSubmarcaSeleccionada] = useState("");
  const [nuevaMarca, setNuevaMarca] = useState("");
  const [nuevaSubmarca, setNuevaSubmarca] = useState("");
  const [nuevaPresentacion, setNuevaPresentacion] = useState({
    productoId: "",
    tipo: "",
    capacidad: "",
    precioUnitario: 0,
    precioPorSix: "",
    precioPorCarton: "",
  });

  const manejarAccion = async () => {
    try {
      if (accion === "crear") {
        if (tipoCreacion === "marca") {
          const nuevaMarcaObj = {
            tipo: "Cerveza",
            marca: nuevaMarca,
            submarca: "Normal",
            presentaciones: [],
          };
          await window.electron.dbHandler.agregarProducto(nuevaMarcaObj);
        } else if (tipoCreacion === "submarca") {
          const nuevaSubmarcaObj = {
            tipo: "Cerveza",
            marca: marcaSeleccionada,
            submarca: nuevaSubmarca,
            presentaciones: [],
          };
          await window.electron.dbHandler.agregarProducto(nuevaSubmarcaObj);
        }
      } else if (accion === "agregar") {
        const producto = productos.find(
          (prod) => prod.marca === marcaSeleccionada && prod.submarca === submarcaSeleccionada
        );

        if (producto) {
          const productoActualizado = {
            ...producto,
            presentaciones: [...producto.presentaciones, nuevaPresentacion],
          };
          await window.electron.dbHandler.actualizarProducto(
            producto._id,
            productoActualizado
          );
        }
      }
      setMostrarModal(false);
      cargarProductos();
    } catch (error) {
      console.error("Error al procesar la acción:", error);
    }
  };

  const obtenerSubmarcas = () =>
    productos
      .filter((producto) => producto.marca === marcaSeleccionada)
      .map((producto) => producto.submarca);

  return (
    <>
      <button
        className="btn btn-primary btn-sm float-end"
        onClick={() => setMostrarModal(true)}
      >
        +
      </button>

      <Modal show={mostrarModal} onHide={() => setMostrarModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Agregar Marca o Presentación</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>¿Qué desea hacer?</Form.Label>
              <Form.Select onChange={(e) => setAccion(e.target.value)}>
                <option value="">Seleccione una opción</option>
                <option value="crear">Crear nueva marca o submarca</option>
                <option value="agregar">Agregar precios a una presentación existente</option>
              </Form.Select>
            </Form.Group>

            {accion === "crear" && (
              <>
                <Form.Group className="mb-3">
                  <Form.Label>¿Qué desea crear?</Form.Label>
                  <Form.Select onChange={(e) => setTipoCreacion(e.target.value)}>
                    <option value="">Seleccione una opción</option>
                    <option value="marca">Nueva Marca</option>
                    <option value="submarca">Submarca de una Marca existente</option>
                  </Form.Select>
                </Form.Group>

                {tipoCreacion === "marca" && (
                  <Form.Group className="mb-3">
                    <Form.Label>Nombre de la Nueva Marca</Form.Label>
                    <Form.Control
                      type="text"
                      value={nuevaMarca}
                      onChange={(e) => setNuevaMarca(e.target.value)}
                    />
                  </Form.Group>
                )}

                {tipoCreacion === "submarca" && (
                  <>
                    <Form.Group className="mb-3">
                      <Form.Label>Seleccionar Marca</Form.Label>
                      <Form.Select
                        onChange={(e) => setMarcaSeleccionada(e.target.value)}
                      >
                        <option value="">Seleccione una marca</option>
                        {[...new Set(productos.map((prod) => prod.marca))].map((marca) => (
                          <option key={marca} value={marca}>
                            {marca}
                          </option>
                        ))}
                      </Form.Select>
                    </Form.Group>
                    <Form.Group className="mb-3">
                      <Form.Label>Nombre de la Nueva Submarca</Form.Label>
                      <Form.Control
                        type="text"
                        value={nuevaSubmarca}
                        onChange={(e) => setNuevaSubmarca(e.target.value)}
                      />
                    </Form.Group>
                  </>
                )}
              </>
            )}

            {accion === "agregar" && (
              <>
                <Form.Group className="mb-3">
                  <Form.Label>Seleccionar Marca</Form.Label>
                  <Form.Select
                    onChange={(e) => {
                      setMarcaSeleccionada(e.target.value);
                      setSubmarcaSeleccionada("");
                    }}
                  >
                    <option value="">Seleccione una marca</option>
                    {[...new Set(productos.map((prod) => prod.marca))].map((marca) => (
                      <option key={marca} value={marca}>
                        {marca}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
                {marcaSeleccionada && (
                  <Form.Group className="mb-3">
                    <Form.Label>Seleccionar Submarca</Form.Label>
                    <Form.Select
                      onChange={(e) => setSubmarcaSeleccionada(e.target.value)}
                    >
                      <option value="">Seleccione una submarca</option>
                      {obtenerSubmarcas().map((submarca, index) => (
                        <option key={index} value={submarca}>
                          {submarca}
                        </option>
                      ))}
                    </Form.Select>
                  </Form.Group>
                )}
                {submarcaSeleccionada && (
                  <>
                    <Form.Group className="mb-3">
                      <Form.Label>Tipo de Presentación</Form.Label>
                      <Form.Control
                        type="text"
                        value={nuevaPresentacion.tipo}
                        onChange={(e) =>
                          setNuevaPresentacion({
                            ...nuevaPresentacion,
                            tipo: e.target.value,
                          })
                        }
                      />
                    </Form.Group>
                    <Form.Group className="mb-3">
                      <Form.Label>Capacidad</Form.Label>
                      <Form.Control
                        type="text"
                        value={nuevaPresentacion.capacidad}
                        onChange={(e) =>
                          setNuevaPresentacion({
                            ...nuevaPresentacion,
                            capacidad: e.target.value,
                          })
                        }
                      />
                    </Form.Group>
                    <Form.Group className="mb-3">
                      <Form.Label>Precio Unitario</Form.Label>
                      <Form.Control
                        type="number"
                        value={nuevaPresentacion.precioUnitario}
                        onChange={(e) =>
                          setNuevaPresentacion({
                            ...nuevaPresentacion,
                            precioUnitario: parseFloat(e.target.value),
                          })
                        }
                      />
                    </Form.Group>
                    <Form.Group className="mb-3">
                      <Form.Label>Precio por Six (opcional)</Form.Label>
                      <Form.Control
                        type="number"
                        value={nuevaPresentacion.precioPorSix}
                        onChange={(e) =>
                          setNuevaPresentacion({
                            ...nuevaPresentacion,
                            precioPorSix: parseFloat(e.target.value),
                          })
                        }
                      />
                    </Form.Group>
                    <Form.Group className="mb-3">
                      <Form.Label>Precio por Cartón (opcional)</Form.Label>
                      <Form.Control
                        type="number"
                        value={nuevaPresentacion.precioPorCarton}
                        onChange={(e) =>
                          setNuevaPresentacion({
                            ...nuevaPresentacion,
                            precioPorCarton: parseFloat(e.target.value),
                          })
                        }
                      />
                    </Form.Group>
                  </>
                )}
              </>
            )}
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setMostrarModal(false)}>
            Cancelar
          </Button>
          <Button
            variant="primary"
            onClick={() => {
              if (
                accion === "agregar" &&
                !nuevaPresentacion.precioPorSix &&
                !nuevaPresentacion.precioPorCarton
              ) {
                alert("Debe ingresar al menos un precio (por Six o por Cartón).");
              } else {
                manejarAccion();
              }
            }}
          >
            Guardar
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default AccionMarcaModal;
