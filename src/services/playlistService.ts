import { v4 as uuidv4 } from 'uuid';
import { Playlist, Song } from '../types';
import { mockPlaylists } from '../data/mockData';

// Simular almacenamiento de listas de reproducción
const playlists: Playlist[] = [...mockPlaylists];

// Obtener todas las listas de reproducción públicas
export const getPublicPlaylists = (): Playlist[] => {
  return playlists.filter(playlist => playlist.isPublic);
};

// Obtener listas de reproducción de un usuario
export const getUserPlaylists = (userId: string): Playlist[] => {
  return playlists.filter(playlist => playlist.userId === userId);
};

// Obtener una lista de reproducción por ID
export const getPlaylistById = (id: string): Playlist | undefined => {
  return playlists.find(playlist => playlist.id === id);
};

// Crear una nueva lista de reproducción
export const createPlaylist = (data: {
  name: string;
  description?: string;
  userId: string;
  isPublic?: boolean;
  collaborative?: boolean;
  coverUrl?: string;
}): Playlist => {
  const now = new Date().toISOString();
  
  const newPlaylist: Playlist = {
    id: uuidv4(),
    name: data.name,
    description: data.description || '',
    coverUrl: data.coverUrl || 'https://images.pexels.com/photos/1105666/pexels-photo-1105666.jpeg?auto=compress&cs=tinysrgb&w=400',
    userId: data.userId,
    songs: [],
    createdAt: now,
    updatedAt: now,
    isPublic: data.isPublic !== undefined ? data.isPublic : true,
    totalDuration: 0,
    followersCount: 0,
    isFollowing: false,
    tags: [],
    collaborative: data.collaborative || false,
    collaborators: [],
  };
  
  playlists.push(newPlaylist);
  return newPlaylist;
};

// Actualizar una lista de reproducción
export const updatePlaylist = (
  id: string, 
  updates: Partial<Omit<Playlist, 'id' | 'userId' | 'createdAt' | 'songs'>>
): Playlist | null => {
  const index = playlists.findIndex(p => p.id === id);
  
  if (index === -1) return null;
  
  const updatedPlaylist: Playlist = {
    ...playlists[index],
    ...updates,
    updatedAt: new Date().toISOString(),
  };
  
  playlists[index] = updatedPlaylist;
  return updatedPlaylist;
};

// Eliminar una lista de reproducción
export const deletePlaylist = (id: string, userId: string): boolean => {
  const index = playlists.findIndex(p => p.id === id && p.userId === userId);
  
  if (index === -1) return false;
  
  playlists.splice(index, 1);
  return true;
};

// Agregar canciones a una lista de reproducción
export const addSongsToPlaylist = (
  playlistId: string, 
  songIds: string[], 
  userId: string
): Playlist | null => {
  const playlist = playlists.find(p => p.id === playlistId);
  
  if (!playlist) return null;
  
  // Verificar permisos (solo el propietario o colaboradores pueden editar)
  if (playlist.userId !== userId && !playlist.collaborators?.includes(userId)) {
    return null;
  }
  
  // En una implementación real, buscaríamos las canciones por sus IDs
  // Aquí simulamos que ya tenemos las canciones
  const songsToAdd = songIds.map(id => ({
    id,
    title: `Canción ${id}`,
    artist: 'Artista',
    genre: 'Género',
    duration: 180,
    fileUrl: '',
    year: 2024,
  } as Song));
  
  // Filtrar canciones que ya están en la lista
  const existingSongIds = new Set(playlist.songs.map(s => s.id));
  const newSongs = songsToAdd.filter(song => !existingSongIds.has(song.id));
  
  // Actualizar la lista
  playlist.songs = [...playlist.songs, ...newSongs];
  playlist.updatedAt = new Date().toISOString();
  playlist.totalDuration = playlist.songs.reduce((sum, song) => sum + (song.duration || 0), 0);
  
  return playlist;
};

// Eliminar canciones de una lista de reproducción
export const removeSongsFromPlaylist = (
  playlistId: string, 
  songIds: string[], 
  userId: string
): Playlist | null => {
  const playlist = playlists.find(p => p.id === playlistId);
  
  if (!playlist) return null;
  
  // Verificar permisos
  if (playlist.userId !== userId && !playlist.collaborators?.includes(userId)) {
    return null;
  }
  
  // Filtrar las canciones a eliminar
  const songIdsToRemove = new Set(songIds);
  playlist.songs = playlist.songs.filter(song => !songIdsToRemove.has(song.id));
  
  // Actualizar metadatos
  playlist.updatedAt = new Date().toISOString();
  playlist.totalDuration = playlist.songs.reduce((sum, song) => sum + (song.duration || 0), 0);
  
  return playlist;
};

// Seguir/Dejar de seguir una lista de reproducción
export const toggleFollowPlaylist = (playlistId: string, userId: string): boolean => {
  const playlist = playlists.find(p => p.id === playlistId);
  
  if (!playlist) return false;
  
  // No puedes seguir tu propia lista
  if (playlist.userId === userId) return false;
  
  if (playlist.isFollowing) {
    // Dejar de seguir
    playlist.followersCount = Math.max(0, playlist.followersCount - 1);
  } else {
    // Seguir
    playlist.followersCount += 1;
  }
  
  playlist.isFollowing = !playlist.isFollowing;
  return playlist.isFollowing;
};

// Agregar colaborador a una lista de reproducción
export const addCollaborator = (playlistId: string, userId: string, collaboratorId: string): boolean => {
  const playlist = playlists.find(p => p.id === playlistId);
  
  if (!playlist || playlist.userId !== userId) return false;
  
  // Evitar duplicados
  if (!playlist.collaborators?.includes(collaboratorId)) {
    playlist.collaborators?.push(collaboratorId);
    playlist.updatedAt = new Date().toISOString();
    return true;
  }
  
  return false;
};

// Eliminar colaborador de una lista de reproducción
export const removeCollaborator = (playlistId: string, userId: string, collaboratorId: string): boolean => {
  const playlist = playlists.find(p => p.id === playlistId);
  
  if (!playlist || playlist.userId !== userId) return false;
  
  const initialLength = playlist.collaborators?.length || 0;
  playlist.collaborators = playlist.collaborators?.filter(id => id !== collaboratorId);
  
  if (playlist.collaborators?.length !== initialLength) {
    playlist.updatedAt = new Date().toISOString();
    return true;
  }
  
  return false;
};
