require('dotenv').config();
const express = require('express');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const cors = require('cors');

const app = express();

// Configuración de CORS
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:3000'],
  credentials: true
}));

// Raw body solo para webhooks
app.use('/api/stripe/webhook', express.raw({ type: 'application/json' }));
app.use(express.json());

// Logs básicos de petición
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} ▶️ ${req.method} ${req.path}`);
  next();
});

// Middleware de autenticación simulado
const authenticateUser = (req, res, next) => {
  const token = req.headers.authorization?.replace('Bearer ', '');
  if (!token) return res.status(401).json({ error: 'Token requerido' });
  req.user = { id: 'user_' + Date.now(), email: 'usuario@ejemplo.com' };
  next();
};

// Manejo genérico de errores de Stripe
const handleStripeError = (err, res) => {
  console.error('Stripe Error:', err);
  const type = err.type;
  if (type === 'StripeCardError') return res.status(400).json({ error: 'Tarjeta rechazada', details: err.message });
  if (type === 'StripeInvalidRequestError') return res.status(400).json({ error: 'Solicitud inválida', details: err.message });
  if (type === 'StripeRateLimitError') return res.status(429).json({ error: 'Demasiadas solicitudes' });
  if (type === 'StripeAuthenticationError') return res.status(500).json({ error: 'Error de autenticación con Stripe' });
  if (type === 'StripeAPIError') return res.status(500).json({ error: 'Error interno de Stripe' });
  return res.status(500).json({ error: 'Error inesperado en Stripe' });
};

// === RUTA: crear PaymentIntent ===
app.post('/api/stripe/create-payment-intent', async (req, res) => {
  try {
    const { planId, customerId } = req.body;
    console.log('➡️ create-payment-intent payload:', { planId, customerId });

    if (!planId) return res.status(400).json({ error: 'planId es requerido' });

    const price = await stripe.prices.retrieve(planId);
    console.log('🟢 price:', price.id, price.unit_amount, price.currency);

    const paymentIntent = await stripe.paymentIntents.create({
      amount: price.unit_amount,
      currency: price.currency,
      customer: customerId,
      automatic_payment_methods: { enabled: true },
      metadata: { planId, userId: 'guest_' + Date.now() }
    });

    res.json({
      id: paymentIntent.id,
      amount: paymentIntent.amount,
      status: paymentIntent.status,
      client_secret: paymentIntent.client_secret
    });
  } catch (err) {
    handleStripeError(err, res);
  }
});

// === RUTA: crear suscripción con manejo seguro del attach ===
app.post('/api/stripe/create-subscription', async (req, res) => {
  try {
    const { planId, paymentMethodId, email } = req.body;
    console.log('➡️ create-subscription payload:', { planId, paymentMethodId, email });

    if (!planId || !paymentMethodId || !email) {
      return res.status(400).json({ error: 'Faltan datos requeridos (planId, paymentMethodId, email)' });
    }

    // Validar payment method
    let pm;
    try {
      pm = await stripe.paymentMethods.retrieve(paymentMethodId);
      console.log('🟢 paymentMethod:', pm.id, pm.card?.brand, pm.card?.last4);
    } catch (err) {
      console.error('Método de pago inválido:', err.message);
      return res.status(400).json({ error: 'paymentMethodId inválido o no existe', details: err.message });
    }

    // Validar plan
    let price;
    try {
      price = await stripe.prices.retrieve(planId);
      console.log('🟢 price:', price.id, price.unit_amount, price.active);
      if (!price.active) {
        return res.status(400).json({ error: 'El plan no está activo' });
      }
    } catch (err) {
      console.error('Error al obtener plan:', err.message);
      return res.status(400).json({ error: 'planId inválido', details: err.message });
    }

    // Buscar o crear cliente
    const list = await stripe.customers.list({ email, limit: 1 });
    let customer;
    if (list.data.length === 0) {
      customer = await stripe.customers.create({ email });
      console.log('🆕 customer creado:', customer.id);
    } else {
      customer = list.data[0];
      console.log('✅ customer existente:', customer.id);
    }

    // Adjuntar PaymentMethod al cliente (manejo seguro)
    if (!pm.customer || pm.customer !== customer.id) {
      try {
        await stripe.paymentMethods.attach(paymentMethodId, { customer: customer.id });
        console.log('🔗 PaymentMethod adjuntado a customer:', customer.id);
      } catch (err) {
        if (err.code !== 'resource_already_attached') {
          return res.status(400).json({ error: 'No se pudo adjuntar el método de pago', details: err.message });
        }
      }
    } else {
      console.log('✅ PaymentMethod ya está adjuntado al cliente.');
    }

    // Actualizar método de pago predeterminado para facturación
    await stripe.customers.update(customer.id, {
      invoice_settings: { default_payment_method: paymentMethodId }
    });

    // Crear suscripción
    const subscription = await stripe.subscriptions.create({
      customer: customer.id,
      items: [{ price: planId }],
      payment_behavior: 'default_incomplete',
      payment_settings: {
        save_default_payment_method: 'on_subscription',
        payment_method_types: ['card'],
        default_payment_method: paymentMethodId
      },
      expand: ['latest_invoice.payment_intent']
    });

    console.log('📝 subscription creada:', subscription.id);

    res.json({
      id: subscription.id,
      status: subscription.status,
      plan: { id: planId },
      current_period_start: subscription.current_period_start,
      current_period_end: subscription.current_period_end,
      cancel_at_period_end: subscription.cancel_at_period_end
    });

  } catch (err) {
    console.error('Error general en create-subscription:', err);
    res.status(500).json({ error: err.message || 'Error al crear suscripción', details: err });
  }
});

// RUTAS SIMULADAS (puedes implementar o pedir ayuda para completarlas)
app.get('/api/stripe/billing-info', authenticateUser, async (req, res) => {
  res.json({ message: 'Aquí iría la info de facturación del usuario' });
});

app.post('/api/stripe/cancel-subscription', authenticateUser, async (req, res) => {
  res.json({ message: 'Cancelación de suscripción simulada' });
});

app.post('/api/stripe/reactivate-subscription', authenticateUser, async (req, res) => {
  res.json({ message: 'Reactivación de suscripción simulada' });
});

app.post('/api/stripe/update-payment-method', authenticateUser, async (req, res) => {
  res.json({ message: 'Actualización de método de pago simulada' });
});

app.get('/api/stripe/billing-history', authenticateUser, async (req, res) => {
  res.json({ message: 'Historial de facturación simulado' });
});

app.post('/api/stripe/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  res.json({ received: true });
});

// Start server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`🚀 Stripe server corriendo en puerto ${PORT}`));

module.exports = app;
