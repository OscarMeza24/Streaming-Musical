import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
    ArrowLeft,
    Music,
    Volume2,
    Heart,
    Download,
    Zap,
    Save,
    RotateCcw
} from 'lucide-react';
import { Button } from '../components/common/Button';
import { useSettings } from '../contexts/SettingsContext';
import toast from 'react-hot-toast';

interface MusicPreferences {
    // Calidad de audio
    audioQuality: 'low' | 'medium' | 'high' | 'lossless';

    // Reproducción
    autoplay: boolean;
    crossfade: boolean;
    crossfadeDuration: number;
    gaplessPlayback: boolean;
    normalizeVolume: boolean;

    // Contenido
    showExplicitContent: boolean;
    autoDownload: boolean;
    downloadQuality: 'low' | 'medium' | 'high' | 'lossless';

    // Descubrimiento
    enableRecommendations: boolean;
    allowSimilarArtists: boolean;
    genrePreferences: string[];
    moodBasedPlaylists: boolean;

    // Social
    autoShare: boolean;
    shareFavorites: boolean;
    shareListening: boolean;
}

const genres = [
    'Pop', 'Rock', 'Hip Hop', 'R&B', 'Jazz', 'Blues', 'Country',
    'Electronic', 'Classical', 'Folk', 'Reggae', 'Funk', 'Metal',
    'Punk', 'Alternative', 'Indie', 'Latin', 'World', 'Ambient'
];

export const MusicPreferencesPage: React.FC = () => {
    const navigate = useNavigate();
    const { settings, updateMultipleSettings } = useSettings();

    const [musicPreferences, setMusicPreferences] = useState<MusicPreferences>({
        audioQuality: settings.audioQuality,
        autoplay: settings.autoplay,
        crossfade: settings.crossfade,
        crossfadeDuration: settings.crossfadeDuration,
        gaplessPlayback: settings.gaplessPlayback,
        normalizeVolume: settings.normalizeVolume,
        showExplicitContent: settings.showExplicitContent,
        autoDownload: settings.autoDownload,
        downloadQuality: settings.downloadQuality,
        enableRecommendations: true,
        allowSimilarArtists: true,
        genrePreferences: ['Pop', 'Rock', 'Electronic'],
        moodBasedPlaylists: true,
        autoShare: false,
        shareFavorites: true,
        shareListening: settings.showListeningActivity,
    });

    const [isLoading, setIsLoading] = useState(false);

    const handleSave = async () => {
        setIsLoading(true);
        try {
            // Actualizar configuraciones en el contexto
            updateMultipleSettings({
                audioQuality: musicPreferences.audioQuality,
                autoplay: musicPreferences.autoplay,
                crossfade: musicPreferences.crossfade,
                crossfadeDuration: musicPreferences.crossfadeDuration,
                gaplessPlayback: musicPreferences.gaplessPlayback,
                normalizeVolume: musicPreferences.normalizeVolume,
                showExplicitContent: musicPreferences.showExplicitContent,
                autoDownload: musicPreferences.autoDownload,
                downloadQuality: musicPreferences.downloadQuality === 'lossless' ? 'high' : musicPreferences.downloadQuality as 'low' | 'medium' | 'high',
                showListeningActivity: musicPreferences.shareListening,
            });

            // Guardar preferencias específicas en localStorage
            localStorage.setItem('musicPreferences', JSON.stringify(musicPreferences));

            toast.success('Preferencias de música guardadas correctamente');
        } catch (error) {
            toast.error('Error al guardar las preferencias');
            console.error('Error saving music preferences:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleReset = () => {
        const defaultPreferences: MusicPreferences = {
            audioQuality: 'high',
            autoplay: true,
            crossfade: false,
            crossfadeDuration: 0,
            gaplessPlayback: true,
            normalizeVolume: true,
            showExplicitContent: false,
            autoDownload: true,
            downloadQuality: 'high',
            enableRecommendations: true,
            allowSimilarArtists: true,
            genrePreferences: [],
            moodBasedPlaylists: true,
            autoShare: false,
            shareFavorites: true,
            shareListening: false,
        };

        setMusicPreferences(defaultPreferences);
        localStorage.removeItem('musicPreferences');
        toast.success('Preferencias restauradas a valores por defecto');
    };

    const updatePreference = <K extends keyof MusicPreferences>(
        key: K,
        value: MusicPreferences[K]
    ) => {
        setMusicPreferences(prev => ({ ...prev, [key]: value }));
    };

    const toggleGenre = (genre: string) => {
        setMusicPreferences(prev => ({
            ...prev,
            genrePreferences: prev.genrePreferences.includes(genre)
                ? prev.genrePreferences.filter(g => g !== genre)
                : [...prev.genrePreferences, genre]
        }));
    };

    return (
        <div className="max-w-6xl mx-auto space-y-6">
            {/* Header with Back Button */}
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

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center mb-8"
            >
                <h1 className="text-3xl font-bold text-white mb-2 flex items-center justify-center gap-3">
                    <Music className="w-8 h-8 text-purple-400" />
                    Preferencias de Música
                </h1>
                <p className="text-gray-400">
                    Personaliza tu experiencia musical según tus gustos y preferencias
                </p>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Audio Quality & Playback */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50"
                >
                    <h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
                        <Volume2 className="w-5 h-5 text-purple-400" />
                        Audio y Reproducción
                    </h2>

                    <div className="space-y-6">
                        {/* Audio Quality */}
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-3">
                                Calidad de audio
                            </label>
                            <div className="space-y-2">
                                {[
                                    { value: 'low', label: 'Baja (96 kbps)', desc: 'Menor uso de datos' },
                                    { value: 'medium', label: 'Media (160 kbps)', desc: 'Equilibrio óptimo' },
                                    { value: 'high', label: 'Alta (320 kbps)', desc: 'Excelente calidad' },
                                    { value: 'lossless', label: 'Sin pérdida', desc: 'Máxima calidad' }
                                ].map(({ value, label, desc }) => (
                                    <div
                                        key={value}
                                        className={`p-3 rounded-lg border-2 cursor-pointer transition-colors ${musicPreferences.audioQuality === value
                                                ? 'border-purple-500 bg-purple-500/10'
                                                : 'border-gray-600 hover:border-gray-500'
                                            }`}
                                        onClick={() => updatePreference('audioQuality', value as any)}
                                    >
                                        <div className="text-white font-medium">{label}</div>
                                        <div className="text-gray-400 text-sm">{desc}</div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Playback Settings */}
                        <div className="space-y-4">
                            <h3 className="text-lg font-medium text-white">Configuraciones de Reproducción</h3>

                            {[
                                { key: 'autoplay', label: 'Reproducción automática', desc: 'Continúa reproduciendo música similar' },
                                { key: 'gaplessPlayback', label: 'Reproducción sin pausas', desc: 'Sin silencios entre canciones' },
                                { key: 'normalizeVolume', label: 'Normalizar volumen', desc: 'Mantiene volumen consistente' },
                                { key: 'showExplicitContent', label: 'Mostrar contenido explícito', desc: 'Incluir canciones con letra explícita' }
                            ].map(({ key, label, desc }) => (
                                <div key={key} className="flex items-start justify-between p-3 bg-gray-700/30 rounded-lg">
                                    <div className="flex-1">
                                        <div className="text-white font-medium">{label}</div>
                                        <div className="text-gray-400 text-sm">{desc}</div>
                                    </div>
                                    <button
                                        onClick={() => updatePreference(key as keyof MusicPreferences, !musicPreferences[key as keyof MusicPreferences])}
                                        className={`ml-4 relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${musicPreferences[key as keyof MusicPreferences] ? 'bg-purple-600' : 'bg-gray-600'
                                            }`}
                                    >
                                        <span
                                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${musicPreferences[key as keyof MusicPreferences] ? 'translate-x-6' : 'translate-x-1'
                                                }`}
                                        />
                                    </button>
                                </div>
                            ))}
                        </div>

                        {/* Crossfade */}
                        <div className="space-y-3">
                            <div className="flex items-center justify-between">
                                <label className="text-white font-medium">Crossfade</label>
                                <button
                                    onClick={() => updatePreference('crossfade', !musicPreferences.crossfade)}
                                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${musicPreferences.crossfade ? 'bg-purple-600' : 'bg-gray-600'
                                        }`}
                                >
                                    <span
                                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${musicPreferences.crossfade ? 'translate-x-6' : 'translate-x-1'
                                            }`}
                                    />
                                </button>
                            </div>

                            {musicPreferences.crossfade && (
                                <div className="space-y-2">
                                    <label className="text-gray-300 text-sm">Duración: {musicPreferences.crossfadeDuration}s</label>
                                    <input
                                        type="range"
                                        min="0"
                                        max="12"
                                        step="1"
                                        value={musicPreferences.crossfadeDuration}
                                        onChange={(e) => updatePreference('crossfadeDuration', parseInt(e.target.value))}
                                        className="slider w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                                    />
                                </div>
                            )}
                        </div>
                    </div>
                </motion.div>

                {/* Genre Preferences */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50"
                >
                    <h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
                        <Heart className="w-5 h-5 text-red-400" />
                        Géneros Favoritos
                    </h2>

                    <div className="space-y-4">
                        <p className="text-gray-400 text-sm">
                            Selecciona tus géneros favoritos para obtener mejores recomendaciones
                        </p>

                        <div className="grid grid-cols-2 gap-2">
                            {genres.map((genre) => (
                                <button
                                    key={genre}
                                    onClick={() => toggleGenre(genre)}
                                    className={`p-2 rounded-lg text-sm font-medium transition-colors ${musicPreferences.genrePreferences.includes(genre)
                                            ? 'bg-purple-600 text-white'
                                            : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                                        }`}
                                >
                                    {genre}
                                </button>
                            ))}
                        </div>

                        {musicPreferences.genrePreferences.length > 0 && (
                            <div className="mt-4 p-3 bg-purple-500/10 border border-purple-500/30 rounded-lg">
                                <p className="text-purple-400 text-sm font-medium">
                                    Géneros seleccionados: {musicPreferences.genrePreferences.length}
                                </p>
                                <div className="text-gray-300 text-sm mt-1">
                                    {musicPreferences.genrePreferences.join(', ')}
                                </div>
                            </div>
                        )}
                    </div>
                </motion.div>

                {/* Discovery & Social */}
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                    className="space-y-6"
                >
                    {/* Discovery */}
                    <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50">
                        <h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
                            <Zap className="w-5 h-5 text-yellow-400" />
                            Descubrimiento
                        </h2>

                        <div className="space-y-4">
                            {[
                                { key: 'enableRecommendations', label: 'Recomendaciones automáticas', desc: 'Descubre nueva música basada en tus gustos' },
                                { key: 'allowSimilarArtists', label: 'Artistas similares', desc: 'Incluir artistas parecidos a tus favoritos' },
                                { key: 'moodBasedPlaylists', label: 'Playlists por estado de ánimo', desc: 'Sugerencias basadas en tu actividad' }
                            ].map(({ key, label, desc }) => (
                                <div key={key} className="flex items-start justify-between p-3 bg-gray-700/30 rounded-lg">
                                    <div className="flex-1">
                                        <div className="text-white font-medium">{label}</div>
                                        <div className="text-gray-400 text-sm">{desc}</div>
                                    </div>
                                    <button
                                        onClick={() => updatePreference(key as keyof MusicPreferences, !musicPreferences[key as keyof MusicPreferences])}
                                        className={`ml-4 relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${musicPreferences[key as keyof MusicPreferences] ? 'bg-yellow-600' : 'bg-gray-600'
                                            }`}
                                    >
                                        <span
                                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${musicPreferences[key as keyof MusicPreferences] ? 'translate-x-6' : 'translate-x-1'
                                                }`}
                                        />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Download Settings */}
                    <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50">
                        <h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
                            <Download className="w-5 h-5 text-green-400" />
                            Descargas
                        </h2>

                        <div className="space-y-4">
                            <div className="flex items-start justify-between p-3 bg-gray-700/30 rounded-lg">
                                <div className="flex-1">
                                    <div className="text-white font-medium">Descarga automática</div>
                                    <div className="text-gray-400 text-sm">Descargar canciones automáticamente</div>
                                </div>
                                <button
                                    onClick={() => updatePreference('autoDownload', !musicPreferences.autoDownload)}
                                    className={`ml-4 relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${musicPreferences.autoDownload ? 'bg-green-600' : 'bg-gray-600'
                                        }`}
                                >
                                    <span
                                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${musicPreferences.autoDownload ? 'translate-x-6' : 'translate-x-1'
                                            }`}
                                    />
                                </button>
                            </div>

                            {musicPreferences.autoDownload && (
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-3">
                                        Calidad de descarga
                                    </label>
                                    <div className="space-y-2">
                                        {[
                                            { value: 'low', label: 'Baja (96 kbps)' },
                                            { value: 'medium', label: 'Media (160 kbps)' },
                                            { value: 'high', label: 'Alta (320 kbps)' },
                                            { value: 'lossless', label: 'Sin pérdida' }
                                        ].map(({ value, label }) => (
                                            <div
                                                key={value}
                                                className={`p-3 rounded-lg border-2 cursor-pointer transition-colors ${musicPreferences.downloadQuality === value
                                                        ? 'border-green-500 bg-green-500/10'
                                                        : 'border-gray-600 hover:border-gray-500'
                                                    }`}
                                                onClick={() => updatePreference('downloadQuality', value as any)}
                                            >
                                                <div className="text-white font-medium">{label}</div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </motion.div>
            </div>

            {/* Action Buttons */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="flex flex-col sm:flex-row gap-4 justify-center"
            >
                <Button
                    variant="ghost"
                    onClick={handleReset}
                    className="text-gray-400 hover:text-gray-300"
                >
                    <RotateCcw className="w-4 h-4 mr-2" />
                    Restaurar por defecto
                </Button>

                <Button
                    variant="primary"
                    onClick={handleSave}
                    isLoading={isLoading}
                    className="min-w-32"
                >
                    <Save className="w-4 h-4 mr-2" />
                    Guardar preferencias
                </Button>
            </motion.div>
        </div>
    );
};
