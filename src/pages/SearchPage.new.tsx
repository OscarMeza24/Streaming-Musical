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
              genre: e.target.value 
            })}
          >
            <option value="">Todos los géneros</option>
            {genres.map((genre) => (
              <option key={genre} value={genre.toLowerCase()}>
                {genre}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">Ordenar por</label>
          <select
            className="w-full bg-gray-700 text-white rounded px-3 py-2 text-sm"
            value={`${filters.sortBy}:${filters.sortOrder}`}
            onChange={(e) => {
              const [sortBy, sortOrder] = e.target.value.split(':');
              onFilterChange({ 
                ...filters,
                sortBy: sortBy as SearchFilters['sortBy'],
                sortOrder: sortOrder as SearchFilters['sortOrder']
              });
            }}
          >
            <option value="relevance:desc">Relevancia</option>
            <option value="date:desc">Más recientes</option>
            <option value="date:asc">Más antiguos</option>
            <option value="title:asc">Título (A-Z)</option>
            <option value="title:desc">Título (Z-A)</option>
          </select>
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
  if (results.total === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-400">No se encontraron resultados para tu búsqueda.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Resultados de canciones */}
      {results.songs.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold text-white mb-4">Canciones</h2>
          <div className="space-y-2">
            {results.songs.map((song) => (
              <div key={song.id} className="flex items-center p-3 hover:bg-gray-800 rounded-lg">
                <div className="flex-shrink-0 w-12 h-12 bg-gray-700 rounded-md flex items-center justify-center">
                  <Music className="w-6 h-6 text-gray-400" />
                </div>
                <div className="ml-4 flex-1">
                  <h3 className="text-white font-medium">{song.title}</h3>
                  <p className="text-sm text-gray-400">{song.artist}</p>
                </div>
                <div className="text-sm text-gray-400">
                  {formatDuration(song.duration)}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Resultados de álbumes */}
      {results.albums.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold text-white mb-4">Álbumes</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {results.albums.map((album) => (
              <div key={album.id} className="group">
                <div className="aspect-square bg-gray-700 rounded-md overflow-hidden mb-2">
                  {album.coverUrl ? (
                    <img 
                      src={album.coverUrl} 
                      alt={album.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Disc className="w-12 h-12 text-gray-400" />
                    </div>
                  )}
                </div>
                <h3 className="text-white font-medium truncate">{album.title}</h3>
                <p className="text-sm text-gray-400 truncate">{album.artist}</p>
                <p className="text-xs text-gray-500">{new Date(album.releaseDate).getFullYear()}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Resultados de artistas */}
      {results.artists.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold text-white mb-4">Artistas</h2>
          <div className="grid grid-cols-3 md:grid-cols-5 lg:grid-cols-8 gap-6">
            {results.artists.map((artist) => (
              <div key={artist.id} className="text-center group">
                <div className="w-20 h-20 mx-auto rounded-full bg-gray-700 overflow-hidden mb-2">
                  {artist.coverUrl ? (
                    <img 
                      src={artist.coverUrl} 
                      alt={artist.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Users className="w-8 h-8 text-gray-400" />
                    </div>
                  )}
                </div>
                <h3 className="text-white font-medium text-sm truncate">{artist.name}</h3>
                <p className="text-xs text-gray-400">Artista</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Resultados de listas de reproducción */}
      {results.playlists.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold text-white mb-4">Listas de reproducción</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {results.playlists.map((playlist) => (
              <div key={playlist.id} className="group">
                <div className="aspect-square bg-gray-700 rounded-md overflow-hidden mb-2">
                  {playlist.coverUrl ? (
                    <img 
                      src={playlist.coverUrl} 
                      alt={playlist.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <ListMusic className="w-12 h-12 text-gray-400" />
                    </div>
                  )}
                </div>
                <h3 className="text-white font-medium truncate">{playlist.name}</h3>
                <p className="text-sm text-gray-400">{playlist.userId}</p>
                <p className="text-xs text-gray-500">{playlist.songs.length} canciones</p>
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
  // Obtener parámetros de búsqueda de la URL
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const initialQuery = searchParams.get('q') || '';
  
  // Estados
  const [query, setQuery] = useState(initialQuery);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  // Inicializar filtros con valores por defecto
  const [filters, setFilters] = useState<SearchFilters>({
    query: initialQuery,
    type: 'all',
    genre: '',
    sortBy: 'relevance',
    sortOrder: 'desc',
    year: undefined,
    artist: ''
  });
  
  // Estado para los resultados de búsqueda
  const [results, setResults] = useState<SearchResults>({
    songs: [],
    albums: [],
    artists: [],
    playlists: [],
    users: [],
    total: 0,
    query: '',
    filters: { ...filters }
  });

  // Actualizar la URL cuando cambia la consulta
  useEffect(() => {
    if (query.trim()) {
      navigate(`/search?q=${encodeURIComponent(query.trim())}`, { replace: true });
    } else {
      navigate('/search', { replace: true });
    }
  }, [query, navigate]);

  // Realizar la búsqueda cuando cambian los filtros
  useEffect(() => {
    let isMounted = true;
    
    const performSearch = async () => {
      if (!filters.query?.trim()) {
        if (isMounted) {
          setResults(prev => ({
            ...prev,
            songs: [],
            albums: [],
            artists: [],
            playlists: [],
            users: [],
            total: 0,
            query: '',
            filters: { ...filters }
          }));
        }
        return;
      }

      setIsLoading(true);
      
      try {
        const searchResults = await search(filters);
        if (isMounted) {
          setResults(prev => ({
            ...prev,
            ...searchResults,
            query: filters.query || '',
            filters: { ...filters }
          }));
        }
      } catch (error) {
        console.error('Error al buscar:', error);
        if (isMounted) {
          setResults(prev => ({
            ...prev,
            songs: [],
            albums: [],
            artists: [],
            playlists: [],
            users: [],
            total: 0,
            query: filters.query || '',
            filters: { ...filters }
          }));
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
      <div className="mb-8">
        <form onSubmit={handleSearch} className="relative">
          <div className="relative">
            <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setShowSuggestions(true);
              }}
              onFocus={() => query.trim() && setShowSuggestions(true)}
              onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
              placeholder="Busca canciones, álbumes, artistas..."
              className="w-full pl-10 pr-10 py-3 rounded-full bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
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
          {showSuggestions && (
            <SearchSuggestions 
              query={query} 
              onSelect={handleSelectSuggestion} 
            />
          )}
        </form>
      </div>

      {/* Filtros de búsqueda */}
      <SearchFilters 
        filters={filters}
        onFilterChange={(newFilters) => setFilters(prev => ({ ...prev, ...newFilters }))}
      />

      {/* Resultados de búsqueda */}
      <div className="mt-8">
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
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
