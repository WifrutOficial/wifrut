import { useAuth } from "../context/AuthContext";
import { Navigate, Outlet } from "react-router-dom";

function ProtectedRouter({ allowedRoles }) {
  const { isAuthenticated, user } = useAuth();

  // Si no está autenticado, lo redirige al login
  if (!isAuthenticated) return <Navigate to="/login" replace />;

  // Si no tiene el rol permitido, lo redirige a inicio
  if (allowedRoles && !allowedRoles.includes(user?.tipoUsuario)) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}

export default ProtectedRouter;
