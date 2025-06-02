import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const AuthContext = createContext();


export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);


  const checkAuthStatus = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/login`,
        { withCredentials: true }
      );

      if (response.data?.user) {
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


  const login = async (email, password) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/login`,
        { email, password },
        {
          withCredentials: true,
          headers: { "Content-Type": "application/json" },
        }
      );

      if (response.data?.user) {
        const u = response.data.user;
       
        setIsAuthenticated(true);
        setUser({
          ...u,
          name: u.nombre,
          phone: u.phone,
        });
        console.log("Respuesta del login:", response.data);
        return response.data.user;
      } else {
        throw new Error("Usuario no recibido en la respuesta.");
      }
    } catch (error) {
      console.error("Error en login:", error.response?.data || error.message);
      throw error.response?.data?.msg || "Error en el servidor";
    }
  };

  
  const logout = async () => {
    try {
      await axios.post(
        `${import.meta.env.VITE_API_URL}/api/logout`,
        {},
        { withCredentials: true }
      );
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
