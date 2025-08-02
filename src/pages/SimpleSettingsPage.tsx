import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
    ArrowLeft,
    Palette,
    Volume2,
    Bell,
    Shield,
    Wifi,
    Check,
    Globe,
    Monitor
} from 'lucide-react';
import { useSettings, useThemeSettings } from '../contexts/SettingsContext';
import { useTranslation } from '../hooks/useTranslation';
import { Button } from '../components/common/Button'; export const SimpleSettingsPage: React.FC = () => {
    const {
        settings,
        updateSetting,
        resetSettings,
        isLoading
    } = useSettings();

    const { theme, language, updateTheme, updateLanguage } = useThemeSettings();
    const { t } = useTranslation();
    const navigate = useNavigate();

    const [activeSection, setActiveSection] = useState<string | null>(null);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
            </div>
        );
    }

    const ToggleSwitch: React.FC<{
        enabled: boolean;
        onChange: (enabled: boolean) => void;
        label: string;
        description: string;
    }> = ({ enabled, onChange, label, description }) => (
        <div className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg">
            <div>
                <h4 className="text-white font-medium">{label}</h4>
                <p className="text-gray-400 text-sm">{description}</p>
            </div>
            <button
                onClick={() => onChange(!enabled)}
                className={`
          relative w-12 h-6 rounded-full transition-colors duration-200
          ${enabled ? 'bg-purple-600' : 'bg-gray-600'}
        `}
            >
                <div
                    className={`
            absolute top-1 w-4 h-4 bg-white rounded-full transition-transform duration-200
            ${enabled ? 'translate-x-6' : 'translate-x-1'}
          `}
                />
            </button>
        </div>
    );

    if (activeSection === 'audio') {
        return (
            <div className="max-w-2xl mx-auto space-y-6">
                <div className="flex items-center gap-4 mb-8">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setActiveSection(null)}
                        className="text-gray-400 hover:text-white"
                    >
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Volver
                    </Button>
                    <h1 className="text-2xl font-bold text-white">Configuración de Audio</h1>
                </div>

                <div className="space-y-4">
                    <div className="bg-gray-800/50 rounded-xl p-6">
                        <h3 className="text-lg font-medium text-white mb-4">Calidad de Audio</h3>
                        <div className="space-y-2">
                            {[
                                { value: 'low', label: 'Baja (96 kbps)', desc: 'Menor uso de datos' },
                                { value: 'medium', label: 'Media (160 kbps)', desc: 'Equilibrio calidad/datos' },
                                { value: 'high', label: 'Alta (320 kbps)', desc: 'Mejor calidad' },
                                { value: 'lossless', label: 'Sin pérdida', desc: 'Máxima calidad' },
                            ].map((option) => (
                                <button
                                    key={option.value}
                                    onClick={() => updateSetting('audioQuality', option.value as any)}
                                    className={`
                    w-full p-3 rounded-lg text-left transition-all
                    ${settings.audioQuality === option.value
                                            ? 'bg-purple-600/20 border-2 border-purple-500'
                                            : 'bg-gray-700/50 border-2 border-transparent hover:bg-gray-700'
                                        }
                  `}
                                >
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <span className="text-white font-medium">{option.label}</span>
                                            <p className="text-gray-400 text-sm">{option.desc}</p>
                                        </div>
                                        {settings.audioQuality === option.value && (
                                            <Check className="w-5 h-5 text-purple-400" />
                                        )}
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="space-y-3">
                        <ToggleSwitch
                            enabled={settings.crossfade}
                            onChange={(enabled) => updateSetting('crossfade', enabled)}
                            label="Crossfade"
                            description="Mezcla suave entre canciones"
                        />

                        {settings.crossfade && (
                            <div className="ml-4 p-3 bg-gray-700/30 rounded-lg">
                                <label className="block text-sm text-gray-300 mb-2">
                                    Duración: {settings.crossfadeDuration}s
                                </label>
                                <input
                                    type="range"
                                    min="1"
                                    max="12"
                                    value={settings.crossfadeDuration}
                                    onChange={(e) => updateSetting('crossfadeDuration', Number(e.target.value))}
                                    className="w-full"
                                />
                            </div>
                        )}

                        <ToggleSwitch
                            enabled={settings.normalizeVolume}
                            onChange={(enabled) => updateSetting('normalizeVolume', enabled)}
                            label="Normalizar Volumen"
                            description="Volumen consistente entre canciones"
                        />

                        <ToggleSwitch
                            enabled={settings.gaplessPlayback}
                            onChange={(enabled) => updateSetting('gaplessPlayback', enabled)}
                            label="Reproducción Sin Pausas"
                            description="Sin espacios entre canciones de álbum"
                        />
                    </div>
                </div>
            </div>
        );
    }

    if (activeSection === 'privacy') {
        return (
            <div className="max-w-2xl mx-auto space-y-6">
                <div className="flex items-center gap-4 mb-8">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setActiveSection(null)}
                        className="text-gray-400 hover:text-white"
                    >
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Volver
                    </Button>
                    <h1 className="text-2xl font-bold text-white">Privacidad</h1>
                </div>

                <div className="space-y-3">
                    <ToggleSwitch
                        enabled={settings.showOnlineStatus}
                        onChange={(enabled) => updateSetting('showOnlineStatus', enabled)}
                        label="Mostrar Estado en Línea"
                        description="Otros pueden ver cuando estás conectado"
                    />

                    <ToggleSwitch
                        enabled={settings.showListeningActivity}
                        onChange={(enabled) => updateSetting('showListeningActivity', enabled)}
                        label="Mostrar Actividad de Escucha"
                        description="Compartir qué estás escuchando"
                    />

                    <ToggleSwitch
                        enabled={settings.allowFollowers}
                        onChange={(enabled) => updateSetting('allowFollowers', enabled)}
                        label="Permitir Seguidores"
                        description="Otros usuarios pueden seguirte"
                    />

                    <ToggleSwitch
                        enabled={settings.makePlaylistsPublic}
                        onChange={(enabled) => updateSetting('makePlaylistsPublic', enabled)}
                        label="Playlists Públicas"
                        description="Nuevas playlists serán públicas por defecto"
                    />
                </div>
            </div>
        );
    }

    // Sección de Notificaciones
    if (activeSection === 'notifications') {
        return (
            <div className="max-w-2xl mx-auto space-y-6">
                <div className="flex items-center gap-4 mb-8">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setActiveSection(null)}
                        className="text-gray-400 hover:text-white"
                    >
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Volver
                    </Button>
                    <h1 className="text-2xl font-bold text-white">{t('notifications')}</h1>
                </div>

                <div className="space-y-3">
                    <ToggleSwitch
                        enabled={settings.desktopNotifications}
                        onChange={(enabled) => updateSetting('desktopNotifications', enabled)}
                        label={t('pushNotifications')}
                        description={t('pushNotificationsDesc')}
                    />

                    <ToggleSwitch
                        enabled={settings.emailNotifications}
                        onChange={(enabled) => updateSetting('emailNotifications', enabled)}
                        label={t('emailNotifications')}
                        description={t('emailNotificationsDesc')}
                    />

                    <ToggleSwitch
                        enabled={settings.playbackNotifications}
                        onChange={(enabled) => updateSetting('playbackNotifications', enabled)}
                        label={t('newReleases')}
                        description={t('newReleasesDesc')}
                    />

                    <ToggleSwitch
                        enabled={settings.marketingEmails}
                        onChange={(enabled) => updateSetting('marketingEmails', enabled)}
                        label="Marketing"
                        description="Recibir emails promocionales y ofertas especiales"
                    />
                </div>
            </div>
        );
    }

    // Sección de Datos
    if (activeSection === 'data') {
        return (
            <div className="max-w-2xl mx-auto space-y-6">
                <div className="flex items-center gap-4 mb-8">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setActiveSection(null)}
                        className="text-gray-400 hover:text-white"
                    >
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Volver
                    </Button>
                    <h1 className="text-2xl font-bold text-white">{t('data')}</h1>
                </div>

                <div className="space-y-4">
                    <div className="bg-gray-800/50 rounded-lg p-6">
                        <h3 className="text-lg font-medium text-white mb-4">{t('downloadQuality')}</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                            {[
                                { value: 'low', label: t('low') },
                                { value: 'medium', label: t('medium') },
                                { value: 'high', label: t('high') }
                            ].map((option) => (
                                <button
                                    key={option.value}
                                    onClick={() => updateSetting('downloadQuality', option.value as any)}
                                    className={`
                    p-3 rounded-lg border transition-all duration-200
                    ${settings.downloadQuality === option.value
                                            ? 'border-purple-500 bg-purple-500/20 text-purple-300'
                                            : 'border-gray-600 bg-gray-800/50 text-gray-300 hover:border-gray-500'
                                        }
                  `}
                                >
                                    <div className="text-center">
                                        <div className="font-medium">{option.label}</div>
                                        {settings.downloadQuality === option.value && (
                                            <Check className="w-4 h-4 text-purple-400 mx-auto mt-1" />
                                        )}
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>

                    <ToggleSwitch
                        enabled={settings.autoDownload}
                        onChange={(enabled) => updateSetting('autoDownload', enabled)}
                        label={t('autoDownload')}
                        description={t('autoDownloadDesc')}
                    />

                    <ToggleSwitch
                        enabled={settings.dataSaver}
                        onChange={(enabled) => updateSetting('dataSaver', enabled)}
                        label={t('dataUsage')}
                        description={t('dataUsageDesc')}
                    />
                </div>
            </div>
        );
    }

    // Sección de Apariencia
    if (activeSection === 'appearance') {
        return (
            <div className="max-w-4xl mx-auto space-y-6">
                <div className="flex items-center gap-4 mb-6">
                    <button
                        onClick={() => setActiveSection(null)}
                        className="p-2 rounded-lg bg-gray-800 hover:bg-gray-700 transition-colors"
                    >
                        <ArrowLeft className="w-5 h-5 text-white" />
                    </button>
                    <h1 className="text-2xl font-bold text-white">{t('appearance')}</h1>
                </div>

                <div className="space-y-4">
                    <div className="bg-gray-800/50 rounded-lg p-6">
                        <h3 className="text-lg font-medium text-white mb-4">{t('theme')}</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                            {[
                                { value: 'dark', label: t('dark'), icon: Monitor },
                                { value: 'light', label: t('light'), icon: Monitor },
                                { value: 'auto', label: t('auto'), icon: Monitor }
                            ].map((option) => {
                                const Icon = option.icon;
                                return (
                                    <button
                                        key={option.value}
                                        onClick={() => updateTheme(option.value as any)}
                                        className={`
                      p-4 rounded-lg border-2 transition-all duration-200 text-left
                      ${theme === option.value
                                                ? 'border-purple-500 bg-purple-500/20'
                                                : 'border-gray-600 bg-gray-800/50 hover:border-gray-500'
                                            }
                    `}
                                    >
                                        <div className="flex items-center gap-3">
                                            <Icon className="w-5 h-5 text-purple-400" />
                                            <span className="text-white font-medium">{option.label}</span>
                                            {theme === option.value && (
                                                <Check className="w-4 h-4 text-purple-400 ml-auto" />
                                            )}
                                        </div>
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // Sección de Idioma
    if (activeSection === 'language') {
        return (
            <div className="max-w-4xl mx-auto space-y-6">
                <div className="flex items-center gap-4 mb-6">
                    <button
                        onClick={() => setActiveSection(null)}
                        className="p-2 rounded-lg bg-gray-800 hover:bg-gray-700 transition-colors"
                    >
                        <ArrowLeft className="w-5 h-5 text-white" />
                    </button>
                    <h1 className="text-2xl font-bold text-white">{t('language')}</h1>
                </div>

                <div className="space-y-4">
                    <div className="bg-gray-800/50 rounded-lg p-6">
                        <h3 className="text-lg font-medium text-white mb-4">{t('language')}</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {[
                                { value: 'es', label: 'Español', flag: '🇪🇸' },
                                { value: 'en', label: 'English', flag: '🇺🇸' }
                            ].map((option) => (
                                <button
                                    key={option.value}
                                    onClick={() => updateLanguage(option.value as any)}
                                    className={`
                    p-4 rounded-lg border-2 transition-all duration-200 text-left
                    ${language === option.value
                                            ? 'border-purple-500 bg-purple-500/20'
                                            : 'border-gray-600 bg-gray-800/50 hover:border-gray-500'
                                        }
                  `}
                                >
                                    <div className="flex items-center gap-3">
                                        <span className="text-2xl">{option.flag}</span>
                                        <span className="text-white font-medium">{option.label}</span>
                                        {language === option.value && (
                                            <Check className="w-4 h-4 text-purple-400 ml-auto" />
                                        )}
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // Vista principal
    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <div className="flex items-center justify-between mb-8">
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => navigate(-1)}
                    className="text-gray-400 hover:text-white"
                >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Volver
                </Button>
            </div>

            <div className="text-center mb-8">
                <h1 className="text-3xl font-bold text-white mb-2">{t('settingsTitle')}</h1>
                <p className="text-gray-400">Personaliza tu experiencia en StreamFlow</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[
                    {
                        id: 'audio',
                        title: t('audio'),
                        description: 'Calidad, crossfade y efectos de sonido',
                        icon: Volume2,
                        gradient: 'from-green-600 to-blue-600',
                    },
                    {
                        id: 'privacy',
                        title: t('privacy'),
                        description: 'Visibilidad y configuración social',
                        icon: Shield,
                        gradient: 'from-red-600 to-orange-600',
                    },
                    {
                        id: 'notifications',
                        title: t('notifications'),
                        description: 'Alertas y notificaciones por email',
                        icon: Bell,
                        gradient: 'from-orange-600 to-yellow-600',
                    },
                    {
                        id: 'data',
                        title: t('data'),
                        description: 'Almacenamiento y uso de datos',
                        icon: Wifi,
                        gradient: 'from-blue-600 to-cyan-600',
                    },
                    {
                        id: 'appearance',
                        title: t('appearance'),
                        description: 'Tema y apariencia visual',
                        icon: Palette,
                        gradient: 'from-purple-600 to-pink-600',
                    },
                    {
                        id: 'language',
                        title: t('language'),
                        description: 'Idioma de la aplicación',
                        icon: Globe,
                        gradient: 'from-indigo-600 to-blue-600',
                    },
                ].map((section) => {
                    const Icon = section.icon;
                    return (
                        <motion.button
                            key={section.id}
                            onClick={() => setActiveSection(section.id)}
                            className="p-6 bg-gray-800/50 rounded-xl border border-gray-700 hover:border-gray-600 transition-all text-left"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            <div className="flex items-start gap-4">
                                <div className={`w-12 h-12 bg-gradient-to-r ${section.gradient} rounded-xl flex items-center justify-center`}>
                                    <Icon className="w-6 h-6 text-white" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold text-white">{section.title}</h3>
                                    <p className="text-gray-400 text-sm">{section.description}</p>
                                </div>
                            </div>
                        </motion.button>
                    );
                })}
            </div>

            {/* Estado actual resumido */}
            <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700">
                <h3 className="text-lg font-semibold text-white mb-4">Estado Actual</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                        <span className="text-gray-400">Calidad:</span>
                        <span className="text-white ml-2 capitalize">{settings.audioQuality}</span>
                    </div>
                    <div>
                        <span className="text-gray-400">Crossfade:</span>
                        <span className="text-white ml-2">{settings.crossfade ? 'Activo' : 'Inactivo'}</span>
                    </div>
                    <div>
                        <span className="text-gray-400">Actividad:</span>
                        <span className="text-white ml-2">{settings.showListeningActivity ? 'Pública' : 'Privada'}</span>
                    </div>
                    <div>
                        <span className="text-gray-400">Ahorro datos:</span>
                        <span className="text-white ml-2">{settings.dataSaver ? 'Activo' : 'Inactivo'}</span>
                    </div>
                </div>
            </div>

            {/* Acciones */}
            <div className="flex gap-4">
                <Button
                    variant="outline"
                    onClick={() => {
                        if (confirm('¿Restablecer todas las configuraciones?')) {
                            resetSettings();
                        }
                    }}
                    className="text-red-400 border-red-400/20 hover:bg-red-400/10"
                >
                    Restablecer Todo
                </Button>
            </div>
        </div>
    );
};
