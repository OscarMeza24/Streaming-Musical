import { Song, Album, Artist, Playlist, LibraryItem } from '../types';
import { mockSongs, mockPlaylists } from '../data/mockData';

// Simular datos de la biblioteca del usuario
const userLibrary: LibraryItem[] = [];

// Función para actualizar el estado de un ítem en la biblioteca
const updateItemLibraryStatus = (item: LibraryItem, isInLibrary: boolean): void => {
  if (item.type === 'song') {
    const song = item.item as Song;
    song.isInLibrary = isInLibrary;
  } else if (item.type === 'playlist') {
    const playlist = item.item as Playlist;
    playlist.isFollowing = isInLibrary;
  } else if (item.type === 'album') {
    const album = item.item as Album;
    album.isInLibrary = isInLibrary;
  } else if (item.type === 'artist') {
    const artist = item.item as Artist;
    artist.isFollowing = isInLibrary;
  }
};

// Función para agregar un ítem a la biblioteca
export const addToLibrary = (item: LibraryItem): void => {
  // Evitar duplicados
  if (!userLibrary.some(i => i.id === item.id)) {
    userLibrary.push(item);
    // Actualizar el estado de isInLibrary o isFollowing en los datos originales
    updateItemLibraryStatus(item, true);
  }
};

export const removeFromLibrary = (itemId: string): void => {
  const index = userLibrary.findIndex(item => item.id === itemId);
  if (index !== -1) {
    const item = userLibrary[index];
    userLibrary.splice(index, 1);
    // Actualizar el estado de isInLibrary o isFollowing en los datos originales
    updateItemLibraryStatus(item, false);
  }
};

// Inicializar con algunos datos de ejemplo
const initializeLibrary = () => {
  // Agregar algunas canciones a la biblioteca
  mockSongs
    .filter(song => song.isInLibrary)
    .forEach(song => {
      addToLibrary({
        id: `song_${song.id}`,
        type: 'song',
        addedAt: song.addedAt || new Date().toISOString(),
        item: song
      });
    });

  // Agregar algunas listas de reproducción a la biblioteca
  mockPlaylists
    .filter(playlist => playlist.isFollowing)
    .forEach(playlist => {
      addToLibrary({
        id: `playlist_${playlist.id}`,
        type: 'playlist',
        addedAt: new Date().toISOString(),
        item: playlist
      });
    });
};

// Inicializar la biblioteca al cargar el módulo
initializeLibrary();

// Obtener recomendaciones basadas en el historial y gustos del usuario
export const getRecommendations = async (): Promise<{
  songs: Song[];
  albums: Album[];
  playlists: Playlist[];
}> => {
  // Simular un retraso de red
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Obtener canciones recientemente reproducidas
  const recentSongs = getRecentlyPlayed(5);
  
  // Obtener canciones que le gustan al usuario
  const likedSongs = getLikedSongs();
  
  // Si no hay historial ni canciones gustadas, devolver recomendaciones populares
  if (recentSongs.length === 0 && likedSongs.length === 0) {
    return {
      songs: mockSongs.slice(0, 5), // 5 canciones populares
      albums: [], // No hay datos de álbumes en los mocks actuales
      playlists: mockPlaylists.filter(p => p.isPublic).slice(0, 3) // 3 listas públicas
    };
  }
  
  // Obtener géneros de las canciones recientes y gustadas
  const allSongs = [...recentSongs, ...likedSongs];
  const genres = Array.from(new Set(allSongs.map(song => song.genre).filter(Boolean))) as string[];
  
  // Si no hay géneros, devolver recomendaciones populares
  if (genres.length === 0) {
    return {
      songs: mockSongs.slice(0, 5),
      albums: [],
      playlists: mockPlaylists.filter(p => p.isPublic).slice(0, 3)
    };
  }
  
  // Filtrar canciones por género similar (excluyendo las que ya están en la biblioteca)
  const recommendedSongs = mockSongs
    .filter(song => 
      !allSongs.some(s => s.id === song.id) && // No incluir canciones ya escuchadas
      song.genre && genres.includes(song.genre) // Coincidencia de género
    )
    .slice(0, 5);
  
  // Filtrar listas de reproducción públicas por género similar
  const recommendedPlaylists = mockPlaylists
    .filter(playlist => 
      playlist.isPublic && 
      playlist.songs.some(song => song.genre && genres.includes(song.genre))
    )
    .slice(0, 3);
  
  return {
    songs: recommendedSongs.length > 0 ? recommendedSongs : mockSongs.slice(0, 5),
    albums: [], // No hay datos de álbumes en los mocks actuales
    playlists: recommendedPlaylists.length > 0 ? recommendedPlaylists : 
      mockPlaylists.filter(p => p.isPublic).slice(0, 3)
  };
};

export const getLibraryItems = (type?: 'song' | 'album' | 'artist' | 'playlist'): LibraryItem[] => {
  if (type) {
    return userLibrary.filter(item => item.type === type);
  }
  return [...userLibrary];
};

export const isInLibrary = (itemId: string, type: 'song' | 'album' | 'artist' | 'playlist'): boolean => {
  return userLibrary.some(item => {
    if (item.type !== type) return false;
    
    switch (type) {
      case 'song':
        return (item.item as Song).id === itemId;
      case 'album':
        return (item.item as Album).id === itemId;
      case 'artist':
        return (item.item as Artist).id === itemId;
      case 'playlist':
        return (item.item as Playlist).id === itemId;
      default:
        return false;
    }
  });
};

export const getRecentlyPlayed = (limit: number = 20): Song[] => {
  // En una implementación real, esto vendría de un historial de reproducción
  return [...mockSongs]
    .sort((a, b) => {
      const dateA = new Date(a.addedAt || 0);
      const dateB = new Date(b.addedAt || 0);
      return dateB.getTime() - dateA.getTime();
    })
    .slice(0, limit);
};

export const getLikedSongs = (): Song[] => {
  return mockSongs.filter(song => song.liked);
};

export const toggleLikeSong = (songId: string): boolean => {
  const song = mockSongs.find(s => s.id === songId);
  if (song) {
    song.liked = !song.liked;
    return song.liked;
  }
  return false;
};

// Almacenamiento local para el historial de reproducción
let playHistory: {song: Song, playedAt: Date}[] = [];

/**
 * Obtiene el historial de reproducción del usuario
 */
export const getPlayHistory = async (): Promise<{song: Song, playedAt: Date}[]> => {
  try {
    // En una implementación real, esto vendría de una base de datos o localStorage
    // Por ahora, devolvemos las canciones recientemente reproducidas con fechas simuladas
    const recentlyPlayed = getRecentlyPlayed(20);
    return recentlyPlayed.map((song, index) => ({
      song,
      playedAt: new Date(Date.now() - index * 1000 * 60 * 60) // Fechas simuladas
    }));
  } catch (error) {
    console.error('Error al obtener el historial de reproducción:', error);
    return [];
  }
};

/**
 * Limpia el historial de reproducción
 */
export const clearPlayHistory = async (): Promise<void> => {
  try {
    // En una implementación real, aquí se limpiaría el historial de la base de datos
    playHistory = [];
  } catch (error) {
    console.error('Error al limpiar el historial de reproducción:', error);
    throw error;
  }
};

export const addToPlayHistory = (song: Song): void => {
  playHistory.push({ song, playedAt: new Date() });
};