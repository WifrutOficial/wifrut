import Register from "../models/register.js";
import MayoristaData from "../models/mayoristaData.js";
import mongoose from "mongoose"; // Asegúrate de importar mongoose


// cambia el estado cuenta del usuario mayorista de pendiente a aprobado 
export const cambiarEstadoAprobado = async (req, res) => {
  try {
    console.log("ID recibido:", req.params);  // <-- Agregar esto para depuración

    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "ID no válido" });
    }

    const updateResult = await Register.updateOne(
      { _id: id },
      { $set: { estadoCuenta: "aprobado" } }
    );

    if (updateResult.modifiedCount > 0) {
      return res.json({ message: "Estado de cuenta cambiado a aprobado correctamente." });
    } else {
      return res.status(404).json({ message: "No se encontró ningún registro para actualizar." });
    }
  } catch (error) {
    console.error("Error al cambiar estado de cuenta:", error);
    res.status(500).json({ message: "Error del servidor" });
  }
};


// Endpoint para obtener los mayoristas aprobados NO LO ESTOY USANDO??
export const getMayoristasAprobados = async (req, res) => {
  try {
    // Filtrar mayoristas con estadoCuenta 'aprobado'
    const mayoristas = await MayoristaData.find()
      .populate('userId', 'nombre email estadoCuenta') // Llenar los datos de `userId` (modelo Register)
      .exec();

    // Filtrar solo los mayoristas cuyo estadoCuenta es 'aprobado'
    const mayoristasAprobados = mayoristas.filter(
      (mayorista) => mayorista.userId.estadoCuenta === 'aprobado'
    );

    res.status(200).json(mayoristasAprobados);
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: "Error al obtener mayoristas aprobados" });
  }
};

// Obtener lista de usuarios que solicitaron ser mayoristas y no han sido aprobados
export const obtenerSolicitudesMayoristas = async (req, res) => {
  try {
    const usuarios = await Register.find({
      tipoUsuario: "mayorista",
      estadoCuenta: "pendiente",
    });
    res.json(usuarios);
    console.log(usuarios);
  } catch (error) {
    res.status(500).json({ message: "Error en el servidor" });
  }
};


export const obtenerDatosMayorista = async (req, res) => {
  try {
    console.log("Tipo de usuario:", req.user.tipoUsuario); // Verifica el usuario que hace la solicitud

    // Obtener los mayoristas con estado de cuenta "pendiente"
    const mayoristas = await MayoristaData.find()
      .populate({
        path: "userId",
        select: "nombre email phone tipoUsuario estadoCuenta", // Asegúrate de incluir el campo estadoCuenta
        match: { estadoCuenta: "pendiente" }, // Filtra por estado de cuenta "pendiente"
      })
      .exec();

    // Filtrar los mayoristas que realmente tengan el estado "pendiente"
    const mayoristasPendientes = mayoristas.filter(mayorista => mayorista.userId);

    console.log("Datos encontrados:", mayoristasPendientes);

    if (mayoristasPendientes.length === 0) {
      return res.status(404).json({ message: "No se encontraron mayoristas pendientes." });
    }

    res.status(200).json(mayoristasPendientes);
  } catch (error) {
    console.error("Error en obtenerDatosMayorista:", error);
    res.status(500).json({ message: "Error al obtener los datos.", error: error.message });
  }
};
