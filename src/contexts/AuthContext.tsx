import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { User, AuthState } from '../types';
import toast from 'react-hot-toast';

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  logout: () => void;
  updateProfile: (updates: Partial<User>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

type AuthAction =
  | { type: 'LOGIN_START' }
  | { type: 'LOGIN_SUCCESS'; payload: { user: User; token: string } }
  | { type: 'LOGIN_FAILURE' }
  | { type: 'LOGOUT' }
  | { type: 'UPDATE_USER'; payload: User };

const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case 'LOGIN_START':
      return { ...state, isLoading: true };
    case 'LOGIN_SUCCESS':
      return {
        ...state,
        isLoading: false,
        isAuthenticated: true,
        user: action.payload.user,
        token: action.payload.token,
      };
    case 'LOGIN_FAILURE':
      return {
        ...state,
        isLoading: false,
        isAuthenticated: false,
        user: null,
        token: null,
      };
    case 'LOGOUT':
      return {
        ...state,
        isAuthenticated: false,
        user: null,
        token: null,
      };
    case 'UPDATE_USER':
      return {
        ...state,
        user: action.payload,
      };
    default:
      return state;
  }
};

const initialState: AuthState = {
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: false,
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  useEffect(() => {
    // Check for stored token on app load
    const token = localStorage.getItem('streamflow_token');
    const userData = localStorage.getItem('streamflow_user');
    
    if (token && userData) {
      try {
        const user = JSON.parse(userData);
        dispatch({ type: 'LOGIN_SUCCESS', payload: { user, token } });
      } catch (error) {
        console.error('Error al cargar el usuario:', error);
        localStorage.removeItem('streamflow_token');
        localStorage.removeItem('streamflow_user');
      }
    }
  }, []);

  const login = async (email: string, password: string) => {
    dispatch({ type: 'LOGIN_START' });
    
    try {
      console.log('Iniciando sesión para:', email);
      // Simulate API call - in production this would be a real API endpoint
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock successful login
      const user: User = {
        id: '1',
        email,
        name: email.split('@')[0],
        createdAt: new Date().toISOString(),
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${email}`,
        subscription: {
          id: '1',
          type: 'free',
          startDate: new Date().toISOString(),
          status: 'active',
          userId: '1',
        },
      };
      
      const token = 'mock-jwt-token-' + Date.now();
      
      localStorage.setItem('streamflow_token', token);
      localStorage.setItem('streamflow_user', JSON.stringify(user));
      
      dispatch({ type: 'LOGIN_SUCCESS', payload: { user, token } });
      toast.success('¡Bienvenido a StreamFlow Music!');
    } catch (error) {
      dispatch({ type: 'LOGIN_FAILURE' });
      toast.error('Error de inicio de sesión. Inténtalo de nuevo.');
      throw error;
    }
  };

  const register = async (email: string, password: string, name: string) => {
    dispatch({ type: 'LOGIN_START' });
    
    try {
        // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1200));
      
      const user: User = {
        id: '1',
        email,
        name,
        createdAt: new Date().toISOString(),
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${email}`,
        subscription: {
          id: '1',
          type: 'free',
          startDate: new Date().toISOString(),
          status: 'active',
          userId: '1',
        },
      };
      
      const token = 'mock-jwt-token-' + Date.now();
      
      localStorage.setItem('streamflow_token', token);
      localStorage.setItem('streamflow_user', JSON.stringify(user));
      
      dispatch({ type: 'LOGIN_SUCCESS', payload: { user, token } });
      toast.success('¡Cuenta creada exitosamente!');
    } catch (error) {
      dispatch({ type: 'LOGIN_FAILURE' });
      toast.error('Error en el registro. Inténtalo de nuevo.');
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('streamflow_token');
    localStorage.removeItem('streamflow_user');
    dispatch({ type: 'LOGOUT' });
    toast.success('Sesión cerrada exitosamente');
  };

  const updateProfile = async (updates: Partial<User>) => {
    if (!state.user) return;
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const updatedUser = { ...state.user, ...updates };
      localStorage.setItem('streamflow_user', JSON.stringify(updatedUser));
      dispatch({ type: 'UPDATE_USER', payload: updatedUser });
      toast.success('Perfil actualizado exitosamente');
    } catch (error) {
      toast.error('Error al actualizar el perfil');
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{
      ...state,
      login,
      register,
      logout,
      updateProfile,
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};