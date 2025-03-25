export const isAdmin = (req, res, next) => {
    const { tipoUsuario } = req.user;
    console.log("tipoUsuario:", tipoUsuario);

    if (tipoUsuario !== 'admin') {
        return res.status(403).json({ message: "Acceso denegado. Solo administradores." });
    }

    next();
};
