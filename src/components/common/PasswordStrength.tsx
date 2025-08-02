import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, AlertCircle } from 'lucide-react';

interface PasswordStrengthProps {
  password: string;
}

interface PasswordRequirement {
  label: string;
  test: (password: string) => boolean;
  met: boolean;
}

export const PasswordStrength: React.FC<PasswordStrengthProps> = ({ password }) => {
  const requirements: PasswordRequirement[] = [
    {
      label: 'Al menos 6 caracteres',
      test: (pwd) => pwd.length >= 6,
      met: password.length >= 6,
    },
    {
      label: 'Una letra minúscula',
      test: (pwd) => /[a-z]/.test(pwd),
      met: /[a-z]/.test(password),
    },
    {
      label: 'Una letra mayúscula',
      test: (pwd) => /[A-Z]/.test(pwd),
      met: /[A-Z]/.test(password),
    },
    {
      label: 'Un número',
      test: (pwd) => /\d/.test(pwd),
      met: /\d/.test(password),
    },
  ];

  const metRequirements = requirements.filter(req => req.met).length;
  const strength = metRequirements / requirements.length;

  const getStrengthColor = () => {
    if (strength < 0.5) return 'bg-red-500';
    if (strength < 0.75) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  const getStrengthText = () => {
    if (strength < 0.5) return 'Débil';
    if (strength < 0.75) return 'Media';
    return 'Fuerte';
  };

  if (!password) return null;

  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      exit={{ opacity: 0, height: 0 }}
      className="mt-2 space-y-2"
    >
      {/* Barra de fortaleza */}
      <div className="space-y-1">
        <div className="flex justify-between items-center">
          <span className="text-xs text-gray-400">Fortaleza de contraseña</span>
          <span className={`text-xs font-medium ${
            strength < 0.5 ? 'text-red-400' : 
            strength < 0.75 ? 'text-yellow-400' : 'text-green-400'
          }`}>
            {getStrengthText()}
          </span>
        </div>
        <div className="w-full bg-gray-700 rounded-full h-2">
          <motion.div
            className={`h-2 rounded-full transition-all duration-300 ${getStrengthColor()}`}
            initial={{ width: 0 }}
            animate={{ width: `${strength * 100}%` }}
          />
        </div>
      </div>

      {/* Lista de requisitos */}
      <div className="space-y-1">
        {requirements.map((req, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="flex items-center gap-2 text-xs"
          >
            {req.met ? (
              <CheckCircle className="w-3 h-3 text-green-400" />
            ) : (
              <AlertCircle className="w-3 h-3 text-gray-500" />
            )}
            <span className={req.met ? 'text-green-400' : 'text-gray-500'}>
              {req.label}
            </span>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};
