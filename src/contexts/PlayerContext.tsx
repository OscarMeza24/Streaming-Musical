import React, { createContext, useContext, useReducer, useRef, useEffect } from 'react';
import { Song, PlayerState } from '../types';
import toast from 'react-hot-toast';

interface PlayerContextType extends PlayerState {
  play: (song?: Song) => void;
  pause: () => void;
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
    case 'SET_CURRENT_TIME':
      return { ...state, currentTime: action.payload };
    case 'SET_VOLUME':
      return { ...state, volume: action.payload };
    case 'NEXT_SONG': {
      const nextIndex = state.currentIndex < state.queue.length - 1 ? state.currentIndex + 1 : 0;
      return {
        ...state,
        currentIndex: nextIndex,
        currentSong: state.queue[nextIndex] || null,
        currentTime: 0,
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
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Create audio element
    audioRef.current = new Audio();
    audioRef.current.volume = state.volume;
    
    // Set up event listeners
    const audio = audioRef.current;
    
    const handleTimeUpdate = () => {
      if (audio.currentTime !== state.currentTime) {
        dispatch({ type: 'SET_CURRENT_TIME', payload: audio.currentTime });
      }
    };
    
    const handleEnded = () => {
      if (state.repeat === 'one') {
        audio.currentTime = 0;
        audio.play();
      } else {
        dispatch({ type: 'NEXT_SONG' });
      }
    };
    
    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('ended', handleEnded);
    
    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('ended', handleEnded);
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [state.currentTime, state.repeat, state.volume]);

  useEffect(() => {
    if (audioRef.current && state.currentSong) {
      audioRef.current.src = state.currentSong.fileUrl;
      if (state.isPlaying) {
        audioRef.current.play().catch(() => {
          toast.error('Error al reproducir la canción');
        });
      }
    }
  }, [state.currentSong]);

  useEffect(() => {
    if (audioRef.current) {
      if (state.isPlaying) {
        audioRef.current.play().catch(() => {
          toast.error('Error al reproducir la canción');
        });
      } else {
        audioRef.current.pause();
      }
    }
  }, [state.isPlaying]);

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

  const next = () => {
    dispatch({ type: 'NEXT_SONG' });
  };

  const previous = () => {
    dispatch({ type: 'PREVIOUS_SONG' });
  };

  const seek = (time: number) => {
    if (audioRef.current) {
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