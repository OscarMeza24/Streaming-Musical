import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Play, Heart, MoreHorizontal } from 'lucide-react';
import { Button } from '../components/common/Button';
import { usePlayer } from '../contexts/PlayerContext';

// Mock data para tendencias
const trendingSongs = [
  {
    id: '1',
    title: 'Blinding Lights',
    artist: 'The Weeknd',
    album: 'After Hours',
    duration: 200,
    coverUrl: 'https://images.pexels.com/photos/1105666/pexels-photo-1105666.jpeg?auto=compress&cs=tinysrgb&w=300',
    trend: '+15',
    plays: '2.1M'
  },
  {
    id: '2',
    title: 'Shape of You',
    artist: 'Ed Sheeran',
    album: '÷ (Divide)',
    duration: 233,
    coverUrl: 'https://images.pexels.com/photos/1763075/pexels-photo-1763075.jpeg?auto=compress&cs=tinysrgb&w=300',
    trend: '+8',
    plays: '1.8M'
  },
  {
    id: '3',
    title: 'Bad Habits',
    artist: 'Ed Sheeran',
    album: '= (Equals)',
    duration: 231,
    coverUrl: 'https://images.pexels.com/photos/1540406/pexels-photo-1540406.jpeg?auto=compress&cs=tinysrgb&w=300',
    trend: '+12',
    plays: '1.5M'
  },
  {
    id: '4',
    title: 'Stay',
    artist: 'The Kid LAROI, Justin Bieber',
    album: 'F*CK LOVE 3: OVER YOU',
    duration: 141,
    coverUrl: 'https://images.pexels.com/photos/1699161/pexels-photo-1699161.jpeg?auto=compress&cs=tinysrgb&w=300',
    trend: '+20',
    plays: '1.9M'
  },
  {
    id: '5',
    title: 'Good 4 U',
    artist: 'Olivia Rodrigo',
    album: 'SOUR',
    duration: 178,
    coverUrl: 'https://images.pexels.com/photos/1644888/pexels-photo-1644888.jpeg?auto=compress&cs=tinysrgb&w=300',
    trend: '+6',
    plays: '1.3M'
  }
];

const formatDuration = (seconds: number) => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};

export const TrendingPage: React.FC = () => {
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-4"
      >
        <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-orange-500 rounded-2xl flex items-center justify-center">
          <TrendingUp className="w-8 h-8 text-white" />
        </div>
        <div>
          <h1 className="text-4xl font-bold text-white mb-2">Tendencias</h1>
          <p className="text-gray-400">Las canciones más populares en este momento</p>
        </div>
      </motion.div>

      {/* Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-4"
      >
        <div className="bg-gray-800/50 rounded-xl p-4">
          <div className="text-2xl font-bold text-white">50+</div>
          <div className="text-gray-400 text-sm">Canciones en tendencia</div>
        </div>
        <div className="bg-gray-800/50 rounded-xl p-4">
          <div className="text-2xl font-bold text-white">12M+</div>
          <div className="text-gray-400 text-sm">Reproducciones totales</div>
        </div>
        <div className="bg-gray-800/50 rounded-xl p-4">
          <div className="text-2xl font-bold text-white">24h</div>
          <div className="text-gray-400 text-sm">Actualizado cada</div>
        </div>
      </motion.div>

      {/* Trending Songs */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-gray-800/30 rounded-xl p-6"
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-white">Top Tendencias</h2>
          <Button variant="ghost" size="sm">
            Ver todas
          </Button>
        </div>

        <div className="space-y-2">
          {trendingSongs.map((song, index) => (
            <motion.div
              key={song.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 * index }}
              className="flex items-center gap-4 p-3 rounded-lg hover:bg-gray-700/30 transition-colors group"
            >
              {/* Ranking */}
              <div className="w-8 text-center">
                <span className="text-lg font-bold text-gray-400">#{index + 1}</span>
              </div>

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

              {/* Trend Indicator */}
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1 text-green-400">
                  <TrendingUp className="w-4 h-4" />
                  <span className="text-sm font-medium">{song.trend}</span>
                </div>
                <span className="text-gray-400 text-sm">{song.plays}</span>
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

      {/* Charts Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="grid grid-cols-1 md:grid-cols-2 gap-6"
      >
        <div className="bg-gray-800/30 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Top Géneros</h3>
          <div className="space-y-3">
            {['Pop', 'Rock', 'Hip-Hop', 'Electronic', 'R&B'].map((genre, index) => (
              <div key={genre} className="flex items-center justify-between">
                <span className="text-gray-300">{genre}</span>
                <div className="flex items-center gap-2">
                  <div className="w-20 h-2 bg-gray-700 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-purple-500 to-blue-500 rounded-full"
                      style={{ width: `${90 - index * 15}%` }}
                    />
                  </div>
                  <span className="text-gray-400 text-sm">{90 - index * 15}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-gray-800/30 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Artistas Trending</h3>
          <div className="space-y-3">
            {['The Weeknd', 'Ed Sheeran', 'Olivia Rodrigo', 'Dua Lipa', 'Bad Bunny'].map((artist, index) => (
              <div key={artist} className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs font-bold">{index + 1}</span>
                </div>
                <span className="text-gray-300 flex-1">{artist}</span>
                <span className="text-green-400 text-sm">+{Math.floor(Math.random() * 20) + 5}%</span>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default TrendingPage;
