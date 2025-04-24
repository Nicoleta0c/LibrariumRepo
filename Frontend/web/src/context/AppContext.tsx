import { createContext, useContext, useState, ReactNode } from 'react';

interface User {
  id: string;
  name: string;
  email: string;
  admin_user: boolean;
}

interface AppContextProps {
  isAuthenticated: boolean;
  user: User | null;
  loginUser: (user: User) => void;
  logoutUser: () => void;
}

const AppContext = createContext<AppContextProps | undefined>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const loginUser = (userData: User) => {
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
  };

  const logoutUser = () => {
    localStorage.removeItem('user');
    setUser(null);
  };

  return (
    <AppContext.Provider value={{ isAuthenticated: !!user, user, loginUser, logoutUser }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};




//traer todo lo que tenga que ver con usuario, data, ordenes que tienen.
//tener generalizacion, el hook que trabaja con usuario pueda usar eso
//contexto solo a memorizar data
//userservice