import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Simple user type for session management
export interface SessionUser {
  userId: string;
  email: string;
  name: string;
}

interface AuthContextType {
  currentUser: SessionUser | null;
  isLoggedIn: boolean;
  login: (user: SessionUser) => void;
  logout: () => void;
  setCurrentUser: (user: SessionUser | null) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AUTH_STORAGE_KEY = 'auth_session';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUserState] = useState<SessionUser | null>(() => {
    const stored = sessionStorage.getItem(AUTH_STORAGE_KEY);
    return stored ? JSON.parse(stored) : null;
  });

  useEffect(() => {
    if (currentUser) {
      sessionStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(currentUser));
    } else {
      sessionStorage.removeItem(AUTH_STORAGE_KEY);
    }
  }, [currentUser]);

  const login = (user: SessionUser) => {
    setCurrentUserState(user);
  };

  const logout = () => {
    setCurrentUserState(null);
  };

  const setCurrentUser = (user: SessionUser | null) => {
    setCurrentUserState(user);
  };

  return (
    <AuthContext.Provider value={{
      currentUser,
      isLoggedIn: currentUser !== null,
      login,
      logout,
      setCurrentUser,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
