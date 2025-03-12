import { useAuth } from "../context/AuthContext";
import { Navigate, Outlet } from "react-router-dom";

function ProtectedRouter({ allowedRoles = [] }) {
  const { isAuthenticated, user } = useAuth();

  console.log("ProtectedRouter ejecutándose...");
  console.log("Auth status:", { isAuthenticated, user });

  if (!isAuthenticated) {
    console.log("❌ Usuario no autenticado → Redirigiendo a /login");
    return <Navigate to="/login" replace />;
  }

  if (
    user?.tipoUsuario === "mayorista" &&
    user?.estadoCuenta === "pendiente" &&
    window.location.pathname !== "/esperando-aprobacion"
  ) {
    console.log("✅ Usuario pendiente → Redirigiendo una sola vez");
    return <Navigate to="/esperando-aprobacion" replace />;
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(user?.tipoUsuario)) {
    console.log("❌ Usuario sin rol permitido → Redirigiendo a /");
    return <Navigate to="/" replace />;
  }

  console.log("✅ Renderizando Outlet...");
  return <Outlet />;
}
export default ProtectedRouter;

