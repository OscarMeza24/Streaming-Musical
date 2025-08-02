import { Song, Playlist, PlayHistory, SearchFilters, SearchResults } from '../types';
import { mockSongs, mockPlaylists, mockRecentPlays, mockTrendingSongs } from '../data/mockData';
import { MockAuthService } from './mockAuthService';

// Local storage keys
const SONGS_KEY = 'streamflow_songs';
const PLAYLISTS_KEY = 'streamflow_playlists';
const PLAY_HISTORY_KEY = 'streamflow_play_history';
const LIKED_SONGS_KEY = 'streamflow_liked_songs';

// Helper functions for local storage
const getStoredSongs = (): Song[] => {
  try {
    const songs = localStorage.getItem(SONGS_KEY);
    return songs ? JSON.parse(songs) : mockSongs;
  } catch {
    return mockSongs;
  }
};

const getStoredPlaylists = (): Playlist[] => {
  try {
    const playlists = localStorage.getItem(PLAYLISTS_KEY);
    return playlists ? JSON.parse(playlists) : mockPlaylists;
  } catch {
    return mockPlaylists;
  }
};

const getPlayHistory = (): PlayHistory[] => {
  try {
    const history = localStorage.getItem(PLAY_HISTORY_KEY);
    return history ? JSON.parse(history) : [];
  } catch {
    return [];
  }
};

const getLikedSongs = (): string[] => {
  try {
    const liked = localStorage.getItem(LIKED_SONGS_KEY);
    return liked ? JSON.parse(liked) : mockSongs.filter(s => s.liked).map(s => s.id);
  } catch {
    return mockSongs.filter(s => s.liked).map(s => s.id);
  }
};

// Simulate network delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export class MockMusicService {
  
  // Song operations
  static async getAllSongs(): Promise<Song[]> {
    await delay(300);
    const songs = getStoredSongs();
    const likedSongIds = new Set(getLikedSongs());
    
    return songs.map(song => ({
      ...song,
      liked: likedSongIds.has(song.id)
    }));
  }

  static async getSongById(id: string): Promise<Song | null> {
    await delay(100);
    const songs = getStoredSongs();
    const song = songs.find(s => s.id === id);
    
    if (!song) return null;
    
    const likedSongIds = new Set(getLikedSongs());
    return {
      ...song,
      liked: likedSongIds.has(song.id)
    };
  }

  static async toggleLikeSong(songId: string): Promise<boolean> {
    await delay(200);
    const user = MockAuthService.getCurrentUser();
    
    if (!user) {
      throw new Error('Usuario no autenticado');
    }

    const likedSongs = getLikedSongs();
    const isLiked = likedSongs.includes(songId);
    
    let newLikedSongs: string[];
    if (isLiked) {
      newLikedSongs = likedSongs.filter(id => id !== songId);
    } else {
      newLikedSongs = [...likedSongs, songId];
    }
    
    localStorage.setItem(LIKED_SONGS_KEY, JSON.stringify(newLikedSongs));
    return !isLiked;
  }

  static async getLikedSongs(): Promise<Song[]> {
    await delay(200);
    const user = MockAuthService.getCurrentUser();
    
    if (!user) {
      throw new Error('Usuario no autenticado');
    }

    const songs = getStoredSongs();
    const likedSongIds = new Set(getLikedSongs());
    
    return songs
      .filter(song => likedSongIds.has(song.id))
      .map(song => ({ ...song, liked: true }));
  }

  // Playlist operations
  static async getUserPlaylists(): Promise<Playlist[]> {
    await delay(300);
    const user = MockAuthService.getCurrentUser();
    
    if (!user) {
      throw new Error('Usuario no autenticado');
    }

    const playlists = getStoredPlaylists();
    return playlists.filter(p => p.userId === user.id);
  }

  static async getPlaylistById(id: string): Promise<Playlist | null> {
    await delay(200);
    const playlists = getStoredPlaylists();
    return playlists.find(p => p.id === id) || null;
  }

  static async createPlaylist(name: string, description?: string): Promise<Playlist> {
    await delay(400);
    const user = MockAuthService.getCurrentUser();
    
    if (!user) {
      throw new Error('Usuario no autenticado');
    }

    const newPlaylist: Playlist = {
      id: `playlist-${Date.now()}`,
      name,
      description: description || '',
      coverUrl: 'https://images.pexels.com/photos/1105666/pexels-photo-1105666.jpeg?auto=compress&cs=tinysrgb&w=400',
      userId: user.id,
      songs: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      isPublic: false,
      totalDuration: 0,
      followersCount: 0,
      isFollowing: false,
      tags: [],
      collaborative: false,
      collaborators: []
    };

    const playlists = getStoredPlaylists();
    playlists.push(newPlaylist);
    localStorage.setItem(PLAYLISTS_KEY, JSON.stringify(playlists));
    
    return newPlaylist;
  }

  static async addSongToPlaylist(playlistId: string, songId: string): Promise<void> {
    await delay(300);
    const user = MockAuthService.getCurrentUser();
    
    if (!user) {
      throw new Error('Usuario no autenticado');
    }

    const playlists = getStoredPlaylists();
    const playlistIndex = playlists.findIndex(p => p.id === playlistId);
    
    if (playlistIndex === -1) {
      throw new Error('Playlist no encontrada');
    }

    const playlist = playlists[playlistIndex];
    
    if (playlist.userId !== user.id) {
      throw new Error('No tienes permisos para modificar esta playlist');
    }

    const songs = getStoredSongs();
    const song = songs.find(s => s.id === songId);
    
    if (!song) {
      throw new Error('Canción no encontrada');
    }

    // Check if song is already in playlist
    if (playlist.songs.some(s => s.id === songId)) {
      throw new Error('La canción ya está en la playlist');
    }

    playlist.songs.push(song);
    playlist.totalDuration += song.duration;
    playlist.updatedAt = new Date().toISOString();
    
    localStorage.setItem(PLAYLISTS_KEY, JSON.stringify(playlists));
  }

  static async removeSongFromPlaylist(playlistId: string, songId: string): Promise<void> {
    await delay(300);
    const user = MockAuthService.getCurrentUser();
    
    if (!user) {
      throw new Error('Usuario no autenticado');
    }

    const playlists = getStoredPlaylists();
    const playlistIndex = playlists.findIndex(p => p.id === playlistId);
    
    if (playlistIndex === -1) {
      throw new Error('Playlist no encontrada');
    }

    const playlist = playlists[playlistIndex];
    
    if (playlist.userId !== user.id) {
      throw new Error('No tienes permisos para modificar esta playlist');
    }

    const songIndex = playlist.songs.findIndex(s => s.id === songId);
    
    if (songIndex === -1) {
      throw new Error('Canción no encontrada en la playlist');
    }

    const removedSong = playlist.songs[songIndex];
    playlist.songs.splice(songIndex, 1);
    playlist.totalDuration -= removedSong.duration;
    playlist.updatedAt = new Date().toISOString();
    
    localStorage.setItem(PLAYLISTS_KEY, JSON.stringify(playlists));
  }

  static async deletePlaylist(playlistId: string): Promise<void> {
    await delay(300);
    const user = MockAuthService.getCurrentUser();
    
    if (!user) {
      throw new Error('Usuario no autenticado');
    }

    const playlists = getStoredPlaylists();
    const playlistIndex = playlists.findIndex(p => p.id === playlistId);
    
    if (playlistIndex === -1) {
      throw new Error('Playlist no encontrada');
    }

    const playlist = playlists[playlistIndex];
    
    if (playlist.userId !== user.id) {
      throw new Error('No tienes permisos para eliminar esta playlist');
    }

    playlists.splice(playlistIndex, 1);
    localStorage.setItem(PLAYLISTS_KEY, JSON.stringify(playlists));
  }

  // Search functionality
  static async searchSongs(filters: Partial<SearchFilters>): Promise<SearchResults> {
    await delay(400);
    
    const allSongs = await this.getAllSongs();
    const allPlaylists = getStoredPlaylists();
    
    let filteredSongs = allSongs;
    let filteredPlaylists = allPlaylists;

    // Apply text search
    if (filters.query) {
      const query = filters.query.toLowerCase();
      filteredSongs = filteredSongs.filter(song =>
        song.title.toLowerCase().includes(query) ||
        song.artist.toLowerCase().includes(query) ||
        song.album?.toLowerCase().includes(query) ||
        song.genre.toLowerCase().includes(query)
      );
      
      filteredPlaylists = filteredPlaylists.filter(playlist =>
        playlist.name.toLowerCase().includes(query) ||
        playlist.description?.toLowerCase().includes(query)
      );
    }

    // Apply genre filter
    if (filters.genre) {
      filteredSongs = filteredSongs.filter(song => 
        song.genre.toLowerCase() === filters.genre!.toLowerCase()
      );
    }

    // Apply year filter
    if (filters.year) {
      filteredSongs = filteredSongs.filter(song => song.year === filters.year);
    }

    // Apply duration filter
    if (filters.duration) {
      const { min, max } = filters.duration;
      filteredSongs = filteredSongs.filter(song => {
        if (min && song.duration < min) return false;
        if (max && song.duration > max) return false;
        return true;
      });
    }

    // Apply sorting
    if (filters.sortBy) {
      filteredSongs.sort((a, b) => {
        let aVal: any, bVal: any;
        
        switch (filters.sortBy) {
          case 'title':
            aVal = a.title.toLowerCase();
            bVal = b.title.toLowerCase();
            break;
          case 'artist':
            aVal = a.artist.toLowerCase();
            bVal = b.artist.toLowerCase();
            break;
          case 'year':
            aVal = a.year || 0;
            bVal = b.year || 0;
            break;
          case 'duration':
            aVal = a.duration;
            bVal = b.duration;
            break;
          case 'plays':
            aVal = a.plays || 0;
            bVal = b.plays || 0;
            break;
          default:
            return 0;
        }
        
        if (filters.sortOrder === 'desc') {
          return bVal > aVal ? 1 : bVal < aVal ? -1 : 0;
        } else {
          return aVal > bVal ? 1 : aVal < bVal ? -1 : 0;
        }
      });
    }

    // Apply pagination
    const limit = filters.limit || 50;
    const offset = filters.offset || 0;
    const paginatedSongs = filteredSongs.slice(offset, offset + limit);

    return {
      songs: paginatedSongs,
      albums: [], // TODO: Implement albums
      artists: [], // TODO: Implement artists
      playlists: filteredPlaylists.slice(0, 10), // Limit playlists for now
      users: [], // TODO: Implement user search
      total: filteredSongs.length,
      query: filters.query || '',
      filters: filters as SearchFilters
    };
  }

  // Play history
  static async addToPlayHistory(songId: string): Promise<void> {
    await delay(100);
    const user = MockAuthService.getCurrentUser();
    
    if (!user) return; // Don't throw error, just silently fail

    const song = await this.getSongById(songId);
    if (!song) return;

    const history = getPlayHistory();
    const newEntry: PlayHistory = {
      id: `history-${Date.now()}`,
      userId: user.id,
      songId,
      song,
      playedAt: new Date().toISOString(),
      duration: song.duration,
      context: {
        type: 'search',
        name: 'Manual Play'
      }
    };

    // Remove previous entry of the same song to avoid duplicates
    const filteredHistory = history.filter(h => h.songId !== songId || h.userId !== user.id);
    filteredHistory.unshift(newEntry);

    // Keep only last 100 entries
    const limitedHistory = filteredHistory.slice(0, 100);
    localStorage.setItem(PLAY_HISTORY_KEY, JSON.stringify(limitedHistory));
  }

  static async getPlayHistory(): Promise<PlayHistory[]> {
    await delay(200);
    const user = MockAuthService.getCurrentUser();
    
    if (!user) {
      throw new Error('Usuario no autenticado');
    }

    const history = getPlayHistory();
    return history
      .filter(h => h.userId === user.id)
      .sort((a, b) => new Date(b.playedAt).getTime() - new Date(a.playedAt).getTime());
  }

  // Trending and recommendations
  static async getTrendingSongs(): Promise<Song[]> {
    await delay(300);
    const likedSongIds = new Set(getLikedSongs());
    
    return mockTrendingSongs.map(song => ({
      ...song,
      liked: likedSongIds.has(song.id)
    }));
  }

  static async getRecommendations(): Promise<Song[]> {
    await delay(400);
    // Simple recommendation algorithm based on liked songs
    const user = MockAuthService.getCurrentUser();
    
    if (!user) {
      return this.getTrendingSongs();
    }

    const likedSongs = await this.getLikedSongs();
    const allSongs = await this.getAllSongs();
    
    if (likedSongs.length === 0) {
      return this.getTrendingSongs();
    }

    // Get genres from liked songs
    const likedGenres = [...new Set(likedSongs.map(s => s.genre))];
    
    // Recommend songs from similar genres that aren't already liked
    const recommendations = allSongs
      .filter(song => 
        likedGenres.includes(song.genre) && 
        !likedSongs.some(liked => liked.id === song.id)
      )
      .sort(() => Math.random() - 0.5) // Randomize
      .slice(0, 20);

    return recommendations;
  }

  static async getRecentlyPlayed(): Promise<Song[]> {
    await delay(200);
    const history = await this.getPlayHistory();
    const uniqueSongs = new Map<string, Song>();
    
    // Get unique songs from history, maintaining order
    history.forEach(entry => {
      if (!uniqueSongs.has(entry.songId)) {
        uniqueSongs.set(entry.songId, entry.song);
      }
    });

    return Array.from(uniqueSongs.values()).slice(0, 20);
  }
}