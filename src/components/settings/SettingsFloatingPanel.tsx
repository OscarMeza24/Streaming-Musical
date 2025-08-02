import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Settings, X, Volume2, Shield, Wifi, Palette } from 'lucide-react';
import { useSettings } from '../../contexts/SettingsContext';

export const SettingsFloatingPanel: React.FC = () => {
    const { settings } = useSettings();
    const [isOpen, setIsOpen] = useState(false);

    const activeSettings = [
        {
            icon: <Volume2 className="w-3 h-3" />,
            label: `Audio: ${settings.audioQuality}`,
            color: 'text-green-400',
            active: true
        },
        {
            icon: <Volume2 className="w-3 h-3" />,
            label: `Crossfade: ${settings.crossfade ? `${settings.crossfadeDuration}s` : 'Off'}`,
            color: settings.crossfade ? 'text-purple-400' : 'text-gray-500',
            active: settings.crossfade
        },
        {
            icon: <Shield className="w-3 h-3" />,
            label: `Privacidad: ${settings.showListeningActivity ? 'Pública' : 'Privada'}`,
            color: settings.showListeningActivity ? 'text-yellow-400' : 'text-green-400',
            active: true
        },
        {
            icon: <Wifi className="w-3 h-3" />,
            label: `Datos: ${settings.dataSaver ? 'Ahorro' : 'Normal'}`,
            color: settings.dataSaver ? 'text-blue-400' : 'text-gray-400',
            active: settings.dataSaver
        },
        {
            icon: <Palette className="w-3 h-3" />,
            label: `Tema: ${settings.theme}`,
            color: 'text-purple-400',
            active: true
        }
    ].filter(setting => setting.active || setting.label.includes('Off'));

    return (
        <>
            {/* Floating Settings Button */}
            <motion.button
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 2 }}
                onClick={() => setIsOpen(!isOpen)}
                className="fixed bottom-24 right-4 z-40 w-12 h-12 bg-gray-800/90 backdrop-blur-sm rounded-full border border-gray-700 flex items-center justify-center hover:bg-gray-700/90 transition-colors shadow-2xl lg:hidden"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
            >
                <Settings className="w-5 h-5 text-purple-400" />
                {/* Indicador de configuraciones activas */}
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-purple-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs font-bold">
                        {activeSettings.length}
                    </span>
                </div>
            </motion.button>

            {/* Floating Panel */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.8, y: 20 }}
                        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                        className="fixed bottom-40 right-4 z-50 w-64 bg-gray-800/95 backdrop-blur-sm rounded-xl border border-gray-700 shadow-2xl"
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between p-4 border-b border-gray-700">
                            <div className="flex items-center gap-2">
                                <Settings className="w-4 h-4 text-purple-400" />
                                <span className="text-white font-medium">Configuraciones</span>
                            </div>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="text-gray-400 hover:text-white transition-colors"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>

                        {/* Settings List */}
                        <div className="p-3 space-y-2 max-h-60 overflow-y-auto">
                            {activeSettings.map((setting, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                    className="flex items-center gap-3 p-2 rounded-lg bg-gray-700/30"
                                >
                                    <div className={setting.color}>
                                        {setting.icon}
                                    </div>
                                    <span className="text-sm text-gray-300 flex-1">
                                        {setting.label}
                                    </span>
                                    <div className={`w-2 h-2 rounded-full ${setting.active ? 'bg-green-400' : 'bg-gray-500'
                                        }`} />
                                </motion.div>
                            ))}
                        </div>

                        {/* Quick Actions */}
                        <div className="p-3 border-t border-gray-700">
                            <button
                                onClick={() => {
                                    // Navegar a configuraciones completas
                                    window.location.href = '/settings';
                                }}
                                className="w-full py-2 px-3 bg-purple-600/20 text-purple-400 rounded-lg hover:bg-purple-600/30 transition-colors text-sm"
                            >
                                Abrir Configuraciones
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};
