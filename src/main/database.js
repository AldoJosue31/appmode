import path from "path";
import Datastore from "nedb";

// Ruta para almacenar los datos en el sistema de archivos
const dbPath = path.join(process.cwd(), "data", "productos.db");

// Crear y cargar la base de datos
const productosDB = new Datastore({ filename: dbPath, autoload: true });

// Agregar datos iniciales si la base está vacía
productosDB.find({}, (err, docs) => {
  if (docs.length === 0) {
    const datosIniciales = [
      // Modelo
      {
        tipo: "Cerveza",
        marca: "Modelo",
        submarca: "Modelo Especial",
        presentaciones: [
          { tipo: "Media Retornable", capacidad: "355ml", precioUnitario: 20.5, esRetornable: true, precioPorCarton: 492 },
          { tipo: "Lata", capacidad: "330ml", precioUnitario: 18.0, descuentoSixPack: true, precioPorSix: 102 },
          { tipo: "Latón", capacidad: "410ml", precioUnitario: 22.0, descuentoSixPack: true, precioPorSix: 122 },
          { tipo: "Mega Lata", capacidad: "710ml", precioUnitario: 35.0, descuentoSixPack: true, precioPorSix: 192 },
          { tipo: "Mega Retornable", capacidad: "1lt", precioUnitario: 50.0, esRetornable: true, precioPorCarton: 600 },
        ],
      },
      {
        tipo: "Cerveza",
        marca: "Modelo",
        submarca: "Modelo Negra",
        presentaciones: [
          { tipo: "Mega Retornable", capacidad: "1lt", precioUnitario: 45.0, esRetornable: true, precioPorCarton: 540 },
          { tipo: "Media Retornable", capacidad: "355ml", precioUnitario: 20.5, esRetornable: true, precioPorCarton: 492 },
        ],
      },
      {
        tipo: "Cerveza",
        marca: "Modelo",
        submarca: "Modelo Malta",
        presentaciones: [
          { tipo: "Media Retornable", capacidad: "355ml", precioUnitario: 21.0, esRetornable: true, precioPorCarton: 504 },
        ],
      },
      // Corona
      {
        tipo: "Cerveza",
        marca: "Corona",
        submarca: "Corona Extra",
        presentaciones: [
          { tipo: "Lata", capacidad: "330ml", precioUnitario: 18.0, descuentoSixPack: true, precioPorSix: 102 },
          { tipo: "Latón", capacidad: "410ml", precioUnitario: 22.0, descuentoSixPack: true, precioPorSix: 122 },
          { tipo: "Mega Lata", capacidad: "710ml", precioUnitario: 35.0, descuentoSixPack: true, precioPorSix: 192 },
          { tipo: "Cuarto Retornable", capacidad: "210ml", precioUnitario: 15.0, esRetornable: true, precioPorCarton: 360 },
          { tipo: "Media Retornable", capacidad: "355ml", precioUnitario: 20.0, esRetornable: true, precioPorCarton: 480 },
          { tipo: "Mega Retornable", capacidad: "1.2lt", precioUnitario: 55.0, esRetornable: true, precioPorCarton: 660 },
          { tipo: "Familiar Retornable", capacidad: "940ml", precioUnitario: 50.0, esRetornable: true, precioPorCarton: 600 },
        ],
      },
      {
        tipo: "Cerveza",
        marca: "Corona",
        submarca: "Corona Light",
        presentaciones: [
          { tipo: "Lata", capacidad: "330ml", precioUnitario: 18.0, descuentoSixPack: true, precioPorSix: 102 },
        ],
      },
      {
        tipo: "Cerveza",
        marca: "Corona",
        submarca: "Corona Cero",
        presentaciones: [
          { tipo: "Lata", capacidad: "355ml", precioUnitario: 19.0, descuentoSixPack: true, precioPorSix: 108 },
        ],
      },
      // Victoria
      {
        tipo: "Cerveza",
        marca: "Victoria",
        submarca: "Victoria Normal",
        presentaciones: [
          { tipo: "Lata", capacidad: "330ml", precioUnitario: 18.0, descuentoSixPack: true, precioPorSix: 102 },
          { tipo: "Latón", capacidad: "410ml", precioUnitario: 22.0, descuentoSixPack: true, precioPorSix: 122 },
          { tipo: "Mega Lata", capacidad: "710ml", precioUnitario: 35.0, descuentoSixPack: true, precioPorSix: 192 },
          { tipo: "Cuarto Retornable", capacidad: "210ml", precioUnitario: 15.0, esRetornable: true, precioPorCarton: 360 },
          { tipo: "Media Retornable", capacidad: "355ml", precioUnitario: 20.0, esRetornable: true, precioPorCarton: 480 },
          { tipo: "Mega Retornable", capacidad: "1.2lt", precioUnitario: 55.0, esRetornable: true, precioPorCarton: 660 },
          { tipo: "Familiar Retornable", capacidad: "940ml", precioUnitario: 50.0, esRetornable: true, precioPorCarton: 600 },
        ],
      },
      {
        tipo: "Cerveza",
        marca: "Victoria",
        submarca: "Victoria Chamoy",
        presentaciones: [
          { tipo: "Latón", capacidad: "473ml", precioUnitario: 25.0, descuentoSixPack: true, precioPorSix: 140 },
        ],
      },
      {
        tipo: "Cerveza",
        marca: "Victoria",
        submarca: "Victoria Cempasúchil",
        presentaciones: [
          { tipo: "Latón", capacidad: "473ml", precioUnitario: 25.0, descuentoSixPack: true, precioPorSix: 140 },
        ],
      },
      {
        tipo: "Cerveza",
        marca: "Victoria",
        submarca: "Victoria Mango",
        presentaciones: [
          { tipo: "Latón", capacidad: "473ml", precioUnitario: 25.0, descuentoSixPack: true, precioPorSix: 140 },
        ],
      },
    ];

    productosDB.insert(datosIniciales, (error) => {
      if (error) console.error("Error al insertar datos iniciales:", error);
    });
  }
});

export default productosDB;
