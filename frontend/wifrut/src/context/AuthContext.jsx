import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const storedToken = localStorage.getItem('token');
    
    if (storedUser && storedToken) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
        setIsAuthenticated(true);
        
      
        axios.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
      
      } catch (error) {
     
        localStorage.removeItem('user');
        localStorage.removeItem('token');
      }
    }
    
    setLoading(false);
  }, []);

  const checkAuthStatus = async () => {
    try {
   
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/login`,
        { withCredentials: true }
      );

      if (response.data?.user) {
        setIsAuthenticated(true);
        setUser(response.data.user);
        localStorage.setItem('user', JSON.stringify(response.data.user));
      } else {
    
        const storedUser = localStorage.getItem('user');
        const storedToken = localStorage.getItem('token');
        
        if (storedUser && storedToken) {
          setUser(JSON.parse(storedUser));
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
          setUser(null);
        }
      }
    } catch (error) {
    
      const storedUser = localStorage.getItem('user');
      const storedToken = localStorage.getItem('token');
      
      if (storedUser && storedToken) {
        setUser(JSON.parse(storedUser));
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
        setUser(null);
      }
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
       
      
        if (response.data.token) {
        
          localStorage.setItem('token', response.data.token);
       
          axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;
        } else {
          console.warn("No token received in login response!");
        }
        
      
        const userData = {
          ...u,
          name: u.nombre,
          phone: u.phone,
        };
        
      
        localStorage.setItem('user', JSON.stringify(userData));
        
        setIsAuthenticated(true);
        setUser(userData);
       
        return userData;
      } else {
       
        throw new Error("Usuario no recibido en la respuesta.");
      }
    } catch (error) {
     
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
      
      // Clean up localStorage
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      
      // Clear default auth header
      delete axios.defaults.headers.common['Authorization'];
      
      setIsAuthenticated(false);
      setUser(null);
    } catch (error) {
      console.error("Error al cerrar sesión", error);
      // Still remove local data on error
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      delete axios.defaults.headers.common['Authorization'];
      setIsAuthenticated(false);
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
