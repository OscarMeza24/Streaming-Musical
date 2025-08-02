import React from 'react';
import { motion } from 'framer-motion';
import { Info, TrendingUp, Battery, Wifi } from 'lucide-react';
import { useSettings } from '../../contexts/SettingsContext';

export const SettingsImpact: React.FC = () => {
    const { settings } = useSettings();

    // Calcular el impacto de las configuraciones
    const calculateDataUsage = () => {
        const baseUsage = 1; // MB por minuto base
        let multiplier = 1;

        switch (settings.audioQuality) {
            case 'low': multiplier = 0.5; break;
            case 'medium': multiplier = 1; break;
            case 'high': multiplier = 1.8; break;
            case 'lossless': multiplier = 8; break;
        }

        if (settings.dataSaver) multiplier *= 0.7;

        return (baseUsage * multiplier).toFixed(1);
    };

    const calculateBatteryImpact = () => {
        let impact = 'Bajo';
        let impactColor = 'text-green-400';

        if (settings.audioQuality === 'lossless' || settings.cacheSize > 1000) {
            impact = 'Alto';
            impactColor = 'text-red-400';
        } else if (settings.audioQuality === 'high' || settings.crossfade) {
            impact = 'Medio';
            impactColor = 'text-yellow-400';
        }

        return { impact, impactColor };
    };

    const calculatePrivacyScore = () => {
        let score = 0;
        if (!settings.showOnlineStatus) score += 20;
        if (!settings.showListeningActivity) score += 25;
        if (!settings.makePlaylistsPublic) score += 15;
        if (!settings.emailNotifications) score += 10;
        if (!settings.marketingEmails) score += 20;
        if (!settings.allowFollowers) score += 10;

        return Math.min(score, 100);
    };

    const getQualityRecommendation = () => {
        if (settings.dataSaver && settings.audioQuality === 'lossless') {
            return {
                type: 'warning',
                message: 'Tienes activado el ahorro de datos pero la calidad sin pérdida. Considera reducir la calidad.',
                icon: '⚠️'
            };
        }
        if (!settings.dataSaver && settings.audioQuality === 'low') {
            return {
                type: 'info',
                message: 'Puedes mejorar la calidad de audio para una mejor experiencia.',
                icon: '💡'
            };
        }
        return {
            type: 'success',
            message: 'Tu configuración de audio está optimizada.',
            icon: '✅'
        };
    };

    const dataUsage = calculateDataUsage();
    const batteryImpact = calculateBatteryImpact();
    const privacyScore = calculatePrivacyScore();
    const qualityRec = getQualityRecommendation();

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
        >
            {/* Impacto en el rendimiento */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 bg-gray-800/50 rounded-xl border border-gray-700">
                    <div className="flex items-center gap-3 mb-2">
                        <Wifi className="w-5 h-5 text-blue-400" />
                        <h4 className="text-white font-medium">Uso de Datos</h4>
                    </div>
                    <p className="text-2xl font-bold text-blue-400">{dataUsage} MB/min</p>
                    <p className="text-gray-400 text-sm">Consumo estimado por minuto</p>
                </div>

                <div className="p-4 bg-gray-800/50 rounded-xl border border-gray-700">
                    <div className="flex items-center gap-3 mb-2">
                        <Battery className="w-5 h-5 text-green-400" />
                        <h4 className="text-white font-medium">Batería</h4>
                    </div>
                    <p className={`text-2xl font-bold ${batteryImpact.impactColor}`}>
                        {batteryImpact.impact}
                    </p>
                    <p className="text-gray-400 text-sm">Impacto en la batería</p>
                </div>

                <div className="p-4 bg-gray-800/50 rounded-xl border border-gray-700">
                    <div className="flex items-center gap-3 mb-2">
                        <TrendingUp className="w-5 h-5 text-purple-400" />
                        <h4 className="text-white font-medium">Privacidad</h4>
                    </div>
                    <p className="text-2xl font-bold text-purple-400">{privacyScore}%</p>
                    <p className="text-gray-400 text-sm">Puntuación de privacidad</p>
                </div>
            </div>

            {/* Recomendaciones */}
            <div className={`
        p-4 rounded-xl border
        ${qualityRec.type === 'warning' ? 'bg-yellow-500/10 border-yellow-500/20' :
                    qualityRec.type === 'info' ? 'bg-blue-500/10 border-blue-500/20' :
                        'bg-green-500/10 border-green-500/20'}
      `}>
                <div className="flex items-start gap-3">
                    <div className="text-xl">{qualityRec.icon}</div>
                    <div>
                        <div className="flex items-center gap-2">
                            <Info className={`w-4 h-4 ${qualityRec.type === 'warning' ? 'text-yellow-400' :
                                    qualityRec.type === 'info' ? 'text-blue-400' :
                                        'text-green-400'
                                }`} />
                            <h4 className={`font-medium ${qualityRec.type === 'warning' ? 'text-yellow-400' :
                                    qualityRec.type === 'info' ? 'text-blue-400' :
                                        'text-green-400'
                                }`}>
                                Recomendación
                            </h4>
                        </div>
                        <p className={`text-sm mt-1 ${qualityRec.type === 'warning' ? 'text-yellow-300/80' :
                                qualityRec.type === 'info' ? 'text-blue-300/80' :
                                    'text-green-300/80'
                            }`}>
                            {qualityRec.message}
                        </p>
                    </div>
                </div>
            </div>

            {/* Configuraciones activas */}
            <div className="p-4 bg-gray-800/50 rounded-xl border border-gray-700">
                <h4 className="text-white font-medium mb-3">Configuraciones Activas</h4>
                <div className="flex flex-wrap gap-2">
                    {settings.crossfade && (
                        <span className="px-2 py-1 bg-purple-500/20 text-purple-400 rounded-full text-xs">
                            Crossfade {settings.crossfadeDuration}s
                        </span>
                    )}
                    {settings.normalizeVolume && (
                        <span className="px-2 py-1 bg-green-500/20 text-green-400 rounded-full text-xs">
                            Normalización de volumen
                        </span>
                    )}
                    {settings.dataSaver && (
                        <span className="px-2 py-1 bg-blue-500/20 text-blue-400 rounded-full text-xs">
                            Ahorro de datos
                        </span>
                    )}
                    {!settings.showListeningActivity && (
                        <span className="px-2 py-1 bg-red-500/20 text-red-400 rounded-full text-xs">
                            Actividad privada
                        </span>
                    )}
                    {settings.gaplessPlayback && (
                        <span className="px-2 py-1 bg-yellow-500/20 text-yellow-400 rounded-full text-xs">
                            Reproducción sin pausas
                        </span>
                    )}
                </div>
            </div>
        </motion.div>
    );
};
