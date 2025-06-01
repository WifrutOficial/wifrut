import { useAuth } from "../context/AuthContext";
import { Navigate, Outlet, useLocation } from "react-router-dom";

function ProtectedRouter({ allowedRoles = [] }) {
  const { isAuthenticated, user } = useAuth();
  const location = useLocation();



  if (!isAuthenticated) {
 
    return <Navigate to="/login" replace />;
  }

  if (
    user?.tipoUsuario === "mayorista" &&
    user?.estadoCuenta === "pendiente" &&
    location.pathname !== "/contacto-mayorista" &&
    location.pathname !== "/paginadeespera" 
  ) {

    return <Navigate to="/contacto-mayorista" replace />;
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(user?.tipoUsuario)) {
 
    return <Navigate to="/" replace />;
  }


  return <Outlet />;
}

export default ProtectedRouter;
