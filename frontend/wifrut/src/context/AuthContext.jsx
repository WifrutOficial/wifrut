import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check if user data is in localStorage whenever the component mounts
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const storedToken = localStorage.getItem('token');
    
    if (storedUser && storedToken) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
        setIsAuthenticated(true);
        
        // Set default auth header for all future requests
        axios.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
        console.log("Restored auth from localStorage:", parsedUser.nombre);
      } catch (error) {
        console.error("Error parsing stored user data:", error);
        localStorage.removeItem('user');
        localStorage.removeItem('token');
      }
    }
    
    setLoading(false);
  }, []);

  const checkAuthStatus = async () => {
    try {
      // First try with cookies (normal flow)
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/login`,
        { withCredentials: true }
      );

      if (response.data?.user) {
        setIsAuthenticated(true);
        setUser(response.data.user);
        localStorage.setItem('user', JSON.stringify(response.data.user));
      } else {
        // If cookies don't work, check localStorage
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
      // Try with localStorage token as fallback
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
      console.log("Attempting login for:", email);
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/login`,
        { email, password },
        {
          withCredentials: true,
          headers: { "Content-Type": "application/json" },
        }
      );

      console.log("Login response:", response.data);

      if (response.data?.user) {
        const u = response.data.user;
       
        // IMPORTANT: Save token to localStorage for Safari fallback
        if (response.data.token) {
          console.log("Saving token to localStorage");
          localStorage.setItem('token', response.data.token);
          // Set default auth header for all future requests
          axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;
        } else {
          console.warn("No token received in login response!");
        }
        
        // Save user data to localStorage
        const userData = {
          ...u,
          name: u.nombre,
          phone: u.phone,
        };
        
        console.log("Saving user data to localStorage:", userData);
        localStorage.setItem('user', JSON.stringify(userData));
        
        setIsAuthenticated(true);
        setUser(userData);
        console.log("Authentication successful:", userData.nombre);
        return userData;
      } else {
        console.error("No user data in response:", response.data);
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
