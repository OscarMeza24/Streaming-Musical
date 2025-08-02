import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Settings, Volume2, Wifi, Shield } from 'lucide-react';
import { useSettings } from '../../contexts/SettingsContext';

interface SettingsNotification {
    id: string;
    message: string;
    type: 'audio' | 'privacy' | 'data' | 'general';
    icon: React.ReactNode;
}

export const SettingsNotificationManager: React.FC = () => {
    const { settings } = useSettings();
    const [notifications, setNotifications] = useState<SettingsNotification[]>([]);
    const [lastSettings, setLastSettings] = useState(settings);

    useEffect(() => {
        // Detectar cambios importantes en las configuraciones
        const newNotifications: SettingsNotification[] = [];

        // Cambios de audio
        if (lastSettings.audioQuality !== settings.audioQuality) {
            newNotifications.push({
                id: `audio-quality-${Date.now()}`,
                message: `Calidad de audio cambiada a ${settings.audioQuality}`,
                type: 'audio',
                icon: <Volume2 className="w-4 h-4" />
            });
        }

        if (lastSettings.crossfade !== settings.crossfade) {
            newNotifications.push({
                id: `crossfade-${Date.now()}`,
                message: settings.crossfade ?
                    `Crossfade activado (${settings.crossfadeDuration}s)` :
                    'Crossfade desactivado',
                type: 'audio',
                icon: <Volume2 className="w-4 h-4" />
            });
        }

        // Cambios de privacidad
        if (lastSettings.showListeningActivity !== settings.showListeningActivity) {
            newNotifications.push({
                id: `listening-activity-${Date.now()}`,
                message: settings.showListeningActivity ?
                    'Tu actividad de escucha ahora es pública' :
                    'Tu actividad de escucha ahora es privada',
                type: 'privacy',
                icon: <Shield className="w-4 h-4" />
            });
        }

        // Cambios de datos
        if (lastSettings.dataSaver !== settings.dataSaver) {
            newNotifications.push({
                id: `data-saver-${Date.now()}`,
                message: settings.dataSaver ?
                    'Modo ahorro de datos activado' :
                    'Modo ahorro de datos desactivado',
                type: 'data',
                icon: <Wifi className="w-4 h-4" />
            });
        }

        // Agregar nuevas notificaciones
        if (newNotifications.length > 0) {
            setNotifications(prev => [...prev, ...newNotifications]);

            // Auto-remover después de 5 segundos
            newNotifications.forEach(notification => {
                setTimeout(() => {
                    setNotifications(prev => prev.filter(n => n.id !== notification.id));
                }, 5000);
            });
        }

        setLastSettings(settings);
    }, [settings, lastSettings]);

    const removeNotification = (id: string) => {
        setNotifications(prev => prev.filter(n => n.id !== id));
    };

    const getNotificationColor = (type: string) => {
        switch (type) {
            case 'audio': return 'from-green-600 to-blue-600';
            case 'privacy': return 'from-red-600 to-orange-600';
            case 'data': return 'from-blue-600 to-cyan-600';
            default: return 'from-purple-600 to-pink-600';
        }
    };

    return (
        <div className="fixed top-20 right-4 z-50 space-y-2">
            <AnimatePresence>
                {notifications.map((notification) => (
                    <motion.div
                        key={notification.id}
                        initial={{ opacity: 0, x: 300, scale: 0.8 }}
                        animate={{ opacity: 1, x: 0, scale: 1 }}
                        exit={{ opacity: 0, x: 300, scale: 0.8 }}
                        transition={{
                            type: 'spring',
                            stiffness: 300,
                            damping: 30
                        }}
                        className={`
              w-80 p-4 bg-gray-800/95 backdrop-blur-sm rounded-xl border border-gray-700
              shadow-2xl
            `}
                    >
                        <div className="flex items-start gap-3">
                            <div className={`
                w-8 h-8 bg-gradient-to-r ${getNotificationColor(notification.type)} 
                rounded-lg flex items-center justify-center flex-shrink-0
              `}>
                                {notification.icon}
                            </div>

                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-1">
                                    <Settings className="w-3 h-3 text-gray-400" />
                                    <span className="text-xs text-gray-400 uppercase tracking-wider">
                                        Configuración actualizada
                                    </span>
                                </div>
                                <p className="text-sm text-white leading-relaxed">
                                    {notification.message}
                                </p>
                            </div>

                            <button
                                onClick={() => removeNotification(notification.id)}
                                className="text-gray-400 hover:text-white transition-colors p-1"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>
                    </motion.div>
                ))}
            </AnimatePresence>
        </div>
    );
};
