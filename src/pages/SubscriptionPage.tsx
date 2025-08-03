import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, Crown, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { PricingPlans } from '../components/subscription/PricingPlans';
import { CheckoutForm } from '../components/subscription/CheckoutForm';
import { SubscriptionStatus } from '../components/subscription/SubscriptionStatus';
import { StripePlan } from '../types';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '../components/common/Button';

type Step = 'plans' | 'checkout' | 'success';

export const SubscriptionPage: React.FC = () => {
  const { user, updateProfile } = useAuth();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState<Step>('plans');
  const [selectedPlan, setSelectedPlan] = useState<StripePlan | null>(null);

  // Si el usuario ya tiene una suscripción premium, mostrar el estado
  if (user?.subscription && user.subscription.type !== 'free') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 p-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/')}
              className="mb-4"
              leftIcon={<ArrowLeft className="w-4 h-4" />}
            >
              Volver al inicio
            </Button>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 bg-gradient-to-r from-green-600 to-blue-600 text-white px-4 py-2 rounded-full mb-4"
            >
              <CheckCircle className="w-5 h-5" />
              <span className="font-semibold">Suscripción Activa</span>
            </motion.div>
            
            <h1 className="text-3xl lg:text-4xl font-bold text-white mb-4">
              Tu Suscripción Premium
            </h1>
            <p className="text-gray-400 text-lg">
              Gestiona tu suscripción y disfruta de todas las funciones premium
            </p>
          </div>

          {/* Subscription Status */}
          <SubscriptionStatus />

          {/* Upgrade Options */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-8 text-center"
          >
            <h2 className="text-2xl font-bold text-white mb-4">
              ¿Quieres cambiar tu plan?
            </h2>
            <p className="text-gray-400 mb-6">
              Explora nuestras opciones y encuentra el plan perfecto para ti
            </p>
            <Button
              variant="primary"
              size="lg"
              onClick={() => setCurrentStep('plans')}
              leftIcon={<Crown className="w-5 h-5" />}
            >
              Ver Planes Disponibles
            </Button>
          </motion.div>
        </div>
      </div>
    );
  }

  const handlePlanSelect = (plan: StripePlan) => {
    setSelectedPlan(plan);
    setCurrentStep('checkout');
  };

  const handleBackToPlans = () => {
    setCurrentStep('plans');
    setSelectedPlan(null);
  };

  const handleSuccess = () => {
    setCurrentStep('success');
    
         // Simular actualización del usuario
     if (selectedPlan && updateProfile) {
       const subscriptionType = selectedPlan.interval === 'month' ? 'monthly' : 'annual';
       const features = {
         adFree: true,
         offlineDownload: selectedPlan.name.includes('Premium') || selectedPlan.name.includes('Familiar'),
         highQualityAudio: true,
         unlimitedSkips: true,
         exclusiveContent: selectedPlan.name.includes('Premium') || selectedPlan.name.includes('Familiar'),
         familyPlan: selectedPlan.name.includes('Familiar')
       };

       updateProfile({
         ...user!,
         subscription: {
           id: 'sub_' + Date.now(),
           type: subscriptionType,
           startDate: new Date().toISOString(),
           status: 'active',
           userId: user!.id,
           planId: selectedPlan.id,
           features
         }
       });
     }
  };

  const handleGoHome = () => {
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 p-4">
      <div className="max-w-6xl mx-auto">
        {currentStep === 'plans' && (
          <motion.div
            key="plans"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
          >
                         <PricingPlans 
               onPlanSelect={handlePlanSelect}
               isLoading={false}
             />
          </motion.div>
        )}

        {currentStep === 'checkout' && selectedPlan && (
          <motion.div
            key="checkout"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <CheckoutForm
              selectedPlan={selectedPlan}
              onBack={handleBackToPlans}
              onSuccess={handleSuccess}
            />
          </motion.div>
        )}

        {currentStep === 'success' && (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center max-w-md mx-auto"
          >
            <div className="mb-8">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6"
              >
                <CheckCircle className="w-10 h-10 text-white" />
              </motion.div>
              
              <h1 className="text-3xl font-bold text-white mb-4">
                ¡Bienvenido a Premium!
              </h1>
              
              <p className="text-gray-400 text-lg mb-8">
                Tu suscripción ha sido activada exitosamente. 
                Ya puedes disfrutar de todas las funciones premium de StreamFlow Music.
              </p>

              <div className="space-y-4 mb-8">
                <div className="flex items-center gap-3 text-left">
                  <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
                  <span className="text-gray-300">Sin anuncios</span>
                </div>
                <div className="flex items-center gap-3 text-left">
                  <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
                  <span className="text-gray-300">Audio de alta calidad</span>
                </div>
                <div className="flex items-center gap-3 text-left">
                  <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
                  <span className="text-gray-300">Saltos ilimitados</span>
                </div>
                {selectedPlan?.name.includes('Premium') && (
                  <>
                    <div className="flex items-center gap-3 text-left">
                      <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
                      <span className="text-gray-300">Descarga offline</span>
                    </div>
                    <div className="flex items-center gap-3 text-left">
                      <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
                      <span className="text-gray-300">Contenido exclusivo</span>
                    </div>
                  </>
                )}
              </div>
            </div>

            <Button
              variant="primary"
              size="lg"
              onClick={handleGoHome}
              className="w-full"
            >
              Comenzar a Escuchar
            </Button>
          </motion.div>
        )}
      </div>
    </div>
  );
}; 