import MayoristaData from "../models/mayoristaData.js";

export const guardarDatosMayorista = async (req, res) => {
  try {
    const { cuil, provincia, localidad, aniosActividad } = req.body;
    const userId = req.user.userId;  // Cambié req.user.id por req.user.userId
    // Aquí estamos obteniendo el userId desde la autenticación

    console.log('UserId:', userId); // Verifica el valor de userId

    // Verificar si ya existe un registro para este usuario
    const existente = await MayoristaData.findOne({ userId });
    if (existente) {
      return res
        .status(400)
        .json({ message: "Ya completaste este formulario." });
    }

    // Crear y guardar los datos
    const nuevoMayorista = new MayoristaData({
      userId,
      cuil,
      provincia,
      localidad,
      aniosActividad,
    });
    await nuevoMayorista.save();
    res.status(201).json({ message: "Datos guardados exitosamente." });
  } catch (error) {
    console.error(error); // Imprime el error para depurar
    res
      .status(500)
      .json({ message: "Error al guardar los datos.", error: error.message });
  }
};


export const obtenerDatosMayorista = async (req, res) => {
  try {
    const userId = req.user.id; // Obtener el userId del usuario autenticado

    // Buscar si existe un registro para este usuario
    const existente = await MayoristaData.findOne({ userId });

    if (!existente) {
      return res.status(404).json({ message: "Formulario no encontrado." });
    }

    // Si el registro existe, devolver los datos
    return res.status(200).json({ data: existente });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Error al obtener los datos.", error: error.message });
  }
};
