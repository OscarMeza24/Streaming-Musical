import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Music, Disc, Users, ListMusic, Clock, Heart, Plus, Loader } from 'lucide-react';
import toast from 'react-hot-toast';
import { Song, Album, Artist, Playlist } from '../types';
import { getLikedSongs, toggleSongLikeStatus } from '../services/libraryService';
import { formatDuration } from '../utils/format';

// Tipos de pestañas disponibles
type LibraryTab = 'liked' | 'playlists' | 'albums' | 'artists';

// Componente para mostrar las canciones que te gustan (ahora más simple)
const LikedSongs: React.FC<{ songs: Song[]; onToggleLike: (songId: string, isLiked: boolean) => void; }> = ({ songs, onToggleLike }) => {
  const navigate = useNavigate();

  if (songs.length === 0) {
    return (
      <div className="text-center py-10">
        <Heart className="w-12 h-12 mx-auto text-gray-500 mb-4" />
        <h3 className="text-lg font-medium text-white mb-2">Aún no tienes canciones favoritas</h3>
        <p className="text-gray-400">Usa el corazón para guardar las canciones que te gusten.</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <div className="bg-gray-800 rounded-lg overflow-hidden">
        {songs.map((song, index) => (
          <div 
            key={song.id}
            className="flex items-center p-3 hover:bg-gray-700 cursor-pointer group"
            onClick={() => navigate(`/song/${song.id}`)} // Navegación futura
          >
            <div className="w-8 text-center text-gray-400 text-sm mr-3">{index + 1}</div>
            <img 
              src={song.coverUrl || '/placeholder.png'} 
              alt={song.title} 
              className="w-12 h-12 rounded-md mr-3"
            />
            <div className="flex-1 min-w-0">
              <h4 className="text-white font-medium truncate">{song.title}</h4>
              <p className="text-gray-400 text-sm truncate">{song.artist}</p>
            </div>
            <button 
              className={`p-2 rounded-full mr-2 text-purple-500`}
              onClick={(e) => {
                e.stopPropagation();
                onToggleLike(song.id, song.liked || false);
              }}
            >
              <Heart className={`w-5 h-5 fill-current`} />
            </button>
            <div className="text-gray-400 text-sm ml-2 w-16 text-right">
              {formatDuration(song.duration)}
            </div>
          </div>
        ))}
      </div>
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
  const [activeTab, setActiveTab] = useState<LibraryTab>('liked');
  const [likedSongs, setLikedSongs] = useState<Song[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Cargar datos de la biblioteca al montar el componente
  const loadLibraryData = useCallback(async () => {
    try {
      setIsLoading(true);
      const songs = await getLikedSongs();
      setLikedSongs(songs);
    } catch (error) {
      toast.error('No se pudieron cargar tus canciones favoritas.');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadLibraryData();
  }, [loadLibraryData]);

  // Función centralizada para manejar los "me gusta"
  const handleToggleLike = async (songId: string, isCurrentlyLiked: boolean) => {
    // No debería ser posible dar "me gusta" desde aquí, solo quitarlo.
    if (!isCurrentlyLiked) return;

    // Actualización optimista de la UI para una respuesta más rápida
    const previousSongs = likedSongs;
    setLikedSongs(previousSongs.filter(s => s.id !== songId));

    try {
      await toggleSongLikeStatus(songId);
      toast.success('Canción eliminada de tus me gusta');
      // Opcional: Recargar datos para consistencia total, aunque el borrado local funciona.
      // loadLibraryData(); 
    } catch (error) {
      toast.error('No se pudo eliminar la canción.');
      // Revertir en caso de error
      setLikedSongs(previousSongs);
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

    switch (activeTab) {
      case 'liked':
        return <LikedSongs songs={likedSongs} onToggleLike={handleToggleLike} />;
      case 'playlists':
        return <PlaceholderSection title="Playlists" icon={<ListMusic />} />;
      case 'albums':
        return <PlaceholderSection title="Álbumes" icon={<Disc />} />;
      case 'artists':
        return <PlaceholderSection title="Artistas" icon={<Users />} />;
      default:
        return null;
    }
  };

  return (
    <div className="p-4 sm:p-6">
      <h1 className="text-3xl font-bold text-white mb-6">Tu Biblioteca</h1>
      
      {/* Pestañas de Navegación */}
      <div className="flex items-center space-x-2 border-b border-gray-700 mb-6">
        <TabButton 
          label="Me gusta" 
          isActive={activeTab === 'liked'} 
          onClick={() => setActiveTab('liked')} 
        />
        <TabButton 
          label="Playlists" 
          isActive={activeTab === 'playlists'} 
          onClick={() => setActiveTab('playlists')} 
        />
        <TabButton 
          label="Álbumes" 
          isActive={activeTab === 'albums'} 
          onClick={() => setActiveTab('albums')} 
        />
        <TabButton 
          label="Artistas" 
          isActive={activeTab === 'artists'} 
          onClick={() => setActiveTab('artists')} 
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
const TabButton: React.FC<{ label: string; isActive: boolean; onClick: () => void; }> = ({ label, isActive, onClick }) => (
  <button
    onClick={onClick}
    className={`px-4 py-2 text-sm font-medium transition-colors duration-200 
      ${isActive 
        ? 'text-white border-b-2 border-purple-500'
        : 'text-gray-400 hover:text-white'}`
    }
  >
    {label}
  </button>
);

export default LibraryPage;
