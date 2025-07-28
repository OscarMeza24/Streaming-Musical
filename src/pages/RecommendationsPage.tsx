import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Music, ListMusic, RefreshCw, Sparkles } from 'lucide-react';
import { Song, Album, Playlist } from '../types';
import { getRecommendations } from '../services/libraryService';
import { formatDuration } from '../utils/format';

// Componente para mostrar las canciones recomendadas
const RecommendedSongs: React.FC<{ songs: Song[] }> = ({ songs }) => {
  const navigate = useNavigate();

  if (songs.length === 0) {
    return (
      <div className="text-center py-10">
        <Music className="w-12 h-12 mx-auto text-gray-500 mb-4" />
        <h3 className="text-lg font-medium text-white mb-2">No hay canciones recomendadas</h3>
        <p className="text-gray-400">Escucha más música para obtener recomendaciones personalizadas</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <h3 className="text-xl font-medium text-white mb-4">Canciones recomendadas</h3>
      <div className="bg-gray-800 rounded-lg overflow-hidden">
        {songs.map((song, index) => (
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
            <div className="text-gray-400 text-sm ml-4">
              {formatDuration(song.duration)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Componente para mostrar álbumes recomendados
const RecommendedAlbums: React.FC<{ albums: Album[] }> = ({ albums }) => {
  const navigate = useNavigate();

  if (albums.length === 0) {
    return null;
  }

  return (
    <div>
      <h3 className="text-xl font-medium text-white mb-4">Álbumes recomendados</h3>
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
            <p className="text-gray-500 text-xs mt-1">{album.genre}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

// Componente para mostrar listas de reproducción recomendadas
const RecommendedPlaylists: React.FC<{ playlists: Playlist[] }> = ({ playlists }) => {
  const navigate = useNavigate();

  if (playlists.length === 0) {
    return null;
  }

  return (
    <div>
      <h3 className="text-xl font-medium text-white mb-4">Listas de reproducción para ti</h3>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
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
              {playlist.userId} • {playlist.songs.length} canciones
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

// Componente para mostrar recomendaciones basadas en el estado de ánimo
const MoodRecommendations: React.FC<{ onMoodSelect: (mood: string) => void }> = ({ onMoodSelect }) => {
  const moods = [
    { id: 'happy', name: 'Feliz', emoji: '😊', color: 'from-yellow-500 to-pink-500' },
    { id: 'sad', name: 'Triste', emoji: '😢', color: 'from-blue-500 to-indigo-600' },
    { id: 'energetic', name: 'Energético', emoji: '⚡', color: 'from-orange-500 to-red-500' },
    { id: 'relaxed', name: 'Relajado', emoji: '🌿', color: 'from-teal-400 to-emerald-600' },
    { id: 'focused', name: 'Concentrado', emoji: '🎯', color: 'from-purple-500 to-indigo-600' },
    { id: 'workout', name: 'Entrenamiento', emoji: '💪', color: 'from-red-500 to-orange-500' },
  ];

  return (
    <div className="mb-8">
      <h3 className="text-xl font-medium text-white mb-4">¿Cómo te sientes hoy?</h3>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
        {moods.map((mood) => (
          <button
            key={mood.id}
            onClick={() => onMoodSelect(mood.id)}
            className={`bg-gradient-to-r ${mood.color} p-4 rounded-lg flex flex-col items-center justify-center h-24 hover:opacity-90 transition-opacity`}
          >
            <span className="text-2xl mb-1">{mood.emoji}</span>
            <span className="text-white font-medium text-sm">{mood.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

// Página principal de recomendaciones
const RecommendationsPage: React.FC = () => {
  const [recommendations, setRecommendations] = useState<{
    songs: Song[];
    albums: Album[];
    playlists: Playlist[];
  }>({ songs: [], albums: [], playlists: [] });
  
  const [isLoading, setIsLoading] = useState(true);
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Cargar recomendaciones iniciales
  useEffect(() => {
    const loadRecommendations = async () => {
      try {
        setIsLoading(true);
        const data = await getRecommendations();
        setRecommendations(data);
      } catch (error) {
        console.error('Error al cargar recomendaciones:', error);
      } finally {
        setIsLoading(false);
        setIsRefreshing(false);
      }
    };

    loadRecommendations();
  }, [selectedMood]);

  // Manejar la actualización de recomendaciones
  const handleRefresh = () => {
    setIsRefreshing(true);
    setSelectedMood(null);
  };

  // Manejar la selección de un estado de ánimo
  const handleMoodSelect = (mood: string) => {
    setSelectedMood(mood);
  };

  return (
    <div className="p-4 md:p-6 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <div className="flex items-center">
          <Sparkles className="w-8 h-8 text-purple-500 mr-3" />
          <h1 className="text-2xl font-bold text-white">Recomendaciones para ti</h1>
        </div>
        
        <button
          onClick={handleRefresh}
          disabled={isRefreshing}
          className={`mt-3 md:mt-0 px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-full text-sm font-medium flex items-center ${
            isRefreshing ? 'opacity-70 cursor-not-allowed' : ''
          }`}
        >
          <RefreshCw className={`w-4 h-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
          {isRefreshing ? 'Actualizando...' : 'Actualizar recomendaciones'}
        </button>
      </div>

      {/* Selector de estado de ánimo */}
      <MoodRecommendations onMoodSelect={handleMoodSelect} />

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
        </div>
      ) : (
        <div className="space-y-10">
          {selectedMood && (
            <div className="bg-gradient-to-r from-purple-900/30 to-blue-900/30 p-4 rounded-lg mb-6">
              <h2 className="text-xl font-bold text-white flex items-center">
                <Sparkles className="w-5 h-5 mr-2 text-yellow-400" />
                Recomendaciones para tu estado de ánimo
              </h2>
              <p className="text-gray-300 mt-1">
                Basado en tu selección, aquí tienes canciones que se adaptan a cómo te sientes.
              </p>
            </div>
          )}

          {recommendations.songs.length > 0 && (
            <RecommendedSongs songs={recommendations.songs} />
          )}

          {recommendations.albums.length > 0 && (
            <div className="mt-10">
              <RecommendedAlbums albums={recommendations.albums} />
            </div>
          )}

          {recommendations.playlists.length > 0 && (
            <div className="mt-10">
              <RecommendedPlaylists playlists={recommendations.playlists} />
            </div>
          )}

          {recommendations.songs.length === 0 && 
           recommendations.albums.length === 0 && 
           recommendations.playlists.length === 0 && (
            <div className="text-center py-16 bg-gray-800/50 rounded-xl">
              <Sparkles className="w-12 h-12 mx-auto text-gray-500 mb-4" />
              <h3 className="text-lg font-medium text-white mb-2">No hay recomendaciones disponibles</h3>
              <p className="text-gray-400 max-w-md mx-auto mb-6">
                {selectedMood
                  ? 'No encontramos recomendaciones para este estado de ánimo. Prueba con otro o actualiza las recomendaciones.'
                  : 'Escucha más música para recibir recomendaciones personalizadas.'}
              </p>
              <button
                onClick={handleRefresh}
                className="px-6 py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-full font-medium transition-colors flex items-center mx-auto"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Actualizar recomendaciones
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default RecommendationsPage;
