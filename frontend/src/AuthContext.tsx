import React, { createContext, useState, useContext, ReactNode, useEffect } from "react";
import { authApi, UserApi } from "./services/api";

interface AuthContextType {
  isLoggedIn: boolean;
  username: string | null;
  setIsLoggedIn: (status: boolean) => void;
  setUsername: (name: string | null) => void;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => 
    sessionStorage.getItem('isLoggedIn') === 'true'
  );
  
  const [username, setUsername] = useState<string | null>(() => 
    sessionStorage.getItem('username')
  );

  const logout = async () => {
    try {
      await authApi.logout();
    } catch (error) {
      console.error('Logout error:', error);
    }
    setIsLoggedIn(false);
    setUsername(null);
    sessionStorage.removeItem('isLoggedIn');
    sessionStorage.removeItem('username');
  };

  useEffect(() => {
    UserApi.getOnlyUserDetails()
      .then(user => {
        if (user?.[0]?.name) {
          setIsLoggedIn(true);
          setUsername(user[0].name);
          sessionStorage.setItem('isLoggedIn', 'true');
          sessionStorage.setItem('username', user[0].name);
        } else {
          logout();
        }
      })
      .catch(() => {
        logout();
      });
  }, []);

  return (
    <AuthContext.Provider value={{ 
      isLoggedIn, 
      username, 
      setIsLoggedIn, 
      setUsername, 
      logout 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};