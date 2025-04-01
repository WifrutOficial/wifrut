import { useAuth } from "../context/AuthContext";
import { Navigate, Outlet, useLocation } from "react-router-dom";

function ProtectedRouter({ allowedRoles = [] }) {
  const { isAuthenticated, user } = useAuth();
  const location = useLocation();

  console.log("ProtectedRouter ejecutándose...");
  console.log("Auth status:", { isAuthenticated, user });

  if (!isAuthenticated) {
    console.log("❌ Usuario no autenticado → Redirigiendo a /login");
    return <Navigate to="/login" replace />;
  }

  if (
    user?.tipoUsuario === "mayorista" &&
    user?.estadoCuenta === "pendiente" &&
    location.pathname !== "/esperando-aprobacion" &&
    location.pathname !== "/paginadeespera" //Evitamos un bucle
  ) {
    console.log("✅ Usuario pendiente → Redirigiendo a /esperando-aprobacion");
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
