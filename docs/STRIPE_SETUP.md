# Configuración de Stripe para StreamFlow Music

Esta guía te ayudará a configurar completamente Stripe para manejar las suscripciones en tu aplicación de música.

## 📋 Requisitos Previos

1. **Cuenta de Stripe**: Regístrate en [stripe.com](https://stripe.com)
2. **Node.js**: Versión 16 o superior instalada
3. **Claves de API**: Obtén tus claves de prueba desde el Dashboard de Stripe

## 🚀 Configuración Paso a Paso

### 1. Configurar Variables de Entorno

Copia el archivo `.env.example` a `.env` y completa las variables de Stripe:

```bash
cp .env.example .env
```

Edita el archivo `.env` y agrega tus claves:

```env
# Stripe - Frontend (Clave Pública)
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_51...

# Stripe - Backend (Clave Secreta)
STRIPE_SECRET_KEY=sk_test_51...

# Webhook Secret (se obtiene después de crear el webhook)
STRIPE_WEBHOOK_SECRET=whsec_...
```

### 2. Configurar Productos y Precios en Stripe

Ejecuta el script de configuración automática:

```bash
# Listar productos existentes
node setup-stripe.js --list

# Crear productos y precios
node setup-stripe.js --create
```

Este script creará automáticamente:
- 📦 **5 productos** en Stripe
- 💰 **5 precios** correspondientes
- 📊 **Metadata** con características de cada plan

### 3. Actualizar IDs de Precios

Después de ejecutar el script, copia los Price IDs generados y actualiza el archivo `src/services/stripeService.ts`:

```typescript
export const STRIPE_PLANS: StripePlan[] = [
  {
    id: 'price_1234567890abcdef', // ← Usar el Price ID real generado
    name: 'Básico',
    price: 499,
    currency: 'usd',
    interval: 'month',
    // ...
  },
  // ... otros planes
];
```

### 4. Configurar Webhooks

1. Ve al **Dashboard de Stripe** → **Developers** → **Webhooks**
2. Clic en **"Add endpoint"**
3. URL del endpoint: `https://tu-dominio.com/api/stripe/webhook`
4. Selecciona estos eventos:
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.payment_succeeded`
   - `invoice.payment_failed`
   - `payment_intent.succeeded`
   - `payment_intent.payment_failed`

5. Copia el **Webhook Secret** y agrégalo a tu `.env`:
   ```env
   STRIPE_WEBHOOK_SECRET=whsec_1234567890abcdef
   ```

### 5. Configurar el Servidor Backend

Inicia el servidor backend:

```bash
# Instalar dependencias del backend
npm install express cors stripe dotenv

# Ejecutar el servidor
node stripe-backend-example.cjs
```

El servidor estará disponible en `http://localhost:3001`

### 6. Configurar el Frontend

Instala las dependencias de Stripe en el frontend:

```bash
npm install @stripe/stripe-js @stripe/react-stripe-js
```

### 7. Iniciar la Aplicación

```bash
# Frontend (puerto 5173)
npm run dev

# Backend (puerto 3001)
node stripe-backend-example.cjs
```

## 🧪 Probando las Suscripciones

### Tarjetas de Prueba de Stripe

Usa estas tarjetas para probar diferentes escenarios:

| Número | Descripción |
|--------|-------------|
| `4242424242424242` | Visa exitosa |
| `4000000000000002` | Tarjeta rechazada |
| `4000000000000069` | CVV expirado |
| `4000000000000119` | Fallo de procesamiento |

### Flujo de Prueba

1. **Ir a Suscripciones**: `http://localhost:5173/subscription`
2. **Seleccionar un Plan**: Elige cualquier plan disponible
3. **Completar Formulario**: 
   - Email: `test@ejemplo.com`
   - Nombre: `Usuario Test`
   - Tarjeta: `4242424242424242`
   - Fecha: Cualquier fecha futura
   - CVV: `123`
4. **Procesar Pago**: Clic en "Suscribirse Ahora"
5. **Verificar**: Revisa el Dashboard de Stripe para confirmar

## 📊 Funcionalidades Implementadas

### ✅ Frontend
- [x] Formulario de pago con elementos de Stripe
- [x] Validación en tiempo real de tarjetas
- [x] Manejo de errores de pago
- [x] Gestión de suscripciones existentes
- [x] Historial de facturación
- [x] Cancelación y reactivación de suscripciones

### ✅ Backend
- [x] Creación de Payment Intents
- [x] Gestión de suscripciones
- [x] Manejo de webhooks
- [x] Validación de datos
- [x] Manejo de errores específicos de Stripe
- [x] Logs detallados

### ✅ Seguridad
- [x] Validación de webhooks con firmas
- [x] Manejo seguro de claves API
- [x] Encriptación SSL automática
- [x] Validación de entrada en el servidor

## 🛠️ Estructura de Archivos

```
src/
├── components/subscription/
│   ├── StripeCheckoutForm.tsx      # Formulario de pago con Stripe Elements
│   ├── SubscriptionManagement.tsx  # Gestión de suscripciones existentes
│   ├── PricingPlans.tsx           # Planes de precios
│   └── SubscriptionStatus.tsx      # Estado de la suscripción
├── contexts/
│   └── StripeContext.tsx          # Proveedor de contexto de Stripe
├── services/
│   └── stripeService.ts           # Servicios de API de Stripe
└── pages/
    └── SubscriptionPage.tsx       # Página principal de suscripciones

Backend/
├── stripe-backend-example.cjs     # Servidor Express con API de Stripe
└── setup-stripe.js               # Script de configuración automática
```

## 🔧 Personalización

### Agregar Nuevos Planes

1. Edita `setup-stripe.js` y agrega tu plan al array `plans`
2. Ejecuta `node setup-stripe.js --create`
3. Actualiza `STRIPE_PLANS` en `stripeService.ts`

### Modificar Validaciones

Edita `StripeCheckoutForm.tsx` para agregar validaciones personalizadas:

```typescript
const validateCustomField = (value: string): string | undefined => {
  // Tu lógica de validación aquí
  return undefined; // Sin errores
};
```

### Personalizar Manejo de Errores

Modifica `handleStripeError` en `stripe-backend-example.cjs`:

```javascript
const handleStripeError = (error, res) => {
  // Tu lógica personalizada aquí
};
```

## 🚨 Troubleshooting

### Error: "No publishable key"
**Solución**: Verifica que `VITE_STRIPE_PUBLISHABLE_KEY` esté configurado en `.env`

### Error: "Invalid price ID"
**Solución**: Ejecuta `node setup-stripe.js --create` y actualiza los IDs en `stripeService.ts`

### Webhooks no funcionan
**Solución**: 
1. Verifica que `STRIPE_WEBHOOK_SECRET` esté correcto
2. Asegúrate de que la URL del webhook sea accesible públicamente
3. Usa [ngrok](https://ngrok.com) para desarrollo local

### Pagos rechazados
**Solución**: 
1. Usa tarjetas de prueba válidas
2. Verifica que los montos estén en centavos
3. Revisa los logs del servidor para detalles

## 📚 Recursos Adicionales

- [Documentación de Stripe](https://stripe.com/docs)
- [Stripe Elements](https://stripe.com/docs/stripe-js)
- [React Stripe.js](https://github.com/stripe/react-stripe-js)
- [Webhooks de Stripe](https://stripe.com/docs/webhooks)
- [Tarjetas de Prueba](https://stripe.com/docs/testing#cards)

## 🎯 Próximos Pasos

1. **Producción**: Cambia a claves de producción cuando estés listo
2. **Impuestos**: Configura Stripe Tax para manejo automático de impuestos
3. **Facturas**: Personaliza las facturas con tu branding
4. **Analytics**: Integra Stripe Analytics para insights de negocio
5. **Multi-moneda**: Soporte para múltiples monedas

¡Listo! Ahora tienes un sistema completo de suscripciones con Stripe. 🎉
