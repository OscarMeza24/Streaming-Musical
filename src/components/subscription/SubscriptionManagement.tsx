import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  CreditCard,
  Calendar,
  AlertCircle,
  CheckCircle,
  RefreshCw,
  X,
  Download,
  Shield
} from 'lucide-react';
import { BillingInfo } from '../../types';
import { 
  getBillingInfo, 
  cancelSubscription, 
  reactivateSubscription,
  getBillingHistory 
} from '../../services/stripeService';
import { Button } from '../common/Button';
import toast from 'react-hot-toast';

interface SubscriptionManagementProps {
  onUpdatePaymentMethod?: () => void;
}

interface BillingHistoryItem {
  id: string;
  amount: number;
  currency: string;
  status: string;
  date: string;
  description: string;
}

export const SubscriptionManagement: React.FC<SubscriptionManagementProps> = ({
  onUpdatePaymentMethod
}) => {
  const [billingInfo, setBillingInfo] = useState<BillingInfo | null>(null);
  const [billingHistory, setBillingHistory] = useState<BillingHistoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [showHistory, setShowHistory] = useState(false);

  useEffect(() => {
    loadBillingData();
  }, []);

  const loadBillingData = async () => {
    setIsLoading(true);
    try {
      const [billing, history] = await Promise.all([
        getBillingInfo(),
        getBillingHistory()
      ]);
      setBillingInfo(billing);
      setBillingHistory(history);
    } catch (error) {
      console.error('Error loading billing data:', error);
      toast.error('Error al cargar la información de facturación');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelSubscription = async () => {
    if (!billingInfo?.subscriptionId) return;

    const confirmed = window.confirm(
      '¿Estás seguro de que quieres cancelar tu suscripción? Continuarás teniendo acceso hasta el final del período actual.'
    );

    if (!confirmed) return;

    setIsUpdating(true);
    try {
      await cancelSubscription(billingInfo.subscriptionId);
      await loadBillingData();
      toast.success('Suscripción cancelada. Seguirás teniendo acceso hasta el final del período.');
    } catch (error) {
      console.error('Error canceling subscription:', error);
      toast.error('Error al cancelar la suscripción');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleReactivateSubscription = async () => {
    if (!billingInfo?.subscriptionId) return;

    setIsUpdating(true);
    try {
      await reactivateSubscription(billingInfo.subscriptionId);
      await loadBillingData();
      toast.success('Suscripción reactivada exitosamente');
    } catch (error) {
      console.error('Error reactivating subscription:', error);
      toast.error('Error al reactivar la suscripción');
    } finally {
      setIsUpdating(false);
    }
  };

  const formatPrice = (price: number, currency: string) => {
    const amount = price / 100;
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: currency.toUpperCase(),
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Intl.DateTimeFormat('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(new Date(dateString));
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!billingInfo?.subscriptionId) {
    return (
      <div className="text-center py-12">
        <AlertCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-white mb-2">
          No tienes una suscripción activa
        </h3>
        <p className="text-gray-400 mb-6">
          Suscríbete a un plan para acceder a todas las funciones premium.
        </p>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Current Subscription */}
      <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-semibold text-white">
            Suscripción Actual
          </h3>
          <div className="flex items-center gap-2 text-green-400">
            <CheckCircle className="w-5 h-5" />
            <span className="text-sm font-medium">Activa</span>
          </div>
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-400 mb-1">Plan</label>
              <p className="text-white font-medium">{billingInfo.plan?.name}</p>
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">Precio</label>
              <p className="text-white font-medium">
                {billingInfo.plan && formatPrice(billingInfo.plan.price, billingInfo.plan.currency)}
                <span className="text-gray-400 text-sm ml-1">
                  /{billingInfo.plan?.interval === 'month' ? 'mes' : 'año'}
                </span>
              </p>
            </div>
          </div>

          {billingInfo.nextBillingDate && (
            <div>
              <label className="block text-sm text-gray-400 mb-1">
                Próxima facturación
              </label>
              <div className="flex items-center gap-2 text-white">
                <Calendar className="w-4 h-4" />
                {formatDate(billingInfo.nextBillingDate)}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Payment Method */}
      {billingInfo.paymentMethod && (
        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-semibold text-white">
              Método de Pago
            </h3>
            <Button
              variant="outline"
              size="sm"
              onClick={onUpdatePaymentMethod}
              leftIcon={<RefreshCw className="w-4 h-4" />}
            >
              Actualizar
            </Button>
          </div>

          <div className="flex items-center gap-4">
            <div className="w-12 h-8 bg-gray-700 rounded flex items-center justify-center">
              <CreditCard className="w-5 h-5 text-gray-400" />
            </div>
            <div>
              <p className="text-white font-medium">
                **** **** **** {billingInfo.paymentMethod.last4}
              </p>
              <p className="text-gray-400 text-sm">
                {billingInfo.paymentMethod.brand.toUpperCase()} • 
                Expira {billingInfo.paymentMethod.expMonth}/{billingInfo.paymentMethod.expYear}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
        <h3 className="text-xl font-semibold text-white mb-4">
          Gestionar Suscripción
        </h3>

        <div className="space-y-3">
          <Button
            variant="outline"
            onClick={() => setShowHistory(!showHistory)}
            leftIcon={<Download className="w-4 h-4" />}
            className="w-full justify-start"
          >
            {showHistory ? 'Ocultar' : 'Ver'} Historial de Facturación
          </Button>

          <Button
            variant="outline"
            onClick={onUpdatePaymentMethod}
            leftIcon={<CreditCard className="w-4 h-4" />}
            className="w-full justify-start"
          >
            Actualizar Método de Pago
          </Button>

          {billingInfo.plan && !billingInfo.plan.name.includes('cancelado') ? (
            <Button
              variant="outline"
              onClick={handleCancelSubscription}
              disabled={isUpdating}
              leftIcon={<X className="w-4 h-4" />}
              className="w-full justify-start text-red-400 border-red-400 hover:bg-red-400/10"
            >
              {isUpdating ? 'Cancelando...' : 'Cancelar Suscripción'}
            </Button>
          ) : (
            <Button
              variant="outline"
              onClick={handleReactivateSubscription}
              disabled={isUpdating}
              leftIcon={<RefreshCw className="w-4 h-4" />}
              className="w-full justify-start text-green-400 border-green-400 hover:bg-green-400/10"
            >
              {isUpdating ? 'Reactivando...' : 'Reactivar Suscripción'}
            </Button>
          )}
        </div>
      </div>

      {/* Billing History */}
      {showHistory && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden"
        >
          <div className="p-6 border-b border-gray-700">
            <h3 className="text-xl font-semibold text-white">
              Historial de Facturación
            </h3>
          </div>

          <div className="divide-y divide-gray-700">
            {billingHistory.length > 0 ? (
              billingHistory.map((item) => (
                <div key={item.id} className="p-4 hover:bg-gray-750 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-2 h-2 rounded-full ${
                        item.status === 'paid' ? 'bg-green-400' : 
                        item.status === 'pending' ? 'bg-yellow-400' : 'bg-red-400'
                      }`} />
                      <div>
                        <p className="text-white font-medium">
                          {item.description || 'Pago de suscripción'}
                        </p>
                        <p className="text-gray-400 text-sm">
                          {formatDate(item.date)}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-white font-medium">
                        {formatPrice(item.amount, item.currency)}
                      </p>
                      <p className={`text-sm capitalize ${
                        item.status === 'paid' ? 'text-green-400' : 
                        item.status === 'pending' ? 'text-yellow-400' : 'text-red-400'
                      }`}>
                        {item.status === 'paid' ? 'Pagado' : 
                         item.status === 'pending' ? 'Pendiente' : 'Fallido'}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-8 text-center">
                <p className="text-gray-400">No hay historial de facturación disponible</p>
              </div>
            )}
          </div>
        </motion.div>
      )}

      {/* Security Notice */}
      <div className="bg-blue-900/20 border border-blue-700 rounded-lg p-4">
        <div className="flex items-center gap-2 text-blue-400 mb-2">
          <Shield className="w-5 h-5" />
          <span className="font-medium">Información de Seguridad</span>
        </div>
        <p className="text-blue-200 text-sm">
          Todos los pagos están protegidos con encriptación SSL de 256 bits. 
          No almacenamos información de tarjetas de crédito en nuestros servidores.
        </p>
      </div>
    </motion.div>
  );
};
