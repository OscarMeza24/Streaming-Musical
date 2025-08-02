import React from 'react';
import { motion } from 'framer-motion';
import { Volume2, Shuffle, Radio } from 'lucide-react';
import { useAudioSettings } from '../../contexts/SettingsContext';

export const AudioSettings: React.FC = () => {
    const {
        audioQuality,
        crossfade,
        crossfadeDuration,
        normalizeVolume,
        gaplessPlayback,
        updateAudioQuality,
        updateCrossfade,
        updateCrossfadeDuration,
        updateNormalizeVolume,
        updateGaplessPlayback,
    } = useAudioSettings();

    const qualityOptions = [
        { value: 'low' as const, label: 'Baja', description: '96 kbps - Menor calidad, menos datos', size: '~1 MB/min' },
        { value: 'medium' as const, label: 'Media', description: '160 kbps - Calidad equilibrada', size: '~1.5 MB/min' },
        { value: 'high' as const, label: 'Alta', description: '320 kbps - Alta calidad recomendada', size: '~2.5 MB/min' },
        { value: 'lossless' as const, label: 'Sin pérdida', description: 'FLAC - Máxima calidad audiófila', size: '~10 MB/min' },
    ];

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
                <div className="w-8 h-8 bg-gradient-to-r from-green-600 to-blue-600 rounded-lg flex items-center justify-center">
                    <Volume2 className="w-4 h-4 text-white" />
                </div>
                <h2 className="text-xl font-semibold text-white">Audio</h2>
            </div>

            {/* Calidad de Audio */}
            <div className="space-y-3">
                <h3 className="text-lg font-medium text-white">Calidad de Audio</h3>
                <p className="text-gray-400 text-sm">Selecciona la calidad de reproducción</p>

                <div className="space-y-2">
                    {qualityOptions.map((option) => {
                        const isSelected = audioQuality === option.value;

                        return (
                            <motion.button
                                key={option.value}
                                onClick={() => updateAudioQuality(option.value)}
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

            {/* Crossfade */}
            <div className="space-y-3">
                <ToggleSwitch
                    enabled={crossfade}
                    onChange={updateCrossfade}
                    label="Crossfade"
                    description="Mezcla gradual entre canciones"
                    icon={<Shuffle className="w-4 h-4 text-gray-400" />}
                />

                {crossfade && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="ml-11 space-y-2"
                    >
                        <label className="text-sm text-gray-300">
                            Duración: {crossfadeDuration}s
                        </label>
                        <input
                            type="range"
                            min="0"
                            max="12"
                            step="1"
                            value={crossfadeDuration}
                            onChange={(e) => updateCrossfadeDuration(Number(e.target.value))}
                            className="w-full h-2 bg-gray-700 rounded-lg appearance-none slider"
                        />
                        <div className="flex justify-between text-xs text-gray-500">
                            <span>0s</span>
                            <span>12s</span>
                        </div>
                    </motion.div>
                )}
            </div>

            {/* Otras configuraciones de audio */}
            <div className="space-y-3">
                <ToggleSwitch
                    enabled={normalizeVolume}
                    onChange={updateNormalizeVolume}
                    label="Normalizar Volumen"
                    description="Mantiene un volumen consistente entre canciones"
                    icon={<Volume2 className="w-4 h-4 text-gray-400" />}
                />

                <ToggleSwitch
                    enabled={gaplessPlayback}
                    onChange={updateGaplessPlayback}
                    label="Reproducción Sin Pausas"
                    description="Sin espacios entre canciones en álbums"
                    icon={<Radio className="w-4 h-4 text-gray-400" />}
                />
            </div>

            {/* Información adicional */}
            <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-xl">
                <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-blue-500/20 rounded-full flex items-center justify-center mt-0.5">
                        <Volume2 className="w-3 h-3 text-blue-400" />
                    </div>
                    <div>
                        <h4 className="text-blue-400 font-medium text-sm">Configuración de Audio</h4>
                        <p className="text-blue-300/80 text-xs mt-1">
                            Las configuraciones de alta calidad mejorarán tu experiencia de escucha pero consumirán más datos.
                            El crossfade y la normalización de volumen pueden afectar el rendimiento en dispositivos más antiguos.
                        </p>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};
