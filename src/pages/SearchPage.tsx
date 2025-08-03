import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Search as SearchIcon, X, Music, Disc, Users, ListMusic } from 'lucide-react';
import type { SearchFilters, SearchResults } from '../types';
import { search, getSearchSuggestions } from '../services/searchService';
import { formatDuration } from '../utils/format';

// Componente para mostrar sugerencias de búsqueda
interface SearchSuggestionsProps {
  query: string;
  onSelect: (suggestion: string) => void;
}

const SearchSuggestions: React.FC<SearchSuggestionsProps> = ({ query, onSelect }) => {
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (!query.trim()) {
        setSuggestions([]);
        return;
      }

      setIsLoading(true);
      try {
        const results = await getSearchSuggestions(query);
        setSuggestions(results);
      } catch (error) {
        console.error('Error al obtener sugerencias:', error);
        setSuggestions([]);
      } finally {
        setIsLoading(false);
      }
    };

    const timer = setTimeout(fetchSuggestions, 300);
    return () => clearTimeout(timer);
  }, [query]);

  if (!query.trim() || suggestions.length === 0) return null;

  return (
    <div className="absolute z-10 mt-1 w-full bg-gray-800 rounded-lg shadow-lg border border-gray-700 max-h-60 overflow-y-auto">
      {isLoading ? (
        <div className="p-4 text-gray-400">Buscando sugerencias...</div>
      ) : (
        <ul>
          {suggestions.map((suggestion, index) => (
            <li 
              key={index}
              className="px-4 py-2 hover:bg-gray-700 cursor-pointer flex items-center text-gray-200"
              onClick={() => onSelect(suggestion)}
            >
              <SearchIcon className="w-4 h-4 mr-2 text-gray-400" />
              {suggestion}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

// Props para el componente SearchFilters
interface SearchFiltersProps {
  filters: Partial<SearchFilters>;
  onFilterChange: (filters: Partial<SearchFilters>) => void;
}

// Componente para mostrar los filtros de búsqueda
const SearchFilters: React.FC<SearchFiltersProps> = ({ filters, onFilterChange }) => {
  const genres = [
    'Todos', 'Pop', 'Rock', 'Electrónica', 'Hip Hop', 'R&B', 'Jazz', 'Clásica',
    'Reggaetón', 'Salsa', 'Soul', 'Funk', 'Metal', 'Punk', 'Indie', 'Alternativo'
  ];

  return (
    <div className="mb-6 p-4 bg-gray-800 rounded-lg">
      <h3 className="text-white font-medium mb-3">Filtros</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">Tipo</label>
          <select
            className="w-full bg-gray-700 text-white rounded px-3 py-2 text-sm"
            value={filters.type || 'all'}
            onChange={(e) => onFilterChange({ 
              ...filters,
              type: e.target.value as SearchFilters['type'] 
            })}
          >
            <option value="all">Todo</option>
            <option value="songs">Canciones</option>
            <option value="albums">Álbumes</option>
            <option value="artists">Artistas</option>
            <option value="playlists">Listas</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">Género</label>
          <select
            className="w-full bg-gray-700 text-white rounded px-3 py-2 text-sm"
            value={filters.genre || ''}
            onChange={(e) => onFilterChange({ 
              ...filters,
              genre: e.target.value || undefined 
            })}
          >
            {genres.map((genre) => (
              <option key={genre} value={genre === 'Todos' ? '' : genre}>
                {genre}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">Ordenar por</label>
          <div className="flex">
            <select
              className="flex-1 bg-gray-700 text-white rounded-l px-3 py-2 text-sm"
              value={filters.sortBy || 'relevance'}
              onChange={(e) => onFilterChange({ 
                ...filters,
                sortBy: e.target.value as SearchFilters['sortBy'] 
              })}
            >
              <option value="relevance">Relevancia</option>
              <option value="title">Título</option>
              <option value="artist">Artista</option>
              <option value="year">Año</option>
              <option value="popularity">Popularidad</option>
            </select>
            <button
              className="bg-gray-600 hover:bg-gray-500 text-white px-2 rounded-r"
              onClick={() => onFilterChange({ 
                ...filters,
                sortOrder: filters.sortOrder === 'asc' ? 'desc' : 'asc' 
              })}
            >
              {filters.sortOrder === 'asc' ? '↑' : '↓'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Props para el componente SearchResults
interface SearchResultsProps {
  results: SearchResults;
}

// Componente para mostrar los resultados de búsqueda
const SearchResults: React.FC<SearchResultsProps> = ({ results }) => {
  const navigate = useNavigate();

  if (results.total === 0) {
    return (
      <div className="text-center py-10">
        <div className="text-6xl mb-4">🔍</div>
        <h3 className="text-xl font-medium text-white mb-2">No se encontraron resultados</h3>
        <p className="text-gray-400">Intenta con otros términos de búsqueda o ajusta los filtros</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Canciones */}
      {results.songs.length > 0 && (
        <div>
          <h3 className="text-xl font-medium text-white mb-4 flex items-center">
            <Music className="w-5 h-5 mr-2" /> Canciones
          </h3>
          <div className="space-y-2">
            {results.songs.map((song) => (
              <div 
                key={song.id} 
                className="flex items-center p-3 hover:bg-gray-800 rounded-lg cursor-pointer"
                onClick={() => navigate(`/song/${song.id}`)}
              >
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
                  {formatDuration(song.duration_seconds)}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Álbumes */}
      {results.albums.length > 0 && (
        <div>
          <h3 className="text-xl font-medium text-white mb-4 flex items-center">
            <Disc className="w-5 h-5 mr-2" /> Álbumes
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {results.albums.map((album) => (
              <div 
                key={album.id}
                className="bg-gray-800 rounded-lg overflow-hidden hover:bg-gray-700 transition-colors cursor-pointer"
                onClick={() => navigate(`/album/${album.id}`)}
              >
                <img 
                  src={album.coverUrl} 
                  alt={album.title} 
                  className="w-full aspect-square object-cover"
                />
                <div className="p-3">
                  <h4 className="text-white font-medium truncate">{album.title}</h4>
                  <p className="text-gray-400 text-sm truncate">{album.artist}</p>
                  <p className="text-gray-500 text-xs mt-1">{album.trackCount} canciones</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Artistas */}
      {results.artists.length > 0 && (
        <div>
          <h3 className="text-xl font-medium text-white mb-4 flex items-center">
            <Users className="w-5 h-5 mr-2" /> Artistas
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {results.artists.map((artist) => (
              <div 
                key={artist.id}
                className="text-center cursor-pointer group"
                onClick={() => navigate(`/artist/${artist.id}`)}
              >
                <div className="w-full aspect-square rounded-full bg-gray-700 mb-3 overflow-hidden mx-auto group-hover:ring-2 group-hover:ring-purple-500 transition-all">
                  <img 
                    src={artist.avatarUrl} 
                    alt={artist.name} 
                    className="w-full h-full object-cover"
                  />
                </div>
                <h4 className="text-white font-medium group-hover:text-purple-400">{artist.name}</h4>
                <p className="text-gray-400 text-sm">Artista</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Listas de reproducción */}
      {results.playlists.length > 0 && (
        <div>
          <h3 className="text-xl font-medium text-white mb-4 flex items-center">
            <ListMusic className="w-5 h-5 mr-2" /> Listas de reproducción
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {results.playlists.map((playlist) => (
              <div 
                key={playlist.id}
                className="bg-gray-800 rounded-lg overflow-hidden hover:bg-gray-700 transition-colors cursor-pointer"
                onClick={() => navigate(`/playlist/${playlist.id}`)}
              >
                <div className="relative">
                  <img 
                    src={playlist.coverUrl} 
                    alt={playlist.name} 
                    className="w-full aspect-square object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-3">
                    <div>
                      <p className="text-white font-medium">{playlist.name}</p>
                      <p className="text-gray-300 text-xs">{playlist.songs.length} canciones</p>
                    </div>
                  </div>
                </div>
                <div className="p-3">
                <p className="text-gray-400 text-sm truncate">Por {playlist.userId}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// Página principal de búsqueda
const SearchPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const initialQuery = searchParams.get('q') || '';

  // Estados
  const [query, setQuery] = useState(initialQuery);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<SearchResults>({
    songs: [],
    albums: [],
    artists: [],
    playlists: [],
    total: 0,
    query: '',
    users: [],
    filters: {
      query: initialQuery,
      type: 'all',
      genre: '',
      sortBy: 'relevance',
      sortOrder: 'desc'
    }
  });

  // Filtros de búsqueda
  const [filters, setFilters] = useState<Partial<SearchFilters>>({
    query: initialQuery,
    type: 'all',
    genre: '',
    sortBy: 'relevance',
    sortOrder: 'desc'
  });

  // Efecto para realizar la búsqueda cuando cambian los filtros
  useEffect(() => {
    let isMounted = true;
    
    const performSearch = async () => {
      if (!filters.query?.trim()) {
        if (isMounted) {
          setResults({
            songs: [],
            albums: [],
            artists: [],
            playlists: [],
            total: 0,
            query: '',
            users: [],
            filters: { 
              query: '',
              type: 'all',
              genre: '',
              sortBy: 'relevance',
              sortOrder: 'desc'
             }
          });
        }
        return;
      }

      setIsLoading(true);
      
      try {
        const searchResults = await search(
          {
            query: filters.query || '',
            type: filters.type || 'all',
            genre: filters.genre || '',
            sortBy: filters.sortBy || 'relevance',
            sortOrder: filters.sortOrder || 'desc'
          });
        if (isMounted) {
          setResults({
            ...searchResults,
            query: filters.query || '',
              filters: { 
                query: filters.query || '',
                type: filters.type || 'all',
                genre: filters.genre || '',
                sortBy: filters.sortBy || 'relevance',
                sortOrder: filters.sortOrder || 'desc'
              }
          });
        }
      } catch (error) {
        console.error('Error al buscar:', error);
        if (isMounted) {
          setResults({
            songs: [],
            albums: [],
            artists: [],
            playlists: [],
            total: 0,
            query: '',
            users: [],
            filters: { 
              query: '',
              type: 'all',
              genre: '',
              sortBy: 'relevance',
              sortOrder: 'desc'
            }
          });
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    const timer = setTimeout(performSearch, 500);
    return () => {
      isMounted = false;
      clearTimeout(timer);
    };
  }, [filters]);

  // Actualizar los parámetros de la URL cuando cambian los filtros
  useEffect(() => {
    const params = new URLSearchParams();
    
    if (filters.query) params.set('q', filters.query);
    if (filters.type && filters.type !== 'all') params.set('type', filters.type);
    if (filters.genre) params.set('genre', filters.genre);
    if (filters.sortBy && filters.sortBy !== 'relevance') params.set('sortBy', filters.sortBy);
    if (filters.sortOrder && filters.sortOrder !== 'desc') params.set('sortOrder', filters.sortOrder);
    
    // Actualizar la URL sin recargar la página
    navigate(`?${params.toString()}`, { replace: true });
  }, [filters, navigate]);

  // Manejador para el envío del formulario de búsqueda
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setShowSuggestions(false);
    setFilters(prev => ({
      ...prev,
      query: query.trim()
    }));
  };

  // Manejador para seleccionar una sugerencia
  const handleSelectSuggestion = (suggestion: string) => {
    setQuery(suggestion);
    setShowSuggestions(false);
    setFilters(prev => ({
      ...prev,
      query: suggestion
    }));
  };

  // Manejador para limpiar la búsqueda
  const handleClearSearch = () => {
    setQuery('');
    setShowSuggestions(false);
    setFilters(prev => ({
      ...prev,
      query: ''
    }));
  };

  return (
    <div className="p-4 md:p-6 max-w-7xl mx-auto">
      {/* Barra de búsqueda */}
      <div className="mb-8 relative">
        <form onSubmit={handleSearch}>
          <div className="relative">
            <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setShowSuggestions(true);
              }}
              onFocus={() => setShowSuggestions(true)}
              onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
              className="w-full bg-gray-800 text-white rounded-full py-3 pl-10 pr-10 focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="Buscar canciones, álbumes, artistas o listas..."
            />
            {query && (
              <button
                type="button"
                onClick={handleClearSearch}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
        </form>
        
        {/* Mostrar sugerencias */}
        {showSuggestions && query.trim() && (
          <SearchSuggestions 
            query={query}
            onSelect={handleSelectSuggestion}
          />
        )}
      </div>

      {/* Filtros de búsqueda */}
      <SearchFilters 
        filters={filters}
        onFilterChange={(updates) => setFilters(prev => ({ ...prev, ...updates }))}
      />

      {/* Resultados de búsqueda */}
      <div className="mt-6">
        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
          </div>
        ) : (
          <SearchResults results={results} />
        )}
      </div>
    </div>
  );
};

export default SearchPage;