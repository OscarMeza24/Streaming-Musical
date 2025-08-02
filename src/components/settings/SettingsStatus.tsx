import React from 'react';
import { motion } from 'framer-motion';
import {
    Palette,
    Volume2,
    Bell,
    Shield,
    Wifi,
    Check,
    AlertCircle
} from 'lucide-react';
import { useSettings } from '../../contexts/SettingsContext';

export const SettingsStatus: React.FC = () => {
    const { settings } = useSettings();

    const getStatusColor = (isGood: boolean) =>
        isGood ? 'text-green-400' : 'text-yellow-400';

    const getStatusIcon = (isGood: boolean) =>
        isGood ? <Check className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />;

    const settingsStatus = [
        {
            category: 'Apariencia',
            icon: Palette,
            gradient: 'from-purple-600 to-blue-600',
            status: [
                {
                    label: 'Tema',
                    value: settings.theme === 'dark' ? 'Oscuro' : settings.theme === 'light' ? 'Claro' : 'Automático',
                    isGood: true
                },
                {
                    label: 'Idioma',
                    value: settings.language === 'es' ? 'Español' : 'English',
                    isGood: true
                }
            ]
        },
        {
            category: 'Audio',
            icon: Volume2,
            gradient: 'from-green-600 to-blue-600',
            status: [
                {
                    label: 'Calidad',
                    value: settings.audioQuality.charAt(0).toUpperCase() + settings.audioQuality.slice(1),
                    isGood: settings.audioQuality !== 'low'
                },
                {
                    label: 'Crossfade',
                    value: settings.crossfade ? `${settings.crossfadeDuration}s` : 'Desactivado',
                    isGood: settings.crossfade
                }
            ]
        },
        {
            category: 'Notificaciones',
            icon: Bell,
            gradient: 'from-orange-600 to-red-600',
            status: [
                {
                    label: 'Desktop',
                    value: settings.desktopNotifications ? 'Activadas' : 'Desactivadas',
                    isGood: settings.desktopNotifications
                },
                {
                    label: 'Email',
                    value: settings.emailNotifications ? 'Activado' : 'Desactivado',
                    isGood: !settings.marketingEmails // Menos marketing es mejor
                }
            ]
        },
        {
            category: 'Privacidad',
            icon: Shield,
            gradient: 'from-red-600 to-orange-600',
            status: [
                {
                    label: 'Actividad',
                    value: settings.showListeningActivity ? 'Pública' : 'Privada',
                    isGood: !settings.showListeningActivity // Más privacidad es mejor
                },
                {
                    label: 'Seguidores',
                    value: settings.allowFollowers ? 'Permitidos' : 'Bloqueados',
                    isGood: settings.allowFollowers
                }
            ]
        },
        {
            category: 'Datos',
            icon: Wifi,
            gradient: 'from-blue-600 to-cyan-600',
            status: [
                {
                    label: 'Ahorro',
                    value: settings.dataSaver ? 'Activado' : 'Desactivado',
                    isGood: settings.dataSaver
                },
                {
                    label: 'Caché',
                    value: `${settings.cacheSize} MB`,
                    isGood: settings.cacheSize >= 250
                }
            ]
        }
    ];

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50"
        >
            <h3 className="text-lg font-semibold text-white mb-4">Estado de Configuraciones</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {settingsStatus.map((category) => {
                    const Icon = category.icon;

                    return (
                        <div
                            key={category.category}
                            className="p-4 bg-gray-700/30 rounded-lg border border-gray-600/30"
                        >
                            <div className="flex items-center gap-2 mb-3">
                                <div className={`w-6 h-6 bg-gradient-to-r ${category.gradient} rounded-lg flex items-center justify-center`}>
                                    <Icon className="w-3 h-3 text-white" />
                                </div>
                                <h4 className="text-sm font-medium text-white">{category.category}</h4>
                            </div>

                            <div className="space-y-2">
                                {category.status.map((item, index) => (
                                    <div key={index} className="flex items-center justify-between text-xs">
                                        <span className="text-gray-400">{item.label}:</span>
                                        <div className="flex items-center gap-1">
                                            <span className={getStatusColor(item.isGood)}>{item.value}</span>
                                            <span className={getStatusColor(item.isGood)}>
                                                {getStatusIcon(item.isGood)}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Indicador de estado general */}
            <div className="mt-4 p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
                <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-green-400" />
                    <span className="text-green-400 text-sm font-medium">
                        Configuraciones cargadas y aplicadas correctamente
                    </span>
                </div>
            </div>
        </motion.div>
    );
};
