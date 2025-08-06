import React, { createContext, useContext, useReducer, useRef, useEffect } from 'react';
import { Song, PlayerState } from '../types';
import toast from 'react-hot-toast';

interface PlayerContextType extends PlayerState {
  play: (song?: Song) => void;
  pause: () => void;
  stop: () => void;
  next: () => void;
  previous: () => void;
  seek: (time: number) => void;
  setVolume: (volume: number) => void;
  toggleShuffle: () => void;
  toggleRepeat: () => void;
  setQueue: (songs: Song[], startIndex?: number) => void;
  addToQueue: (song: Song) => void;
  removeFromQueue: (index: number) => void;
}

const PlayerContext = createContext<PlayerContextType | undefined>(undefined);

type PlayerAction =
  | { type: 'PLAY'; payload?: Song }
  | { type: 'PAUSE' }
  | { type: 'STOP' }
  | { type: 'SET_CURRENT_TIME'; payload: number }
  | { type: 'SET_VOLUME'; payload: number }
  | { type: 'NEXT_SONG' }
  | { type: 'PREVIOUS_SONG' }
  | { type: 'SET_QUEUE'; payload: { songs: Song[]; startIndex?: number } }
  | { type: 'ADD_TO_QUEUE'; payload: Song }
  | { type: 'REMOVE_FROM_QUEUE'; payload: number }
  | { type: 'TOGGLE_SHUFFLE' }
  | { type: 'TOGGLE_REPEAT' };

const playerReducer = (state: PlayerState, action: PlayerAction): PlayerState => {
  switch (action.type) {
    case 'PLAY':
      return {
        ...state,
        isPlaying: true,
        currentSong: action.payload || state.currentSong,
      };
    case 'PAUSE':
      return { ...state, isPlaying: false };
    case 'STOP':
      return {
        ...state,
        isPlaying: false,
        currentSong: null,
        currentTime: 0,
        queue: [],
        currentIndex: 0,
      };
    case 'SET_CURRENT_TIME':
      return { ...state, currentTime: action.payload };
    case 'SET_VOLUME':
      return { ...state, volume: action.payload };
    case 'NEXT_SONG': {
      if (state.queue.length === 0) return state;
      let nextIndex;
      if (state.shuffle) {
        nextIndex = Math.floor(Math.random() * state.queue.length);
      } else {
        nextIndex = state.currentIndex + 1;
        if (nextIndex >= state.queue.length) {
          if (state.repeat === 'all') {
            nextIndex = 0; // Loop back to the start
          } else {
            // Stop playback if not repeating
            return { ...state, isPlaying: false };
          }
        }
      }
      return {
        ...state,
        currentIndex: nextIndex,
        currentSong: state.queue[nextIndex],
        currentTime: 0,
        isPlaying: true, // Ensure playback continues
      };
    }
    case 'PREVIOUS_SONG': {
      const prevIndex = state.currentIndex > 0 ? state.currentIndex - 1 : state.queue.length - 1;
      return {
        ...state,
        currentIndex: prevIndex,
        currentSong: state.queue[prevIndex] || null,
        currentTime: 0,
      };
    }
    case 'SET_QUEUE': {
      const startIndex = action.payload.startIndex || 0;
      return {
        ...state,
        queue: action.payload.songs,
        currentIndex: startIndex,
        currentSong: action.payload.songs[startIndex] || null,
        currentTime: 0,
      };
    }
    case 'ADD_TO_QUEUE':
      return {
        ...state,
        queue: [...state.queue, action.payload],
      };
    case 'REMOVE_FROM_QUEUE': {
      const newQueue = state.queue.filter((_, index) => index !== action.payload);
      let newIndex = state.currentIndex;
      if (action.payload < state.currentIndex) {
        newIndex = state.currentIndex - 1;
      } else if (action.payload === state.currentIndex) {
        newIndex = Math.min(state.currentIndex, newQueue.length - 1);
      }
      return {
        ...state,
        queue: newQueue,
        currentIndex: Math.max(0, newIndex),
        currentSong: newQueue[Math.max(0, newIndex)] || null,
      };
    }
    case 'TOGGLE_SHUFFLE': {
      return { ...state, shuffle: !state.shuffle };
    }
    case 'TOGGLE_REPEAT': {
      const nextRepeat = state.repeat === 'none' ? 'all' : state.repeat === 'all' ? 'one' : 'none';
      return { ...state, repeat: nextRepeat };
    }
    default:
      return state;
  }
};

const initialState: PlayerState = {
  currentSong: null,
  isPlaying: false,
  volume: 0.8,
  currentTime: 0,
  queue: [],
  currentIndex: 0,
  shuffle: false,
  repeat: 'none',
};

export const PlayerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(playerReducer, initialState);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Use a ref to hold the latest state for use in event listeners
  const stateRef = useRef(state);
  useEffect(() => {
    stateRef.current = state;
  }, [state]);

  // Effect to initialize and manage the audio element and its listeners
  useEffect(() => {
    const audio = new Audio();
    audioRef.current = audio;

    const handleTimeUpdate = () => {
      if (audio && !audio.seeking && !isNaN(audio.currentTime)) {
        dispatch({ type: 'SET_CURRENT_TIME', payload: audio.currentTime });
      }
    };

    const handleLoadedMetadata = () => {
      if (audio && audio.duration) {
        // Asegurarse de que tenemos la duración correcta
        console.log('Duración cargada:', audio.duration);
      }
    };

    const handleEnded = () => {
      console.log('Canción terminada, modo repetición:', stateRef.current.repeat);

      if (stateRef.current.repeat === 'one') {
        // Repetir la misma canción
        audio.currentTime = 0;
        audio.play().catch(e => console.error("Error al repetir canción:", e));
      } else if (stateRef.current.repeat === 'all' ||
        stateRef.current.currentIndex < stateRef.current.queue.length - 1) {
        // Pasar a la siguiente canción
        dispatch({ type: 'NEXT_SONG' });
      } else {
        // Detener la reproducción si no hay más canciones y no está en modo repetición
        dispatch({ type: 'PAUSE' });
        audio.currentTime = 0;
      }
    };

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);

    // Forzar una actualización inicial del tiempo
    const updateInterval = setInterval(handleTimeUpdate, 1000);

    // Escuchar evento de logout para detener la música
    const handleLogout = () => {
      audio.pause();
      audio.currentTime = 0;
      audio.src = '';
      dispatch({ type: 'STOP' });
    };

    window.addEventListener('userLogout', handleLogout);

    // Cleanup on unmount
    return () => {
      clearInterval(updateInterval);
      audio.pause();
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      window.removeEventListener('userLogout', handleLogout);
    };
  }, []); // This effect runs only once on mount

  // Effect to handle song changes
  useEffect(() => {
    if (audioRef.current && state.currentSong) {
      audioRef.current.src = state.currentSong.fileUrl;
      if (state.isPlaying) {
        audioRef.current.play().catch(e => console.error("Error playing song:", e));
      }
    }
  }, [state.currentSong]);

  // Effect to handle play/pause state changes
  useEffect(() => {
    if (!audioRef.current) return;
    if (state.isPlaying && state.currentSong) {
      audioRef.current.play().catch(e => console.error("Error on play command:", e));
    } else {
      audioRef.current.pause();
    }
  }, [state.isPlaying, state.currentSong]);

  // Effect to handle volume changes
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = state.volume;
    }
  }, [state.volume]);

  const play = (song?: Song) => {
    dispatch({ type: 'PLAY', payload: song });
  };

  const pause = () => {
    dispatch({ type: 'PAUSE' });
  };

  const stop = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      audioRef.current.src = '';
    }
    dispatch({ type: 'STOP' });
  };

  const next = () => {
    dispatch({ type: 'NEXT_SONG' });
  };

  const previous = () => {
    dispatch({ type: 'PREVIOUS_SONG' });
  };

  const seek = (time: number) => {
    if (
      audioRef.current &&
      typeof time === 'number' &&
      isFinite(time) &&
      !isNaN(time) &&
      time >= 0 &&
      (audioRef.current.duration ? time <= audioRef.current.duration : true)
    ) {
      audioRef.current.currentTime = time;
      dispatch({ type: 'SET_CURRENT_TIME', payload: time });
    }
  };

  const setVolume = (volume: number) => {
    dispatch({ type: 'SET_VOLUME', payload: volume });
  };

  const toggleShuffle = () => {
    dispatch({ type: 'TOGGLE_SHUFFLE' });
  };

  const toggleRepeat = () => {
    dispatch({ type: 'TOGGLE_REPEAT' });
  };

  const setQueue = (songs: Song[], startIndex?: number) => {
    dispatch({ type: 'SET_QUEUE', payload: { songs, startIndex } });
  };

  const addToQueue = (song: Song) => {
    dispatch({ type: 'ADD_TO_QUEUE', payload: song });
    toast.success(`"${song.title}" agregada a la cola`);
  };

  const removeFromQueue = (index: number) => {
    dispatch({ type: 'REMOVE_FROM_QUEUE', payload: index });
  };

  return (
    <PlayerContext.Provider value={{
      ...state,
      play,
      pause,
      stop,
      next,
      previous,
      seek,
      setVolume,
      toggleShuffle,
      toggleRepeat,
      setQueue,
      addToQueue,
      removeFromQueue,
    }}>
      {children}
    </PlayerContext.Provider>
  );
};

export const usePlayer = () => {
  const context = useContext(PlayerContext);
  if (context === undefined) {
    throw new Error('usePlayer must be used within a PlayerProvider');
  }
  return context;
};