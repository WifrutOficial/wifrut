export const isAprobado = (req, res, next) => {
    if (!req.user || req.user.estadoCuenta !== "aprobado") {
        return res.status(403).json({ message: "Tu cuenta aún no ha sido aprobada" });
    }
    next();
};
