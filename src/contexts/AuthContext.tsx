import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { User, AuthState } from '../types';
import { MockAuthService } from '../services/mockAuthService';
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

// Simulación de base de datos de usuarios en localStorage
const USERS_KEY = 'streamflow_users';
const getStoredUsers = (): User[] => {
  try {
    const users = localStorage.getItem(USERS_KEY);
    return users ? JSON.parse(users) : [];
  } catch {
    return [];
  }
};

const saveUser = (user: User) => {
  const users = getStoredUsers();
  const existingIndex = users.findIndex(u => u.email === user.email);
  
  if (existingIndex >= 0) {
    users[existingIndex] = user;
  } else {
    users.push(user);
  }
  
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
};

const findUserByEmail = (email: string): User | null => {
  const users = getStoredUsers();
  return users.find(u => u.email === email) || null;
};

// Validaciones mejoradas
const validateEmail = (email: string): string | null => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email) return 'El email es requerido';
  if (!emailRegex.test(email)) return 'Formato de email inválido';
  return null;
};

const validatePassword = (password: string): string | null => {
  if (!password) return 'La contraseña es requerida';
  if (password.length < 6) return 'La contraseña debe tener al menos 6 caracteres';
  if (!/(?=.*[a-z])/.test(password)) return 'La contraseña debe contener al menos una letra minúscula';
  if (!/(?=.*[A-Z])/.test(password)) return 'La contraseña debe contener al menos una letra mayúscula';
  if (!/(?=.*\d)/.test(password)) return 'La contraseña debe contener al menos un número';
  return null;
};

const validateName = (name: string): string | null => {
  if (!name) return 'El nombre es requerido';
  if (name.length < 2) return 'El nombre debe tener al menos 2 caracteres';
  if (name.length > 50) return 'El nombre no puede exceder 50 caracteres';
  if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(name)) return 'El nombre solo puede contener letras y espacios';
  return null;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  useEffect(() => {
    // Verificar sesión almacenada al cargar
    const user = MockAuthService.getCurrentUser();
    const token = MockAuthService.getToken();
    
    if (user && token) {
      dispatch({ type: 'LOGIN_SUCCESS', payload: { user, token } });
    }
  }, []);

  const login = async (email: string, password: string) => {
    dispatch({ type: 'LOGIN_START' });
    
    try {
      const { user, token } = await MockAuthService.login(email, password);
      dispatch({ type: 'LOGIN_SUCCESS', payload: { user, token } });
      toast.success(`¡Bienvenido de vuelta, ${user.name}!`);
    } catch (error: any) {
      dispatch({ type: 'LOGIN_FAILURE' });
      toast.error(error.message || 'Error de inicio de sesión. Inténtalo de nuevo.');
      throw error;
    }
  };

  const register = async (email: string, password: string, name: string) => {
    dispatch({ type: 'LOGIN_START' });
    
    try {
      const { user, token } = await MockAuthService.register(email, password, name);
      dispatch({ type: 'LOGIN_SUCCESS', payload: { user, token } });
      toast.success(`¡Bienvenido a StreamFlow Music, ${user.name}!`);
    } catch (error: any) {
      dispatch({ type: 'LOGIN_FAILURE' });
      toast.error(error.message || 'Error en el registro. Inténtalo de nuevo.');
      throw error;
    }
  };

  const logout = () => {
    MockAuthService.logout();
    dispatch({ type: 'LOGOUT' });
    toast.success('Sesión cerrada exitosamente');
  };

  const updateProfile = async (updates: Partial<User>) => {
    if (!state.user) return;
    
    try {
      const updatedUser = await MockAuthService.updateProfile(updates);
      dispatch({ type: 'UPDATE_USER', payload: updatedUser });
      toast.success('Perfil actualizado exitosamente');
    } catch (error: any) {
      toast.error(error.message || 'Error al actualizar el perfil');
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