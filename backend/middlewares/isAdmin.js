export const isAdmin = (req, res, next) => {
    const { tipoUsuario } = req.user;


    if (tipoUsuario !== 'admin') {
        return res.status(403).json({ message: "Acceso denegado. Solo administradores." });
    }

    next();
};
