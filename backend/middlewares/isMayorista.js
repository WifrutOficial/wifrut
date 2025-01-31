export const isMayorista = (req, res, next) => {
    const { tipoUsuario } = req.user;
    if (tipoUsuario !== "mayorista") {
      return res.status(403).json({ message: "Acceso denegado. Solo mayoristas." });
    }
    next();
  };
  
