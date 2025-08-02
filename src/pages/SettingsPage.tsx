import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    ArrowLeft,
    Palette,
    Volume2,
    Bell,
    Shield,
    Wifi,
    Download,
    Upload,
    RotateCcw,
    Settings as SettingsIcon
} from 'lucide-react';
import { useSettings } from '../contexts/SettingsContext';
import { AppearanceSettings } from '../components/settings/AppearanceSettings';
import { AudioSettings } from '../components/settings/AudioSettings';
import { NotificationSettings } from '../components/settings/NotificationSettings';
import { PrivacySettings } from '../components/settings/PrivacySettings';
import { DataSettings } from '../components/settings/DataSettings';
import { SettingsStatus } from '../components/settings/SettingsStatus';
import { SettingsImpact } from '../components/settings/SettingsImpact';
import { Button } from '../components/common/Button';
import toast from 'react-hot-toast';

type SettingsSection =
    | 'appearance'
    | 'audio'
    | 'notifications'
    | 'privacy'
    | 'data'
    | null;

export const SettingsPage: React.FC = () => {
    const [activeSection, setActiveSection] = useState<SettingsSection>(null);
    const {
        settings,
        resetSettings,
        exportSettings,
        importSettings,
        isLoading
    } = useSettings();

    const settingsSections = [
        {
            id: 'appearance' as const,
            title: 'Apariencia',
            description: 'Tema, idioma y personalización visual',
            icon: Palette,
            gradient: 'from-purple-600 to-blue-600',
            component: AppearanceSettings,
        },
        {
            id: 'audio' as const,
            title: 'Audio',
            description: 'Calidad, crossfade y configuración de sonido',
            icon: Volume2,
            gradient: 'from-green-600 to-blue-600',
            component: AudioSettings,
        },
        {
            id: 'notifications' as const,
            title: 'Notificaciones',
            description: 'Alertas del sistema y notificaciones por email',
            icon: Bell,
            gradient: 'from-orange-600 to-red-600',
            component: NotificationSettings,
        },
        {
            id: 'privacy' as const,
            title: 'Privacidad',
            description: 'Seguridad, visibilidad y configuración social',
            icon: Shield,
            gradient: 'from-red-600 to-orange-600',
            component: PrivacySettings,
        },
        {
            id: 'data' as const,
            title: 'Datos',
            description: 'Almacenamiento, caché y uso de datos',
            icon: Wifi,
            gradient: 'from-blue-600 to-cyan-600',
            component: DataSettings,
        },
    ];

    const handleExportSettings = () => {
        try {
            const settingsData = exportSettings();
            const blob = new Blob([settingsData], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `streamflow-settings-${new Date().toISOString().split('T')[0]}.json`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            toast.success('Configuraciones exportadas exitosamente');
        } catch (error) {
            console.error('Error al exportar configuraciones:', error);
            toast.error('Error al exportar configuraciones');
        }
    };

    const handleImportSettings = () => {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.json';
        input.onchange = (e) => {
            const file = (e.target as HTMLInputElement).files?.[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    try {
                        const content = e.target?.result as string;
                        importSettings(content);
                    } catch (error) {
                        toast.error('Error al leer el archivo');
                    }
                };
                reader.readAsText(file);
            }
        };
        input.click();
    };

    const handleResetSettings = () => {
        if (window.confirm('¿Estás seguro de que quieres restablecer todas las configuraciones? Esta acción no se puede deshacer.')) {
            resetSettings();
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
            </div>
        );
    }

    // Vista de sección específica
    if (activeSection) {
        const section = settingsSections.find(s => s.id === activeSection);
        if (!section) return null;

        const Component = section.component;

        return (
            <div className="max-w-4xl mx-auto space-y-6">
                {/* Header con botón de regreso */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center gap-4 mb-8"
                >
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setActiveSection(null)}
                        className="text-gray-400 hover:text-white"
                    >
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Volver
                    </Button>
                    <div>
                        <h1 className="text-3xl font-bold text-white">{section.title}</h1>
                        <p className="text-gray-400">{section.description}</p>
                    </div>
                </motion.div>

                {/* Contenido de la sección */}
                <AnimatePresence mode="wait">
                    <motion.div
                        key={activeSection}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.2 }}
                    >
                        <Component />
                    </motion.div>
                </AnimatePresence>

                {/* Mostrar impacto de configuraciones en las secciones */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="mt-8"
                >
                    <SettingsImpact />
                </motion.div>
            </div>
        );
    }

    // Vista principal de configuraciones
    return (
        <div className="max-w-4xl mx-auto space-y-6">
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center mb-8"
            >
                <h1 className="text-3xl font-bold text-white mb-2">Configuraciones</h1>
                <p className="text-gray-400">Personaliza tu experiencia en StreamFlow</p>
            </motion.div>

            {/* Secciones de configuración */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {settingsSections.map((section, index) => {
                    const Icon = section.icon;

                    return (
                        <motion.button
                            key={section.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            onClick={() => setActiveSection(section.id)}
                            className="p-6 bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700/50 hover:border-gray-600/50 transition-all duration-200 text-left group"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            <div className="flex items-start gap-4">
                                <div className={`w-12 h-12 bg-gradient-to-r ${section.gradient} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-200`}>
                                    <Icon className="w-6 h-6 text-white" />
                                </div>
                                <div className="flex-1">
                                    <h3 className="text-lg font-semibold text-white group-hover:text-purple-400 transition-colors">
                                        {section.title}
                                    </h3>
                                    <p className="text-gray-400 text-sm mt-1">
                                        {section.description}
                                    </p>
                                </div>
                            </div>
                        </motion.button>
                    );
                })}
            </div>

            {/* Acciones de gestión */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50"
            >
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                    <SettingsIcon className="w-5 h-5" />
                    Gestión de Configuraciones
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Button
                        variant="outline"
                        onClick={handleExportSettings}
                        className="flex items-center justify-center gap-2"
                    >
                        <Download className="w-4 h-4" />
                        Exportar
                    </Button>

                    <Button
                        variant="outline"
                        onClick={handleImportSettings}
                        className="flex items-center justify-center gap-2"
                    >
                        <Upload className="w-4 h-4" />
                        Importar
                    </Button>

                    <Button
                        variant="outline"
                        onClick={handleResetSettings}
                        className="flex items-center justify-center gap-2 text-red-400 border-red-400/20 hover:bg-red-400/10"
                    >
                        <RotateCcw className="w-4 h-4" />
                        Restablecer
                    </Button>
                </div>

                <p className="text-gray-400 text-sm mt-4">
                    Puedes exportar tus configuraciones para hacer una copia de seguridad o importar configuraciones previas.
                    Restablecer volverá todas las configuraciones a sus valores por defecto.
                </p>
            </motion.div>

            {/* Estado actual de las configuraciones */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
            >
                <SettingsStatus />
            </motion.div>
        </div>
    );
};
