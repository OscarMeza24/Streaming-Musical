import React, { useState, useEffect } from 'react';
import { Search as SearchIcon, X, Music, Play, Heart, Plus, Filter } from 'lucide-react';
import type { SearchFilters, SearchResults, Song } from '../types';
import { MockMusicService } from '../services/mockMusicService';
import { usePlayer } from '../contexts/PlayerContext';
import { formatDuration } from '../utils/format';
import { Button } from '../components/common/Button';
import toast from 'react-hot-toast';

const SearchPage: React.FC = () => {
  const [query, setQuery] = useState('');
  const [filters, setFilters] = useState<Partial<SearchFilters>>({
    sortBy: 'relevance',
    sortOrder: 'desc',
    type: 'all'
  });
  const [results, setResults] = useState<SearchResults | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  
  const { play, setQueue, currentSong, isPlaying } = usePlayer();

  // Search function
  const performSearch = async (searchQuery: string, searchFilters: Partial<SearchFilters> = {}) => {
    if (!searchQuery.trim()) {
      setResults(null);
      return;
    }

    setIsLoading(true);
    try {
      const searchResults = await MockMusicService.searchSongs({
        query: searchQuery,
        ...searchFilters
      });
      setResults(searchResults);
    } catch (error) {
      console.error('Error en búsqueda:', error);
      toast.error('Error al realizar la búsqueda');
      setResults(null);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle search input change
  useEffect(() => {
    const timer = setTimeout(() => {
      performSearch(query, filters);
    }, 300);

    return () => clearTimeout(timer);
  }, [query, filters]);

  // Handle song play
  const handlePlaySong = (song: Song) => {
    if (results?.songs) {
      setQueue(results.songs, results.songs.findIndex(s => s.id === song.id));
    }
    play(song);
  };

  // Handle like toggle
  const handleToggleLike = async (songId: string) => {
    try {
      const newLikedState = await MockMusicService.toggleLikeSong(songId);
      
      // Update results to reflect new liked state
      if (results) {
        setResults({
          ...results,
          songs: results.songs.map(song => 
            song.id === songId ? { ...song, liked: newLikedState } : song
          )
        });
      }
      
      toast.success(newLikedState ? 'Añadida a favoritos' : 'Eliminada de favoritos');
    } catch (error) {
      toast.error('Error al actualizar favoritos');
    }
  };

  const genres = [
    'Electrónica', 'Ambiental', 'Synthwave', 'Naturaleza', 'Psytrance', 'Acústico',
    'Pop', 'Rock', 'Jazz', 'Clásica', 'Hip Hop', 'R&B'
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Buscar</h1>
        <p className="text-gray-400">Descubre nueva música</p>
      </div>

      {/* Search Input */}
      <div className="relative">
        <div className="relative">
          <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="¿Qué quieres escuchar?"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full bg-gray-800 text-white pl-12 pr-12 py-4 rounded-lg text-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>

      {/* Filter Toggle */}
      <div className="flex items-center justify-between">
        <Button
          variant="ghost"
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center gap-2"
        >
          <Filter className="w-4 h-4" />
          Filtros
        </Button>
        
        {results && (
          <p className="text-gray-400 text-sm">
            {results.total} resultados
          </p>
        )}
      </div>

      {/* Filters */}
      {showFilters && (
        <div className="bg-gray-800 rounded-lg p-4 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Genre Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Género</label>
              <select
                value={filters.genre || ''}
                onChange={(e) => setFilters({ ...filters, genre: e.target.value || undefined })}
                className="w-full bg-gray-700 text-white rounded px-3 py-2 text-sm"
              >
                <option value="">Todos los géneros</option>
                {genres.map(genre => (
                  <option key={genre} value={genre}>{genre}</option>
                ))}
              </select>
            </div>

            {/* Sort By */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Ordenar por</label>
              <select
                value={filters.sortBy || 'relevance'}
                onChange={(e) => setFilters({ ...filters, sortBy: e.target.value as SearchFilters['sortBy'] })}
                className="w-full bg-gray-700 text-white rounded px-3 py-2 text-sm"
              >
                <option value="relevance">Relevancia</option>
                <option value="title">Título</option>
                <option value="artist">Artista</option>
                <option value="year">Año</option>
                <option value="plays">Reproducciones</option>
                <option value="duration">Duración</option>
              </select>
            </div>

            {/* Sort Order */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Orden</label>
              <select
                value={filters.sortOrder || 'desc'}
                onChange={(e) => setFilters({ ...filters, sortOrder: e.target.value as 'asc' | 'desc' })}
                className="w-full bg-gray-700 text-white rounded px-3 py-2 text-sm"
              >
                <option value="desc">Descendente</option>
                <option value="asc">Ascendente</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Loading State */}
      {isLoading && (
        <div className="text-center py-12">
          <div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">Buscando...</p>
        </div>
      )}

      {/* No Query State */}
      {!query && !isLoading && (
        <div className="text-center py-12">
          <Music className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-white mb-2">Comienza a buscar</h3>
          <p className="text-gray-400">Busca canciones, artistas, álbumes y más</p>
        </div>
      )}

      {/* No Results */}
      {query && !isLoading && results && results.songs.length === 0 && (
        <div className="text-center py-12">
          <SearchIcon className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-white mb-2">No se encontraron resultados</h3>
          <p className="text-gray-400">Intenta con otros términos de búsqueda</p>
        </div>
      )}

      {/* Results */}
      {results && results.songs.length > 0 && (
        <div className="space-y-6">
          {/* Songs */}
          <div>
            <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
              <Music className="w-5 h-5" />
              Canciones
            </h2>
            <div className="space-y-2">
              {results.songs.map((song, index) => (
                <div
                  key={song.id}
                  className="flex items-center gap-4 p-3 rounded-lg hover:bg-gray-800 transition-colors group"
                >
                  {/* Play Button */}
                  <button
                    onClick={() => handlePlaySong(song)}
                    className="w-10 h-10 rounded-full bg-purple-600 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 hover:bg-purple-700 transition-all"
                  >
                    <Play className="w-4 h-4" />
                  </button>

                  {/* Cover Image */}
                  <img
                    src={song.coverUrl || 'https://images.pexels.com/photos/1105666/pexels-photo-1105666.jpeg?auto=compress&cs=tinysrgb&w=100'}
                    alt={song.title}
                    className="w-12 h-12 rounded-lg object-cover"
                  />

                  {/* Song Info */}
                  <div className="flex-1 min-w-0">
                    <h3 className="text-white font-medium truncate">{song.title}</h3>
                    <p className="text-gray-400 text-sm truncate">{song.artist}</p>
                  </div>

                  {/* Genre */}
                  <div className="hidden md:block">
                    <span className="text-gray-400 text-sm">{song.genre}</span>
                  </div>

                  {/* Duration */}
                  <div className="text-gray-400 text-sm">
                    {formatDuration(song.duration)}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleToggleLike(song.id)}
                      className={song.liked ? 'text-red-500' : 'text-gray-400'}
                    >
                      <Heart className={`w-4 h-4 ${song.liked ? 'fill-current' : ''}`} />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Playlists */}
          {results.playlists.length > 0 && (
            <div>
              <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                <Music className="w-5 h-5" />
                Listas de reproducción
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                {results.playlists.map((playlist) => (
                  <div
                    key={playlist.id}
                    className="bg-gray-800 rounded-lg p-4 hover:bg-gray-750 transition-colors cursor-pointer"
                  >
                    <img
                      src={playlist.coverUrl || 'https://images.pexels.com/photos/1105666/pexels-photo-1105666.jpeg?auto=compress&cs=tinysrgb&w=300'}
                      alt={playlist.name}
                      className="w-full aspect-square rounded-lg object-cover mb-3"
                    />
                    <h3 className="text-white font-medium truncate">{playlist.name}</h3>
                    <p className="text-gray-400 text-sm truncate">{playlist.songs.length} canciones</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchPage;