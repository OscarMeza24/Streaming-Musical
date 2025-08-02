import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Play, TrendingUp, Clock, Heart, Loader } from 'lucide-react';
import toast from 'react-hot-toast';
import { SongCard } from '../components/music/SongCard';
import { PlaylistCard } from '../components/music/PlaylistCard';
import { Button } from '../components/common/Button';
import { usePlayer } from '../contexts/PlayerContext';
import { Song, Playlist } from '../types';
import { MockMusicService } from '../services/mockMusicService';
import { mockPlaylists } from '../data/mockData';

export const HomePage: React.FC = () => {
  const { setQueue } = usePlayer();
  const [songs, setSongs] = useState<Song[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadInitialData = async () => {
    try {
      setIsLoading(true);
      const allSongs = await MockMusicService.getAllSongs();
      setSongs(allSongs);
    } catch (error) {
      toast.error('No se pudieron cargar las canciones.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadInitialData();
  }, []);

  const handleToggleLike = async (songId: string, isCurrentlyLiked: boolean) => {
    const originalSongs = [...songs];

    // Optimistic UI update
    setSongs(prevSongs =>
      prevSongs.map(s => (s.id === songId ? { ...s, liked: !isCurrentlyLiked } : s))
    );

    try {
      const newLikedStatus = await MockMusicService.toggleLikeSong(songId);
      if (newLikedStatus) {
        toast.success('Canción añadida a tus favoritos');
      } else {
        toast.success('Canción eliminada de tus favoritos');
      }
    } catch (error) {
      toast.error('No se pudo actualizar la canción.');
      setSongs(originalSongs); // Revert on error
    }
  };

  const handlePlaySongs = (songList: Song[], songIndex: number) => {
    setQueue(songList, songIndex);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-full">
        <Loader className="w-12 h-12 animate-spin text-purple-500" />
      </div>
    );
  }

  // Dividir canciones para diferentes secciones (simulado)
  const recentPlays = songs.slice(0, 5);
  const trendingSongs = songs.slice(5, 11);

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative bg-gradient-to-r from-purple-900/50 to-blue-900/50 rounded-2xl p-8 overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-blue-600/20 backdrop-blur-sm" />
        <div className="relative z-10">
          <h1 className="text-4xl lg:text-5xl font-bold text-white mb-4">
            Descubre Tu Próxima
            <span className="block bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
              Canción Favorita
            </span>
          </h1>
          <p className="text-gray-300 text-lg mb-6 max-w-2xl">
            Explora millones de canciones, crea listas de reproducción y disfruta streaming musical de alta calidad con StreamFlow Music.
          </p>
          <Button
            variant="primary"
            size="lg"
            onClick={() => handlePlaySongs(trendingSongs, 0)}
            leftIcon={<Play className="w-5 h-5" />}
          >
            Reproducir Tendencias
          </Button>
        </div>
      </motion.section>

      {/* Quick Access - Esto puede ser estático o futuro desarrollo */}
      <section>
        <h2 className="text-2xl font-bold text-white mb-6">Acceso Rápido</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { title: 'Canciones Favoritas', icon: Heart, color: 'from-red-500 to-pink-500', path: '/library?tab=liked' },
            { title: 'Reproducidas Recientemente', icon: Clock, color: 'from-blue-500 to-cyan-500', path: '/recent' },
            { title: 'Tendencias', icon: TrendingUp, color: 'from-orange-500 to-red-500', path: '/trending' },
            { title: 'Descubrir', icon: Play, color: 'from-purple-500 to-blue-500', path: '/discover' },
          ].map((item, index) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Link
                to={item.path}
                className="block group bg-gray-800/50 rounded-lg p-4 hover:bg-gray-800 cursor-pointer transition-all duration-200"
              >
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${item.color} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                    <item.icon className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-white">{item.title}</h3>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Recently Played */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white">Reproducidas Recientemente</h2>
          <Button variant="ghost">Ver Todo</Button>
        </div>
        <div className="space-y-2">
          {recentPlays.map((song, index) => (
            <SongCard
              key={song.id}
              song={song}
              index={index}
              showIndex={true}
              onToggleLike={handleToggleLike}
            />
          ))}
        </div>
      </section>

      {/* Your Playlists (aún con datos de prueba) */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white">Tus Listas de Reproducción</h2>
          <Button variant="ghost">Ver Todo</Button>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {mockPlaylists.map((playlist) => (
            <PlaylistCard
              key={playlist.id}
              playlist={playlist}
            />
          ))}
        </div>
      </section>

      {/* Trending Songs */}
      <section>
        <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-white">Tendencias de Esta Semana</h2>
        <Button variant="ghost">Ver Todo</Button>
        </div>
        <div className="space-y-2">
          {trendingSongs.map((song, index) => (
            <SongCard
              key={song.id}
              song={song}
              index={index}
              showIndex={true}
              onToggleLike={handleToggleLike}
            />
          ))}
        </div>
      </section>
    </div>
  );
};