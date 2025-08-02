import { useEffect, useRef } from 'react';
import { useSettings } from '../contexts/SettingsContext';

export const useAudioPlayer = (audioRef: React.RefObject<HTMLAudioElement>) => {
    const { settings } = useSettings();
    const previousVolumeRef = useRef<number>(1);

    useEffect(() => {
        if (!audioRef.current) return;

        const audio = audioRef.current;

        // Aplicar normalización de volumen
        if (settings.normalizeVolume) {
            // Simular normalización ajustando el volumen base
            audio.volume = Math.min(audio.volume * 0.85, 1);
        }

        // Configurar crossfade (esto sería más complejo en una implementación real)
        if (settings.crossfade) {
            // En una implementación real, esto manejaría el fade entre canciones
            console.log(`Crossfade habilitado: ${settings.crossfadeDuration}s`);
        }

        // Aplicar configuraciones de calidad (en una implementación real esto afectaría la URL del stream)
        console.log(`Calidad de audio: ${settings.audioQuality}`);

    }, [settings, audioRef]);

    // Función para aplicar fade out
    const fadeOut = (duration: number = 1000): Promise<void> => {
        return new Promise((resolve) => {
            if (!audioRef.current) {
                resolve();
                return;
            }

            const audio = audioRef.current;
            const startVolume = audio.volume;
            const step = startVolume / (duration / 50);

            const fadeInterval = setInterval(() => {
                if (audio.volume > 0) {
                    audio.volume = Math.max(0, audio.volume - step);
                } else {
                    clearInterval(fadeInterval);
                    resolve();
                }
            }, 50);
        });
    };

    // Función para aplicar fade in
    const fadeIn = (duration: number = 1000, targetVolume: number = 1): Promise<void> => {
        return new Promise((resolve) => {
            if (!audioRef.current) {
                resolve();
                return;
            }

            const audio = audioRef.current;
            audio.volume = 0;
            const step = targetVolume / (duration / 50);

            const fadeInterval = setInterval(() => {
                if (audio.volume < targetVolume) {
                    audio.volume = Math.min(targetVolume, audio.volume + step);
                } else {
                    clearInterval(fadeInterval);
                    resolve();
                }
            }, 50);
        });
    };

    // Función para cambiar canción con crossfade
    const changeSongWithCrossfade = async (newSongUrl: string): Promise<void> => {
        if (!settings.crossfade || !audioRef.current) {
            // Sin crossfade, cambio directo
            if (audioRef.current) {
                audioRef.current.src = newSongUrl;
            }
            return;
        }

        const fadeDuration = settings.crossfadeDuration * 1000; // Convertir a ms

        // Fade out de la canción actual
        await fadeOut(fadeDuration / 2);

        // Cambiar la canción
        if (audioRef.current) {
            audioRef.current.src = newSongUrl;

            // Esperar a que la nueva canción esté lista y hacer fade in
            audioRef.current.addEventListener('canplay', async () => {
                await fadeIn(fadeDuration / 2, previousVolumeRef.current);
            }, { once: true });
        }
    };

    // Guardar el volumen actual cuando cambie
    useEffect(() => {
        if (audioRef.current) {
            previousVolumeRef.current = audioRef.current.volume;
        }
    }, [audioRef.current?.volume]);

    return {
        fadeOut,
        fadeIn,
        changeSongWithCrossfade,
        currentSettings: {
            crossfade: settings.crossfade,
            crossfadeDuration: settings.crossfadeDuration,
            normalizeVolume: settings.normalizeVolume,
            gaplessPlayback: settings.gaplessPlayback,
            audioQuality: settings.audioQuality,
        },
    };
};
