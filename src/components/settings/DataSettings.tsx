import React from 'react';
import { motion } from 'framer-motion';
import { Wifi, Download, HardDrive, Smartphone } from 'lucide-react';
import { useSettings } from '../../contexts/SettingsContext';

export const DataSettings: React.FC = () => {
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

    const qualityOptions = [
        { value: 'low' as const, label: 'Baja', description: '96 kbps', size: '~1 MB/min' },
        { value: 'medium' as const, label: 'Media', description: '160 kbps', size: '~1.5 MB/min' },
        { value: 'high' as const, label: 'Alta', description: '320 kbps', size: '~2.5 MB/min' },
    ];

    const cacheSizes = [
        { value: 100, label: '100 MB', description: 'Mínimo recomendado' },
        { value: 250, label: '250 MB', description: 'Equilibrado' },
        { value: 500, label: '500 MB', description: 'Recomendado' },
        { value: 1000, label: '1 GB', description: 'Máximo rendimiento' },
        { value: 2000, label: '2 GB', description: 'Para audiófilos' },
    ];

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
        >
            <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-lg flex items-center justify-center">
                    <Wifi className="w-4 h-4 text-white" />
                </div>
                <h2 className="text-xl font-semibold text-white">Datos y Almacenamiento</h2>
            </div>

            {/* Ahorro de Datos */}
            <div className="space-y-3">
                <h3 className="text-lg font-medium text-white">Ahorro de Datos</h3>
                <p className="text-gray-400 text-sm">Controla el uso de datos móviles y WiFi</p>

                <ToggleSwitch
                    enabled={settings.dataSaver}
                    onChange={(enabled) => updateSetting('dataSaver', enabled)}
                    label="Modo Ahorro de Datos"
                    description="Reduce la calidad automáticamente en conexiones lentas"
                    icon={<Smartphone className="w-4 h-4 text-gray-400" />}
                />
            </div>

            {/* Calidad de Descarga */}
            <div className="space-y-3">
                <h3 className="text-lg font-medium text-white">Calidad de Descarga</h3>
                <p className="text-gray-400 text-sm">Calidad para contenido descargado offline</p>

                <div className="space-y-2">
                    {qualityOptions.map((option) => {
                        const isSelected = settings.downloadQuality === option.value;

                        return (
                            <motion.button
                                key={option.value}
                                onClick={() => updateSetting('downloadQuality', option.value)}
                                className={`
                  w-full p-4 rounded-xl border-2 transition-all duration-200 text-left
                  ${isSelected
                                        ? 'border-purple-500 bg-purple-500/10'
                                        : 'border-gray-700 bg-gray-800/50 hover:border-gray-600'
                                    }
                `}
                                whileHover={{ scale: 1.01 }}
                                whileTap={{ scale: 0.99 }}
                            >
                                <div className="flex items-center justify-between">
                                    <div>
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className={`font-medium ${isSelected ? 'text-purple-400' : 'text-white'}`}>
                                                {option.label}
                                            </span>
                                            {isSelected && (
                                                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                                            )}
                                        </div>
                                        <p className="text-gray-400 text-sm">{option.description}</p>
                                    </div>
                                    <span className="text-gray-500 text-xs">{option.size}</span>
                                </div>
                            </motion.button>
                        );
                    })}
                </div>
            </div>

            {/* Tamaño de Caché */}
            <div className="space-y-3">
                <h3 className="text-lg font-medium text-white">Tamaño de Caché</h3>
                <p className="text-gray-400 text-sm">Espacio para almacenar música temporalmente</p>

                <div className="space-y-2">
                    {cacheSizes.map((size) => {
                        const isSelected = settings.cacheSize === size.value;

                        return (
                            <motion.button
                                key={size.value}
                                onClick={() => updateSetting('cacheSize', size.value)}
                                className={`
                  w-full p-3 rounded-xl border-2 transition-all duration-200 text-left
                  ${isSelected
                                        ? 'border-purple-500 bg-purple-500/10'
                                        : 'border-gray-700 bg-gray-800/50 hover:border-gray-600'
                                    }
                `}
                                whileHover={{ scale: 1.01 }}
                                whileTap={{ scale: 0.99 }}
                            >
                                <div className="flex items-center justify-between">
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <span className={`font-medium ${isSelected ? 'text-purple-400' : 'text-white'}`}>
                                                {size.label}
                                            </span>
                                            {isSelected && (
                                                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                                            )}
                                        </div>
                                        <p className="text-gray-400 text-xs">{size.description}</p>
                                    </div>
                                </div>
                            </motion.button>
                        );
                    })}
                </div>
            </div>

            {/* Gestión de Almacenamiento */}
            <div className="space-y-3">
                <h3 className="text-lg font-medium text-white">Gestión de Almacenamiento</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Uso Actual */}
                    <div className="p-4 bg-gray-800/50 rounded-xl border border-gray-700">
                        <h4 className="text-white font-medium mb-3 flex items-center gap-2">
                            <HardDrive className="w-4 h-4" />
                            Uso Actual
                        </h4>
                        <div className="space-y-3">
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-400">Música en caché:</span>
                                <span className="text-white">245 MB</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-400">Descargas offline:</span>
                                <span className="text-white">1.2 GB</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-400">Imágenes:</span>
                                <span className="text-white">78 MB</span>
                            </div>
                            <div className="h-px bg-gray-600"></div>
                            <div className="flex justify-between text-sm font-medium">
                                <span className="text-white">Total:</span>
                                <span className="text-purple-400">1.5 GB</span>
                            </div>
                        </div>
                    </div>

                    {/* Acciones de Limpieza */}
                    <div className="p-4 bg-gray-800/50 rounded-xl border border-gray-700">
                        <h4 className="text-white font-medium mb-3 flex items-center gap-2">
                            <Download className="w-4 h-4" />
                            Limpieza
                        </h4>
                        <div className="space-y-2">
                            <button className="w-full px-3 py-2 bg-gray-700 text-gray-300 rounded-lg hover:bg-gray-600 transition-colors text-sm">
                                Limpiar Caché
                            </button>
                            <button className="w-full px-3 py-2 bg-yellow-600/20 text-yellow-400 rounded-lg hover:bg-yellow-600/30 transition-colors text-sm">
                                Eliminar Descargas
                            </button>
                            <button className="w-full px-3 py-2 bg-red-600/20 text-red-400 rounded-lg hover:bg-red-600/30 transition-colors text-sm">
                                Borrar Todo
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Configuración de Red */}
            <div className="space-y-3">
                <h3 className="text-lg font-medium text-white">Configuración de Red</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 bg-gray-800/50 rounded-xl border border-gray-700">
                        <h4 className="text-white font-medium mb-2">WiFi</h4>
                        <p className="text-gray-400 text-sm mb-3">
                            Configuración para conexiones WiFi
                        </p>
                        <div className="space-y-2">
                            <label className="flex items-center gap-2 text-sm">
                                <input type="checkbox" defaultChecked className="rounded" />
                                <span className="text-gray-300">Descarga automática</span>
                            </label>
                            <label className="flex items-center gap-2 text-sm">
                                <input type="checkbox" defaultChecked className="rounded" />
                                <span className="text-gray-300">Streaming en alta calidad</span>
                            </label>
                        </div>
                    </div>

                    <div className="p-4 bg-gray-800/50 rounded-xl border border-gray-700">
                        <h4 className="text-white font-medium mb-2">Datos Móviles</h4>
                        <p className="text-gray-400 text-sm mb-3">
                            Configuración para datos móviles
                        </p>
                        <div className="space-y-2">
                            <label className="flex items-center gap-2 text-sm">
                                <input type="checkbox" className="rounded" />
                                <span className="text-gray-300">Descarga automática</span>
                            </label>
                            <label className="flex items-center gap-2 text-sm">
                                <input type="checkbox" className="rounded" />
                                <span className="text-gray-300">Streaming en alta calidad</span>
                            </label>
                        </div>
                    </div>
                </div>
            </div>

            {/* Información de Datos */}
            <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-xl">
                <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-green-500/20 rounded-full flex items-center justify-center mt-0.5">
                        <Wifi className="w-3 h-3 text-green-400" />
                    </div>
                    <div>
                        <h4 className="text-green-400 font-medium text-sm">Optimización Inteligente</h4>
                        <p className="text-green-300/80 text-xs mt-1">
                            El sistema ajusta automáticamente la calidad según tu conexión y configuraciones de ahorro de datos.
                            Las canciones que escuchas frecuentemente se almacenan en caché para acceso más rápido.
                        </p>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};
