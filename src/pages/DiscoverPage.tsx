import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Music, Play, Heart, MoreHorizontal, Shuffle, Radio, Compass } from 'lucide-react';
import { Button } from '../components/common/Button';
import { usePlayer } from '../contexts/PlayerContext';

// Mock data para descubrimiento
const featuredPlaylists = [
  {
    id: '1',
    title: 'Chill Vibes',
    description: 'Música relajante para cualquier momento',
    coverUrl: 'https://images.pexels.com/photos/1105666/pexels-photo-1105666.jpeg?auto=compress&cs=tinysrgb&w=300',
    songCount: 25,
    duration: '1h 32m'
  },
  {
    id: '2',
    title: 'Workout Hits',
    description: 'Energía para tus entrenamientos',
    coverUrl: 'https://images.pexels.com/photos/1763075/pexels-photo-1763075.jpeg?auto=compress&cs=tinysrgb&w=300',
    songCount: 40,
    duration: '2h 15m'
  },
  {
    id: '3',
    title: 'Indie Discoveries',
    description: 'Nuevos talentos independientes',
    coverUrl: 'https://images.pexels.com/photos/1540406/pexels-photo-1540406.jpeg?auto=compress&cs=tinysrgb&w=300',
    songCount: 30,
    duration: '1h 45m'
  }
];

const newReleases = [
  {
    id: '1',
    title: 'Midnight Rain',
    artist: 'Taylor Swift',
    album: 'Midnights',
    duration: 175,
    coverUrl: 'https://images.pexels.com/photos/1699161/pexels-photo-1699161.jpeg?auto=compress&cs=tinysrgb&w=300',
    releaseDate: '2024-01-10'
  },
  {
    id: '2',
    title: 'Unholy',
    artist: 'Sam Smith ft. Kim Petras',
    album: 'Gloria',
    duration: 156,
    coverUrl: 'https://images.pexels.com/photos/1644888/pexels-photo-1644888.jpeg?auto=compress&cs=tinysrgb&w=300',
    releaseDate: '2024-01-08'
  },
  {
    id: '3',
    title: 'Calm Down',
    artist: 'Rema & Selena Gomez',
    album: 'Rave & Roses',
    duration: 239,
    coverUrl: 'https://images.pexels.com/photos/1105666/pexels-photo-1105666.jpeg?auto=compress&cs=tinysrgb&w=300',
    releaseDate: '2024-01-05'
  }
];

const genres = [
  { name: 'Pop', color: 'from-pink-500 to-rose-500', songs: '2.5K' },
  { name: 'Rock', color: 'from-red-500 to-orange-500', songs: '1.8K' },
  { name: 'Hip-Hop', color: 'from-purple-500 to-indigo-500', songs: '3.2K' },
  { name: 'Electronic', color: 'from-blue-500 to-cyan-500', songs: '1.9K' },
  { name: 'Jazz', color: 'from-yellow-500 to-amber-500', songs: '890' },
  { name: 'Classical', color: 'from-green-500 to-emerald-500', songs: '1.2K' }
];

const formatDuration = (seconds: number) => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};

export const DiscoverPage: React.FC = () => {
  const { play, setQueue } = usePlayer();
  const navigate = useNavigate();

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
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-4"
      >
        <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-teal-500 rounded-2xl flex items-center justify-center">
          <Compass className="w-8 h-8 text-white" />
        </div>
        <div>
          <h1 className="text-4xl font-bold text-white mb-2">Descubrir</h1>
          <p className="text-gray-400">Explora nueva música personalizada para ti</p>
        </div>
      </motion.div>

      {/* Quick Discovery Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-4"
      >
        <Button variant="primary" className="h-16 justify-start text-left">
          <Shuffle className="w-6 h-6 mr-4" />
          <div>
            <div className="font-semibold">Mix Aleatorio</div>
            <div className="text-sm opacity-80">Descubre música nueva</div>
          </div>
        </Button>
        <Button variant="ghost" className="h-16 justify-start text-left border border-gray-700">
          <Radio className="w-6 h-6 mr-4" />
          <div>
            <div className="font-semibold">Radio Personalizada</div>
            <div className="text-sm opacity-80">Basada en tus gustos</div>
          </div>
        </Button>
        <Button variant="ghost" className="h-16 justify-start text-left border border-gray-700">
          <Music className="w-6 h-6 mr-4" />
          <div>
            <div className="font-semibold">Explorar Géneros</div>
            <div className="text-sm opacity-80">Por categorías</div>
          </div>
        </Button>
      </motion.div>

      {/* Featured Playlists */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white">Playlists Destacadas</h2>
          <Button variant="ghost" size="sm">Ver todas</Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredPlaylists.map((playlist, index) => (
            <motion.div
              key={playlist.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * index }}
              className="bg-gray-800/30 rounded-xl p-4 hover:bg-gray-800/50 transition-colors group cursor-pointer"
            >
              <div className="relative mb-4">
                <img
                  src={playlist.coverUrl}
                  alt={playlist.title}
                  className="w-full aspect-square rounded-lg object-cover"
                />
                <Button
                  variant="primary"
                  size="lg"
                  className="absolute bottom-2 right-2 rounded-full w-12 h-12 p-0 opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                >
                  <Play className="w-5 h-5 ml-0.5" />
                </Button>
              </div>
              <h3 className="text-white font-semibold mb-1">{playlist.title}</h3>
              <p className="text-gray-400 text-sm mb-2">{playlist.description}</p>
              <div className="flex items-center gap-2 text-gray-500 text-xs">
                <span>{playlist.songCount} canciones</span>
                <span>•</span>
                <span>{playlist.duration}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Genres */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <h2 className="text-2xl font-bold text-white mb-6">Explorar por Género</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {genres.map((genre, index) => (
            <motion.div
              key={genre.name}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 * index }}
              className={`bg-gradient-to-br ${genre.color} rounded-xl p-4 cursor-pointer hover:scale-105 transition-transform`}
            >
              <div className="text-white font-bold text-lg mb-1">{genre.name}</div>
              <div className="text-white/80 text-sm">{genre.songs} canciones</div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* New Releases */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-gray-800/30 rounded-xl p-6"
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white">Nuevos Lanzamientos</h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/library')}
            className="hover:text-blue-400 transition-colors"
          >
            Ver todos
          </Button>
        </div>

        <div className="space-y-3">
          {newReleases.map((song, index) => (
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
                  className="w-14 h-14 rounded-lg object-cover"
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

              {/* Release Date */}
              <div className="text-gray-400 text-sm">
                {new Date(song.releaseDate).toLocaleDateString('es-ES', {
                  month: 'short',
                  day: 'numeric'
                })}
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

      {/* Personalized Recommendations */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="grid grid-cols-1 md:grid-cols-2 gap-6"
      >
        <div className="bg-gray-800/30 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Basado en tu Actividad</h3>
          <div className="space-y-3">
            <div className="text-gray-400 text-sm mb-4">
              Porque escuchaste mucho Pop y Rock esta semana
            </div>
            <Button variant="ghost" className="w-full justify-start">
              <Music className="w-4 h-4 mr-3" />
              Mix Pop-Rock Personalizado
            </Button>
            <Button variant="ghost" className="w-full justify-start">
              <Radio className="w-4 h-4 mr-3" />
              Radio de Artistas Similares
            </Button>
          </div>
        </div>

        <div className="bg-gray-800/30 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Tendencias en tu Área</h3>
          <div className="space-y-3">
            <div className="text-gray-400 text-sm mb-4">
              Lo más popular en tu región
            </div>
            <Button variant="ghost" className="w-full justify-start">
              <Compass className="w-4 h-4 mr-3" />
              Top Local
            </Button>
            <Button variant="ghost" className="w-full justify-start">
              <Music className="w-4 h-4 mr-3" />
              Artistas Emergentes Locales
            </Button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default DiscoverPage;
