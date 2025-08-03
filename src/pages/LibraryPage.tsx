import React, { useState, useEffect, useCallback } from 'react';
import { useUser } from '@supabase/auth-helpers-react';
import { Disc, Users, ListMusic, Heart, Plus, Loader } from 'lucide-react';
import toast from 'react-hot-toast';
import { Song, SongWithRelations } from '../types';
import { getLikedSongs, toggleSongLikeStatus } from '../services/libraryService';
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

// Componente para mostrar playlists
const PlaylistsSection: React.FC = () => {
  // Datos mock de playlists
  const mockPlaylists = [
    {
      id: '1',
      name: 'Mis Favoritas',
      description: 'Las canciones que más me gustan',
      songCount: 25,
      coverUrl: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=300&fit=crop',
      createdAt: '2024-01-15'
    },
    {
      id: '2',
      name: 'Motivación',
      description: 'Música para entrenar',
      songCount: 18,
      coverUrl: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=300&h=300&fit=crop',
      createdAt: '2024-01-10'
    },
    {
      id: '3',
      name: 'Electronica',
      description: 'Para relajarse',
      songCount: 12,
      coverUrl: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=300&h=300&fit=crop',
      createdAt: '2024-01-05'
    }
  ];

  if (mockPlaylists.length === 0) {
    return (
      <div className="text-center py-16">
        <ListMusic className="w-16 h-16 mx-auto text-gray-500 mb-4" />
        <h3 className="text-xl font-medium text-white mb-2">No tienes playlists aún</h3>
        <p className="text-gray-400">Crea tu primera playlist para organizar tu música.</p>
        <button className="mt-4 px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors">
          <Plus className="w-4 h-4 inline mr-2" />
          Crear Playlist
        </button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {mockPlaylists.map((playlist) => (
        <div key={playlist.id} className="bg-gray-800 rounded-lg p-4 hover:bg-gray-750 transition-colors cursor-pointer group">
          <div className="relative mb-4">
            <img
              src={playlist.coverUrl}
              alt={playlist.name}
              className="w-full aspect-square object-cover rounded-lg group-hover:scale-105 transition-transform duration-300"
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 rounded-lg transition-colors duration-300" />
          </div>
          <h3 className="font-semibold text-white mb-1 truncate">{playlist.name}</h3>
          <p className="text-gray-400 text-sm mb-2 line-clamp-2">{playlist.description}</p>
          <p className="text-gray-500 text-xs">{playlist.songCount} canciones</p>
        </div>
      ))}
    </div>
  );
};

// Componente para mostrar álbumes
const AlbumsSection: React.FC = () => {
  // Datos mock de álbumes
  const mockAlbums = [
    {
      id: '1',
      title: 'After Hours',
      artist: 'The Weeknd',
      year: 2020,
      songCount: 14,
      coverUrl: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=300&fit=crop'
    },
    {
      id: '2',
      title: 'Fine Line',
      artist: 'Harry Styles',
      year: 2019,
      songCount: 12,
      coverUrl: 'https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=300&h=300&fit=crop'
    },
    {
      id: '3',
      title: 'Future Nostalgia',
      artist: 'Dua Lipa',
      year: 2020,
      songCount: 11,
      coverUrl: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=300&h=300&fit=crop'
    }
  ];

  if (mockAlbums.length === 0) {
    return (
      <div className="text-center py-16">
        <Disc className="w-16 h-16 mx-auto text-gray-500 mb-4" />
        <h3 className="text-xl font-medium text-white mb-2">No tienes álbumes guardados</h3>
        <p className="text-gray-400">Los álbumes que te gusten aparecerán aquí.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {mockAlbums.map((album) => (
        <div key={album.id} className="bg-gray-800 rounded-lg p-4 hover:bg-gray-750 transition-colors cursor-pointer group">
          <div className="relative mb-4">
            <img
              src={album.coverUrl}
              alt={album.title}
              className="w-full aspect-square object-cover rounded-lg group-hover:scale-105 transition-transform duration-300"
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 rounded-lg transition-colors duration-300" />
          </div>
          <h3 className="font-semibold text-white mb-1 truncate">{album.title}</h3>
          <p className="text-gray-400 text-sm mb-1">{album.artist}</p>
          <p className="text-gray-500 text-xs">{album.year} • {album.songCount} canciones</p>
        </div>
      ))}
    </div>
  );
};

// Componente para mostrar artistas
const ArtistsSection: React.FC = () => {
  // Datos mock de artistas
  const mockArtists = [
    {
      id: '1',
      name: 'The Weeknd',
      followers: '2.5M',
      imageUrl: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=300&fit=crop'
    },
    {
      id: '2',
      name: 'Harry Styles',
      followers: '1.8M',
      imageUrl: 'https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=300&h=300&fit=crop'
    },
    {
      id: '3',
      name: 'Dua Lipa',
      followers: '2.1M',
      imageUrl: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=300&h=300&fit=crop'
    }
  ];

  if (mockArtists.length === 0) {
    return (
      <div className="text-center py-16">
        <Users className="w-16 h-16 mx-auto text-gray-500 mb-4" />
        <h3 className="text-xl font-medium text-white mb-2">No sigues a ningún artista</h3>
        <p className="text-gray-400">Los artistas que sigas aparecerán aquí.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {mockArtists.map((artist) => (
        <div key={artist.id} className="bg-gray-800 rounded-lg p-4 hover:bg-gray-750 transition-colors cursor-pointer group text-center">
          <div className="relative mb-4">
            <img
              src={artist.imageUrl}
              alt={artist.name}
              className="w-24 h-24 mx-auto object-cover rounded-full group-hover:scale-105 transition-transform duration-300"
            />
          </div>
          <h3 className="font-semibold text-white mb-1">{artist.name}</h3>
          <p className="text-gray-400 text-sm">{artist.followers} seguidores</p>
          <button className="mt-3 px-4 py-1 bg-purple-600 hover:bg-purple-700 text-white text-sm rounded-full transition-colors">
            Siguiendo
          </button>
        </div>
      ))}
    </div>
  );
};

// --- PÁGINA PRINCIPAL DE LA BIBLIOTECA (REFACTORIZADA) ---

const LibraryPage: React.FC = () => {
  const user = useUser();
  const userId = user?.id;

  const [activeTab, setActiveTab] = useState<LibraryTab>('liked');
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

    switch (activeTab) {
      case 'liked':
        return <LikedSongs songs={likedSongs} onToggleLike={handleToggleLike} />;
      case 'playlists':
        return <PlaylistsSection />;
      case 'albums':
        return <AlbumsSection />;
      case 'artists':
        return <ArtistsSection />;
      default:
        return <LikedSongs songs={likedSongs} onToggleLike={handleToggleLike} />;
    }
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
