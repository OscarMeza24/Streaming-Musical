require('dotenv').config();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

const plans = [
  {
    name: 'Básico',
    description: 'Plan básico con funciones esenciales de streaming musical',
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
    name: 'Premium',
    description: 'Plan premium con todas las funciones avanzadas',
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
    name: 'Básico Anual',
    description: 'Plan básico con facturación anual (2 meses gratis)',
    price: 4999, // $49.99 en centavos
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
    name: 'Premium Anual',
    description: 'Plan premium con facturación anual (2 meses gratis)',
    price: 9999, // $99.99 en centavos
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
    name: 'Premium Familiar',
    description: 'Plan premium para hasta 6 miembros de la familia',
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

async function createStripeProducts() {
  console.log('🚀 Configurando productos y precios en Stripe...\n');
  
  const createdPlans = [];
  
  for (const plan of plans) {
    try {
      console.log(`📦 Creando producto: ${plan.name}`);
      
      // Crear el producto
      const product = await stripe.products.create({
        name: plan.name,
        description: plan.description,
        metadata: {
          features: JSON.stringify(plan.features),
          type: 'music_streaming'
        }
      });
      
      console.log(`✅ Producto creado: ${product.id}`);
      
      // Crear el precio
      const price = await stripe.prices.create({
        product: product.id,
        unit_amount: plan.price,
        currency: plan.currency,
        recurring: {
          interval: plan.interval,
        },
        metadata: {
          plan_type: plan.interval === 'month' ? 'monthly' : 'yearly',
          tier: plan.name.includes('Premium') ? 'premium' : 'basic'
        }
      });
      
      console.log(`💰 Precio creado: ${price.id}`);
      
      createdPlans.push({
        name: plan.name,
        productId: product.id,
        priceId: price.id,
        price: plan.price,
        currency: plan.currency,
        interval: plan.interval
      });
      
      console.log(`✨ Plan completado: ${plan.name}\n`);
      
    } catch (error) {
      console.error(`❌ Error creando ${plan.name}:`, error.message);
    }
  }
  
  console.log('🎉 Configuración completada!\n');
  console.log('📋 Resumen de planes creados:');
  console.log('================================');
  
  createdPlans.forEach(plan => {
    console.log(`${plan.name}:`);
    console.log(`  - Product ID: ${plan.productId}`);
    console.log(`  - Price ID: ${plan.priceId}`);
    console.log(`  - Precio: $${plan.price / 100} ${plan.currency.toUpperCase()}/${plan.interval}`);
    console.log('');
  });
  
  console.log('📝 Actualiza tu stripeService.ts con estos Price IDs:');
  console.log('================================');
  
  createdPlans.forEach(plan => {
    const planType = plan.interval === 'month' ? 'monthly' : 'annual';
    const tier = plan.name.includes('Premium') ? 'premium' : 
                 plan.name.includes('Familiar') ? 'family' : 'basic';
    const key = `price_${planType}_${tier}`;
    console.log(`${key}: '${plan.priceId}',`);
  });
}

async function listExistingProducts() {
  console.log('📋 Productos existentes en Stripe:');
  console.log('================================');
  
  try {
    const products = await stripe.products.list({ limit: 20 });
    const prices = await stripe.prices.list({ limit: 50 });
    
    for (const product of products.data) {
      console.log(`\n${product.name} (${product.id})`);
      console.log(`  Descripción: ${product.description || 'N/A'}`);
      
      const productPrices = prices.data.filter(price => price.product === product.id);
      productPrices.forEach(price => {
        const amount = price.unit_amount / 100;
        const interval = price.recurring?.interval || 'one-time';
        console.log(`  - ${price.id}: $${amount} ${price.currency.toUpperCase()}/${interval}`);
      });
    }
  } catch (error) {
    console.error('Error listando productos:', error.message);
  }
}

// Ejecutar el script
async function main() {
  const args = process.argv.slice(2);
  
  if (args.includes('--list')) {
    await listExistingProducts();
  } else if (args.includes('--create')) {
    await createStripeProducts();
  } else {
    console.log('🔧 Script de configuración de Stripe para StreamFlow Music');
    console.log('=======================================================');
    console.log('');
    console.log('Uso:');
    console.log('  node setup-stripe.js --list     # Listar productos existentes');
    console.log('  node setup-stripe.js --create   # Crear nuevos productos y precios');
    console.log('');
    console.log('Asegúrate de tener configurado STRIPE_SECRET_KEY en tu archivo .env');
  }
}

if (require.main === module) {
  main().catch(console.error);
}

module.exports = { createStripeProducts, listExistingProducts };
