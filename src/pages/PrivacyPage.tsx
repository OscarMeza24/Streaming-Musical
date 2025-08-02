import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
    ArrowLeft,
    Shield,
    Users,
    Lock,
    Globe,
    UserCheck,
    Download,
    Trash2,
    AlertTriangle,
    Info,
    X
} from 'lucide-react';
import { Button } from '../components/common/Button';
import { useSettings } from '../contexts/SettingsContext';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';

interface PrivacySettings {
    profileVisibility: 'public' | 'friends' | 'private';
    showActivity: boolean;
    showPlaylists: boolean;
    showListening: boolean;
    allowFollowers: boolean;
    showOnlineStatus: boolean;
    dataCollection: boolean;
    personalizedAds: boolean;
    analyticsSharing: boolean;
    thirdPartySharing: boolean;
}

export const PrivacyPage: React.FC = () => {
    const navigate = useNavigate();
    const { settings, updateSetting } = useSettings();
    const { logout } = useAuth();

    // Cargar configuraciones guardadas desde localStorage
    const loadSavedSettings = (): PrivacySettings => {
        try {
            const saved = localStorage.getItem('privacySettings');
            if (saved) {
                return JSON.parse(saved);
            }
        } catch (error) {
            console.error('Error loading privacy settings:', error);
        }

        // Valores por defecto sincronizados con el contexto
        return {
            profileVisibility: 'public',
            showActivity: true,
            showPlaylists: settings.makePlaylistsPublic,
            showListening: settings.showListeningActivity,
            allowFollowers: settings.allowFollowers,
            showOnlineStatus: settings.showOnlineStatus,
            dataCollection: true,
            personalizedAds: true,
            analyticsSharing: false,
            thirdPartySharing: false,
        };
    };

    const [privacySettings, setPrivacySettings] = useState<PrivacySettings>(loadSavedSettings);

    const [isLoading, setIsLoading] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [deleteConfirmText, setDeleteConfirmText] = useState('');
    const [isDeletingData, setIsDeletingData] = useState(false);

    const handleSave = async () => {
        setIsLoading(true);
        try {
            // Simular guardado
            await new Promise(resolve => setTimeout(resolve, 1000));

            // Guardar en localStorage
            localStorage.setItem('privacySettings', JSON.stringify(privacySettings));

            // Sincronizar con el contexto de settings
            updateSetting('showOnlineStatus', privacySettings.showOnlineStatus);
            updateSetting('showListeningActivity', privacySettings.showListening);
            updateSetting('makePlaylistsPublic', privacySettings.showPlaylists);
            updateSetting('allowFollowers', privacySettings.allowFollowers);

            toast.success('Configuración de privacidad guardada correctamente');
        } catch (error) {
            toast.error('Error al guardar la configuración');
        } finally {
            setIsLoading(false);
        }
    };

    const handleReset = () => {
        const defaultSettings = {
            profileVisibility: 'public' as const,
            showActivity: true,
            showPlaylists: true,
            showListening: true,
            allowFollowers: true,
            showOnlineStatus: true,
            dataCollection: true,
            personalizedAds: true,
            analyticsSharing: false,
            thirdPartySharing: false,
        };

        setPrivacySettings(defaultSettings);
        localStorage.removeItem('privacySettings');
        toast.success('Configuración restaurada a valores por defecto');
    };

    const handleDeleteData = () => {
        setShowDeleteModal(true);
    };

    const confirmDeleteData = async () => {
        if (deleteConfirmText !== 'ELIMINAR') {
            toast.error('Debes escribir "ELIMINAR" para confirmar');
            return;
        }

        setIsDeletingData(true);
        try {
            // Simular proceso de eliminación de datos
            await new Promise(resolve => setTimeout(resolve, 2000));

            // Eliminar todos los datos del localStorage
            const keysToRemove = [
                'privacySettings',
                'userSettings',
                'playerState',
                'authToken',
                'userProfile',
                'recentPlays',
                'favorites',
                'playlists',
                'searchHistory',
                'audioSettings'
            ];

            keysToRemove.forEach(key => {
                localStorage.removeItem(key);
            });

            // Limpiar sessionStorage también
            sessionStorage.clear();

            toast.success('Todos tus datos han sido eliminados correctamente');

            // Cerrar sesión y redirigir
            setTimeout(() => {
                logout();
                navigate('/login');
            }, 2000);

        } catch (error) {
            toast.error('Error al eliminar los datos');
            console.error('Error deleting data:', error);
        } finally {
            setIsDeletingData(false);
            setShowDeleteModal(false);
            setDeleteConfirmText('');
        }
    };

    const handleDownloadData = async () => {
        setIsLoading(true);
        try {
            // Recopilar todos los datos del usuario
            const userData = {
                profile: JSON.parse(localStorage.getItem('userProfile') || '{}'),
                settings: {
                    privacy: JSON.parse(localStorage.getItem('privacySettings') || '{}'),
                    user: JSON.parse(localStorage.getItem('userSettings') || '{}'),
                    audio: JSON.parse(localStorage.getItem('audioSettings') || '{}'),
                },
                activity: {
                    recentPlays: JSON.parse(localStorage.getItem('recentPlays') || '[]'),
                    favorites: JSON.parse(localStorage.getItem('favorites') || '[]'),
                    playlists: JSON.parse(localStorage.getItem('playlists') || '[]'),
                    searchHistory: JSON.parse(localStorage.getItem('searchHistory') || '[]'),
                },
                exportDate: new Date().toISOString(),
                exportVersion: '1.0'
            };

            // Crear archivo JSON para descarga
            const dataStr = JSON.stringify(userData, null, 2);
            const dataBlob = new Blob([dataStr], { type: 'application/json' });

            // Crear enlace de descarga
            const url = URL.createObjectURL(dataBlob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `streamflow-data-export-${new Date().toISOString().split('T')[0]}.json`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);

            toast.success('Descarga de datos iniciada correctamente');
        } catch (error) {
            toast.error('Error al generar la descarga de datos');
            console.error('Error downloading data:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const updatePrivacySetting = <K extends keyof PrivacySettings>(
        key: K,
        value: PrivacySettings[K]
    ) => {
        setPrivacySettings(prev => ({ ...prev, [key]: value }));
    };

    return (
        <div className="max-w-4xl mx-auto space-y-6">
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
                    <Shield className="w-8 h-8 text-blue-400" />
                    Configuración de Privacidad
                </h1>
                <p className="text-gray-400">
                    Controla quién puede ver tu información y cómo se utilizan tus datos
                </p>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Profile Privacy */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50"
                >
                    <h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
                        <Users className="w-5 h-5 text-blue-400" />
                        Privacidad del Perfil
                    </h2>

                    <div className="space-y-6">
                        {/* Profile Visibility */}
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-3">
                                Visibilidad del perfil
                            </label>
                            <div className="space-y-2">
                                {[
                                    { value: 'public', label: 'Público', icon: Globe, desc: 'Cualquiera puede ver tu perfil' },
                                    { value: 'friends', label: 'Solo amigos', icon: UserCheck, desc: 'Solo tus amigos pueden ver tu perfil' },
                                    { value: 'private', label: 'Privado', icon: Lock, desc: 'Solo tú puedes ver tu perfil' }
                                ].map(({ value, label, icon: Icon, desc }) => (
                                    <div
                                        key={value}
                                        className={`p-3 rounded-lg border-2 cursor-pointer transition-colors ${privacySettings.profileVisibility === value
                                            ? 'border-blue-500 bg-blue-500/10'
                                            : 'border-gray-600 hover:border-gray-500'
                                            }`}
                                        onClick={() => updatePrivacySetting('profileVisibility', value as any)}
                                    >
                                        <div className="flex items-center gap-3">
                                            <Icon className="w-4 h-4 text-gray-400" />
                                            <div>
                                                <div className="text-white font-medium">{label}</div>
                                                <div className="text-gray-400 text-sm">{desc}</div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Activity Settings */}
                        <div className="space-y-4">
                            <h3 className="text-lg font-medium text-white">Actividad</h3>

                            {[
                                { key: 'showActivity', label: 'Mostrar actividad reciente', desc: 'Permite que otros vean tu actividad musical' },
                                { key: 'showPlaylists', label: 'Mostrar playlists públicas', desc: 'Tus playlists públicas serán visibles' },
                                { key: 'showListening', label: 'Mostrar lo que estás escuchando', desc: 'Otros verán tu música actual' },
                                { key: 'allowFollowers', label: 'Permitir seguidores', desc: 'Los usuarios pueden seguir tu perfil' },
                                { key: 'showOnlineStatus', label: 'Mostrar estado en línea', desc: 'Mostrar cuando estás activo' }
                            ].map(({ key, label, desc }) => (
                                <div key={key} className="flex items-start justify-between p-3 bg-gray-700/30 rounded-lg">
                                    <div className="flex-1">
                                        <div className="text-white font-medium">{label}</div>
                                        <div className="text-gray-400 text-sm">{desc}</div>
                                    </div>
                                    <button
                                        onClick={() => updatePrivacySetting(key as keyof PrivacySettings, !privacySettings[key as keyof PrivacySettings])}
                                        className={`ml-4 relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${privacySettings[key as keyof PrivacySettings] ? 'bg-blue-600' : 'bg-gray-600'
                                            }`}
                                    >
                                        <span
                                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${privacySettings[key as keyof PrivacySettings] ? 'translate-x-6' : 'translate-x-1'
                                                }`}
                                        />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                </motion.div>

                {/* Data Privacy */}
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50"
                >
                    <h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
                        <Lock className="w-5 h-5 text-green-400" />
                        Privacidad de Datos
                    </h2>

                    <div className="space-y-6">
                        {/* Data Collection */}
                        <div className="space-y-4">
                            <h3 className="text-lg font-medium text-white">Recopilación de Datos</h3>

                            {[
                                { key: 'dataCollection', label: 'Recopilación de datos de uso', desc: 'Ayuda a mejorar la experiencia' },
                                { key: 'personalizedAds', label: 'Anuncios personalizados', desc: 'Mostrar anuncios relevantes para ti' },
                                { key: 'analyticsSharing', label: 'Compartir análisis anónimos', desc: 'Datos agregados sin identificación personal' },
                                { key: 'thirdPartySharing', label: 'Compartir con terceros', desc: 'Permitir integración con servicios externos' }
                            ].map(({ key, label, desc }) => (
                                <div key={key} className="flex items-start justify-between p-3 bg-gray-700/30 rounded-lg">
                                    <div className="flex-1">
                                        <div className="text-white font-medium">{label}</div>
                                        <div className="text-gray-400 text-sm">{desc}</div>
                                    </div>
                                    <button
                                        onClick={() => updatePrivacySetting(key as keyof PrivacySettings, !privacySettings[key as keyof PrivacySettings])}
                                        className={`ml-4 relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${privacySettings[key as keyof PrivacySettings] ? 'bg-green-600' : 'bg-gray-600'
                                            }`}
                                    >
                                        <span
                                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${privacySettings[key as keyof PrivacySettings] ? 'translate-x-6' : 'translate-x-1'
                                                }`}
                                        />
                                    </button>
                                </div>
                            ))}
                        </div>

                        {/* Data Management */}
                        <div className="space-y-4">
                            <h3 className="text-lg font-medium text-white">Gestión de Datos</h3>

                            <div className="space-y-3">
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    fullWidth
                                    onClick={handleDownloadData}
                                    isLoading={isLoading}
                                    className="justify-start text-blue-400 hover:text-blue-300 hover:bg-blue-400/10"
                                >
                                    <Download className="w-4 h-4 mr-2" />
                                    Descargar mis datos
                                </Button>

                                <Button
                                    variant="ghost"
                                    size="sm"
                                    fullWidth
                                    onClick={handleDeleteData}
                                    className="justify-start text-red-400 hover:text-red-300 hover:bg-red-400/10"
                                >
                                    <Trash2 className="w-4 h-4 mr-2" />
                                    Eliminar todos mis datos
                                </Button>
                            </div>
                        </div>

                        {/* Privacy Notice */}
                        <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
                            <div className="flex items-start gap-3">
                                <Info className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0" />
                                <div>
                                    <h4 className="text-blue-400 font-medium mb-1">Información importante</h4>
                                    <p className="text-gray-300 text-sm">
                                        Algunos cambios pueden tardar hasta 24 horas en aplicarse completamente.
                                        Para más información, consulta nuestra política de privacidad.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>

            {/* Action Buttons */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="flex flex-col sm:flex-row gap-4 justify-center"
            >
                <Button
                    variant="ghost"
                    onClick={handleReset}
                    className="text-gray-400 hover:text-gray-300"
                >
                    Restaurar por defecto
                </Button>

                <Button
                    variant="primary"
                    onClick={handleSave}
                    isLoading={isLoading}
                    className="min-w-32"
                >
                    Guardar cambios
                </Button>
            </motion.div>

            {/* Modal de Confirmación de Eliminación */}
            <AnimatePresence>
                {showDeleteModal && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
                        onClick={() => setShowDeleteModal(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="bg-gray-800 rounded-xl border border-gray-700 p-6 max-w-md w-full mx-4"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-xl font-semibold text-white flex items-center gap-2">
                                    <AlertTriangle className="w-6 h-6 text-red-400" />
                                    Eliminar Todos los Datos
                                </h3>
                                <button
                                    onClick={() => setShowDeleteModal(false)}
                                    className="text-gray-400 hover:text-white transition-colors"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            <div className="space-y-4">
                                <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4">
                                    <div className="flex items-start gap-3">
                                        <AlertTriangle className="w-5 h-5 text-red-400 mt-0.5 flex-shrink-0" />
                                        <div>
                                            <h4 className="text-red-400 font-medium mb-1">¡Acción Irreversible!</h4>
                                            <p className="text-gray-300 text-sm">
                                                Esta acción eliminará permanentemente todos tus datos, incluyendo:
                                            </p>
                                            <ul className="text-gray-300 text-sm mt-2 ml-4 list-disc">
                                                <li>Perfil de usuario</li>
                                                <li>Configuraciones personales</li>
                                                <li>Historial de reproducción</li>
                                                <li>Playlists y favoritos</li>
                                                <li>Historial de búsquedas</li>
                                                <li>Configuraciones de audio</li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">
                                        Para confirmar, escribe <span className="font-bold text-red-400">"ELIMINAR"</span>:
                                    </label>
                                    <input
                                        type="text"
                                        value={deleteConfirmText}
                                        onChange={(e) => setDeleteConfirmText(e.target.value)}
                                        placeholder="Escribe ELIMINAR"
                                        className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500"
                                    />
                                </div>

                                <div className="flex gap-3 pt-4">
                                    <Button
                                        variant="ghost"
                                        onClick={() => {
                                            setShowDeleteModal(false);
                                            setDeleteConfirmText('');
                                        }}
                                        className="flex-1"
                                    >
                                        Cancelar
                                    </Button>
                                    <Button
                                        variant="primary"
                                        onClick={confirmDeleteData}
                                        isLoading={isDeletingData}
                                        className="flex-1 bg-red-600 hover:bg-red-700"
                                        disabled={deleteConfirmText !== 'ELIMINAR'}
                                    >
                                        {isDeletingData ? 'Eliminando...' : 'Eliminar Datos'}
                                    </Button>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};
