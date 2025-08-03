import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { CreditCard, Lock, Shield, ArrowLeft, AlertCircle } from 'lucide-react';
import { StripePlan, PaymentIntent } from '../../types';
import { mockStripeOperations } from '../../services/stripeService';
import { Button } from '../common/Button';
import toast from 'react-hot-toast';

interface CheckoutFormProps {
  selectedPlan: StripePlan;
  onBack: () => void;
  onSuccess: () => void;
}

interface FormErrors {
  cardNumber?: string;
  expiryDate?: string;
  cvv?: string;
  cardholderName?: string;
}

export const CheckoutForm: React.FC<CheckoutFormProps> = ({
  selectedPlan,
  onBack,
  onSuccess
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [paymentIntent, setPaymentIntent] = useState<PaymentIntent | null>(null);
  const [cardNumber, setCardNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
  const [cardholderName, setCardholderName] = useState('');
  const [errors, setErrors] = useState<FormErrors>({});
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    // Simular creación del payment intent
    const initializePayment = async () => {
      setIsLoading(true);
      try {
        // En desarrollo, usar operaciones mock
        const intent = await mockStripeOperations.createPaymentIntent(selectedPlan.id);
        setPaymentIntent(intent);
      } catch (error) {
        toast.error('Error al inicializar el pago');
        console.error('Error initializing payment:', error);
      } finally {
        setIsLoading(false);
      }
    };

    initializePayment();
  }, [selectedPlan.id]);

  const formatPrice = (price: number, currency: string) => {
    const amount = price / 100;
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: currency.toUpperCase(),
    }).format(amount);
  };

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    if (parts.length) {
      return parts.join(' ');
    } else {
      return v;
    }
  };

  const formatExpiryDate = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    if (v.length >= 2) {
      return v.substring(0, 2) + '/' + v.substring(2, 4);
    }
    return v;
  };

  const validateCardNumber = (value: string): string | undefined => {
    const cleanValue = value.replace(/\s/g, '');
    if (!cleanValue) return 'El número de tarjeta es requerido';
    if (cleanValue.length < 13) return 'El número de tarjeta debe tener al menos 13 dígitos';
    if (cleanValue.length > 19) return 'El número de tarjeta no puede tener más de 19 dígitos';
    return undefined;
  };

  const validateExpiryDate = (value: string): string | undefined => {
    if (!value) return 'La fecha de expiración es requerida';
    const [month, year] = value.split('/');
    if (!month || !year) return 'Formato inválido (MM/YY)';
    
    const monthNum = parseInt(month);
    const yearNum = parseInt('20' + year);
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth() + 1;

    if (monthNum < 1 || monthNum > 12) return 'Mes inválido';
    if (yearNum < currentYear || (yearNum === currentYear && monthNum < currentMonth)) {
      return 'La tarjeta ha expirado';
    }
    return undefined;
  };

  const validateCVV = (value: string): string | undefined => {
    if (!value) return 'El CVV es requerido';
    if (value.length < 3) return 'El CVV debe tener al menos 3 dígitos';
    if (value.length > 4) return 'El CVV no puede tener más de 4 dígitos';
    return undefined;
  };

  const validateCardholderName = (value: string): string | undefined => {
    if (!value.trim()) return 'El nombre del titular es requerido';
    if (value.trim().length < 2) return 'El nombre debe tener al menos 2 caracteres';
    return undefined;
  };

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCardNumber(e.target.value);
    setCardNumber(formatted);
    const error = validateCardNumber(formatted);
    setErrors(prev => ({ ...prev, cardNumber: error }));
  };

  const handleExpiryDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatExpiryDate(e.target.value);
    setExpiryDate(formatted);
    const error = validateExpiryDate(formatted);
    setErrors(prev => ({ ...prev, expiryDate: error }));
  };

  const handleCVVChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '');
    setCvv(value);
    const error = validateCVV(value);
    setErrors(prev => ({ ...prev, cvv: error }));
  };

  const handleCardholderNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setCardholderName(value);
    const error = validateCardholderName(value);
    setErrors(prev => ({ ...prev, cardholderName: error }));
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {
      cardNumber: validateCardNumber(cardNumber),
      expiryDate: validateExpiryDate(expiryDate),
      cvv: validateCVV(cvv),
      cardholderName: validateCardholderName(cardholderName)
    };

    setErrors(newErrors);
    return !Object.values(newErrors).some(error => error);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error('Por favor corrige los errores en el formulario');
      return;
    }

    setIsProcessing(true);
    
    try {
      // Simular procesamiento del pago
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Simular creación de suscripción
      await mockStripeOperations.createSubscription(selectedPlan.id);
      
      toast.success('¡Suscripción activada exitosamente!');
      onSuccess();
    } catch (error) {
      toast.error('Error al procesar el pago');
      console.error('Error processing payment:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const isFormValid = cardNumber && expiryDate && cvv && cardholderName && 
                     !Object.values(errors).some(error => error);

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="max-w-md mx-auto"
    >
      {/* Header */}
      <div className="text-center mb-8">
        <Button
          variant="ghost"
          size="sm"
          onClick={onBack}
          className="mb-4"
          leftIcon={<ArrowLeft className="w-4 h-4" />}
        >
          Volver a planes
        </Button>
        
        <h2 className="text-2xl font-bold text-white mb-2">
          Completar Compra
        </h2>
        <p className="text-gray-400">
          {selectedPlan.name} - {formatPrice(selectedPlan.price, selectedPlan.currency)}
        </p>
      </div>

      {/* Payment Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Card Information */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Número de Tarjeta
            </label>
            <div className="relative">
              <CreditCard className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                value={cardNumber}
                onChange={handleCardNumberChange}
                placeholder="1234 5678 9012 3456"
                className={`w-full bg-gray-800 text-white rounded-lg pl-10 pr-4 py-3 border focus:outline-none transition-colors ${
                  errors.cardNumber 
                    ? 'border-red-500 focus:border-red-500' 
                    : 'border-gray-700 focus:border-purple-500'
                }`}
                maxLength={19}
              />
              {errors.cardNumber && (
                <div className="flex items-center gap-1 mt-1 text-red-400 text-xs">
                  <AlertCircle className="w-3 h-3" />
                  {errors.cardNumber}
                </div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Fecha de Expiración
              </label>
              <input
                type="text"
                value={expiryDate}
                onChange={handleExpiryDateChange}
                placeholder="MM/YY"
                className={`w-full bg-gray-800 text-white rounded-lg px-4 py-3 border focus:outline-none transition-colors ${
                  errors.expiryDate 
                    ? 'border-red-500 focus:border-red-500' 
                    : 'border-gray-700 focus:border-purple-500'
                }`}
                maxLength={5}
              />
              {errors.expiryDate && (
                <div className="flex items-center gap-1 mt-1 text-red-400 text-xs">
                  <AlertCircle className="w-3 h-3" />
                  {errors.expiryDate}
                </div>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                CVV
              </label>
              <input
                type="text"
                value={cvv}
                onChange={handleCVVChange}
                placeholder="123"
                className={`w-full bg-gray-800 text-white rounded-lg px-4 py-3 border focus:outline-none transition-colors ${
                  errors.cvv 
                    ? 'border-red-500 focus:border-red-500' 
                    : 'border-gray-700 focus:border-purple-500'
                }`}
                maxLength={4}
              />
              {errors.cvv && (
                <div className="flex items-center gap-1 mt-1 text-red-400 text-xs">
                  <AlertCircle className="w-3 h-3" />
                  {errors.cvv}
                </div>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Nombre del Titular
            </label>
            <input
              type="text"
              value={cardholderName}
              onChange={handleCardholderNameChange}
              placeholder="Como aparece en la tarjeta"
              className={`w-full bg-gray-800 text-white rounded-lg px-4 py-3 border focus:outline-none transition-colors ${
                errors.cardholderName 
                  ? 'border-red-500 focus:border-red-500' 
                  : 'border-gray-700 focus:border-purple-500'
              }`}
            />
            {errors.cardholderName && (
              <div className="flex items-center gap-1 mt-1 text-red-400 text-xs">
                <AlertCircle className="w-3 h-3" />
                {errors.cardholderName}
              </div>
            )}
          </div>
        </div>

        {/* Security Info */}
        <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
          <div className="flex items-center gap-2 text-gray-400 text-sm mb-2">
            <Lock className="w-4 h-4" />
            <span>Pago Seguro</span>
          </div>
          <p className="text-gray-500 text-xs">
            Tu información de pago está protegida con encriptación SSL de 256 bits.
          </p>
        </div>

        {/* Order Summary */}
        <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
          <h3 className="text-white font-medium mb-3">Resumen del Pedido</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-400">Plan:</span>
              <span className="text-white">{selectedPlan.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Precio:</span>
              <span className="text-white">{formatPrice(selectedPlan.price, selectedPlan.currency)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Impuestos:</span>
              <span className="text-white">Incluidos</span>
            </div>
            <hr className="border-gray-700 my-2" />
            <div className="flex justify-between font-medium">
              <span className="text-white">Total:</span>
              <span className="text-white">{formatPrice(selectedPlan.price, selectedPlan.currency)}</span>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          variant="primary"
          size="lg"
          className="w-full"
          disabled={isProcessing || !isFormValid}
        >
          {isProcessing ? (
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Procesando Pago...
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4" />
              Completar Compra
            </div>
          )}
        </Button>

        {/* Terms */}
        <p className="text-gray-500 text-xs text-center">
          Al completar la compra, aceptas nuestros{' '}
          <a href="#" className="text-purple-400 hover:underline">Términos de Servicio</a>
          {' '}y{' '}
          <a href="#" className="text-purple-400 hover:underline">Política de Privacidad</a>
        </p>
      </form>
    </motion.div>
  );
}; 