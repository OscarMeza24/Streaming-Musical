import React from 'react';
import { motion } from 'framer-motion';
import { Monitor, Moon, Sun, Globe, Palette } from 'lucide-react';
import { useThemeSettings } from '../../contexts/SettingsContext';

export const AppearanceSettings: React.FC = () => {
    const { theme, language, updateTheme, updateLanguage } = useThemeSettings();

    const themes = [
        { value: 'dark' as const, label: 'Oscuro', icon: Moon, description: 'Tema oscuro (actual)' },
        { value: 'light' as const, label: 'Claro', icon: Sun, description: 'Tema claro (experimental)' },
        { value: 'auto' as const, label: 'Automático', icon: Monitor, description: 'Sigue el sistema (experimental)' },
    ];

    const languages = [
        { value: 'es' as const, label: 'Español', flag: '🇪🇸' },
        { value: 'en' as const, label: 'English', flag: '🇺🇸' },
    ];

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
        >
            <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg flex items-center justify-center">
                    <Palette className="w-4 h-4 text-white" />
                </div>
                <h2 className="text-xl font-semibold text-white">Apariencia</h2>
            </div>

            {/* Tema */}
            <div className="space-y-3">
                <h3 className="text-lg font-medium text-white">Tema</h3>
                <p className="text-gray-400 text-sm">Personaliza la apariencia de la aplicación</p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    {themes.map((themeOption) => {
                        const Icon = themeOption.icon;
                        const isSelected = theme === themeOption.value;

                        return (
                            <motion.button
                                key={themeOption.value}
                                onClick={() => updateTheme(themeOption.value)}
                                className={`
                  p-4 rounded-xl border-2 transition-all duration-200 text-left
                  ${isSelected
                                        ? 'border-purple-500 bg-purple-500/10'
                                        : 'border-gray-700 bg-gray-800/50 hover:border-gray-600'
                                    }
                `}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                            >
                                <div className="flex items-center gap-3 mb-2">
                                    <Icon className={`w-5 h-5 ${isSelected ? 'text-purple-400' : 'text-gray-400'}`} />
                                    <span className={`font-medium ${isSelected ? 'text-purple-400' : 'text-white'}`}>
                                        {themeOption.label}
                                    </span>
                                </div>
                                <p className="text-gray-400 text-sm">{themeOption.description}</p>
                            </motion.button>
                        );
                    })}
                </div>
            </div>

            {/* Idioma */}
            <div className="space-y-3">
                <h3 className="text-lg font-medium text-white">Idioma</h3>
                <p className="text-gray-400 text-sm">Selecciona el idioma de la interfaz</p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {languages.map((lang) => {
                        const isSelected = language === lang.value;

                        return (
                            <motion.button
                                key={lang.value}
                                onClick={() => updateLanguage(lang.value)}
                                className={`
                  p-4 rounded-xl border-2 transition-all duration-200 text-left
                  ${isSelected
                                        ? 'border-purple-500 bg-purple-500/10'
                                        : 'border-gray-700 bg-gray-800/50 hover:border-gray-600'
                                    }
                `}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                            >
                                <div className="flex items-center gap-3">
                                    <span className="text-2xl">{lang.flag}</span>
                                    <div className="flex items-center gap-2">
                                        <Globe className={`w-4 h-4 ${isSelected ? 'text-purple-400' : 'text-gray-400'}`} />
                                        <span className={`font-medium ${isSelected ? 'text-purple-400' : 'text-white'}`}>
                                            {lang.label}
                                        </span>
                                    </div>
                                </div>
                            </motion.button>
                        );
                    })}
                </div>
            </div>

            {/* Vista previa del tema */}
            <div className="p-4 bg-gray-800/50 rounded-xl border border-gray-700">
                <h4 className="text-sm font-medium text-gray-300 mb-3">Vista previa</h4>
                <div className="space-y-2">
                    <div className="h-3 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full w-3/4"></div>
                    <div className="h-2 bg-gray-600 rounded-full w-1/2"></div>
                    <div className="h-2 bg-gray-700 rounded-full w-2/3"></div>
                </div>
            </div>
        </motion.div>
    );
};
