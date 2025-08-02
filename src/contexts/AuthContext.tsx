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
    const token = localStorage.getItem('streamflow_token');
    const userData = localStorage.getItem('streamflow_user');
    
    if (token && userData) {
      try {
        const user = JSON.parse(userData);
        // Verificar que el token no haya expirado (simulación)
        const tokenData = JSON.parse(atob(token.split('.')[1] || '{}'));
        const isExpired = tokenData.exp && Date.now() >= tokenData.exp * 1000;
        
        if (!isExpired) {
          dispatch({ type: 'LOGIN_SUCCESS', payload: { user, token } });
        } else {
          // Token expirado, limpiar
          localStorage.removeItem('streamflow_token');
          localStorage.removeItem('streamflow_user');
          toast.error('Tu sesión ha expirado. Por favor, inicia sesión nuevamente.');
        }
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
      // Validaciones
      const emailError = validateEmail(email);
      if (emailError) {
        throw new Error(emailError);
      }
      
      const passwordError = validatePassword(password);
      if (passwordError) {
        throw new Error(passwordError);
      }

      // Simular delay de red
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Buscar usuario
      const existingUser = findUserByEmail(email);
      if (!existingUser) {
        throw new Error('Usuario no encontrado. ¿Necesitas crear una cuenta?');
      }
      
      if (existingUser.password !== password) {
        throw new Error('Contraseña incorrecta');
      }
      
      // Crear token JWT simulado con expiración
      const tokenPayload = {
        userId: existingUser.id,
        email: existingUser.email,
        exp: Math.floor(Date.now() / 1000) + (24 * 60 * 60), // 24 horas
      };
      const token = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.${btoa(JSON.stringify(tokenPayload))}.signature`;
      
      localStorage.setItem('streamflow_token', token);
      localStorage.setItem('streamflow_user', JSON.stringify(existingUser));
      
      dispatch({ type: 'LOGIN_SUCCESS', payload: { user: existingUser, token } });
      toast.success(`¡Bienvenido de vuelta, ${existingUser.name}!`);
    } catch (error: any) {
      dispatch({ type: 'LOGIN_FAILURE' });
      toast.error(error.message || 'Error de inicio de sesión. Inténtalo de nuevo.');
      throw error;
    }
  };

  const register = async (email: string, password: string, name: string) => {
    dispatch({ type: 'LOGIN_START' });
    
    try {
      // Validaciones
      const emailError = validateEmail(email);
      if (emailError) {
        throw new Error(emailError);
      }
      
      const passwordError = validatePassword(password);
      if (passwordError) {
        throw new Error(passwordError);
      }
      
      const nameError = validateName(name);
      if (nameError) {
        throw new Error(nameError);
      }

      // Simular delay de red
      await new Promise(resolve => setTimeout(resolve, 1200));
      
      // Verificar si el usuario ya existe
      const existingUser = findUserByEmail(email);
      if (existingUser) {
        throw new Error('Ya existe una cuenta con este email');
      }
      
      // Crear nuevo usuario
      const newUser: User = {
        id: `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        email,
        name: name.trim(),
        password,
        createdAt: new Date().toISOString(),
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${email}`,
        subscription: {
          id: `sub_${Date.now()}`,
          type: 'free',
          startDate: new Date().toISOString(),
          status: 'active',
          userId: `user_${Date.now()}`,
        },
      };
      
      // Guardar usuario
      saveUser(newUser);
      
      // Crear token
      const tokenPayload = {
        userId: newUser.id,
        email: newUser.email,
        exp: Math.floor(Date.now() / 1000) + (24 * 60 * 60),
      };
      const token = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.${btoa(JSON.stringify(tokenPayload))}.signature`;
      
      localStorage.setItem('streamflow_token', token);
      localStorage.setItem('streamflow_user', JSON.stringify(newUser));
      
      dispatch({ type: 'LOGIN_SUCCESS', payload: { user: newUser, token } });
      toast.success(`¡Bienvenido a StreamFlow Music, ${newUser.name}!`);
    } catch (error: any) {
      dispatch({ type: 'LOGIN_FAILURE' });
      toast.error(error.message || 'Error en el registro. Inténtalo de nuevo.');
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
      // Validaciones
      if (updates.name) {
        const nameError = validateName(updates.name);
        if (nameError) {
          throw new Error(nameError);
        }
      }
      
      if (updates.email) {
        const emailError = validateEmail(updates.email);
        if (emailError) {
          throw new Error(emailError);
        }
        
        // Verificar que el nuevo email no esté en uso
        if (updates.email !== state.user.email) {
          const existingUser = findUserByEmail(updates.email);
          if (existingUser) {
            throw new Error('Este email ya está en uso');
          }
        }
      }

      // Simular delay de red
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const updatedUser = { ...state.user, ...updates };
      
      // Actualizar en el almacenamiento
      saveUser(updatedUser);
      localStorage.setItem('streamflow_user', JSON.stringify(updatedUser));
      
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