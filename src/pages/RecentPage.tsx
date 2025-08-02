import React from 'react';
import { motion } from 'framer-motion';
import { Clock, Play, Heart, MoreHorizontal, Calendar } from 'lucide-react';
import { Button } from '../components/common/Button';
import { usePlayer } from '../contexts/PlayerContext';

// Mock data para canciones recientes
const recentSongs = [
  {
    id: '1',
    title: 'Watermelon Sugar',
    artist: 'Harry Styles',
    album: 'Fine Line',
    duration: 174,
    coverUrl: 'https://images.pexels.com/photos/1105666/pexels-photo-1105666.jpeg?auto=compress&cs=tinysrgb&w=300',
    playedAt: '2024-01-15T10:30:00Z',
    playCount: 15
  },
  {
    id: '2',
    title: 'Levitating',
    artist: 'Dua Lipa',
    album: 'Future Nostalgia',
    duration: 203,
    coverUrl: 'https://images.pexels.com/photos/1763075/pexels-photo-1763075.jpeg?auto=compress&cs=tinysrgb&w=300',
    playedAt: '2024-01-15T09:15:00Z',
    playCount: 8
  },
  {
    id: '3',
    title: 'As It Was',
    artist: 'Harry Styles',
    album: "Harry's House",
    duration: 167,
    coverUrl: 'https://images.pexels.com/photos/1540406/pexels-photo-1540406.jpeg?auto=compress&cs=tinysrgb&w=300',
    playedAt: '2024-01-14T22:45:00Z',
    playCount: 12
  },
  {
    id: '4',
    title: 'Anti-Hero',
    artist: 'Taylor Swift',
    album: 'Midnights',
    duration: 200,
    coverUrl: 'https://images.pexels.com/photos/1699161/pexels-photo-1699161.jpeg?auto=compress&cs=tinysrgb&w=300',
    playedAt: '2024-01-14T20:30:00Z',
    playCount: 20
  },
  {
    id: '5',
    title: 'Flowers',
    artist: 'Miley Cyrus',
    album: 'Endless Summer Vacation',
    duration: 200,
    coverUrl: 'https://images.pexels.com/photos/1644888/pexels-photo-1644888.jpeg?auto=compress&cs=tinysrgb&w=300',
    playedAt: '2024-01-14T18:20:00Z',
    playCount: 6
  }
];

const formatDuration = (seconds: number) => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};

const formatRelativeTime = (dateString: string) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
  
  if (diffInHours < 1) return 'Hace menos de 1 hora';
  if (diffInHours < 24) return `Hace ${diffInHours} horas`;
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays === 1) return 'Ayer';
  if (diffInDays < 7) return `Hace ${diffInDays} días`;
  return date.toLocaleDateString('es-ES', { month: 'short', day: 'numeric' });
};

export const RecentPage: React.FC = () => {
  const { play, setQueue } = usePlayer();

  const handlePlay = (song: any) => {
    const songData = {
      id: song.id,
      title: song.title,
      artist: song.artist,
      album: song.album || '',
      genre: 'Pop', // Género por defecto
      duration: song.duration,
      coverUrl: song.coverUrl,
      fileUrl: `https://www.soundjay.com/misc/sounds/bell-ringing-05.wav` // URL de ejemplo
    };
    setQueue([songData], 0);
    play(songData);
  };

  const totalPlayTime = recentSongs.reduce((total, song) => total + (song.duration * song.playCount), 0);
  const totalSongs = recentSongs.length;
  const avgPlaysPerSong = Math.round(recentSongs.reduce((total, song) => total + song.playCount, 0) / totalSongs);

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-4"
      >
        <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center">
          <Clock className="w-8 h-8 text-white" />
        </div>
        <div>
          <h1 className="text-4xl font-bold text-white mb-2">Recientemente Reproducidas</h1>
          <p className="text-gray-400">Tu historial de reproducción reciente</p>
        </div>
      </motion.div>

      {/* Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-4 gap-4"
      >
        <div className="bg-gray-800/50 rounded-xl p-4">
          <div className="text-2xl font-bold text-white">{totalSongs}</div>
          <div className="text-gray-400 text-sm">Canciones recientes</div>
        </div>
        <div className="bg-gray-800/50 rounded-xl p-4">
          <div className="text-2xl font-bold text-white">{Math.floor(totalPlayTime / 3600)}h</div>
          <div className="text-gray-400 text-sm">Tiempo total</div>
        </div>
        <div className="bg-gray-800/50 rounded-xl p-4">
          <div className="text-2xl font-bold text-white">{avgPlaysPerSong}</div>
          <div className="text-gray-400 text-sm">Reproducciones promedio</div>
        </div>
        <div className="bg-gray-800/50 rounded-xl p-4">
          <div className="text-2xl font-bold text-white">7</div>
          <div className="text-gray-400 text-sm">Días de historial</div>
        </div>
      </motion.div>

      {/* Filter Options */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="flex items-center gap-4 flex-wrap"
      >
        <Button variant="primary" size="sm">
          Todas
        </Button>
        <Button variant="ghost" size="sm">
          Hoy
        </Button>
        <Button variant="ghost" size="sm">
          Ayer
        </Button>
        <Button variant="ghost" size="sm">
          Esta semana
        </Button>
        <Button variant="ghost" size="sm">
          Este mes
        </Button>
      </motion.div>

      {/* Recent Songs */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-gray-800/30 rounded-xl p-6"
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-white">Historial de Reproducción</h2>
          <Button variant="ghost" size="sm">
            <Calendar className="w-4 h-4 mr-2" />
            Filtrar por fecha
          </Button>
        </div>

        <div className="space-y-2">
          {recentSongs.map((song, index) => (
            <motion.div
              key={song.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 * index }}
              className="flex items-center gap-4 p-3 rounded-lg hover:bg-gray-700/30 transition-colors group"
            >
              {/* Cover */}
              <div className="relative">
                <img
                  src={song.coverUrl}
                  alt={song.title}
                  className="w-12 h-12 rounded-lg object-cover"
                />
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => handlePlay(song)}
                  className="absolute inset-0 w-full h-full rounded-lg opacity-0 group-hover:opacity-100 transition-opacity bg-black/50"
                >
                  <Play className="w-4 h-4" />
                </Button>
              </div>

              {/* Song Info */}
              <div className="flex-1 min-w-0">
                <h3 className="text-white font-medium truncate">{song.title}</h3>
                <p className="text-gray-400 text-sm truncate">{song.artist}</p>
              </div>

              {/* Album */}
              <div className="hidden md:block text-gray-400 text-sm min-w-0 flex-1">
                <span className="truncate">{song.album}</span>
              </div>

              {/* Play Count */}
              <div className="flex items-center gap-2 text-gray-400 text-sm">
                <span>{song.playCount} reproducciones</span>
              </div>

              {/* Time Played */}
              <div className="text-gray-400 text-sm min-w-0">
                <span className="truncate">{formatRelativeTime(song.playedAt)}</span>
              </div>

              {/* Duration */}
              <div className="text-gray-400 text-sm w-12 text-right">
                {formatDuration(song.duration)}
              </div>

              {/* Actions */}
              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button variant="ghost" size="sm">
                  <Heart className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="sm">
                  <MoreHorizontal className="w-4 h-4" />
                </Button>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="grid grid-cols-1 md:grid-cols-2 gap-6"
      >
        <div className="bg-gray-800/30 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Acciones Rápidas</h3>
          <div className="space-y-3">
            <Button variant="ghost" className="w-full justify-start">
              <Play className="w-4 h-4 mr-3" />
              Reproducir todo el historial
            </Button>
            <Button variant="ghost" className="w-full justify-start">
              <Heart className="w-4 h-4 mr-3" />
              Agregar todo a favoritos
            </Button>
            <Button variant="ghost" className="w-full justify-start">
              <Calendar className="w-4 h-4 mr-3" />
              Exportar historial
            </Button>
          </div>
        </div>

        <div className="bg-gray-800/30 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Artistas Más Escuchados</h3>
          <div className="space-y-3">
            {['Harry Styles', 'Dua Lipa', 'Taylor Swift', 'Miley Cyrus'].map((artist, index) => (
              <div key={artist} className="flex items-center justify-between">
                <span className="text-gray-300">{artist}</span>
                <div className="flex items-center gap-2">
                  <div className="w-16 h-2 bg-gray-700 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"
                      style={{ width: `${80 - index * 15}%` }}
                    />
                  </div>
                  <span className="text-gray-400 text-sm">{3 - index}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default RecentPage;
