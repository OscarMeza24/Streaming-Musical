import React, { useState, useEffect, useCallback } from 'react';
import { useUser } from '@supabase/auth-helpers-react';
import { Music, Disc, Users, ListMusic, Clock, Heart, Plus, Loader } from 'lucide-react';
import toast from 'react-hot-toast';
import { Song, SongWithRelations } from '../types';
import { getLikedSongs, toggleSongLikeStatus } from '../services/libraryService';
import { formatDuration } from '../utils/format';
import { useNavigate } from 'react-router-dom';
import { SongCard } from '../components/music/SongCard';

// Tipos de pestañas disponibles
type LibraryTab = 'liked' | 'playlists' | 'albums' | 'artists';

// Función para convertir SongWithRelations a Song
const mapToSong = (songWithRelations: SongWithRelations): Song => {
  // Create a base song object with all properties from songWithRelations
  const song: Song = {
    ...songWithRelations,
    // Use artistInfo if available, otherwise fall back to the artist string or default
    artist: typeof songWithRelations.artist === 'string' 
      ? songWithRelations.artist 
      : songWithRelations.artistInfo?.name || 'Artista desconocido',
    // Use albumInfo if available, otherwise fall back to the album string or default
    album: typeof songWithRelations.album === 'string'
      ? songWithRelations.album
      : songWithRelations.albumInfo?.title || 'Álbum desconocido',
    // Use coverUrl from albumInfo if available, otherwise use the song's coverUrl or default
    coverUrl: songWithRelations.albumInfo?.coverUrl || 
             songWithRelations.coverUrl || 
             '/default-cover.png',
    // All songs in this view are liked
    liked: true,
    // Use the provided addedAt or default to now
    addedAt: songWithRelations.addedAt || new Date().toISOString()
  };
  
  return song;
};

// Componente para mostrar las canciones que te gustan
const LikedSongs: React.FC<{ 
  songs: SongWithRelations[]; 
  onToggleLike: (songId: string, isLiked: boolean) => void; 
}> = ({ songs, onToggleLike }) => {
  if (songs.length === 0) {
    return (
      <div className="text-center py-16">
        <Heart className="w-16 h-16 mx-auto text-gray-500 mb-4" />
        <h3 className="text-xl font-medium text-white mb-2">Aún no tienes canciones favoritas</h3>
        <p className="text-gray-400">Usa el corazón para guardar las canciones que te gusten.</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {songs.map((song, index) => (
        <SongCard
          key={song.id}
          song={mapToSong(song)}
          index={index}
          showIndex={true}
          onToggleLike={onToggleLike}
        />
      ))}
    </div>
  );
};

// Componentes Placeholder para otras secciones (a implementar en el futuro)
const PlaceholderSection: React.FC<{ title: string; icon: React.ReactNode }> = ({ title, icon }) => (
  <div className="text-center py-10">
    <div className="w-12 h-12 mx-auto text-gray-500 mb-4">{icon}</div>
    <h3 className="text-lg font-medium text-white mb-2">{title} no disponible</h3>
    <p className="text-gray-400">Esta sección se implementará en el futuro.</p>
  </div>
);

// --- PÁGINA PRINCIPAL DE LA BIBLIOTECA (REFACTORIZADA) ---

const LibraryPage: React.FC = () => {
  const user = useUser();
  const userId = user?.id;

  const [likedSongs, setLikedSongs] = useState<SongWithRelations[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Cargar datos de la biblioteca al montar el componente
  const loadLibraryData = useCallback(async () => {
    if (!userId) return;
    try {
      setIsLoading(true);
      const songs = await getLikedSongs(userId); // ✅ Así es correcto
      setLikedSongs(songs);
    } catch (error) {
      toast.error('No se pudieron cargar tus canciones favoritas.');
    } finally {
      setIsLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    loadLibraryData();
  }, [loadLibraryData]);

  // Función centralizada para manejar los "me gusta"
  const handleToggleLike = async (songId: string, isCurrentlyLiked: boolean) => {
    if (!userId) {
      toast.error('Debes iniciar sesión para dar me gusta.');
      return;
    }
    setIsLoading(true);
    try {
      await toggleSongLikeStatus(songId, userId);
      const songs = await getLikedSongs(userId);
      setLikedSongs(songs);
      toast.success(isCurrentlyLiked ? 'Canción eliminada de tus me gusta' : 'Canción añadida a tus me gusta');
    } catch (error) {
      toast.error('No se pudo actualizar la canción.');
    } finally {
      setIsLoading(false);
    }
  };

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="flex justify-center items-center h-64">
          <Loader className="w-8 h-8 animate-spin text-purple-500" />
        </div>
      );
    }

    return <LikedSongs songs={likedSongs} onToggleLike={handleToggleLike} />;
  };

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-white">Tus canciones favoritas</h1>
      </div>
      
      {/* Pestañas de Navegación */}
      <div className="flex items-center space-x-4 border-b border-gray-700 mb-8">
        <TabButton 
          label="Canciones" 
          isActive={true} 
          onClick={() => {}} 
        />
        <TabButton 
          label="Playlists" 
          isActive={false} 
          onClick={() => {}} 
        />
        <TabButton 
          label="Álbumes" 
          isActive={false} 
          onClick={() => {}} 
        />
        <TabButton 
          label="Artistas" 
          isActive={false} 
          onClick={() => {}} 
        />
      </div>

      {/* Contenido dinámico según la pestaña */}
      <div>
        {renderContent()}
      </div>
    </div>
  );
};

// Componente auxiliar para las pestañas
const TabButton: React.FC<{ label: string; isActive: boolean; onClick: () => void }> = ({ 
  label, 
  isActive, 
  onClick 
}) => (
  <button
    onClick={onClick}
    className={`px-4 py-3 text-sm font-medium transition-colors duration-200 relative
      ${isActive 
        ? 'text-white' 
        : 'text-gray-400 hover:text-white'}`}
  >
    {label}
    {isActive && (
      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full" />
    )}
  </button>
);

export default LibraryPage;
