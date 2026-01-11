import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { User, AuthState } from './types';

interface AuthContextType extends AuthState {
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  register: (userData: any) => Promise<void>;
}

/* ================= CONTEXT ================= */

const AuthContext = createContext<AuthContextType | undefined>(undefined);

/* ================= PROVIDER ================= */

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true
  });

  const isHydrated = useRef(false);
  const isLogging = useRef(false);

  /* ===== HYDRATE SESSION ===== */
  useEffect(() => {
    try {
      const savedUser = localStorage.getItem('chess_user');

      if (savedUser) {
        const parsedUser: User = JSON.parse(savedUser);
        setState({
          user: parsedUser,
          isAuthenticated: true,
          isLoading: false
        });
      } else {
        setState(prev => ({ ...prev, isLoading: false }));
      }
    } catch (err) {
      console.error('Auth hydrate failed:', err);
      localStorage.removeItem('chess_user');
      setState({ user: null, isAuthenticated: false, isLoading: false });
    } finally {
      isHydrated.current = true;
    }
  }, []);

  /* ===== LOGIN ===== */
  const login = async (username: string, password: string) => {
    if (isLogging.current) return;
    isLogging.current = true;

    return new Promise<void>((resolve) => {
      setTimeout(() => {
        const mockUser: User = {
          id: 'u_' + Date.now(),
          username,
          fullName: username.split('@')[0],
          avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${username}`,
          rating: 1200,
          token: 'jwt_mock_token_' + Date.now()
        };

        localStorage.setItem('chess_user', JSON.stringify(mockUser));

        setState(prev => ({
          ...prev,
          user: mockUser,
          isAuthenticated: true,
          isLoading: false
        }));

        isLogging.current = false;
        resolve();
      }, 700);
    });
  };

  /* ===== LOGOUT ===== */
  const logout = () => {
    localStorage.removeItem('chess_user');

    setState({
      user: null,
      isAuthenticated: false,
      isLoading: false
    });
  };

  /* ===== REGISTER ===== */
  const register = async (userData: any) => {
    if (!userData?.username) {
      throw new Error('Invalid register data');
    }
    return login(userData.username, userData.password || '');
  };

  /* ===== CONTEXT VALUE ===== */
  const value: AuthContextType = {
    ...state,
    login,
    logout,
    register
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

/* ================= HOOK ================= */

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
