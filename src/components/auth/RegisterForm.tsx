import React from 'react';
import { motion } from 'framer-motion';
import { useForm, Controller } from 'react-hook-form';
import { Mail, Lock, User, Eye, EyeOff, AlertCircle } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { Button } from '../common/Button';
import { Input } from '../common/Input';
import { PasswordStrength } from '../common/PasswordStrength';

interface RegisterFormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  terms: boolean;
}

interface RegisterFormProps {
  onSwitchToLogin: () => void;
}

export const RegisterForm: React.FC<RegisterFormProps> = ({ onSwitchToLogin }) => {
  const { register: registerUser, isLoading } = useAuth();
  const [showPassword, setShowPassword] = React.useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);
  
  const {
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<RegisterFormData>();

  const password = watch('password');

  const onSubmit = async (data: RegisterFormData) => {
    try {
      await registerUser(data.email, data.password, data.name);
    } catch (error) {
      console.error('Error al registrar:', error);
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
        <h1 className="text-3xl font-bold text-white mb-2">Crear Cuenta</h1>
        <p className="text-gray-400">Únete a StreamFlow Music hoy</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <Controller
          name="name"
          control={control}
          rules={{
            required: 'El nombre es requerido',
            minLength: {
              value: 2,
              message: 'El nombre debe tener al menos 2 caracteres',
            },
            maxLength: {
              value: 50,
              message: 'El nombre no puede exceder 50 caracteres',
            },
            pattern: {
              value: /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/,
              message: 'El nombre solo puede contener letras y espacios',
            },
          }}
          render={({ field }) => (
            <div className="space-y-1">
              <Input
                {...field}
                type="text"
                name="name"
                label="Nombre Completo"
                placeholder="Ingresa tu nombre completo"
                leftIcon={<User className="w-4 h-4" />}
                error={errors.name?.message}
                className={errors.name ? 'border-red-500 focus:border-red-500' : ''}
              />
              {errors.name && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center text-red-400 text-sm"
                >
                  <AlertCircle className="w-4 h-4 mr-1" />
                  {errors.name.message}
                </motion.div>
              )}
            </div>
          )}
        />

        <Controller
          name="email"
          control={control}
          rules={{
            required: 'El correo electrónico es requerido',
            pattern: {
              value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
              message: 'Formato de email inválido',
            },
          }}
          render={({ field }) => (
            <div className="space-y-1">
              <Input
                {...field}
                type="email"
                name="email"
                label="Correo Electrónico"
                placeholder="ejemplo@correo.com"
                leftIcon={<Mail className="w-4 h-4" />}
                error={errors.email?.message}
                className={errors.email ? 'border-red-500 focus:border-red-500' : ''}
              />
              {errors.email && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center text-red-400 text-sm"
                >
                  <AlertCircle className="w-4 h-4 mr-1" />
                  {errors.email.message}
                </motion.div>
              )}
            </div>
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
            validate: {
              hasLowercase: (value) => /[a-z]/.test(value) || 'Debe contener al menos una letra minúscula',
              hasUppercase: (value) => /[A-Z]/.test(value) || 'Debe contener al menos una letra mayúscula',
              hasNumber: (value) => /\d/.test(value) || 'Debe contener al menos un número',
            },
          }}
          render={({ field }) => (
            <div className="space-y-1">
              <Input
                {...field}
                type={showPassword ? 'text' : 'password'}
                name="password"
                label="Contraseña"
                placeholder="Crea una contraseña segura"
                leftIcon={<Lock className="w-4 h-4" />}
                rightIcon={
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-gray-400 hover:text-white transition-colors"
                    tabIndex={-1}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                }
                error={errors.password?.message}
                className={errors.password ? 'border-red-500 focus:border-red-500' : ''}
              />
              {errors.password && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center text-red-400 text-sm"
                >
                  <AlertCircle className="w-4 h-4 mr-1" />
                  {errors.password.message}
                </motion.div>
              )}
              <PasswordStrength password={field.value || ''} />
            </div>
          )}
        />

        <Controller
          name="confirmPassword"
          control={control}
          rules={{
            required: 'Por favor confirma tu contraseña',
            validate: (value) => value === password || 'Las contraseñas no coinciden',
          }}
          render={({ field }) => (
            <div className="space-y-1">
              <Input
                {...field}
                type={showConfirmPassword ? 'text' : 'password'}
                name="confirmPassword"
                label="Confirmar Contraseña"
                placeholder="Confirma tu contraseña"
                leftIcon={<Lock className="w-4 h-4" />}
                rightIcon={
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="text-gray-400 hover:text-white transition-colors"
                    tabIndex={-1}
                  >
                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                }
                error={errors.confirmPassword?.message}
                className={errors.confirmPassword ? 'border-red-500 focus:border-red-500' : ''}
              />
              {errors.confirmPassword && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center text-red-400 text-sm"
                >
                  <AlertCircle className="w-4 h-4 mr-1" />
                  {errors.confirmPassword.message}
                </motion.div>
              )}
            </div>
          )}
        />

        <Controller
          name="terms"
          control={control}
          rules={{
            required: 'Debes aceptar los términos y condiciones',
          }}
          render={({ field: { onChange, value, ...field } }) => (
            <div className="flex flex-col space-y-1">
              <div className="flex items-start">
                <input
                  type="checkbox"
                  id="terms"
                  checked={value || false}
                  onChange={(e) => onChange(e.target.checked)}
                  className="rounded border-gray-700 bg-gray-800 text-purple-600 focus:ring-purple-500 focus:ring-offset-gray-900 mt-1"
                  {...field}
                />
                <div className="ml-3">
                  <label htmlFor="terms" className="text-sm text-gray-400">
                    Acepto los{' '}
                    <a href="#" className="text-purple-400 hover:text-purple-300">
                      Términos de Servicio
                    </a>{' '}
                    y{' '}
                    <a href="#" className="text-purple-400 hover:text-purple-300">
                      Política de Privacidad
                    </a>
                  </label>
                </div>
              </div>
              {errors.terms && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center text-red-400 text-sm"
                >
                  <AlertCircle className="w-4 h-4 mr-1" />
                  {errors.terms.message as string}
                </motion.div>
              )}
            </div>
          )}
        />

        <Button
          type="submit"
          variant="primary"
          size="lg"
          fullWidth
          isLoading={isLoading}
        >
          Crear Cuenta
        </Button>
      </form>

      <div className="mt-8 text-center">
        <p className="text-gray-400">
          ¿Ya tienes una cuenta?{' '}
          <button
            onClick={onSwitchToLogin}
            className="text-purple-400 hover:text-purple-300 font-medium"
          >
            Iniciar Sesión
          </button>
        </p>
      </div>
    </motion.div>
  );
};