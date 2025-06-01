import Register from "../models/register.js";
import MayoristaData from "../models/mayoristaData.js";
import mongoose from "mongoose";

export const cambiarEstadoAprobado = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "ID no válido" });
    }

    const updateResult = await Register.updateOne(
      { _id: id },
      { $set: { estadoCuenta: "aprobado" } }
    );

    if (updateResult.modifiedCount > 0) {
      return res.json({
        message: "Estado de cuenta cambiado a aprobado correctamente.",
      });
    } else {
      return res
        .status(404)
        .json({ message: "No se encontró ningún registro para actualizar." });
    }
  } catch (error) {
    console.error("Error al cambiar estado de cuenta:", error);
    res.status(500).json({ message: "Error del servidor" });
  }
};

export const getMayoristasAprobados = async (req, res) => {
  try {
    const mayoristas = await MayoristaData.find()
      .populate("userId", "nombre email estadoCuenta")
      .exec();

    const mayoristasAprobados = mayoristas.filter(
      (mayorista) => mayorista.userId.estadoCuenta === "aprobado"
    );

    res.status(200).json(mayoristasAprobados);
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: "Error al obtener mayoristas aprobados" });
  }
};

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
    const mayoristas = await MayoristaData.find()
      .populate({
        path: "userId",
        select: "nombre email phone tipoUsuario estadoCuenta",
        match: { estadoCuenta: "pendiente" },
      })
      .exec();

    const mayoristasPendientes = mayoristas.filter(
      (mayorista) => mayorista.userId
    );

    if (mayoristasPendientes.length === 0) {
      return res
        .status(404)
        .json({ message: "No se encontraron mayoristas pendientes." });
    }

    res.status(200).json(mayoristasPendientes);
  } catch (error) {
    console.error("Error en obtenerDatosMayorista:", error);
    res
      .status(500)
      .json({ message: "Error al obtener los datos.", error: error.message });
  }
};
