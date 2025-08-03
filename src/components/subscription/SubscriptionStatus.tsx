import React from 'react';
import { motion } from 'framer-motion';
import { Crown, CheckCircle, AlertCircle, Calendar, CreditCard, Users } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { Button } from '../common/Button';

export const SubscriptionStatus: React.FC = () => {
  const { user } = useAuth();

  if (!user?.subscription || user.subscription.type === 'free') {
    return null;
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'text-green-400';
      case 'past_due':
        return 'text-yellow-400';
      case 'cancelled':
        return 'text-red-400';
      default:
        return 'text-gray-400';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <CheckCircle className="w-4 h-4" />;
      case 'past_due':
        return <AlertCircle className="w-4 h-4" />;
      case 'cancelled':
        return <AlertCircle className="w-4 h-4" />;
      default:
        return <AlertCircle className="w-4 h-4" />;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getPlanIcon = () => {
    if (user?.subscription?.features?.familyPlan) {
      return <Users className="w-5 h-5" />;
    }
    return <Crown className="w-5 h-5" />;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gray-800/50 rounded-2xl p-6 border border-gray-700"
    >
      <div className="flex items-center gap-3 mb-4">
        {getPlanIcon()}
        <div>
          <h3 className="text-xl font-bold text-white">
            Plan {user.subscription.type === 'monthly' ? 'Mensual' : 'Anual'}
          </h3>
          <div className="flex items-center gap-2">
            {getStatusIcon(user.subscription.status)}
            <span className={`text-sm font-medium ${getStatusColor(user.subscription.status)}`}>
              {user.subscription.status === 'active' ? 'Activo' : 
               user.subscription.status === 'cancelled' ? 'Cancelado' :
               user.subscription.status === 'expired' ? 'Expirado' : 'Desconocido'}
            </span>
          </div>
        </div>
      </div>

      <div className="space-y-3 mb-6">
        <div className="flex items-center justify-between">
          <span className="text-gray-400 text-sm">Fecha de inicio:</span>
          <span className="text-white text-sm">{formatDate(user.subscription.startDate)}</span>
        </div>
        
        {user.subscription.endDate && (
          <div className="flex items-center justify-between">
            <span className="text-gray-400 text-sm">Fecha de finalización:</span>
            <span className="text-white text-sm">{formatDate(user.subscription.endDate)}</span>
          </div>
        )}

        {user.subscription.stripeSubscriptionId && (
          <div className="flex items-center justify-between">
            <span className="text-gray-400 text-sm">ID de Suscripción:</span>
            <span className="text-white text-sm font-mono text-xs">
              {user.subscription.stripeSubscriptionId.slice(-8)}
            </span>
          </div>
        )}
      </div>

      {/* Features */}
      {user.subscription.features && (
        <div className="mb-6">
          <h4 className="text-white font-medium mb-3">Características incluidas:</h4>
          <div className="space-y-2">
            {user.subscription.features.adFree && (
              <div className="flex items-center gap-2 text-sm">
                <CheckCircle className="w-4 h-4 text-green-400" />
                <span className="text-gray-300">Sin anuncios</span>
              </div>
            )}
            {user.subscription.features.offlineDownload && (
              <div className="flex items-center gap-2 text-sm">
                <CheckCircle className="w-4 h-4 text-green-400" />
                <span className="text-gray-300">Descarga offline</span>
              </div>
            )}
            {user.subscription.features.highQualityAudio && (
              <div className="flex items-center gap-2 text-sm">
                <CheckCircle className="w-4 h-4 text-green-400" />
                <span className="text-gray-300">Audio de alta calidad</span>
              </div>
            )}
            {user.subscription.features.unlimitedSkips && (
              <div className="flex items-center gap-2 text-sm">
                <CheckCircle className="w-4 h-4 text-green-400" />
                <span className="text-gray-300">Saltos ilimitados</span>
              </div>
            )}
            {user.subscription.features.exclusiveContent && (
              <div className="flex items-center gap-2 text-sm">
                <CheckCircle className="w-4 h-4 text-green-400" />
                <span className="text-gray-300">Contenido exclusivo</span>
              </div>
            )}
            {user.subscription.features.familyPlan && (
              <div className="flex items-center gap-2 text-sm">
                <CheckCircle className="w-4 h-4 text-green-400" />
                <span className="text-gray-300">Plan familiar (6 cuentas)</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-3">
        <Button
          variant="secondary"
          size="sm"
          className="flex-1"
          leftIcon={<Calendar className="w-4 h-4" />}
        >
          Gestionar Suscripción
        </Button>
        <Button
          variant="secondary"
          size="sm"
          className="flex-1"
          leftIcon={<CreditCard className="w-4 h-4" />}
        >
          Método de Pago
        </Button>
      </div>
    </motion.div>
  );
}; 