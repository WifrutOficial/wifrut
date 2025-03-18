import MayoristaData from "../models/mayoristaData.js";



//este controlador guarda los datos del formulario de esperando-aprobacion (mayorista)
export const guardarDatosMayorista = async (req, res) => {
  try {
    const { cuil, provincia, localidad, aniosActividad } = req.body;
    const userId = req.user?.userId; // Verificar si req.user existe y tiene userId

    if (!userId) {
      return res.status(400).json({ message: "El usuario no está autenticado." });
    }

    console.log('UserId recibido:', userId); // Para depuración

    // Verificar si ya existe un registro para este usuario
    const existente = await MayoristaData.findOne({ userId });
    if (existente) {
      return res.status(400).json({ message: "Ya completaste este formulario." });
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
    console.error(error); 
    res.status(500).json({ message: "Error al guardar los datos.", error: error.message });
  }
};

