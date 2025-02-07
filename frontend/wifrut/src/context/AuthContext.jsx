import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";


const AuthContext = createContext();

// Proveedor del contexto de autenticación
export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);

  // Verificacion de token en las cookies
  const checkAuthStatus = async () => {
    try {
      const response = await axios.get("http://localhost:3000/api/login", { withCredentials: true });
      if (response.data.user) {
        setIsAuthenticated(true);
        setUser(response.data.user);
      } else {
        setIsAuthenticated(false);
        setUser(null);
      }
    } catch (error) {
      setIsAuthenticated(false);
      setUser(null);
    }
  };

  useEffect(() => {
    checkAuthStatus();
  }, []);

  // FUNCIÓN LOGIN
  const login = async (email, password) => {
    try {
      const response = await axios.post(
        "http://localhost:3000/api/login",
        { email, password },
        { withCredentials: true }
      );
  
      const userData = response.data.user;
      console.log("Usuario autenticado:", userData); // 🛑 Verifica qué datos llegan
  
      setIsAuthenticated(true);
      setUser(userData);
  
      return userData; // Retorna el usuario logueado para usar en Login.js
    } catch (error) {
      throw error.response?.data?.msg || "Error en el servidor";
    }
  };

  //FUNCIÓN LOGOUT
  const logout = async () => {
    try {
      await axios.post("http://localhost:3000/api/logout", {}, { withCredentials: true });
      setIsAuthenticated(false);
      setUser(null);
    } catch (error) {
      console.error("Error al cerrar sesión", error);
    }
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
