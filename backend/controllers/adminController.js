import Register from "../models/register.js";

//esto ahora no etsa haciendo nada
export const adminRouter = async (req, res) => {
  res.status(200).json({ message: "Panel de administración listo" });
};

export const aprobarMayorista = async (req, res) => {
  const { id } = req.params;
  const { estadoCuenta } = req.body;
  try {
    const user = await Register.findById(id);

    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    if (user.tipoUsuario !== "mayorista") {
      return res.status(400).json({ message: "El usuario no es mayorista" });
    }

    // Validar que el estadoCuenta solo acepte valores permitidos
    if (!["aprobado", "pendiente", "rechazado"].includes(estadoCuenta)) {
      return res.status(400).json({ message: "Estado de cuenta no válido" });
    }

    user.estadoCuenta = estadoCuenta;
    await user.save();

    res.json({ message: `Cuenta ${estadoCuenta}`, user });
  } catch (error) {
    res.status(500).json({ message: "Error en el servidor" });
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
    console.log(usuarios)
  } catch (error) {
    res.status(500).json({ message: "Error en el servidor" });
  }
};
