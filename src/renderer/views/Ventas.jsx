import React, { useState, useEffect } from "react";
import Carrito from "../components/Carrito";
import "bootstrap/dist/css/bootstrap.min.css";

const Ventas = () => {
  const [tipo, setTipo] = useState("");
  const [marcaSeleccionada, setMarcaSeleccionada] = useState("");
  const [subMarcaSeleccionada, setSubMarcaSeleccionada] = useState("");
  const [tamanoSeleccionado, setTamanoSeleccionado] = useState("");
  const [cantidad, setCantidad] = useState("1");
  const [tipoVenta, setTipoVenta] = useState(""); // Almacena el tipo de venta específico
  const [opcionesVenta, setOpcionesVenta] = useState([]); // Almacena las opciones dinámicas
  const [carrito, setCarrito] = useState([]);
  const [productos, setProductos] = useState([]);

  useEffect(() => {
    const cargarProductos = async () => {
      try {
        const productosDb = await window.electron.dbHandler.obtenerProductos();
        setProductos(productosDb);
      } catch (error) {
        console.error("Error al cargar productos:", error);
      }
    };

    cargarProductos();
  }, []);

  const obtenerMarcasPorTipo = () => {
    return [...new Set(productos.filter((p) => p.tipo === tipo).map((p) => p.marca))];
  };

  const obtenerSubmarcasPorMarca = () => {
    return [...new Set(
      productos
        .filter((p) => p.tipo === tipo && p.marca === marcaSeleccionada)
        .map((p) => p.submarca)
    )];
  };

  const obtenerTamanosPorSubmarca = () => {
    const productoSubmarca = productos.find(
      (p) =>
        p.tipo === tipo &&
        p.marca === marcaSeleccionada &&
        p.submarca === subMarcaSeleccionada
    );
    return productoSubmarca ? productoSubmarca.presentaciones.map((p) => p.capacidad) : [];
  };

  const manejarSeleccionTamano = (tamano) => {
    setTamanoSeleccionado(tamano);
    // Obtener el producto específico seleccionado
    const productoSeleccionado = productos.find(
      (p) =>
        p.tipo === tipo &&
        p.marca === marcaSeleccionada &&
        p.submarca === subMarcaSeleccionada
    );

    if (productoSeleccionado) {
      const presentacionSeleccionada = productoSeleccionado.presentaciones.find(
        (p) => p.capacidad === tamano
      );

      if (presentacionSeleccionada) {
        const opciones = [];
        if (presentacionSeleccionada.precioPorSix) opciones.push("six");
        if (presentacionSeleccionada.precioPorCarton) opciones.push("cartón");
        opciones.push("individual"); // Individual siempre disponible
        setOpcionesVenta(opciones);
        setTipoVenta(""); // Resetear selección previa
      }
    }
  };

  const agregarAlCarrito = () => {
    const cantidadNumerica = parseInt(cantidad, 10);
    if (
      tipo &&
      marcaSeleccionada &&
      subMarcaSeleccionada &&
      tamanoSeleccionado &&
      tipoVenta &&
      cantidadNumerica > 0
    ) {
      const productoSeleccionado = productos.find(
        (p) =>
          p.tipo === tipo &&
          p.marca === marcaSeleccionada &&
          p.submarca === subMarcaSeleccionada
      );

      if (productoSeleccionado) {
        const presentacionSeleccionada = productoSeleccionado.presentaciones.find(
          (p) => p.capacidad === tamanoSeleccionado
        );

        if (presentacionSeleccionada) {
          let precioPorVenta = 0;
          if (tipoVenta === "six") {
            precioPorVenta = presentacionSeleccionada.precioPorSix;
          } else if (tipoVenta === "cartón") {
            precioPorVenta = presentacionSeleccionada.precioPorCarton;
          } else {
            precioPorVenta = presentacionSeleccionada.precioUnitario * cantidadNumerica;
          }

          const nuevoItem = {
            tipo,
            marca: marcaSeleccionada,
            subMarca: subMarcaSeleccionada,
            tamano: tamanoSeleccionado,
            cantidad: cantidadNumerica,
            precioUnitario: presentacionSeleccionada.precioUnitario,
            tipoVenta,
            precioPorVenta,
          };

          setCarrito([...carrito, nuevoItem]);
          limpiarSeleccion();
        } else {
          alert("No se encontró la presentación seleccionada.");
        }
      }
    }
  };

  const limpiarSeleccion = () => {
    setMarcaSeleccionada("");
    setSubMarcaSeleccionada("");
    setTamanoSeleccionado("");
    setCantidad("1");
    setTipoVenta("");
    setOpcionesVenta([]);
  };

  const actualizarCantidad = (index, nuevaCantidad) => {
    if (!nuevaCantidad || nuevaCantidad <= 0) return; // Validar que sea un número positivo
  
    setCarrito((prevCarrito) => {
      // Clonar el carrito para evitar mutaciones
      const nuevoCarrito = [...prevCarrito];
      const item = { ...nuevoCarrito[index] }; // Clonar el objeto del producto
  
      // Calcular el nuevo precio basado en el tipo de venta
      let nuevoPrecioPorVenta = 0;
      if (item.tipoVenta === "six") {
        nuevoPrecioPorVenta = item.precioUnitario * 6 * nuevaCantidad; // Precio por six
      } else if (item.tipoVenta === "cartón") {
        nuevoPrecioPorVenta = item.precioUnitario * 24 * nuevaCantidad; // Precio por cartón
      } else {
        nuevoPrecioPorVenta = item.precioUnitario * nuevaCantidad; // Precio por unidad
      }
  
      // Actualizar el producto con la nueva cantidad y precio
      item.cantidad = nuevaCantidad;
      item.precioPorVenta = nuevoPrecioPorVenta;
  
      // Reemplazar el producto en el carrito
      nuevoCarrito[index] = item;
  
      return nuevoCarrito; // Devolver el nuevo carrito actualizado
    });
  };
  
  
  
  


  return (
    <div className="main-content">
      <h1>Registro de Ventas</h1>

      <div className="mb-4">
        {/* Selección de opciones */}
        <select
          className="form-select mb-2"
          value={tipo}
          onChange={(e) => setTipo(e.target.value)}
        >
          <option value="">Seleccionar Tipo</option>
          {[...new Set(productos.map((p) => p.tipo))].map((tipo) => (
            <option key={tipo} value={tipo}>
              {tipo}
            </option>
          ))}
        </select>

        {tipo && (
          <select
            className="form-select mb-2"
            value={marcaSeleccionada}
            onChange={(e) => setMarcaSeleccionada(e.target.value)}
          >
            <option value="">Seleccionar Marca</option>
            {obtenerMarcasPorTipo().map((marca) => (
              <option key={marca} value={marca}>
                {marca}
              </option>
            ))}
          </select>
        )}

        {marcaSeleccionada && (
          <select
            className="form-select mb-2"
            value={subMarcaSeleccionada}
            onChange={(e) => setSubMarcaSeleccionada(e.target.value)}
          >
            <option value="">Seleccionar Sub-Marca</option>
            {obtenerSubmarcasPorMarca().map((submarca, index) => (
              <option key={index} value={submarca}>
                {submarca}
              </option>
            ))}
          </select>
        )}

        {subMarcaSeleccionada && (
          <select
            className="form-select mb-2"
            value={tamanoSeleccionado}
            onChange={(e) => manejarSeleccionTamano(e.target.value)}
          >
            <option value="">Seleccionar Tamaño</option>
            {obtenerTamanosPorSubmarca().map((tamano, index) => (
              <option key={index} value={tamano}>
                {tamano}
              </option>
            ))}
          </select>
        )}

        {/* Lista dinámica para tipo de venta */}
        {opcionesVenta.length > 0 && (
          <select
            className="form-select mb-2"
            value={tipoVenta}
            onChange={(e) => setTipoVenta(e.target.value)}
          >
            <option value="">Seleccionar Tipo de Venta</option>
            {opcionesVenta.map((opcion, index) => (
              <option key={index} value={opcion}>
                {opcion.charAt(0).toUpperCase() + opcion.slice(1)}
              </option>
            ))}
          </select>
        )}

        <input
          type="number"
          className="form-control mb-2"
          value={cantidad}
          min="1"
          onChange={(e) => setCantidad(e.target.value)}
        />

        <button className="btn btn-success" onClick={agregarAlCarrito}>
          Agregar al Carrito
        </button>
      </div>

      {carrito.length > 0 && (
  <Carrito
    carrito={carrito}
    eliminarItem={(index) => setCarrito(carrito.filter((_, i) => i !== index))}
    actualizarCantidad={actualizarCantidad} // Pasa la función al carrito
  />
)}

    </div>
  );
};

export default Ventas;
