import React from 'react';
import { motion } from 'framer-motion';
import { Bell, Mail, Smartphone, Volume2 } from 'lucide-react';
import { useSettings } from '../../contexts/SettingsContext';

export const NotificationSettings: React.FC = () => {
    const { settings, updateSetting } = useSettings();

    const ToggleSwitch: React.FC<{
        enabled: boolean;
        onChange: (enabled: boolean) => void;
        label: string;
        description: string;
        icon: React.ReactNode;
    }> = ({ enabled, onChange, label, description, icon }) => (
        <div className="flex items-center justify-between p-4 bg-gray-800/50 rounded-xl border border-gray-700">
            <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gray-700 rounded-lg flex items-center justify-center">
                    {icon}
                </div>
                <div>
                    <h4 className="text-white font-medium">{label}</h4>
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
                <div className="w-8 h-8 bg-gradient-to-r from-orange-600 to-red-600 rounded-lg flex items-center justify-center">
                    <Bell className="w-4 h-4 text-white" />
                </div>
                <h2 className="text-xl font-semibold text-white">Notificaciones</h2>
            </div>

            {/* Notificaciones del Sistema */}
            <div className="space-y-3">
                <h3 className="text-lg font-medium text-white">Notificaciones del Sistema</h3>
                <p className="text-gray-400 text-sm">Controla las notificaciones en tu dispositivo</p>

                <div className="space-y-3">
                    <ToggleSwitch
                        enabled={settings.desktopNotifications}
                        onChange={(enabled) => updateSetting('desktopNotifications', enabled)}
                        label="Notificaciones de Escritorio"
                        description="Muestra notificaciones en tu escritorio"
                        icon={<Smartphone className="w-4 h-4 text-gray-400" />}
                    />

                    <ToggleSwitch
                        enabled={settings.playbackNotifications}
                        onChange={(enabled) => updateSetting('playbackNotifications', enabled)}
                        label="Notificaciones de Reproducción"
                        description="Notifica sobre cambios de canción y controles"
                        icon={<Volume2 className="w-4 h-4 text-gray-400" />}
                    />
                </div>
            </div>

            {/* Notificaciones por Email */}
            <div className="space-y-3">
                <h3 className="text-lg font-medium text-white">Notificaciones por Email</h3>
                <p className="text-gray-400 text-sm">Recibe actualizaciones en tu correo electrónico</p>

                <div className="space-y-3">
                    <ToggleSwitch
                        enabled={settings.emailNotifications}
                        onChange={(enabled) => updateSetting('emailNotifications', enabled)}
                        label="Notificaciones de Cuenta"
                        description="Cambios de contraseña, seguridad, etc."
                        icon={<Mail className="w-4 h-4 text-gray-400" />}
                    />

                    <ToggleSwitch
                        enabled={settings.marketingEmails}
                        onChange={(enabled) => updateSetting('marketingEmails', enabled)}
                        label="Emails de Marketing"
                        description="Nuevas funciones, promociones y noticias"
                        icon={<Bell className="w-4 h-4 text-gray-400" />}
                    />
                </div>
            </div>

            {/* Estado de permisos */}
            <div className="p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-xl">
                <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-yellow-500/20 rounded-full flex items-center justify-center mt-0.5">
                        <Bell className="w-3 h-3 text-yellow-400" />
                    </div>
                    <div>
                        <h4 className="text-yellow-400 font-medium text-sm">Permisos de Notificación</h4>
                        <p className="text-yellow-300/80 text-xs mt-1">
                            Para recibir notificaciones del sistema, asegúrate de que los permisos estén habilitados en tu navegador.
                            Puedes gestionar estos permisos en la configuración de tu navegador.
                        </p>
                        <button
                            onClick={() => {
                                if ('Notification' in window) {
                                    Notification.requestPermission().then(permission => {
                                        if (permission === 'granted') {
                                            new Notification('¡Notificaciones habilitadas!', {
                                                body: 'Ahora recibirás notificaciones de StreamFlow.',
                                                icon: '/favicon.ico'
                                            });
                                        }
                                    });
                                }
                            }}
                            className="mt-2 px-3 py-1 bg-yellow-500/20 text-yellow-400 rounded-lg text-xs hover:bg-yellow-500/30 transition-colors"
                        >
                            Solicitar Permisos
                        </button>
                    </div>
                </div>
            </div>

            {/* Configuración de notificaciones detallada */}
            <div className="space-y-3">
                <h3 className="text-lg font-medium text-white">Configuración Avanzada</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 bg-gray-800/50 rounded-xl border border-gray-700">
                        <h4 className="text-white font-medium mb-2">Horario de Notificaciones</h4>
                        <p className="text-gray-400 text-sm mb-3">
                            Define cuándo quieres recibir notificaciones
                        </p>
                        <div className="space-y-2">
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-gray-300">Desde:</span>
                                <input
                                    type="time"
                                    defaultValue="09:00"
                                    className="bg-gray-700 text-white rounded px-2 py-1 text-xs"
                                />
                            </div>
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-gray-300">Hasta:</span>
                                <input
                                    type="time"
                                    defaultValue="22:00"
                                    className="bg-gray-700 text-white rounded px-2 py-1 text-xs"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="p-4 bg-gray-800/50 rounded-xl border border-gray-700">
                        <h4 className="text-white font-medium mb-2">Frecuencia</h4>
                        <p className="text-gray-400 text-sm mb-3">
                            Con qué frecuencia recibir resúmenes
                        </p>
                        <select className="w-full bg-gray-700 text-white rounded px-2 py-1 text-sm">
                            <option value="immediate">Inmediatamente</option>
                            <option value="daily">Resumen diario</option>
                            <option value="weekly">Resumen semanal</option>
                            <option value="never">Nunca</option>
                        </select>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};
