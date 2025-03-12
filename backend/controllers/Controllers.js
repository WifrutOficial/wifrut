import Register from "../models/register.js";
import { createAccessToken } from "../token/token.js";

//controlador para guardar en la BD y validar en el back en registro.
export const postRegister = async (req, res) => {
    try {
      console.log("ESSTOS SON LOS DATOS DEL BACKEN",req.body)
        const { nombre, email,phone, password , tipoUsuario} = req.body;
    
        if (!nombre || !email ||!phone|| !password ||!tipoUsuario) {
          return res.status(400).json({ msg: "Todos los campos son obligatorios." });
        }
    
  
        const existingUser = await Register.findOne({ email });
        if (existingUser) {
          return res.status(400).json({ msg: "El email ya está registrado." });
        }
    
    
        const register = new Register({ nombre, email,phone, password ,  tipoUsuario,  estadoCuenta: tipoUsuario === "mayorista" ? "pendiente" : "aprobado",});
 
        await register.save();
    
        res.status(201).json({
          msg: "Registro exitoso",
          tipoUsuario: register.tipoUsuario,
          estadoCuenta: register.estadoCuenta,  // Asegúrate de incluir el estadoCuenta aquí
        });
      } catch (error) {
        // Manejar errores de validación (por ejemplo, la contraseña no cumple con los requisitos)
        if (error.name === "ValidationError") {
          return res.status(400).json({ msg: error.message });
        }
    
        res.status(500).json({
          msg: "Error al procesar la solicitud. Por favor, inténtelo nuevamente.",
          error: error.message,
        });
      }
};

export const postLogin = async (req, res) => {
  
  try {
    const { email, password } = req.body;

    const user = await Register.findOne({ email }).select("+password");
    if (!user) {
      return res.status(401).json({ msg: "Usuario no encontrado" });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      console.log("Contraseña incorrecta"); // 🛑 Asegúrate de que esto aparece en la terminal del backend
    return res.status(401).json({ msg: "Contraseña incorrecta" }); // ✅ IMPORTANTE: Enviar respuesta JSON
    }

    // Crear el token de verificación usando la función `createAccessToken`
    const payload = {
      userId: user._id,
      tipoUsuario: user.tipoUsuario,
      estadoCuenta: user.estadoCuenta, 
    };
    
    console.log("Payload que se enviará al token:", payload);  // Agrega un log para verificar el payload

    const token = await createAccessToken(payload);

    // Guardar el token en las cookies
    res.cookie("token", token, {
      httpOnly: true,
      secure: false, // Desactivar en desarrollo, activar en producción
      sameSite: "Lax",
      path: "/",
      maxAge: 24 * 60 * 60 * 1000, // 1 día
    });

    // Retornar el usuario sin la contraseña
    res.json({
      msg: "Inicio de sesión exitoso",
      user: {
        id: user._id,
        nombre: user.nombre,
        email: user.email,
        userName: user.userName,
        tipoUsuario: user.tipoUsuario,
        estadoCuenta: user.estadoCuenta,
      },
    });
  } catch (error) {
    res.status(500).json({ msg: "Error en el servidor" });
  }
}

export const logout = async (req, res) =>{
  res.clearCookie("token", { httpOnly: true, secure: process.env.NODE_ENV === "production" });
    res.json({ message: "Logout exitoso" });
}

