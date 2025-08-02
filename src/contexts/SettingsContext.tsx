import React, { createContext, useContext, useReducer, useEffect } from 'react';
import toast from 'react-hot-toast';

// Tipos para las configuraciones
export interface UserSettings {
    // Apariencia
    theme: 'dark' | 'light' | 'auto';
    language: 'es' | 'en';

    // Audio
    audioQuality: 'low' | 'medium' | 'high' | 'lossless';
    crossfade: boolean;
    crossfadeDuration: number; // en segundos (0-12)
    normalizeVolume: boolean;

    // Reproducción
    autoplay: boolean;
    showExplicitContent: boolean;
    gaplessPlayback: boolean;

    // Notificaciones
    desktopNotifications: boolean;
    playbackNotifications: boolean;
    emailNotifications: boolean;
    marketingEmails: boolean;

    // Privacidad
    showOnlineStatus: boolean;
    showListeningActivity: boolean;
    makePlaylistsPublic: boolean;
    allowFollowers: boolean;

    // Datos
    dataSaver: boolean;
    autoDownload: boolean;
    downloadQuality: 'low' | 'medium' | 'high';
    cacheSize: number; // en MB

    // Social
    connectToFacebook: boolean;
    connectToSpotify: boolean;
    sharePlaylists: boolean;
}

const defaultSettings: UserSettings = {
    // Apariencia - mantener tema oscuro por defecto
    theme: 'dark',
    language: 'es',

    // Audio
    audioQuality: 'high',
    crossfade: false,
    crossfadeDuration: 3,
    normalizeVolume: true,

    // Reproducción
    autoplay: true,
    showExplicitContent: true,
    gaplessPlayback: true,

    // Notificaciones
    desktopNotifications: true,
    playbackNotifications: true,
    emailNotifications: false,
    marketingEmails: false,

    // Privacidad
    showOnlineStatus: true,
    showListeningActivity: true,
    makePlaylistsPublic: false,
    allowFollowers: true,

    // Datos
    dataSaver: false,
    autoDownload: true,
    downloadQuality: 'high',
    cacheSize: 500,

    // Social
    connectToFacebook: false,
    connectToSpotify: false,
    sharePlaylists: true,
};

interface SettingsState {
    settings: UserSettings;
    isLoading: boolean;
}

interface SettingsContextType extends SettingsState {
    updateSetting: <K extends keyof UserSettings>(key: K, value: UserSettings[K]) => void;
    updateMultipleSettings: (updates: Partial<UserSettings>) => void;
    resetSettings: () => void;
    exportSettings: () => string;
    importSettings: (settingsJson: string) => boolean;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

type SettingsAction =
    | { type: 'SET_LOADING'; payload: boolean }
    | { type: 'UPDATE_SETTING'; payload: { key: keyof UserSettings; value: any } }
    | { type: 'UPDATE_MULTIPLE'; payload: Partial<UserSettings> }
    | { type: 'RESET_SETTINGS' }
    | { type: 'LOAD_SETTINGS'; payload: UserSettings };

const settingsReducer = (state: SettingsState, action: SettingsAction): SettingsState => {
    switch (action.type) {
        case 'SET_LOADING':
            return { ...state, isLoading: action.payload };
        case 'UPDATE_SETTING':
            return {
                ...state,
                settings: {
                    ...state.settings,
                    [action.payload.key]: action.payload.value,
                },
            };
        case 'UPDATE_MULTIPLE':
            return {
                ...state,
                settings: {
                    ...state.settings,
                    ...action.payload,
                },
            };
        case 'RESET_SETTINGS':
            return {
                ...state,
                settings: { ...defaultSettings },
            };
        case 'LOAD_SETTINGS':
            return {
                ...state,
                settings: action.payload,
                isLoading: false,
            };
        default:
            return state;
    }
};

const SETTINGS_KEY = 'streamflow_settings';

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [state, dispatch] = useReducer(settingsReducer, {
        settings: defaultSettings,
        isLoading: true,
    });

    // Cargar configuraciones del localStorage al iniciar
    useEffect(() => {
        const loadSettings = () => {
            try {
                // Asegurar que el HTML tenga la clase dark por defecto
                document.documentElement.classList.add('dark');

                const savedSettings = localStorage.getItem(SETTINGS_KEY);
                if (savedSettings) {
                    const parsedSettings = JSON.parse(savedSettings);
                    // Fusionar con configuraciones por defecto para agregar nuevas configuraciones
                    const mergedSettings = { ...defaultSettings, ...parsedSettings };
                    dispatch({ type: 'LOAD_SETTINGS', payload: mergedSettings });
                } else {
                    dispatch({ type: 'LOAD_SETTINGS', payload: defaultSettings });
                }
            } catch (error) {
                console.error('Error al cargar configuraciones:', error);
                document.documentElement.classList.add('dark');
                dispatch({ type: 'LOAD_SETTINGS', payload: defaultSettings });
            }
        };

        loadSettings();
    }, []);

    // Guardar configuraciones en localStorage cuando cambien
    useEffect(() => {
        if (!state.isLoading) {
            try {
                localStorage.setItem(SETTINGS_KEY, JSON.stringify(state.settings));
            } catch (error) {
                console.error('Error al guardar configuraciones:', error);
                toast.error('Error al guardar configuraciones');
            }
        }
    }, [state.settings, state.isLoading]);

    // Aplicar configuraciones del tema (mejorado para funcionar correctamente)
    useEffect(() => {
        const applyTheme = () => {
            const { theme } = state.settings;
            const root = document.documentElement;
            const body = document.body;

            // Limpiar clases existentes
            root.classList.remove('dark', 'light');
            body.classList.remove('dark', 'light');

            if (theme === 'auto') {
                const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                if (prefersDark) {
                    root.classList.add('dark');
                    body.classList.add('dark');
                } else {
                    root.classList.add('light');
                    body.classList.add('light');
                }
            } else {
                root.classList.add(theme);
                body.classList.add(theme);
            }

            // Aplicar estilos directamente al body para asegurar el cambio
            if (theme === 'light') {
                body.style.backgroundColor = '#f9fafb';
                body.style.color = '#111827';
            } else {
                body.style.backgroundColor = '#111827';
                body.style.color = '#ffffff';
            }
        };

        // Solo aplicar si no estamos en el estado inicial
        if (!state.isLoading) {
            applyTheme();

            // Escuchar cambios en la preferencia del sistema si está en modo auto
            if (state.settings.theme === 'auto') {
                const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
                const handleChange = () => applyTheme();
                mediaQuery.addEventListener('change', handleChange);
                return () => mediaQuery.removeEventListener('change', handleChange);
            }
        }
    }, [state.settings.theme, state.isLoading]);

    const updateSetting = <K extends keyof UserSettings>(key: K, value: UserSettings[K]) => {
        dispatch({ type: 'UPDATE_SETTING', payload: { key, value } });

        // Mostrar mensaje de confirmación para ciertos cambios importantes
        const importantSettings = ['theme', 'language', 'audioQuality'];
        if (importantSettings.includes(key as string)) {
            toast.success('Configuración actualizada');
        }
    };

    const updateMultipleSettings = (updates: Partial<UserSettings>) => {
        dispatch({ type: 'UPDATE_MULTIPLE', payload: updates });
        toast.success('Configuraciones actualizadas');
    };

    const resetSettings = () => {
        dispatch({ type: 'RESET_SETTINGS' });
        toast.success('Configuraciones restablecidas');
    };

    const exportSettings = (): string => {
        try {
            return JSON.stringify(state.settings, null, 2);
        } catch (error) {
            console.error('Error al exportar configuraciones:', error);
            toast.error('Error al exportar configuraciones');
            return '';
        }
    };

    const importSettings = (settingsJson: string): boolean => {
        try {
            const importedSettings = JSON.parse(settingsJson);

            // Validar que tenga la estructura correcta
            const validKeys = Object.keys(defaultSettings);
            const importedKeys = Object.keys(importedSettings);

            const validImport = importedKeys.every(key => validKeys.includes(key));

            if (!validImport) {
                toast.error('Formato de configuraciones inválido');
                return false;
            }

            // Fusionar con configuraciones por defecto
            const mergedSettings = { ...defaultSettings, ...importedSettings };
            dispatch({ type: 'UPDATE_MULTIPLE', payload: mergedSettings });
            toast.success('Configuraciones importadas exitosamente');
            return true;
        } catch (error) {
            console.error('Error al importar configuraciones:', error);
            toast.error('Error al importar configuraciones');
            return false;
        }
    };

    return (
        <SettingsContext.Provider
            value={{
                ...state,
                updateSetting,
                updateMultipleSettings,
                resetSettings,
                exportSettings,
                importSettings,
            }}
        >
            {children}
        </SettingsContext.Provider>
    );
};

export const useSettings = () => {
    const context = useContext(SettingsContext);
    if (context === undefined) {
        throw new Error('useSettings debe usarse dentro de un SettingsProvider');
    }
    return context;
};

// Hook para usar configuraciones específicas de audio
export const useAudioSettings = () => {
    const { settings, updateSetting } = useSettings();

    return {
        audioQuality: settings.audioQuality,
        crossfade: settings.crossfade,
        crossfadeDuration: settings.crossfadeDuration,
        normalizeVolume: settings.normalizeVolume,
        gaplessPlayback: settings.gaplessPlayback,
        updateAudioQuality: (quality: UserSettings['audioQuality']) => updateSetting('audioQuality', quality),
        updateCrossfade: (enabled: boolean) => updateSetting('crossfade', enabled),
        updateCrossfadeDuration: (duration: number) => updateSetting('crossfadeDuration', duration),
        updateNormalizeVolume: (enabled: boolean) => updateSetting('normalizeVolume', enabled),
        updateGaplessPlayback: (enabled: boolean) => updateSetting('gaplessPlayback', enabled),
    };
};

// Hook para usar configuraciones de tema
export const useThemeSettings = () => {
    const { settings, updateSetting } = useSettings();

    return {
        theme: settings.theme,
        language: settings.language,
        updateTheme: (theme: UserSettings['theme']) => updateSetting('theme', theme),
        updateLanguage: (language: UserSettings['language']) => updateSetting('language', language),
    };
};
