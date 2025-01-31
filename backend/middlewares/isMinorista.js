export const isMinorista = (req, res, next) => {
    const { tipoUsuario } = req.user;
    if (tipoUsuario !== "minorista") {
      return res.status(403).json({ message: "Acceso denegado. Solo minoristas." });
    }
    next();
  };