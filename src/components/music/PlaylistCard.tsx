import React from 'react';
import { motion } from 'framer-motion';
import { Play, Music, Clock, Lock, Globe } from 'lucide-react';
import { Playlist } from '../../types';
import { formatDuration } from '../../utils/format';
import { Button } from '../common/Button';

interface PlaylistCardProps {
  playlist: Playlist;
  onClick?: () => void;
}

export const PlaylistCard: React.FC<PlaylistCardProps> = ({ playlist, onClick }) => {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className="group bg-gray-800/50 rounded-lg p-4 cursor-pointer hover:bg-gray-800 transition-all duration-200"
      onClick={onClick}
    >
      <div className="relative mb-4">
        <img
          src={playlist.coverUrl || 'https://images.pexels.com/photos/1105666/pexels-photo-1105666.jpeg?auto=compress&cs=tinysrgb&w=300'}
          alt={playlist.name}
          className="w-full aspect-square rounded-lg object-cover"
        />
        <Button
          variant="primary"
          size="sm"
          className="absolute bottom-2 right-2 rounded-full w-12 h-12 p-0 opacity-0 group-hover:opacity-100 transition-all duration-200 transform translate-y-2 group-hover:translate-y-0"
        >
          <Play className="w-5 h-5 ml-0.5" />
        </Button>
      </div>

      <div className="space-y-2">
        <h3 className="font-semibold text-white truncate">{playlist.name}</h3>
        {playlist.description && (
          <p className="text-sm text-gray-400 line-clamp-2">{playlist.description}</p>
        )}
        
        <div className="flex items-center gap-4 text-xs text-gray-500">
          <div className="flex items-center gap-1">
            <Music className="w-3 h-3" />
            <span>{playlist.songs.length} canciones</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            <span>{formatDuration(playlist.totalDuration)}</span>
          </div>
          <div className="flex items-center gap-1">
            {playlist.isPublic ? (
              <>
                <Globe className="w-3 h-3" />
                <span>Pública</span>
              </>
            ) : (
              <>
                <Lock className="w-3 h-3" />
                <span>Privada</span>
              </>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};