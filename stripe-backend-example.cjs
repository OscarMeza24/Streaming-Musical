require('dotenv').config();
const express = require('express');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json());

// Middleware para verificar autenticación
const authenticateUser = (req, res, next) => {
  const token = req.headers.authorization?.replace('Bearer ', '');
  if (!token) {
    return res.status(401).json({ error: 'Token requerido' });
  }
  // Aquí verificarías el token con tu sistema de autenticación
  next();
};

// Crear Payment Intent
app.post('/api/stripe/create-payment-intent', authenticateUser, async (req, res) => {
  try {
    const { planId, customerId } = req.body;
    
    // Obtener el precio del plan desde Stripe
    const price = await stripe.prices.retrieve(planId);
    
    const paymentIntent = await stripe.paymentIntents.create({
      amount: price.unit_amount,
      currency: price.currency,
      customer: customerId,
      metadata: {
        planId: planId
      }
    });

    res.json({
      id: paymentIntent.id,
      amount: paymentIntent.amount,
      currency: paymentIntent.currency,
      status: paymentIntent.status,
      client_secret: paymentIntent.client_secret
    });
  } catch (error) {
    console.error('Error creating payment intent:', error);
    res.status(500).json({ error: 'Error al crear payment intent' });
  }
});

// Crear suscripción
app.post('/api/stripe/create-subscription', authenticateUser, async (req, res) => {
  try {
    const { planId, paymentMethodId } = req.body;
    const userId = req.user.id; // Obtener del token

    // Crear o obtener customer
    let customer = await stripe.customers.list({
      email: req.user.email,
      limit: 1
    });

    if (customer.data.length === 0) {
      customer = await stripe.customers.create({
        email: req.user.email,
        payment_method: paymentMethodId,
        invoice_settings: {
          default_payment_method: paymentMethodId,
        },
      });
    } else {
      customer = customer.data[0];
    }

    // Crear suscripción
    const subscription = await stripe.subscriptions.create({
      customer: customer.id,
      items: [{ price: planId }],
      payment_behavior: 'default_incomplete',
      payment_settings: { save_default_payment_method: 'on_subscription' },
      expand: ['latest_invoice.payment_intent'],
    });

    res.json({
      id: subscription.id,
      status: subscription.status,
      current_period_start: subscription.current_period_start,
      current_period_end: subscription.current_period_end,
      cancel_at_period_end: subscription.cancel_at_period_end,
      plan: {
        id: planId,
        // Obtener detalles del plan desde Stripe
      }
    });
  } catch (error) {
    console.error('Error creating subscription:', error);
    res.status(500).json({ error: 'Error al crear suscripción' });
  }
});

// Obtener información de facturación
app.get('/api/stripe/billing-info', authenticateUser, async (req, res) => {
  try {
    const userId = req.user.id;
    
    // Buscar customer en Stripe
    const customers = await stripe.customers.list({
      email: req.user.email,
      limit: 1
    });

    if (customers.data.length === 0) {
      return res.json({
        customerId: null,
        subscriptionId: null,
        plan: null,
        nextBillingDate: null,
        paymentMethod: null
      });
    }

    const customer = customers.data[0];
    const subscriptions = await stripe.subscriptions.list({
      customer: customer.id,
      limit: 1
    });

    let billingInfo = {
      customerId: customer.id,
      subscriptionId: null,
      plan: null,
      nextBillingDate: null,
      paymentMethod: null
    };

    if (subscriptions.data.length > 0) {
      const subscription = subscriptions.data[0];
      billingInfo.subscriptionId = subscription.id;
      billingInfo.nextBillingDate = new Date(subscription.current_period_end * 1000).toISOString();
      
      // Obtener método de pago
      if (subscription.default_payment_method) {
        const paymentMethod = await stripe.paymentMethods.retrieve(
          subscription.default_payment_method
        );
        billingInfo.paymentMethod = {
          id: paymentMethod.id,
          brand: paymentMethod.card.brand,
          last4: paymentMethod.card.last4,
          expMonth: paymentMethod.card.exp_month,
          expYear: paymentMethod.card.exp_year
        };
      }
    }

    res.json(billingInfo);
  } catch (error) {
    console.error('Error getting billing info:', error);
    res.status(500).json({ error: 'Error al obtener información de facturación' });
  }
});

// Cancelar suscripción
app.post('/api/stripe/cancel-subscription', authenticateUser, async (req, res) => {
  try {
    const { subscriptionId } = req.body;
    
    const subscription = await stripe.subscriptions.update(subscriptionId, {
      cancel_at_period_end: true
    });

    res.json({ success: true });
  } catch (error) {
    console.error('Error canceling subscription:', error);
    res.status(500).json({ error: 'Error al cancelar suscripción' });
  }
});

// Reactivar suscripción
app.post('/api/stripe/reactivate-subscription', authenticateUser, async (req, res) => {
  try {
    const { subscriptionId } = req.body;
    
    const subscription = await stripe.subscriptions.update(subscriptionId, {
      cancel_at_period_end: false
    });

    res.json({ success: true });
  } catch (error) {
    console.error('Error reactivating subscription:', error);
    res.status(500).json({ error: 'Error al reactivar suscripción' });
  }
});

// Actualizar método de pago
app.post('/api/stripe/update-payment-method', authenticateUser, async (req, res) => {
  try {
    const { subscriptionId, paymentMethodId } = req.body;
    
    await stripe.subscriptions.update(subscriptionId, {
      default_payment_method: paymentMethodId
    });

    res.json({ success: true });
  } catch (error) {
    console.error('Error updating payment method:', error);
    res.status(500).json({ error: 'Error al actualizar método de pago' });
  }
});

// Obtener historial de facturación
app.get('/api/stripe/billing-history', authenticateUser, async (req, res) => {
  try {
    const customers = await stripe.customers.list({
      email: req.user.email,
      limit: 1
    });

    if (customers.data.length === 0) {
      return res.json([]);
    }

    const customer = customers.data[0];
    const invoices = await stripe.invoices.list({
      customer: customer.id,
      limit: 10
    });

    const billingHistory = invoices.data.map(invoice => ({
      id: invoice.id,
      amount: invoice.amount_paid,
      currency: invoice.currency,
      status: invoice.status,
      date: new Date(invoice.created * 1000).toISOString(),
      description: invoice.description
    }));

    res.json(billingHistory);
  } catch (error) {
    console.error('Error getting billing history:', error);
    res.status(500).json({ error: 'Error al obtener historial de facturación' });
  }
});

// Webhook para eventos de Stripe
app.post('/api/stripe/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  const sig = req.headers['stripe-signature'];
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Manejar eventos
  switch (event.type) {
    case 'customer.subscription.created':
      const subscriptionCreated = event.data.object;
      console.log('Subscription created:', subscriptionCreated.id);
      // Actualizar base de datos
      break;
      
    case 'customer.subscription.updated':
      const subscriptionUpdated = event.data.object;
      console.log('Subscription updated:', subscriptionUpdated.id);
      // Actualizar base de datos
      break;
      
    case 'customer.subscription.deleted':
      const subscriptionDeleted = event.data.object;
      console.log('Subscription deleted:', subscriptionDeleted.id);
      // Actualizar base de datos
      break;
      
    case 'invoice.payment_succeeded':
      const paymentSucceeded = event.data.object;
      console.log('Payment succeeded:', paymentSucceeded.id);
      // Actualizar base de datos
      break;
      
    case 'invoice.payment_failed':
      const paymentFailed = event.data.object;
      console.log('Payment failed:', paymentFailed.id);
      // Notificar al usuario
      break;
      
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  res.json({ received: true });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;