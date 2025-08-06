import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  useStripe, 
  useElements, 
  CardElement 
} from '@stripe/react-stripe-js';
import { 
  Lock, 
  Shield, 
  ArrowLeft, 
  AlertCircle,
  User
} from 'lucide-react';
import { StripePlan, PaymentIntent } from '../../types';
import { createPaymentIntent, createSubscription } from '../../services/stripeService';
import { Button } from '../common/Button';
import toast from 'react-hot-toast';

interface StripeCheckoutFormProps {
  selectedPlan: StripePlan;
  onBack: () => void;
  onSuccess: () => void;
}

const CARD_ELEMENT_OPTIONS = {
  style: {
    base: {
      fontSize: '16px',
      color: '#ffffff',
      '::placeholder': {
        color: '#9ca3af',
      },
      backgroundColor: 'transparent',
    },
    invalid: {
      color: '#ef4444',
      iconColor: '#ef4444',
    },
  },
  hidePostalCode: true,
};

export const StripeCheckoutForm: React.FC<StripeCheckoutFormProps> = ({
  selectedPlan,
  onBack,
  onSuccess
}) => {
  const stripe = useStripe();
  const elements = useElements();
  
  const [isLoading, setIsLoading] = useState(false);
  const [paymentIntent, setPaymentIntent] = useState<PaymentIntent | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [cardholderName, setCardholderName] = useState('');
  const [email, setEmail] = useState('');
  const [cardError, setCardError] = useState<string | null>(null);
  const [cardComplete, setCardComplete] = useState(false);

  useEffect(() => {
    const initializePayment = async () => {
      if (!stripe) return;
      
      setIsLoading(true);
      try {
        const intent = await createPaymentIntent(selectedPlan.id);
        setPaymentIntent(intent);
      } catch (error) {
        toast.error('Error al inicializar el pago');
        console.error('Error initializing payment:', error);
      } finally {
        setIsLoading(false);
      }
    };

    initializePayment();
  }, [selectedPlan.id, stripe]);

  const formatPrice = (price: number, currency: string) => {
    const amount = price / 100;
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: currency.toUpperCase(),
    }).format(amount);
  };

  const handleCardChange = (event: any) => {
    if (event.error) {
      setCardError(event.error.message);
    } else {
      setCardError(null);
    }
    setCardComplete(event.complete);
  };

  const validateForm = (): boolean => {
    if (!cardholderName.trim()) {
      setCardError('El nombre del titular es requerido');
      return false;
    }

    if (!email.trim() || !email.includes('@')) {
      setCardError('Se requiere un email válido');
      return false;
    }

    if (!cardComplete) {
      setCardError('Por favor completa los datos de la tarjeta');
      return false;
    }

    return true;
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements || !paymentIntent) {
      toast.error('Stripe no está cargado correctamente');
      return;
    }

    if (!validateForm()) {
      return;
    }

    setIsProcessing(true);
    setCardError(null);

    try {
      const cardElement = elements.getElement(CardElement);
      if (!cardElement) {
        throw new Error('Elemento de tarjeta no encontrado');
      }

      // Confirmar el pago con Stripe
      const { error: paymentError, paymentIntent: confirmedIntent } = await stripe.confirmCardPayment(
        paymentIntent.client_secret,
        {
          payment_method: {
            card: cardElement,
            billing_details: {
              name: cardholderName,
              email: email,
            },
          },
        }
      );

      if (paymentError) {
        setCardError(paymentError.message || 'Error en el pago');
        toast.error('Error al procesar el pago: ' + paymentError.message);
        return;
      }

      if (confirmedIntent?.status === 'succeeded') {
        // Extraer paymentMethodId de forma robusta
        let paymentMethodId = confirmedIntent.payment_method;
        if (!paymentMethodId) {
          toast.error('No se pudo obtener el método de pago.');
          console.error('paymentMethodId ausente en confirmedIntent:', confirmedIntent);
          return;
        }
        if (typeof paymentMethodId !== 'string' && paymentMethodId.id) {
          paymentMethodId = paymentMethodId.id;
        }

        // Log para depuración
        console.log('Enviando a createSubscription:', {
          planId: selectedPlan.id,
          paymentMethodId,
          email
        });

        // Llamar a createSubscription enviando el email como tercer parámetro
        let subscriptionResponse;
        try {
          subscriptionResponse = await createSubscription(selectedPlan.id, paymentMethodId as string, email);
        } catch (err: any) {
          setCardError(err.message || 'Error al crear la suscripción');
          toast.error('Error al crear la suscripción: ' + (err.message || ''));
          if (err.response) {
            console.error('Respuesta backend:', err.response);
          }
          return;
        }
        console.log('Respuesta backend createSubscription:', subscriptionResponse);
        toast.success('¡Suscripción activada exitosamente!');
        onSuccess();
      } else {
        setCardError('El pago no fue exitoso.');
        toast.error('El pago no fue exitoso.');
      }
    } catch (error: any) {
      // Mostrar error exacto y log completo
      console.error('Error processing payment:', error);
      setCardError(error.message || 'Error al procesar el pago');
      toast.error('Error al procesar el pago: ' + (error.message || ''));
    } finally {
      setIsProcessing(false);
    }
  };

  const isFormValid = cardholderName.trim() && 
                     email.trim() && 
                     email.includes('@') &&
                     cardComplete && 
                     !cardError;

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

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
        {/* Email */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Email
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="tu@email.com"
            className="w-full bg-gray-800 text-white rounded-lg px-4 py-3 border border-gray-700 focus:border-purple-500 focus:outline-none transition-colors"
            required
          />
        </div>

        {/* Cardholder Name */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Nombre del Titular
          </label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              value={cardholderName}
              onChange={(e) => setCardholderName(e.target.value)}
              placeholder="Como aparece en la tarjeta"
              className="w-full bg-gray-800 text-white rounded-lg pl-10 pr-4 py-3 border border-gray-700 focus:border-purple-500 focus:outline-none transition-colors"
              required
            />
          </div>
        </div>

        {/* Card Information */}
        <div className="space-y-4">
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Información de la Tarjeta
          </label>
          
          {/* Card Element */}
          <div className="bg-gray-800 rounded-lg p-4 border border-gray-700 focus-within:border-purple-500 transition-colors">
            <CardElement 
              options={CARD_ELEMENT_OPTIONS}
              onChange={handleCardChange}
            />
          </div>
          
          {cardError && (
            <div className="flex items-center gap-2 text-red-400 text-sm">
              <AlertCircle className="w-4 h-4" />
              {cardError}
            </div>
          )}
        </div>

        {/* Security Info */}
        <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
          <div className="flex items-center gap-2 text-gray-400 text-sm mb-2">
            <Lock className="w-4 h-4" />
            <span>Pago Seguro</span>
          </div>
          <p className="text-gray-500 text-xs">
            Tu información de pago está protegida con encriptación SSL de 256 bits y es procesada por Stripe.
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
              <span className="text-gray-400">Facturación:</span>
              <span className="text-white">
                {selectedPlan.interval === 'month' ? 'Mensual' : 'Anual'}
              </span>
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
          disabled={isProcessing || !isFormValid || !stripe}
        >
          {isProcessing ? (
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Procesando Pago...
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4" />
              Suscribirse Ahora
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
