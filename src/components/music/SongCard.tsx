import React from 'react';
import { motion } from 'framer-motion';
import { Play, Pause, Heart, MoreHorizontal, Plus } from 'lucide-react';
import { Song } from '../../types';
import { usePlayer } from '../../contexts/PlayerContext';
import { formatDuration } from '../../utils/format';
import { Button } from '../common/Button';

interface SongCardProps {
  song: Song;
  index?: number;
  showIndex?: boolean;
  className?: string;
  onToggleLike?: (songId: string, isLiked: boolean) => void;
}

export const SongCard: React.FC<SongCardProps> = ({ 
  song, 
  index, 
  showIndex = false, 
  className, 
  onToggleLike
}) => {
  const { currentSong, isPlaying, play, pause, addToQueue } = usePlayer();
  const isCurrentSong = currentSong?.id === song.id;
  const isCurrentPlaying = isCurrentSong && isPlaying;

  const handlePlayClick = () => {
    if (isCurrentSong) {
      if (isPlaying) {
        pause();
      } else {
        play();
      }
    } else {
      play(song);
    }
  };

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className={`group bg-gray-800/50 rounded-lg p-4 hover:bg-gray-800 transition-all duration-200 ${className}`}
    >
      <div className="flex items-center gap-4">
        {/* Index or Play Button */}
        <div className="w-8 flex items-center justify-center">
          {showIndex && !isCurrentSong && (
            <span className="text-gray-400 text-sm group-hover:hidden">
              {index! + 1}
            </span>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={handlePlayClick}
            className={`p-1 ${showIndex ? 'hidden group-hover:flex' : 'flex'} ${isCurrentSong ? 'text-purple-400' : ''}`}
          >
            {isCurrentPlaying ? (
              <Pause className="w-4 h-4" />
            ) : (
              <Play className="w-4 h-4" />
            )}
          </Button>
        </div>

        {/* Song Cover */}
        <div className="relative">
          <img
            src={song.coverUrl || 'https://images.pexels.com/photos/1105666/pexels-photo-1105666.jpeg?auto=compress&cs=tinysrgb&w=100'}
            alt={song.title}
            className="w-12 h-12 rounded-lg object-cover"
          />
          {isCurrentPlaying && (
            <div className="absolute inset-0 bg-black/50 rounded-lg flex items-center justify-center">
              <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse" />
            </div>
          )}
        </div>

        {/* Song Info */}
        <div className="flex-1 min-w-0">
          <h3 className={`font-medium truncate ${isCurrentSong ? 'text-purple-400' : 'text-white'}`}>
            {song.title}
          </h3>
          <p className="text-sm text-gray-400 truncate">{song.artist}</p>
        </div>

        {/* Album */}
        <div className="hidden md:block w-32">
          <p className="text-sm text-gray-400 truncate">{song.album || '-'}</p>
        </div>

        {/* Genre */}
        <div className="hidden lg:block w-24">
          <span className="text-xs bg-gray-700 text-gray-300 px-2 py-1 rounded-full">
            {song.genre}
          </span>
        </div>

        {/* Duration and Actions */}
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            className="opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={() => addToQueue(song)}
          >
            <Plus className="w-4 h-4" />
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation(); // Evita que se active el play de la canción
              onToggleLike?.(song.id, !!song.liked);
            }}
            className={`${song.liked ? 'text-red-500' : 'opacity-0 group-hover:opacity-100'} transition-opacity`}
          >
            <Heart className={`w-4 h-4 ${song.liked ? 'fill-current' : ''}`} />
          </Button>
          
          <span className="text-sm text-gray-400 w-12 text-right">
            {formatDuration(song.duration)}
          </span>
          
          <Button
            variant="ghost"
            size="sm"
            className="opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <MoreHorizontal className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </motion.div>
  );
};