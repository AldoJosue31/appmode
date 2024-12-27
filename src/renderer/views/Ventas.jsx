import React, { useState, useEffect } from "react";
import Carrito from "../components/Carrito";
import "bootstrap/dist/css/bootstrap.min.css";

const Ventas = () => {
  const [tipo, setTipo] = useState("");
  const [marcaSeleccionada, setMarcaSeleccionada] = useState("");
  const [subMarcaSeleccionada, setSubMarcaSeleccionada] = useState("");
  const [tamanoSeleccionado, setTamanoSeleccionado] = useState("");
  const [cantidad, setCantidad] = useState("1");
  const [carrito, setCarrito] = useState([]);
  const [productos, setProductos] = useState({});

  useEffect(() => {
    const cargarProductos = async () => {
      try {
        const productosDb = await window.electron.dbHandler.obtenerProductos();
        const productosOrganizados = {};

        productosDb.forEach((producto) => {
          if (!productosOrganizados[producto.tipo]) {
            productosOrganizados[producto.tipo] = {};
          }

          productosOrganizados[producto.tipo][producto.marca] = {
            subMarcas: producto.subMarcas,
            tamanos: producto.tamanos || [],
            precios: producto.precios || {},
          };
        });

        setProductos(productosOrganizados);
      } catch (error) {
        console.error("Error al cargar productos:", error);
      }
    };

    cargarProductos();
  }, []);

  const agregarAlCarrito = () => {
    const cantidadNumerica = parseInt(cantidad, 10);
    if (tipo && marcaSeleccionada && subMarcaSeleccionada && cantidadNumerica > 0) {
      const seleccionado = productos[tipo][marcaSeleccionada];
      const esCervezaConCarton =
        tipo.toLowerCase() === "cerveza" &&
        tamanoSeleccionado &&
        seleccionado.porCarton &&
        seleccionado.porCarton[tamanoSeleccionado];
  
      const nuevoItem = {
        tipo,
        marca: marcaSeleccionada,
        subMarca: subMarcaSeleccionada,
        tamano: tamanoSeleccionado,
        cantidad: cantidadNumerica,
        precioPorUnidad: seleccionado.precios[subMarcaSeleccionada],
        ...(esCervezaConCarton && {
          precioPorCarton: seleccionado.porCarton[tamanoSeleccionado].precioPorCarton,
          piezasPorCarton: seleccionado.porCarton[tamanoSeleccionado].piezas,
        }),
      };
      setCarrito([...carrito, nuevoItem]);
      limpiarSeleccion();
    }
  };
  

  const limpiarSeleccion = () => {
    setMarcaSeleccionada("");
    setSubMarcaSeleccionada("");
    setTamanoSeleccionado("");
    setCantidad("1");
  };

  const eliminarItem = (index) => {
    setCarrito(carrito.filter((_, i) => i !== index));
  };

  const actualizarCantidad = (index, nuevaCantidad) => {
    if (nuevaCantidad < 1) return;
    const nuevoCarrito = [...carrito];
    nuevoCarrito[index].cantidad = nuevaCantidad;
    setCarrito(nuevoCarrito);
  };

  return (
    <div className="main-content">
      <h1>Registro de Ventas</h1>

      <div className="mb-4">
        <select
          className="form-select mb-2"
          value={tipo}
          onChange={(e) => setTipo(e.target.value)}
        >
          <option value="">Seleccionar Tipo</option>
          {Object.keys(productos).map((tipo) => (
            <option key={tipo} value={tipo}>
              {tipo}
            </option>
          ))}
        </select>

        {tipo && (
          <>
            <select
              className="form-select mb-2"
              value={marcaSeleccionada}
              onChange={(e) => setMarcaSeleccionada(e.target.value)}
            >
              <option value="">Seleccionar Marca</option>
              {Object.keys(productos[tipo]).map((marca) => (
                <option key={marca} value={marca}>
                  {marca}
                </option>
              ))}
            </select>

            {marcaSeleccionada && productos[tipo][marcaSeleccionada] && (
              <>
                <select
                  className="form-select mb-2"
                  value={subMarcaSeleccionada}
                  onChange={(e) => setSubMarcaSeleccionada(e.target.value)}
                >
                  <option value="">Seleccionar Sub-Marca</option>
                  {productos[tipo][marcaSeleccionada].subMarcas.map(
                    (subMarca, index) => (
                      <option key={index} value={subMarca}>
                        {subMarca}
                      </option>
                    )
                  )}
                </select>

                {productos[tipo][marcaSeleccionada].tamanos.length > 0 && (
                  <select
                    className="form-select mb-2"
                    value={tamanoSeleccionado}
                    onChange={(e) => setTamanoSeleccionado(e.target.value)}
                  >
                    <option value="">Seleccionar Tamaño</option>
                    {productos[tipo][marcaSeleccionada].tamanos.map(
                      (tamano, index) => (
                        <option key={index} value={tamano}>
                          {tamano}
                        </option>
                      )
                    )}
                  </select>
                )}
              </>
            )}
          </>
        )}

        <input
          type="text"
          className="form-control mb-2"
          value={cantidad}
          onChange={(e) => {
            const valor = e.target.value;
            if (valor === "" || /^[0-9]+$/.test(valor)) {
              setCantidad(valor);
            }
          }}
          onBlur={() => {
            if (cantidad === "" || parseInt(cantidad, 10) < 1) {
              setCantidad("1");
            }
          }}
        />

        <button className="btn btn-success" onClick={agregarAlCarrito}>
          Agregar al Carrito
        </button>
      </div>

      {carrito.length > 0 && (
        <Carrito
          carrito={carrito}
          eliminarItem={eliminarItem}
          actualizarCantidad={actualizarCantidad}
          precios={productos}
        />
      )}
    </div>
  );
};

export default Ventas;
