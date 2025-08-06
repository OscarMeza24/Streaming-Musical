import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Volume2,
  VolumeX,
  Shuffle,
  Repeat,
  Heart,
  MoreHorizontal,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { usePlayer } from '../../contexts/PlayerContext';
import { formatDuration } from '../../utils/format';
import { Button } from '../common/Button';
import clsx from 'clsx';

export const MusicPlayer: React.FC = () => {
  const [isMinimized, setIsMinimized] = useState(false);
  
  const {
    currentSong,
    isPlaying,
    volume,
    currentTime,
    shuffle,
    repeat,
    play,
    pause,
    next,
    previous,
    seek,
    setVolume,
    toggleShuffle,
    toggleRepeat,
  } = usePlayer();

  if (!currentSong) {
    return null;
  }

  // Asegurarse de que la duración sea un número válido
  const songDuration = currentSong.duration || 1; // Evitar división por cero
  const progress = Math.min(100, Math.max(0, (currentTime / songDuration) * 100));

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const percentage = clickX / rect.width;
    const newTime = percentage * currentSong.duration;
    seek(newTime);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setVolume(parseFloat(e.target.value));
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        className="fixed bottom-0 left-0 right-0 bg-gray-900/95 backdrop-blur-lg border-t border-gray-800 z-30"
      >
        <div className="max-w-screen-2xl mx-auto">
          {/* Minimize/Maximize Button */}
          <div className="flex justify-center">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMinimized(!isMinimized)}
              className="text-gray-400 hover:text-white py-1 px-3 rounded-b-none border-b-0"
            >
              {isMinimized ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </Button>
          </div>

          <motion.div
            initial={false}
            animate={{ 
              height: isMinimized ? 0 : 'auto',
              opacity: isMinimized ? 0 : 1 
            }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="p-4">
              {/* Progress bar */}
              <div
                className="w-full h-1 bg-gray-700 rounded-full mb-4 cursor-pointer group"
                onClick={handleProgressClick}
              >
                <div
                  className="h-full bg-gradient-to-r from-purple-500 to-blue-500 rounded-full relative transition-all duration-150 group-hover:h-1.5"
                  style={{ width: `${progress}%` }}
                >
                  <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </div>

              <div className="flex items-center justify-between">
                {/* Song info */}
                <div className="flex items-center gap-4 min-w-0 flex-1">
                  <img
                    src={currentSong.coverUrl || 'https://images.pexels.com/photos/1105666/pexels-photo-1105666.jpeg?auto=compress&cs=tinysrgb&w=100'}
                    alt={currentSong.title}
                    className="w-14 h-14 rounded-lg object-cover"
                  />
                  <div className="min-w-0">
                    <h3 className="text-white font-semibold truncate">{currentSong.title}</h3>
                    <p className="text-gray-400 text-sm truncate">{currentSong.artist}</p>
                  </div>
                  <Button variant="ghost" size="sm">
                    <Heart className="w-4 h-4" />
                  </Button>
                </div>

                {/* Control buttons */}
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={toggleShuffle}
                      className={shuffle ? 'text-purple-400' : 'text-gray-400'}
                    >
                      <Shuffle className="w-4 h-4" />
                    </Button>

                    <Button variant="ghost" size="sm" onClick={previous}>
                      <SkipBack className="w-5 h-5" />
                    </Button>

                    <Button
                      variant="primary"
                      size="lg"
                      onClick={isPlaying ? () => pause() : () => play()}
                      className="rounded-full w-12 h-12 p-0"
                    >
                      {isPlaying ? (
                        <Pause className="w-5 h-5" />
                      ) : (
                        <Play className="w-5 h-5 ml-0.5" />
                      )}
                    </Button>

                    <Button variant="ghost" size="sm" onClick={next}>
                      <SkipForward className="w-5 h-5" />
                    </Button>

                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={toggleRepeat}
                      className={clsx(
                        repeat !== 'none' ? 'text-purple-400' : 'text-gray-400'
                      )}
                    >
                      <Repeat className="w-4 h-4" />
                      {repeat === 'one' && (
                        <span className="absolute -top-1 -right-1 w-2 h-2 bg-purple-400 rounded-full" />
                      )}
                    </Button>
                  </div>
                </div>

                {/* Volume and additional controls */}
                <div className="flex items-center gap-4 min-w-0 flex-1 justify-end">
                  <span className="text-xs text-gray-400 hidden sm:block">
                    {formatDuration(currentTime)} / {formatDuration(currentSong.duration)}
                  </span>

                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="sm">
                      {volume === 0 ? (
                        <VolumeX className="w-4 h-4" />
                      ) : (
                        <Volume2 className="w-4 h-4" />
                      )}
                    </Button>

                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.01"
                      value={volume}
                      onChange={handleVolumeChange}
                      className="w-20 h-1 bg-gray-700 rounded-lg appearance-none cursor-pointer hidden sm:block slider"
                    />
                  </div>

                  <Button variant="ghost" size="sm">
                    <MoreHorizontal className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Minimized view - shown when minimized */}
          {isMinimized && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="px-4 pb-2"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <img
                    src={currentSong.coverUrl || 'https://images.pexels.com/photos/1105666/pexels-photo-1105666.jpeg?auto=compress&cs=tinysrgb&w=100'}
                    alt={currentSong.title}
                    className="w-10 h-10 rounded-lg object-cover"
                  />
                  <div className="min-w-0">
                    <h3 className="text-white font-medium text-sm truncate">{currentSong.title}</h3>
                    <p className="text-gray-400 text-xs truncate">{currentSong.artist}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="sm" onClick={previous}>
                    <SkipBack className="w-4 h-4" />
                  </Button>

                  <Button
                    variant="primary"
                    size="sm"
                    onClick={isPlaying ? () => pause() : () => play()}
                    className="rounded-full w-8 h-8 p-0"
                  >
                    {isPlaying ? (
                      <Pause className="w-3 h-3" />
                    ) : (
                      <Play className="w-3 h-3 ml-0.5" />
                    )}
                  </Button>

                  <Button variant="ghost" size="sm" onClick={next}>
                    <SkipForward className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {/* Mini progress bar */}
              <div
                className="w-full h-0.5 bg-gray-700 rounded-full mt-2 cursor-pointer"
                onClick={handleProgressClick}
              >
                <div
                  className="h-full bg-gradient-to-r from-purple-500 to-blue-500 rounded-full transition-all duration-150"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </motion.div>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
};