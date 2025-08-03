import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, Crown, Star, Zap, Users, Music, Headphones } from 'lucide-react';
import { STRIPE_PLANS } from '../../services/stripeService';
import { StripePlan } from '../../types';
import { Button } from '../common/Button';
import { useAuth } from '../../contexts/AuthContext';

interface PricingPlansProps {
  onPlanSelect: (plan: StripePlan) => void;
  isLoading?: boolean;
}

export const PricingPlans: React.FC<PricingPlansProps> = ({ 
  onPlanSelect, 
  isLoading = false 
}) => {
  const { user } = useAuth();
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);

  const handlePlanSelect = (plan: StripePlan) => {
    setSelectedPlan(plan.id);
    onPlanSelect(plan);
  };

  const formatPrice = (price: number, currency: string) => {
    const amount = price / 100; // Convertir centavos a dólares
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: currency.toUpperCase(),
    }).format(amount);
  };

  const getIntervalText = (interval: string) => {
    return interval === 'month' ? 'mes' : 'año';
  };

  const isCurrentPlan = (plan: StripePlan) => {
    const subscriptionType = user?.subscription?.type;
    const planInterval = plan.interval === 'month' ? 'monthly' : 'annual';
    return subscriptionType === planInterval && 
           user?.subscription?.planId === plan.id;
  };

  const getPlanIcon = (plan: StripePlan) => {
    if (plan.name.includes('Familiar')) return <Users className="w-5 h-5" />;
    if (plan.name.includes('Premium')) return <Crown className="w-5 h-5" />;
    if (plan.name.includes('Básico')) return <Music className="w-5 h-5" />;
    return <Headphones className="w-5 h-5" />;
  };

  const getPlanBadge = (plan: StripePlan) => {
    if (plan.name.includes('Familiar')) {
      return { text: 'Familiar', color: 'from-pink-500 to-purple-500' };
    }
    if (plan.interval === 'year') {
      return { text: 'Popular', color: 'from-orange-500 to-red-500' };
    }
    if (plan.name.includes('Premium')) {
      return { text: 'Premium', color: 'from-purple-500 to-blue-500' };
    }
    return null;
  };

  const calculateSavings = (plan: StripePlan) => {
    if (plan.interval === 'year') {
      const monthlyPrice = plan.price / 12;
      const monthlyPlan = STRIPE_PLANS.find(p => 
        p.name.includes('Básico') && p.interval === 'month' && p.name.includes(plan.name.includes('Básico') ? 'Básico' : 'Premium')
      );
      if (monthlyPlan) {
        const savings = ((monthlyPlan.price - monthlyPrice) / monthlyPlan.price) * 100;
        return Math.round(savings);
      }
    }
    return null;
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white px-4 py-2 rounded-full mb-4"
        >
          <Crown className="w-5 h-5" />
          <span className="font-semibold">Planes Premium</span>
        </motion.div>
        <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
          Elige tu plan ideal
        </h2>
        <p className="text-gray-400 text-lg max-w-2xl mx-auto">
          Desde planes básicos hasta opciones familiares. Encuentra el plan perfecto para ti.
        </p>
      </div>

      {/* Plans Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
        {STRIPE_PLANS.map((plan, index) => {
          const badge = getPlanBadge(plan);
          const savings = calculateSavings(plan);
          
          return (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`relative p-6 rounded-2xl border-2 transition-all duration-300 ${
                selectedPlan === plan.id
                  ? 'border-purple-500 bg-gradient-to-br from-purple-900/20 to-blue-900/20'
                  : 'border-gray-700 bg-gray-800/50 hover:border-gray-600'
              } ${isCurrentPlan(plan) ? 'ring-2 ring-green-500' : ''}`}
            >
              {/* Current Plan Badge */}
              {isCurrentPlan(plan) && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <span className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                    Plan Actual
                  </span>
                </div>
              )}

              {/* Plan Badge */}
              {badge && (
                <div className="absolute -top-3 -right-3">
                  <div className={`bg-gradient-to-r ${badge.color} text-white px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1`}>
                    <Star className="w-3 h-3" />
                    {badge.text}
                  </div>
                </div>
              )}

              {/* Savings Badge */}
              {savings && (
                <div className="absolute -top-3 -left-3">
                  <div className="bg-green-500/20 text-green-400 px-3 py-1 rounded-full text-sm font-medium">
                    Ahorra {savings}%
                  </div>
                </div>
              )}

              <div className="text-center mb-6">
                <div className="flex items-center justify-center gap-2 mb-3">
                  {getPlanIcon(plan)}
                  <h3 className="text-xl font-bold text-white">{plan.name}</h3>
                </div>
                <div className="mb-4">
                  <span className="text-4xl font-bold text-white">
                    {formatPrice(plan.price, plan.currency)}
                  </span>
                  <span className="text-gray-400 ml-2">/{getIntervalText(plan.interval)}</span>
                </div>
                
                {/* Savings for annual plan */}
                {plan.interval === 'year' && (
                  <div className="bg-green-500/20 text-green-400 px-3 py-1 rounded-full text-sm font-medium mb-4">
                    2 meses gratis
                  </div>
                )}
              </div>

              {/* Features */}
              <div className="space-y-3 mb-6">
                {plan.features.map((feature, featureIndex) => (
                  <div key={featureIndex} className="flex items-start gap-3">
                    <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Check className="w-3 h-3 text-white" />
                    </div>
                    <span className="text-gray-300 text-sm leading-relaxed">{feature}</span>
                  </div>
                ))}
              </div>

              {/* Action Button */}
              <Button
                variant={selectedPlan === plan.id ? "primary" : "secondary"}
                size="lg"
                className="w-full"
                onClick={() => handlePlanSelect(plan)}
                disabled={isLoading || isCurrentPlan(plan)}
              >
                {isLoading && selectedPlan === plan.id ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Procesando...
                  </div>
                ) : isCurrentPlan(plan) ? (
                  'Plan Actual'
                ) : (
                  <div className="flex items-center gap-2">
                    <Zap className="w-4 h-4" />
                    {isCurrentPlan(plan) ? 'Plan Actual' : 'Seleccionar Plan'}
                  </div>
                )}
              </Button>
            </motion.div>
          );
        })}
      </div>

      {/* Additional Info */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="text-center text-gray-400 text-sm"
      >
        <p>
          Todos los planes incluyen acceso completo a StreamFlow Music.
          <br />
          Puedes cancelar tu suscripción en cualquier momento.
        </p>
      </motion.div>
    </div>
  );
}; 