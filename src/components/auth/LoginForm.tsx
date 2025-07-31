import React from 'react';
import { motion } from 'framer-motion';
import { useForm, Controller } from 'react-hook-form';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { Button } from '../common/Button';
import { Input } from '../common/Input';

interface LoginFormData {
  email: string;
  password: string;
}

interface LoginFormProps {
  onSwitchToRegister: () => void;
}

export const LoginForm: React.FC<LoginFormProps> = ({ onSwitchToRegister }) => {
  const { login, isLoading } = useAuth();
  const [showPassword, setShowPassword] = React.useState(false);
  
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      await login(data.email, data.password);
    } catch (error) {
      console.error('Error al iniciar sesión:', error);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-md mx-auto"
    >
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl flex items-center justify-center mx-auto mb-4">
          <span className="text-white font-bold text-2xl">SF</span>
        </div>
        <h1 className="text-3xl font-bold text-white mb-2">Bienvenido de Nuevo</h1>
        <p className="text-gray-400">Inicia sesión para continuar en StreamFlow Music</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <Controller
          name="email"
          control={control}
          rules={{
            required: 'El correo electrónico es requerido',
            pattern: {
              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
              message: 'Correo electrónico inválido',
            },
          }}
          render={({ field }) => (
            <Input
              {...field}
              type="email"
              name="email"
              label="Correo Electrónico"
              placeholder="Ingresa tu correo electrónico"
              leftIcon={<Mail className="w-4 h-4" />}
              error={errors.email?.message}
            />
          )}
        />

        <Controller
          name="password"
          control={control}
          rules={{
            required: 'La contraseña es requerida',
            minLength: {
              value: 6,
              message: 'La contraseña debe tener al menos 6 caracteres',
            },
          }}
          render={({ field }) => (
            <Input
              {...field}
              type={showPassword ? 'text' : 'password'}
              name="password"
              label="Contraseña"
              placeholder="Ingresa tu contraseña"
              leftIcon={<Lock className="w-4 h-4" />}
              rightIcon={
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-gray-400 hover:text-white"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              }
              error={errors.password?.message}
            />
          )}
        />

        <div className="flex items-center justify-between">
          <label className="flex items-center">
            <input
              type="checkbox"
              className="rounded border-gray-700 bg-gray-800 text-purple-600 focus:ring-purple-500 focus:ring-offset-gray-900"
            />
            <span className="ml-2 text-sm text-gray-400">Recordarme</span>
          </label>
          <button
            type="button"
            className="text-sm text-purple-400 hover:text-purple-300"
          >
            ¿Olvidaste tu contraseña?
          </button>
        </div>

        <Button
          type="submit"
          variant="primary"
          size="lg"
          fullWidth
          isLoading={isLoading}
        >
         Iniciar Sesión
        </Button>
      </form>

      <div className="mt-8 text-center">
        <p className="text-gray-400">
         ¿No tienes una cuenta?{' '}
          <button
            onClick={onSwitchToRegister}
            className="text-purple-400 hover:text-purple-300 font-medium"
          >
           Regístrate
          </button>
        </p>
      </div>
    </motion.div>
  );
};