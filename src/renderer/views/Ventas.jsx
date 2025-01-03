import React, { useState } from "react";
import Carrito from "../components/Carrito"; // El componente que muestra el carrito

const Ventas = () => {
  const [carrito, setCarrito] = useState([]);

  // Función para agregar un producto al carrito
  const agregarAlCarrito = (producto, presentacionSeleccionada) => {
    const { tipo, marca, submarca } = producto;
    const { tipo: presentacionTipo, capacidad, precioUnitario, precioPorSix, precioPorCarton } =
      presentacionSeleccionada;

    const nuevoItem = {
      tipo,
      marca,
      submarca,
      presentacion: presentacionTipo,
      capacidad,
      cantidad: 1, // Por defecto, agregar una unidad
      precioUnitario: precioUnitario || 0,
      precioPorSix: precioPorSix || null,
      precioPorCarton: precioPorCarton || null,
    };

    setCarrito((prevCarrito) => [...prevCarrito, nuevoItem]);
  };

  // Función para actualizar la cantidad de un producto
  const actualizarCantidad = (index, nuevaCantidad) => {
    setCarrito((prevCarrito) => {
      const actualizado = [...prevCarrito];
      if (nuevaCantidad > 0) {
        actualizado[index].cantidad = nuevaCantidad;
      } else {
        actualizado.splice(index, 1); // Eliminar si la cantidad es 0
      }
      return actualizado;
    });
  };

  // Función para eliminar un producto del carrito
  const eliminarItem = (index) => {
    setCarrito((prevCarrito) => prevCarrito.filter((_, i) => i !== index));
  };

  // Simulación de productos
  const productos = [
    {
      tipo: "Cerveza",
      marca: "Modelo",
      submarca: "Modelo Especial",
      presentaciones: [
        {
          tipo: "Lata",
          capacidad: "355ml",
          precioUnitario: 20.5,
        },
        {
          tipo: "Mega Retornable",
          capacidad: "1lt",
          precioUnitario: 45,
          precioPorCarton: 540,
        },
      ],
      _id: "1",
    },
    {
      tipo: "Cerveza",
      marca: "Corona",
      submarca: "Corona Extra",
      presentaciones: [
        {
          tipo: "Latón",
          capacidad: "473ml",
          precioUnitario: 22,
          precioPorSix: 122,
        },
      ],
      _id: "2",
    },
  ];

  return (
    <div>
      <h1>Ventas</h1>
      <div>
        <h2>Productos</h2>
        {productos.map((producto) => (
          <div key={producto._id}>
            <h3>{producto.marca} - {producto.submarca}</h3>
            {producto.presentaciones.map((presentacion, index) => (
              <div key={index}>
                <p>{presentacion.tipo} - {presentacion.capacidad}</p>
                <p>Precio: ${presentacion.precioUnitario}</p>
                <button onClick={() => agregarAlCarrito(producto, presentacion)}>
                  Agregar al Carrito
                </button>
              </div>
            ))}
          </div>
        ))}
      </div>

      {/* Mostrar el carrito */}
      <Carrito
        carrito={carrito}
        actualizarCantidad={actualizarCantidad}
        eliminarItem={eliminarItem}
      />
    </div>
  );
};

export default Ventas;
