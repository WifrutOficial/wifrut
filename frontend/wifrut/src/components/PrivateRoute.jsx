import { useAuth } from "../context/AuthContext";
import { Navigate, Outlet } from "react-router-dom";

function ProtectedRouter({ allowedRoles = [] }) { // Agregamos un valor por defecto
  const { isAuthenticated, user } = useAuth();

  // 1️⃣ Si no está autenticado, redirige al login
  if (!isAuthenticated) return <Navigate to="/login" replace />;

  // 2️⃣ Si es mayorista con cuenta pendiente, redirige a "/esperando-aprobacion"
  if (user?.tipoUsuario === "mayorista" && user?.estadoCuenta === "pendiente") {
    return <Navigate to="/esperando-aprobacion" replace />;
  }

  // 3️⃣ Si no tiene el rol permitido, lo redirige a "/"
  if (allowedRoles.length > 0 && !allowedRoles.includes(user?.tipoUsuario)) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}

export default ProtectedRouter;

