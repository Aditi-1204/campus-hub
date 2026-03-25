import { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('campushub_user');
    return saved ? JSON.parse(saved) : null;
  });

  const login = (userData, token) => {
    localStorage.setItem('campushub_user', JSON.stringify(userData));
    localStorage.setItem('campushub_token', token);
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem('campushub_user');
    localStorage.removeItem('campushub_token');
    setUser(null);
  };

  return <AuthContext.Provider value={{ user, login, logout }}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
