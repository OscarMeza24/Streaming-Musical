import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Music, Disc, Users, ListMusic, Clock, Heart, Plus } from 'lucide-react';
import { Song, Album, Artist, Playlist } from '../types';
import { 
  getLibraryItems, 
  getRecentlyPlayed, 
  getLikedSongs, 
  toggleLikeSong 
} from '../services/libraryService';
import { formatDuration } from '../utils/format';

// Tipos de pestañas disponibles en la biblioteca
type LibraryTab = 'recent' | 'songs' | 'albums' | 'artists' | 'playlists' | 'liked';

// Componente para mostrar las canciones recientes
const RecentlyPlayed: React.FC<{ songs: Song[] }> = ({ songs }) => {
  const navigate = useNavigate();

  if (songs.length === 0) {
    return (
      <div className="text-center py-10">
        <Clock className="w-12 h-12 mx-auto text-gray-500 mb-4" />
        <h3 className="text-lg font-medium text-white mb-2">No hay canciones recientes</h3>
        <p className="text-gray-400">Las canciones que escuches aparecerán aquí</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <h3 className="text-xl font-medium text-white mb-4">Recientemente reproducido</h3>
      <div className="bg-gray-800 rounded-lg overflow-hidden">
        {songs.map((song, index) => (
          <div 
            key={`${song.id}-${index}`}
            className="flex items-center p-3 hover:bg-gray-700 cursor-pointer group"
            onClick={() => navigate(`/song/${song.id}`)}
          >
            <div className="w-8 text-center text-gray-400 text-sm mr-3">{index + 1}</div>
            <img 
              src={song.coverUrl} 
              alt={song.title} 
              className="w-12 h-12 rounded-md mr-3"
            />
            <div className="flex-1 min-w-0">
              <h4 className="text-white font-medium truncate">{song.title}</h4>
              <p className="text-gray-400 text-sm truncate">{song.artist}</p>
            </div>
            <div className="text-gray-400 text-sm ml-4">
              {formatDuration(song.duration)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Componente para mostrar las canciones guardadas
const LibrarySongs: React.FC<{ songs: Song[] }> = ({ songs }) => {
  const navigate = useNavigate();
  const [localSongs, setLocalSongs] = useState<Song[]>(songs);

  const handleLike = (e: React.MouseEvent, songId: string) => {
    e.stopPropagation();
    const updatedSongs = localSongs.map(song => 
      song.id === songId ? { ...song, liked: !song.liked } : song
    );
    setLocalSongs(updatedSongs);
    toggleLikeSong(songId);
  };

  if (localSongs.length === 0) {
    return (
      <div className="text-center py-10">
        <Music className="w-12 h-12 mx-auto text-gray-500 mb-4" />
        <h3 className="text-lg font-medium text-white mb-2">No hay canciones guardadas</h3>
        <p className="text-gray-400">Las canciones que guardes aparecerán aquí</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-medium text-white">Tus canciones</h3>
      </div>
      <div className="bg-gray-800 rounded-lg overflow-hidden">
        {localSongs.map((song, index) => (
          <div 
            key={song.id}
            className="flex items-center p-3 hover:bg-gray-700 cursor-pointer group"
            onClick={() => navigate(`/song/${song.id}`)}
          >
            <div className="w-8 text-center text-gray-400 text-sm mr-3">{index + 1}</div>
            <img 
              src={song.coverUrl} 
              alt={song.title} 
              className="w-12 h-12 rounded-md mr-3"
            />
            <div className="flex-1 min-w-0">
              <h4 className="text-white font-medium truncate">{song.title}</h4>
              <p className="text-gray-400 text-sm truncate">{song.artist}</p>
            </div>
            <button 
              className={`p-2 rounded-full mr-2 ${song.liked ? 'text-green-500' : 'text-gray-400 hover:text-white'}`}
              onClick={(e) => handleLike(e, song.id)}
            >
              <Heart className={`w-5 h-5 ${song.liked ? 'fill-current' : ''}`} />
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

// Componente para mostrar los álbumes guardados
const LibraryAlbums: React.FC<{ albums: Album[] }> = ({ albums }) => {
  const navigate = useNavigate();

  if (albums.length === 0) {
    return (
      <div className="text-center py-10">
        <Disc className="w-12 h-12 mx-auto text-gray-500 mb-4" />
        <h3 className="text-lg font-medium text-white mb-2">No hay álbumes guardados</h3>
        <p className="text-gray-400">Los álbumes que guardes aparecerán aquí</p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-medium text-white">Tus álbumes</h3>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
        {albums.map((album) => (
          <div 
            key={album.id}
            className="bg-gray-800 p-3 rounded-lg hover:bg-gray-700 cursor-pointer transition"
            onClick={() => navigate(`/album/${album.id}`)}
          >
            <img 
              src={album.coverUrl} 
              alt={album.title} 
              className="w-full aspect-square rounded-md mb-2 object-cover"
            />
            <h4 className="text-white font-medium text-sm truncate">{album.title}</h4>
            <p className="text-gray-400 text-xs truncate">{album.artist}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

// Componente para mostrar los artistas seguidos
const LibraryArtists: React.FC<{ artists: Artist[] }> = ({ artists }) => {
  const navigate = useNavigate();

  if (artists.length === 0) {
    return (
      <div className="text-center py-10">
        <Users className="w-12 h-12 mx-auto text-gray-500 mb-4" />
        <h3 className="text-lg font-medium text-white mb-2">No sigues a ningún artista</h3>
        <p className="text-gray-400">Los artistas que sigas aparecerán aquí</p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-medium text-white">Tus artistas</h3>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
        {artists.map((artist) => (
          <div 
            key={artist.id}
            className="text-center cursor-pointer group"
            onClick={() => navigate(`/artist/${artist.id}`)}
          >
            <div className="w-full aspect-square rounded-full bg-gradient-to-br from-purple-600 to-blue-500 mb-3 overflow-hidden mx-auto transform group-hover:scale-105 transition-transform">
              {artist.avatarUrl ? (
                <img 
                  src={artist.avatarUrl} 
                  alt={artist.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-4xl font-bold text-white">
                  {artist.name.charAt(0)}
                </div>
              )}
            </div>
            <h4 className="text-white font-medium group-hover:text-purple-400 transition-colors">
              {artist.name}
            </h4>
            <p className="text-gray-400 text-sm">Artista</p>
          </div>
        ))}
      </div>
    </div>
  );
};

// Componente para mostrar las listas de reproducción del usuario
const LibraryPlaylists: React.FC<{ playlists: Playlist[] }> = ({ playlists }) => {
  const navigate = useNavigate();

  if (playlists.length === 0) {
    return (
      <div className="text-center py-10">
        <ListMusic className="w-12 h-12 mx-auto text-gray-500 mb-4" />
        <h3 className="text-lg font-medium text-white mb-2">No tienes listas de reproducción</h3>
        <p className="text-gray-400">Crea tu primera lista de reproducción</p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-medium text-white">Tus listas</h3>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
        {/* Botón para crear nueva lista */}
        <div 
          className="bg-gray-800 p-4 rounded-lg border-2 border-dashed border-gray-600 hover:border-purple-500 hover:bg-gray-700 cursor-pointer transition flex flex-col items-center justify-center aspect-square"
          onClick={() => navigate('/playlist/create')}
        >
          <div className="w-12 h-12 bg-gray-700 rounded-full flex items-center justify-center mb-2">
            <Plus className="w-6 h-6 text-gray-400" />
          </div>
          <span className="text-white text-sm font-medium">Nueva lista</span>
        </div>

        {/* Listas de reproducción existentes */}
        {playlists.map((playlist) => (
          <div 
            key={playlist.id}
            className="bg-gray-800 p-3 rounded-lg hover:bg-gray-700 cursor-pointer transition"
            onClick={() => navigate(`/playlist/${playlist.id}`)}
          >
            <div className="relative aspect-square mb-2">
              {playlist.coverUrl ? (
                <img 
                  src={playlist.coverUrl} 
                  alt={playlist.name} 
                  className="w-full h-full rounded-md object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-purple-600 to-blue-500 rounded-md flex items-center justify-center">
                  <ListMusic className="w-8 h-8 text-white" />
                </div>
              )}
              {playlist.collaborative && (
                <div className="absolute top-1 right-1 bg-black bg-opacity-70 text-white text-xs px-1 rounded">
                  Colab
                </div>
              )}
            </div>
            <h4 className="text-white font-medium text-sm truncate">{playlist.name}</h4>
            <p className="text-gray-400 text-xs truncate">
              {playlist.collaborative 
                ? `Colaborativa • ${playlist.followersCount} seguidores`
                : `${playlist.songs.length} canciones`}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

// Componente para mostrar las canciones que te gustan
const LikedSongs: React.FC<{ songs: Song[] }> = ({ songs }) => {
  const navigate = useNavigate();
  const [localSongs, setLocalSongs] = useState<Song[]>(songs);

  const handleUnlike = (e: React.MouseEvent, songId: string) => {
    e.stopPropagation();
    const updatedSongs = localSongs.filter(song => song.id !== songId);
    setLocalSongs(updatedSongs);
    toggleLikeSong(songId);
  };

  if (localSongs.length === 0) {
    return (
      <div className="text-center py-10">
        <Heart className="w-12 h-12 mx-auto text-gray-500 mb-4" />
        <h3 className="text-lg font-medium text-white mb-2">No hay canciones que te gusten</h3>
        <p className="text-gray-400">Las canciones que te gusten aparecerán aquí</p>
      </div>
    );
  }

  // Calcular la duración total
  const totalDuration = localSongs.reduce((sum, song) => sum + (song.duration || 0), 0);

  return (
    <div className="space-y-4">
      <div className="bg-gradient-to-r from-purple-900/50 to-blue-900/50 p-6 rounded-xl mb-6">
        <div className="flex items-center">
          <div className="w-24 h-24 bg-gradient-to-br from-purple-600 to-blue-500 rounded flex items-center justify-center mr-6">
            <Heart className="w-10 h-10 text-white fill-white" />
          </div>
          <div>
            <span className="text-sm font-medium text-white bg-black/20 px-2 py-1 rounded">Lista</span>
            <h1 className="text-4xl md:text-5xl font-bold text-white mt-2 mb-2">Canciones que te gustan</h1>
            <div className="flex items-center text-sm text-gray-300">
              <span className="font-medium">Tus canciones favoritas</span>
              <span className="mx-2">•</span>
              <span>{localSongs.length} canciones</span>
              <span className="mx-2">•</span>
              <span>{Math.floor(totalDuration / 3600) > 0 ? `${Math.floor(totalDuration / 3600)} hr ` : ''}
                {Math.floor((totalDuration % 3600) / 60)} min</span>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-gray-800 rounded-lg overflow-hidden">
        <div className="grid grid-cols-12 gap-4 px-4 py-3 text-sm text-gray-400 border-b border-gray-700">
          <div className="col-span-1 text-center">#</div>
          <div className="col-span-5">TÍTULO</div>
          <div className="col-span-3">ÁLBUM</div>
          <div className="col-span-2">AGREGADO</div>
          <div className="col-span-1 text-right">
            <Clock className="w-4 h-4 inline" />
          </div>
        </div>

        {localSongs.map((song, index) => (
          <div 
            key={song.id}
            className="grid grid-cols-12 gap-4 px-4 py-3 items-center hover:bg-gray-700/50 group cursor-pointer"
            onClick={() => navigate(`/song/${song.id}`)}
          >
            <div className="col-span-1 text-center text-gray-400 text-sm">
              <div className="group-hover:hidden">{index + 1}</div>
              <button 
                className="hidden group-hover:block w-full text-left pl-3 text-white"
                onClick={(e) => {
                  e.stopPropagation();
                  // Aquí iría la lógica para reproducir la canción
                }}
              >
                ▶️
              </button>
            </div>
            <div className="col-span-5 flex items-center">
              <img 
                src={song.coverUrl} 
                alt={song.title} 
                className="w-10 h-10 rounded mr-3"
              />
              <div>
                <div className="text-white font-medium group-hover:text-purple-400">{song.title}</div>
                <div className="text-sm text-gray-400">{song.artist}</div>
              </div>
            </div>
            <div className="col-span-3 text-sm text-gray-400 truncate">
              {song.album || 'Álbum desconocido'}
            </div>
            <div className="col-span-2 text-sm text-gray-400">
              Hace 2 días
            </div>
            <div className="col-span-1 flex items-center justify-end">
              <button 
                className={`p-1 rounded-full ${song.liked ? 'text-green-500' : 'text-gray-400 hover:text-white'}`}
                onClick={(e) => {
                  e.stopPropagation();
                  handleUnlike(e, song.id);
                }}
              >
                <Heart className={`w-4 h-4 ${song.liked ? 'fill-current' : ''}`} />
              </button>
              <span className="text-gray-400 text-sm ml-4">
                {formatDuration(song.duration)}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Página principal de la biblioteca
const LibraryPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<LibraryTab>('recent');
  const [recentlyPlayed, setRecentlyPlayed] = useState<Song[]>([]);
  const [songs, setSongs] = useState<Song[]>([]);
  const [albums, setAlbums] = useState<Album[]>([]);
  const [artists, setArtists] = useState<Artist[]>([]);
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [likedSongs, setLikedSongs] = useState<Song[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Cargar datos de la biblioteca
  useEffect(() => {
    const loadLibraryData = async () => {
      try {
        setIsLoading(true);
        
        // Cargar datos en paralelo
        const [
          recent, 
          songItems, 
          albumItems, 
          artistItems, 
          playlistItems,
          liked
        ] = await Promise.all([
          getRecentlyPlayed(),
          getLibraryItems('song'),
          getLibraryItems('album'),
          getLibraryItems('artist'),
          getLibraryItems('playlist'),
          getLikedSongs()
        ]);
        
        setRecentlyPlayed(recent);
        setSongs(songItems.map(item => item.item as Song));
        setAlbums(albumItems.map(item => item.item as Album));
        setArtists(artistItems.map(item => item.item as Artist));
        setPlaylists(playlistItems.map(item => item.item as Playlist));
        setLikedSongs(liked);
      } catch (error) {
        console.error('Error al cargar la biblioteca:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadLibraryData();
  }, []);

  // Renderizar el contenido según la pestaña activa
  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
        </div>
      );
    }

    switch (activeTab) {
      case 'recent':
        return <RecentlyPlayed songs={recentlyPlayed} />;
      case 'songs':
        return <LibrarySongs songs={songs} />;
      case 'albums':
        return <LibraryAlbums albums={albums} />;
      case 'artists':
        return <LibraryArtists artists={artists} />;
      case 'playlists':
        return <LibraryPlaylists playlists={playlists} />;
      case 'liked':
        return <LikedSongs songs={likedSongs} />;
      default:
        return <RecentlyPlayed songs={recentlyPlayed} />;
    }
  };

  return (
    <div className="p-4 md:p-6 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold text-white mb-6">Tu biblioteca</h1>
      
      {/* Pestañas de navegación */}
      <div className="border-b border-gray-700 mb-6">
        <nav className="flex space-x-6 overflow-x-auto">
          <button
            className={`py-3 px-1 font-medium text-sm whitespace-nowrap ${
              activeTab === 'recent'
                ? 'text-purple-400 border-b-2 border-purple-400'
                : 'text-gray-400 hover:text-white'
            }`}
            onClick={() => setActiveTab('recent')}
          >
            Recientes
          </button>
          <button
            className={`py-3 px-1 font-medium text-sm whitespace-nowrap ${
              activeTab === 'songs'
                ? 'text-purple-400 border-b-2 border-purple-400'
                : 'text-gray-400 hover:text-white'
            }`}
            onClick={() => setActiveTab('songs')}
          >
            Canciones
          </button>
          <button
            className={`py-3 px-1 font-medium text-sm whitespace-nowrap ${
              activeTab === 'albums'
                ? 'text-purple-400 border-b-2 border-purple-400'
                : 'text-gray-400 hover:text-white'
            }`}
            onClick={() => setActiveTab('albums')}
          >
            Álbumes
          </button>
          <button
            className={`py-3 px-1 font-medium text-sm whitespace-nowrap ${
              activeTab === 'artists'
                ? 'text-purple-400 border-b-2 border-purple-400'
                : 'text-gray-400 hover:text-white'
            }`}
            onClick={() => setActiveTab('artists')}
          >
            Artistas
          </button>
          <button
            className={`py-3 px-1 font-medium text-sm whitespace-nowrap ${
              activeTab === 'playlists'
                ? 'text-purple-400 border-b-2 border-purple-400'
                : 'text-gray-400 hover:text-white'
            }`}
            onClick={() => setActiveTab('playlists')}
          >
            Listas
          </button>
          <button
            className={`py-3 px-1 font-medium text-sm whitespace-nowrap ${
              activeTab === 'liked'
                ? 'text-purple-400 border-b-2 border-purple-400'
                : 'text-gray-400 hover:text-white'
            }`}
            onClick={() => setActiveTab('liked')}
          >
            Canciones que te gustan
          </button>
        </nav>
      </div>
      
      {/* Contenido de la pestaña activa */}
      <div className="mt-4">
        {renderContent()}
      </div>
    </div>
  );
};

export default LibraryPage;
