import Register from "../models/register.js";
import { createAccessToken } from "../token/token.js";

export const postRegister = async (req, res) => {
  try {
    const { nombre, email, phone, password, tipoUsuario } = req.body;

    if (!nombre || !email || !phone || !password || !tipoUsuario) {
      return res.status(400).json({
        errors: { general: "Todos los campos son obligatorios" },
      });
    }

    if (await Register.findOne({ email })) {
      return res.status(409).json({
        errors: { email: "El email ya está registrado" },
      });
    }

    const user = new Register({
      nombre,
      email,
      phone,
      password,
      tipoUsuario,
      estadoCuenta: tipoUsuario === "mayorista" ? "pendiente" : "aprobado",
    });
    await user.save();

    return res.status(201).json({
      message: "Registro exitoso",
      user: {
        nombre: user.nombre,
        tipoUsuario: user.tipoUsuario,
        estadoCuenta: user.estadoCuenta,
        phone: user.phone,
      },
    });
  } catch (error) {
    if (error.name === "ValidationError") {
      const errors = Object.values(error.errors).reduce((acc, err) => {
        acc[err.path] = err.message;
        return acc;
      }, {});
      return res.status(400).json({ errors });
    }

    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern)[0];
      return res.status(409).json({
        errors: { [field]: `El ${field} ya está registrado` },
      });
    }

    return res.status(500).json({
      errors: { general: "Error interno del servidor" },
    });
  }
};

// export const getMayoristas = async (req, res) => {
//   try {
//     const filtro = { tipoUsuario: "mayorista" };
//     const mayoristas = await Register.find(filtro).select("-password -__v");
//     res.json(mayoristas);
//   } catch (error) {
//     console.error("Error al obtener mayoristas:", error);
//     res.status(500).json({ message: "Error de servidor al obtener mayoristas" });
//   }
// };

export const postLogin = async (req, res) => {
  try {
    console.log("Datos de inicio de sesión:", req.body);
    const { email, password } = req.body;

    const user = await Register.findOne({ email }).select("+password +phone");

    if (!user) {
      return res.status(401).json({ message: "Usuario no encontrado" });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: "Contraseña incorrecta" });
    }

    const payload = {
      userId: user._id,
      tipoUsuario: user.tipoUsuario,
      estadoCuenta: user.estadoCuenta,
      phone: user.phone,
    };

    const token = await createAccessToken(payload);

    const isProd = process.env.NODE_ENV === "production";

    // Set secure cookie for production, use non-secure for local dev
    // const isProd = process.env.NODE_ENV === "production";
    res.cookie("token", token, {
      httpOnly: true,
      secure: isProd,
      sameSite: isProd ? "None" : "Lax",
      path: "/",
      maxAge: 5 * 24 * 60 * 60 * 1000,
    });

    res.json({
      message: "Inicio de sesión exitoso",
      token: token, // Include token in the response for browsers that block cookies
      user: {
        id: user._id,
        nombre: user.nombre,
        email: user.email,
        tipoUsuario: user.tipoUsuario,
        estadoCuenta: user.estadoCuenta,
        phone: user.phone,
      },
    });
  } catch (error) {
    console.error("Error en /api/login:", error);
    return res.status(500).json({ message: "Error en el servidor" });
  }
};

export const logout = async (req, res) => {
  const isProd = process.env.NODE_ENV === "production";
  res.clearCookie("token", {
    httpOnly: true,
    secure: isProd,
    sameSite: isProd ? "None" : "Lax",
    path: "/",
  });
  res.json({ message: "Logout exitoso" });
};
