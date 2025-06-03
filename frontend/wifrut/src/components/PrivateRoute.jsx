import { useAuth } from "../context/AuthContext";
import { Navigate, Outlet, useLocation } from "react-router-dom";

function ProtectedRouter({ allowedRoles = [] }) {
  const { isAuthenticated, user, loading } = useAuth();
  const location = useLocation();

  // Show a loader while checking authentication
  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh' 
      }}>
        <div style={{
          border: '4px solid rgba(0, 0, 0, 0.1)',
          borderLeft: '4px solid #005234',
          borderRadius: '50%',
          width: '30px',
          height: '30px',
          animation: 'spin 1s linear infinite'
        }}></div>
        <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  if (!isAuthenticated) {
    console.log("Not authenticated, redirecting to login");
    return <Navigate to="/login" replace />;
  }

  if (
    user?.tipoUsuario === "mayorista" &&
    user?.estadoCuenta === "pendiente" &&
    location.pathname !== "/contacto-mayorista" &&
    location.pathname !== "/paginadeespera" 
  ) {
    console.log("Mayorista pending approval, redirecting to contact");
    return <Navigate to="/contacto-mayorista" replace />;
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(user?.tipoUsuario)) {
    console.log("User doesn't have required role:", user?.tipoUsuario);
    return <Navigate to="/" replace />;
  }

  console.log("Protected route access granted for:", user?.nombre);
  return <Outlet />;
}

export default ProtectedRouter;
