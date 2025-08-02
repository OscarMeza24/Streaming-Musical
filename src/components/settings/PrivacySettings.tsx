import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Eye, Users, Globe, Lock } from 'lucide-react';
import { useSettings } from '../../contexts/SettingsContext';

export const PrivacySettings: React.FC = () => {
    const { settings, updateSetting } = useSettings();

    const ToggleSwitch: React.FC<{
        enabled: boolean;
        onChange: (enabled: boolean) => void;
        label: string;
        description: string;
        icon: React.ReactNode;
        privacy?: 'high' | 'medium' | 'low';
    }> = ({ enabled, onChange, label, description, icon, privacy }) => (
        <div className="flex items-center justify-between p-4 bg-gray-800/50 rounded-xl border border-gray-700">
            <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gray-700 rounded-lg flex items-center justify-center">
                    {icon}
                </div>
                <div className="flex-1">
                    <div className="flex items-center gap-2">
                        <h4 className="text-white font-medium">{label}</h4>
                        {privacy && (
                            <span className={`
                px-2 py-0.5 rounded-full text-xs font-medium
                ${privacy === 'high' ? 'bg-red-500/20 text-red-400' :
                                    privacy === 'medium' ? 'bg-yellow-500/20 text-yellow-400' :
                                        'bg-green-500/20 text-green-400'}
              `}>
                                {privacy === 'high' ? 'Alto Riesgo' :
                                    privacy === 'medium' ? 'Riesgo Medio' :
                                        'Bajo Riesgo'}
                            </span>
                        )}
                    </div>
                    <p className="text-gray-400 text-sm">{description}</p>
                </div>
            </div>
            <motion.button
                onClick={() => onChange(!enabled)}
                className={`
          relative w-12 h-6 rounded-full transition-colors duration-200
          ${enabled ? 'bg-purple-600' : 'bg-gray-600'}
        `}
                whileTap={{ scale: 0.95 }}
            >
                <motion.div
                    className="absolute top-1 w-4 h-4 bg-white rounded-full"
                    animate={{ x: enabled ? 26 : 2 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                />
            </motion.button>
        </div>
    );

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
        >
            <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-8 bg-gradient-to-r from-red-600 to-orange-600 rounded-lg flex items-center justify-center">
                    <Shield className="w-4 h-4 text-white" />
                </div>
                <h2 className="text-xl font-semibold text-white">Privacidad y Seguridad</h2>
            </div>

            {/* Estado de Actividad */}
            <div className="space-y-3">
                <h3 className="text-lg font-medium text-white">Visibilidad de Actividad</h3>
                <p className="text-gray-400 text-sm">Controla qué información pueden ver otros usuarios</p>

                <div className="space-y-3">
                    <ToggleSwitch
                        enabled={settings.showOnlineStatus}
                        onChange={(enabled) => updateSetting('showOnlineStatus', enabled)}
                        label="Estado en Línea"
                        description="Permite que otros vean cuando estás conectado"
                        icon={<Globe className="w-4 h-4 text-gray-400" />}
                        privacy="medium"
                    />

                    <ToggleSwitch
                        enabled={settings.showListeningActivity}
                        onChange={(enabled) => updateSetting('showListeningActivity', enabled)}
                        label="Actividad de Escucha"
                        description="Muestra qué estás escuchando a tus seguidores"
                        icon={<Eye className="w-4 h-4 text-gray-400" />}
                        privacy="high"
                    />
                </div>
            </div>

            {/* Configuración Social */}
            <div className="space-y-3">
                <h3 className="text-lg font-medium text-white">Configuración Social</h3>
                <p className="text-gray-400 text-sm">Gestiona tus interacciones sociales</p>

                <div className="space-y-3">
                    <ToggleSwitch
                        enabled={settings.allowFollowers}
                        onChange={(enabled) => updateSetting('allowFollowers', enabled)}
                        label="Permitir Seguidores"
                        description="Otros usuarios pueden seguir tu actividad musical"
                        icon={<Users className="w-4 h-4 text-gray-400" />}
                        privacy="medium"
                    />

                    <ToggleSwitch
                        enabled={settings.makePlaylistsPublic}
                        onChange={(enabled) => updateSetting('makePlaylistsPublic', enabled)}
                        label="Playlists Públicas por Defecto"
                        description="Las nuevas playlists serán públicas automáticamente"
                        icon={<Globe className="w-4 h-4 text-gray-400" />}
                        privacy="medium"
                    />

                    <ToggleSwitch
                        enabled={settings.sharePlaylists}
                        onChange={(enabled) => updateSetting('sharePlaylists', enabled)}
                        label="Compartir Playlists"
                        description="Permite que otros compartan tus playlists"
                        icon={<Users className="w-4 h-4 text-gray-400" />}
                        privacy="low"
                    />
                </div>
            </div>

            {/* Nivel de Privacidad */}
            <div className="space-y-3">
                <h3 className="text-lg font-medium text-white">Nivel de Privacidad</h3>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    {[
                        {
                            level: 'public',
                            title: 'Público',
                            description: 'Máxima visibilidad social',
                            icon: Globe,
                            settings: { showOnlineStatus: true, showListeningActivity: true, allowFollowers: true }
                        },
                        {
                            level: 'friends',
                            title: 'Solo Amigos',
                            description: 'Visible para seguidores',
                            icon: Users,
                            settings: { showOnlineStatus: true, showListeningActivity: false, allowFollowers: true }
                        },
                        {
                            level: 'private',
                            title: 'Privado',
                            description: 'Máxima privacidad',
                            icon: Lock,
                            settings: { showOnlineStatus: false, showListeningActivity: false, allowFollowers: false }
                        }
                    ].map((preset) => {
                        const Icon = preset.icon;

                        return (
                            <motion.button
                                key={preset.level}
                                onClick={() => {
                                    Object.entries(preset.settings).forEach(([key, value]) => {
                                        updateSetting(key as keyof typeof settings, value);
                                    });
                                }}
                                className="p-4 rounded-xl border border-gray-700 bg-gray-800/50 hover:border-gray-600 transition-all duration-200 text-left"
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                            >
                                <div className="flex items-center gap-3 mb-2">
                                    <Icon className="w-5 h-5 text-purple-400" />
                                    <span className="text-white font-medium">{preset.title}</span>
                                </div>
                                <p className="text-gray-400 text-sm">{preset.description}</p>
                            </motion.button>
                        );
                    })}
                </div>
            </div>

            {/* Gestión de Datos */}
            <div className="space-y-3">
                <h3 className="text-lg font-medium text-white">Gestión de Datos</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 bg-gray-800/50 rounded-xl border border-gray-700">
                        <h4 className="text-white font-medium mb-2 flex items-center gap-2">
                            <Shield className="w-4 h-4" />
                            Descargar Mis Datos
                        </h4>
                        <p className="text-gray-400 text-sm mb-3">
                            Obtén una copia de toda tu información personal
                        </p>
                        <button className="w-full px-3 py-2 bg-purple-600/20 text-purple-400 rounded-lg hover:bg-purple-600/30 transition-colors text-sm">
                            Solicitar Descarga
                        </button>
                    </div>

                    <div className="p-4 bg-gray-800/50 rounded-xl border border-gray-700">
                        <h4 className="text-white font-medium mb-2 flex items-center gap-2">
                            <Lock className="w-4 h-4" />
                            Eliminar Cuenta
                        </h4>
                        <p className="text-gray-400 text-sm mb-3">
                            Elimina permanentemente tu cuenta y datos
                        </p>
                        <button className="w-full px-3 py-2 bg-red-600/20 text-red-400 rounded-lg hover:bg-red-600/30 transition-colors text-sm">
                            Eliminar Cuenta
                        </button>
                    </div>
                </div>
            </div>

            {/* Información de Seguridad */}
            <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-xl">
                <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-blue-500/20 rounded-full flex items-center justify-center mt-0.5">
                        <Shield className="w-3 h-3 text-blue-400" />
                    </div>
                    <div>
                        <h4 className="text-blue-400 font-medium text-sm">Tu Privacidad es Importante</h4>
                        <p className="text-blue-300/80 text-xs mt-1">
                            Revisamos constantemente nuestras políticas de privacidad para proteger tu información.
                            Puedes cambiar estas configuraciones en cualquier momento. Los cambios se aplican inmediatamente.
                        </p>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};
