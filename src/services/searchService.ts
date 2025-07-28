import { SearchFilters, SearchResults, Album, Artist, Song, Playlist } from '../types';
import { mockSongs, mockPlaylists } from '../data/mockData';

// Simulación de datos de álbumes y artistas para la búsqueda
const mockAlbums: Album[] = [
  {
    id: 'a1',
    title: 'Noches Estelares',
    artist: 'Luna Rosa',
    artistId: 'ar1',
    coverUrl: 'https://images.pexels.com/photos/1763075/pexels-photo-1763075.jpeg?auto=compress&cs=tinysrgb&w=400',
    releaseDate: '2024-01-15',
    genre: 'Electrónica',
    trackCount: 12,
    duration: 2940, // 49 minutos
    type: 'album',
    copyright: '© 2024 Luna Rosa Records',
    popularity: 85,
    explicit: false,
    addedAt: '2024-01-10T00:00:00Z',
    isInLibrary: true,
    tracks: [], // Se llenará después
  },
  // Más álbumes simulados...
];

const mockArtists: Artist[] = [
  {
    id: 'ar1',
    name: 'Luna Rosa',
    bio: 'Artista de música electrónica con influencias del synthwave y el dream pop.',
    avatarUrl: 'https://images.pexels.com/photos/1763075/pexels-photo-1763075.jpeg?auto=compress&cs=tinysrgb&w=200',
    coverUrl: 'https://images.pexels.com/photos/1105666/pexels-photo-1105666.jpeg?auto=compress&cs=tinysrgb&w=1200',
    followers: 1250000,
    isFollowing: true,
    genres: ['Electrónica', 'Synthwave', 'Dream Pop'],
    popularity: 82,
    monthlyListeners: 2500000,
    albums: [], // Se llenará después
    topTracks: [], // Se llenará después
    relatedArtists: [],
    isVerified: true,
  },
  // Más artistas simulados...
];

// Llenar datos relacionados
mockAlbums[0].tracks = mockSongs.filter(song => song.albumId === 'a1');
mockArtists[0].albums = mockAlbums.filter(album => album.artistId === 'ar1');
mockArtists[0].topTracks = mockSongs.filter(song => song.artist === 'Luna Rosa').slice(0, 5);

export const search = async (filters: SearchFilters): Promise<SearchResults> => {
  // Simular retraso de red
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const query = filters.query.toLowerCase();
  const type = filters.type || 'all';
  
  // Filtrar resultados basados en la consulta
  const filteredSongs = mockSongs.filter(song => 
    (song.title.toLowerCase().includes(query) || 
     song.artist.toLowerCase().includes(query) ||
     song.album?.toLowerCase().includes(query)) &&
    (!filters.genre || song.genre === filters.genre) &&
    (!filters.year || song.year === filters.year) &&
    (filters.explicit === undefined || song.explicit === filters.explicit)
  );

  const filteredAlbums = mockAlbums.filter(album => 
    (album.title.toLowerCase().includes(query) || 
     album.artist.toLowerCase().includes(query)) &&
    (!filters.genre || album.genre === filters.genre)
  );

  const filteredArtists = mockArtists.filter(artist => 
    artist.name.toLowerCase().includes(query) &&
    (!filters.genre || artist.genres.includes(filters.genre))
  );

  const filteredPlaylists = mockPlaylists.filter(playlist => 
    playlist.name.toLowerCase().includes(query) ||
    playlist.description?.toLowerCase().includes(query) ||
    playlist.tags?.some(tag => tag.toLowerCase().includes(query))
  );

  // Type guard to check if an item has a specific property
  const hasProperty = <T extends object, K extends PropertyKey>(
    obj: T,
    prop: K
  ): obj is T & Record<K, unknown> => {
    return prop in obj;
  };

  // Sort function that handles different types and their sortable fields
  const sortResults = <T extends Song | Album | Artist | Playlist>(
    items: T[], 
    sortBy: string, 
    sortOrder: 'asc' | 'desc' = 'asc'
  ): T[] => {
    return [...items].sort((a, b) => {
      // Helper function to safely get a value from an object
      const getSortValue = (item: T, field: string): string | number => {
        // Check if the field exists on the item
        if (hasProperty(item, field)) {
          const value = item[field as keyof T];
          // Convert to string for consistent comparison
          if (value !== null && value !== undefined) {
            return String(value);
          }
        }
        
        // Handle special cases
        if (field === 'name' || field === 'title') {
          if ('name' in item) return String(item.name);
          if ('title' in item) return String(item.title);
        } 
        else if (field === 'popularity' && 'popularity' in item) {
          return Number(item.popularity) || 0;
        }
        else if (field === 'year' && 'releaseDate' in item) {
          return new Date(item.releaseDate).getFullYear() || 0;
        }
        
        return ''; // Default empty string for comparison
      };
      
      // Get the values to compare
      const aValue = getSortValue(a, sortBy);
      const bValue = getSortValue(b, sortBy);
      
      // Handle undefined values
      if (aValue === undefined || aValue === null) return sortOrder === 'asc' ? -1 : 1;
      if (bValue === undefined || bValue === null) return sortOrder === 'asc' ? 1 : -1;
      
      // Compare values
      let comparison = 0;
      if (aValue > bValue) {
        comparison = 1;
      } else if (aValue < bValue) {
        comparison = -1;
      }
      
      return sortOrder === 'asc' ? comparison : -comparison;
    });
  };

  // Aplicar ordenación
  // Map sort fields to the correct field names for each type
  const songSortField = filters.sortBy === 'artist' ? 'artist' : 
                       filters.sortBy === 'year' ? 'year' : 'title';
  
  const albumSortField = filters.sortBy === 'artist' ? 'artist' : 'title';
  
  const sortedSongs = sortResults(filteredSongs, songSortField, filters.sortOrder);
  const sortedAlbums = sortResults(filteredAlbums, albumSortField, filters.sortOrder);
  const sortedArtists = sortResults(filteredArtists, 'name', filters.sortOrder);
  const sortedPlaylists = sortResults(filteredPlaylists, 'name', filters.sortOrder);

  // Aplicar paginación
  const limit = filters.limit || 10;
  const offset = filters.offset || 0;
  
  const paginate = <T>(items: T[]): T[] => {
    return items.slice(offset, offset + limit);
  };

  // Devolver resultados según el tipo de búsqueda
  const results: SearchResults = {
    songs: type === 'all' || type === 'songs' ? paginate(sortedSongs) : [],
    albums: type === 'all' || type === 'albums' ? paginate(sortedAlbums) : [],
    artists: type === 'all' || type === 'artists' ? paginate(sortedArtists) : [],
    playlists: type === 'all' || type === 'playlists' ? paginate(sortedPlaylists) : [],
    users: [], // No implementado en los datos de prueba
    total: filteredSongs.length + filteredAlbums.length + filteredArtists.length + filteredPlaylists.length,
    query: filters.query,
    filters
  };

  return results;
};

export const getSearchSuggestions = async (query: string): Promise<string[]> => {
  // Simular retraso de red
  await new Promise(resolve => setTimeout(resolve, 300));
  
  const lowerQuery = query.toLowerCase();
  const suggestions = new Set<string>();
  
  // Sugerencias de canciones
  mockSongs.forEach(song => {
    if (song.title.toLowerCase().includes(lowerQuery)) {
      suggestions.add(song.title);
    }
    if (song.artist.toLowerCase().includes(lowerQuery)) {
      suggestions.add(song.artist);
    }
  });
  
  // Sugerencias de álbumes
  mockAlbums.forEach(album => {
    if (album.title.toLowerCase().includes(lowerQuery)) {
      suggestions.add(album.title);
    }
  });
  
  // Sugerencias de artistas
  mockArtists.forEach(artist => {
    if (artist.name.toLowerCase().includes(lowerQuery)) {
      suggestions.add(artist.name);
    }
  });
  
  // Sugerencias de géneros
  const allGenres = new Set<string>();
  mockSongs.forEach(song => allGenres.add(song.genre));
  mockArtists.forEach(artist => artist.genres.forEach(g => allGenres.add(g)));
  
  allGenres.forEach(genre => {
    if (genre.toLowerCase().includes(lowerQuery)) {
      suggestions.add(genre);
    }
  });
  
  return Array.from(suggestions).slice(0, 8); // Limitar a 8 sugerencias
};
