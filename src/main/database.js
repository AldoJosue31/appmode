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
      { tipo: "Cerveza", marca: "Victoria", subMarcas: ["Normal", "Chamoy", "Cempasúchil"], tamanos: ["Lata 330", "Vidrio 940"] },
      { tipo: "Cerveza", marca: "Corona", subMarcas: ["Extra", "Light", "Cero"], tamanos: ["Vidrio 355", "Vidrio 940"] },
      { tipo: "Producto", marca: "Sabritas", subMarcas: ["Rancheritos", "Doritos"], tamanos: [] },
      { tipo: "Producto", marca: "Marinela", subMarcas: ["Gansito", "Chocorroles"], tamanos: [] },
    ];
    productosDB.insert(datosIniciales, (error) => {
      if (error) console.error("Error al insertar datos iniciales:", error);
    });
  }
});

export default productosDB;
