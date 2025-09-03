// frontend/src/context/AuthContext.jsx
import { createContext, useContext, useEffect, useState } from "react";
import { authAPI } from "../utils/authAPI";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  /* Auto-login on refresh */
  useEffect(() => {
    (async () => {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          const profile = await authAPI.getCurrentUser();
          setUser(profile);
        } catch {
          localStorage.removeItem("token");
        }
      }
      setLoading(false);
    })();
  }, []);

  const login = async (credentials) => {
    const { token, user: u } = await authAPI.loginUser(credentials);
    localStorage.setItem("token", token);
    setUser(u);
  };

  const register = async (data) => {
    const { token, user: u } = await authAPI.registerUser(data);
    localStorage.setItem("token", token);
    setUser(u);
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user,setUser, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);