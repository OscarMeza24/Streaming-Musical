import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { User, AuthState } from '../types';
import { supabase } from '../lib/supabase';
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
    // Verificar sesión activa al cargar
    const checkSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session) {
          const user: User = {
            id: session.user.id,
            email: session.user.email || '',
            name: session.user.user_metadata?.name || session.user.email?.split('@')[0] || 'Usuario',
            avatar_url: session.user.user_metadata?.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${session.user.email}`,
            role: session.user.user_metadata?.role || 'normal',
            created_at: session.user.created_at || new Date().toISOString(),
            updated_at: session.user.created_at || new Date().toISOString(),
          };
          dispatch({
            type: 'LOGIN_SUCCESS',
            payload: {
              user,
              token: session.access_token
            }
          });
        }
      } catch (error) {
        console.error('Error al verificar la sesión:', error);
      }
    };

    checkSession();

    // Escuchar cambios en el estado de autenticación
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session) {
        const user: User = {
          id: session.user.id,
          email: session.user.email || '',
          name: session.user.user_metadata?.name || session.user.email?.split('@')[0] || 'Usuario',
          avatar_url: session.user.user_metadata?.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${session.user.email}`,
          role: session.user.user_metadata?.role || 'normal',
          created_at: session.user.created_at || new Date().toISOString(),
          updated_at: session.user.created_at || new Date().toISOString(),
        };
        dispatch({
          type: 'LOGIN_SUCCESS',
          payload: {
            user,
            token: session.access_token
          }
        });
      } else if (event === 'SIGNED_OUT') {
        dispatch({ type: 'LOGOUT' });
      }
    });

    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  const login = async (email: string, password: string) => {
    dispatch({ type: 'LOGIN_START' });

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
      if (!data.session) throw new Error('No se pudo iniciar sesión');

      const user: User = {
        id: data.user.id,
        email: data.user.email || '',
        name: data.user.user_metadata?.name || data.user.email?.split('@')[0] || 'Usuario',
        avatar_url: data.user.user_metadata?.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${data.user.email}`,
        role: data.user.user_metadata?.role || 'normal',
        created_at: data.user.created_at || new Date().toISOString(),
        updated_at: data.user.created_at || new Date().toISOString(),
      };

      dispatch({
        type: 'LOGIN_SUCCESS',
        payload: {
          user,
          token: data.session.access_token
        }
      });

      toast.success('¡Bienvenido de nuevo!');
    } catch (error: any) {
      console.error('Error al iniciar sesión:', error);
      dispatch({ type: 'LOGIN_FAILURE' });
      toast.error(error.message || 'Error al iniciar sesión');
    }
  };

  const register = async (email: string, password: string, name: string) => {
    dispatch({ type: 'LOGIN_START' });

    // Mostrar mensaje de carga
    const loadingToast = toast.loading('Creando tu cuenta...');

    try {

      // 1. Crear el usuario en Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name: name,
            avatar_url: `https://api.dicebear.com/7.x/avataaars/svg?seed=${name}`,
          },
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (authError) throw authError;
      if (!authData.user) throw new Error('No se pudo crear el usuario');

      // Cerrar el toast de carga
      toast.dismiss(loadingToast);

      // Mostrar mensaje de verificación de correo
      toast.success(
        `Hemos enviado un enlace de verificación a ${email}.\nPor favor revisa tu bandeja de entrada.`,
        {
          duration: 30000, // 30 segundos
          icon: '✉️',
          style: {
            padding: '16px',
            fontSize: '16px',
            maxWidth: '100%',
            whiteSpace: 'pre-line',
            minWidth: '350px',
            zIndex: 9999 // Asegurar que esté por encima de otros elementos
          },
          position: 'top-center' as const
        }
      );

      // Redirigir a la página de verificación de correo
      window.location.href = '/auth/verify-email';
      return;
    } catch (error: any) {
      // Cerrar el toast de carga en caso de error
      toast.dismiss(loadingToast);

      console.error('Error al registrar:', error);
      dispatch({ type: 'LOGIN_FAILURE' });

      // Mostrar mensaje de error más descriptivo
      const errorMessage = error.message.includes('already registered')
        ? 'Este correo ya está registrado. ¿Quieres iniciar sesión?'
        : 'Error al crear la cuenta. Por favor, inténtalo de nuevo.';

      toast.error(errorMessage, {
        duration: 15000, // 15 segundos para mensajes de error
        style: {
          padding: '16px',
          fontSize: '16px',
          maxWidth: '100%',
          margin: '0 auto',
          textAlign: 'center',
          minWidth: '350px',
          zIndex: 9999 // Asegurar que esté por encima de otros elementos
        },
        position: 'top-center' as const
      });
    }
  };

  const logout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;

      // Disparar evento personalizado para detener la música
      window.dispatchEvent(new CustomEvent('userLogout'));

      dispatch({ type: 'LOGOUT' });
      toast.success('Sesión cerrada correctamente');
    } catch (error: any) {
      console.error('Error al cerrar sesión:', error);
      toast.error(error.message || 'Error al cerrar sesión');
    }
  };

  const updateProfile = async (updates: Partial<User>) => {
    if (!state.user) return;

    try {
      // Actualizar los metadatos del usuario en Auth
      const { data, error } = await supabase.auth.updateUser({
        data: {
          name: updates.name,
          avatar_url: updates.avatar_url,
        }
      });

      if (error) throw error;
      if (!data.user) throw new Error('No se pudo actualizar el perfil');

      // Actualizar el perfil en la base de datos
      const { error: profileError } = await supabase
        .from('profiles')
        .upsert({
          id: state.user.id,
          name: updates.name,
          avatar_url: updates.avatar_url,
          updated_at: new Date().toISOString(),
        });

      if (profileError) throw profileError;

      // Actualizar el estado local
      const updatedUser = {
        ...state.user,
        ...updates,
      };

      dispatch({ type: 'UPDATE_USER', payload: updatedUser });
      toast.success('Perfil actualizado correctamente');
    } catch (error: any) {
      console.error('Error al actualizar el perfil:', error);
      toast.error(error.message || 'Error al actualizar el perfil');
    }
  };

  return (
    <AuthContext.Provider
      value={{
        ...state,
        login,
        register,
        logout,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth debe usarse dentro de un AuthProvider');
  }
  return context;
};