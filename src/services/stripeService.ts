import { StripePlan, PaymentIntent, BillingInfo, StripeSubscription } from '../types';

// Configuración de Stripe (en producción, estas claves vendrían de variables de entorno)
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api';

// Planes disponibles
export const STRIPE_PLANS: StripePlan[] = [
  {
    id: 'price_monthly_basic',
    name: 'Básico',
    price: 499, // $4.99 en centavos
    currency: 'usd',
    interval: 'month',
    features: [
      'Sin anuncios',
      'Audio de alta calidad (320kbps)',
      'Saltos ilimitados',
      'Reproducción en segundo plano',
      'Sincronización entre dispositivos'
    ]
  },
  {
    id: 'price_monthly_premium',
    name: 'Premium',
    price: 999, // $9.99 en centavos
    currency: 'usd',
    interval: 'month',
    features: [
      'Todo de Básico',
      'Descarga offline',
      'Audio Hi-Fi (FLAC)',
      'Contenido exclusivo',
      'Letras sincronizadas',
      'Modo fiesta',
      'Soporte prioritario'
    ]
  },
  {
    id: 'price_annual_basic',
    name: 'Básico Anual',
    price: 4999, // $49.99 en centavos (2 meses gratis)
    currency: 'usd',
    interval: 'year',
    features: [
      'Sin anuncios',
      'Audio de alta calidad (320kbps)',
      'Saltos ilimitados',
      'Reproducción en segundo plano',
      'Sincronización entre dispositivos',
      '2 meses gratis'
    ]
  },
  {
    id: 'price_annual_premium',
    name: 'Premium Anual',
    price: 9999, // $99.99 en centavos (2 meses gratis)
    currency: 'usd',
    interval: 'year',
    features: [
      'Todo de Premium',
      'Descarga offline',
      'Audio Hi-Fi (FLAC)',
      'Contenido exclusivo',
      'Letras sincronizadas',
      'Modo fiesta',
      'Soporte prioritario',
      '2 meses gratis',
      'Acceso anticipado a nuevas funciones'
    ]
  },
  {
    id: 'price_family_premium',
    name: 'Premium Familiar',
    price: 1499, // $14.99 en centavos
    currency: 'usd',
    interval: 'month',
    features: [
      'Todo de Premium',
      'Hasta 6 cuentas familiares',
      'Controles parentales',
      'Perfiles individuales',
      'Historial personalizado',
      'Descargas compartidas',
      'Soporte 24/7'
    ]
  }
];

// Función para crear un Payment Intent
export const createPaymentIntent = async (
  planId: string,
  customerId?: string
): Promise<PaymentIntent> => {
  try {
    const response = await fetch(`${API_BASE_URL}/stripe/create-payment-intent`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('streamflow_token')}`
      },
      body: JSON.stringify({
        planId,
        customerId
      })
    });

    if (!response.ok) {
      throw new Error('Error al crear el payment intent');
    }

    return await response.json();
  } catch (error) {
    console.error('Error creating payment intent:', error);
    throw error;
  }
};

// Función para crear una suscripción
export const createSubscription = async (
  planId: string,
  paymentMethodId: string
): Promise<StripeSubscription> => {
  try {
    const response = await fetch(`${API_BASE_URL}/stripe/create-subscription`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('streamflow_token')}`
      },
      body: JSON.stringify({
        planId,
        paymentMethodId
      })
    });

    if (!response.ok) {
      throw new Error('Error al crear la suscripción');
    }

    return await response.json();
  } catch (error) {
    console.error('Error creating subscription:', error);
    throw error;
  }
};

// Función para obtener información de facturación
export const getBillingInfo = async (): Promise<BillingInfo> => {
  try {
    const response = await fetch(`${API_BASE_URL}/stripe/billing-info`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('streamflow_token')}`
      }
    });

    if (!response.ok) {
      throw new Error('Error al obtener información de facturación');
    }

    return await response.json();
  } catch (error) {
    console.error('Error getting billing info:', error);
    throw error;
  }
};

// Función para cancelar suscripción
export const cancelSubscription = async (subscriptionId: string): Promise<void> => {
  try {
    const response = await fetch(`${API_BASE_URL}/stripe/cancel-subscription`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('streamflow_token')}`
      },
      body: JSON.stringify({ subscriptionId })
    });

    if (!response.ok) {
      throw new Error('Error al cancelar la suscripción');
    }
  } catch (error) {
    console.error('Error canceling subscription:', error);
    throw error;
  }
};

// Función para reactivar suscripción
export const reactivateSubscription = async (subscriptionId: string): Promise<void> => {
  try {
    const response = await fetch(`${API_BASE_URL}/stripe/reactivate-subscription`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('streamflow_token')}`
      },
      body: JSON.stringify({ subscriptionId })
    });

    if (!response.ok) {
      throw new Error('Error al reactivar la suscripción');
    }
  } catch (error) {
    console.error('Error reactivating subscription:', error);
    throw error;
  }
};

// Función para actualizar método de pago
export const updatePaymentMethod = async (
  subscriptionId: string,
  paymentMethodId: string
): Promise<void> => {
  try {
    const response = await fetch(`${API_BASE_URL}/stripe/update-payment-method`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('streamflow_token')}`
      },
      body: JSON.stringify({
        subscriptionId,
        paymentMethodId
      })
    });

    if (!response.ok) {
      throw new Error('Error al actualizar el método de pago');
    }
  } catch (error) {
    console.error('Error updating payment method:', error);
    throw error;
  }
};

// Función para obtener el historial de facturación
export const getBillingHistory = async (): Promise<any[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/stripe/billing-history`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('streamflow_token')}`
      }
    });

    if (!response.ok) {
      throw new Error('Error al obtener el historial de facturación');
    }

    return await response.json();
  } catch (error) {
    console.error('Error getting billing history:', error);
    throw error;
  }
};

// Función para simular operaciones de Stripe (para desarrollo)
export const mockStripeOperations = {
  createPaymentIntent: async (planId: string): Promise<PaymentIntent> => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    return {
      id: 'pi_mock_' + Date.now(),
      amount: STRIPE_PLANS.find(p => p.id === planId)?.price || 999,
      currency: 'usd',
      status: 'requires_payment_method',
      client_secret: 'pi_mock_secret_' + Date.now()
    };
  },

  createSubscription: async (planId: string): Promise<StripeSubscription> => {
    await new Promise(resolve => setTimeout(resolve, 1500));
    const plan = STRIPE_PLANS.find(p => p.id === planId);
    return {
      id: 'sub_mock_' + Date.now(),
      status: 'active',
      current_period_start: Date.now(),
      current_period_end: Date.now() + (30 * 24 * 60 * 60 * 1000), // 30 días
      cancel_at_period_end: false,
      plan: plan || STRIPE_PLANS[0]
    };
  },

  getBillingInfo: async (): Promise<BillingInfo> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return {
      customerId: 'cus_mock_' + Date.now(),
      subscriptionId: 'sub_mock_' + Date.now(),
      plan: STRIPE_PLANS[0],
      nextBillingDate: new Date(Date.now() + (30 * 24 * 60 * 60 * 1000)).toISOString(),
      paymentMethod: {
        id: 'pm_mock_' + Date.now(),
        brand: 'visa',
        last4: '4242',
        expMonth: 12,
        expYear: 2025
      }
    };
  }
}; 