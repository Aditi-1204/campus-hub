import { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

const safeParseUser = () => {
  try {
    const saved = localStorage.getItem('campushub_user');
    return saved ? JSON.parse(saved) : null;
  } catch {
    localStorage.removeItem('campushub_user');
    return null;
  }
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(safeParseUser);

  const token = localStorage.getItem('campushub_token');

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

  // Safe role check — never crashes if user is null
  const isRole = (role) => user?.role === role;

  // Safe field accessor — returns fallback if user or field is null
  const getUserField = (field, fallback = '') => user?.[field] ?? fallback;

  return (
    <AuthContext.Provider value={{ user, token, login, logout, isRole, getUserField }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
