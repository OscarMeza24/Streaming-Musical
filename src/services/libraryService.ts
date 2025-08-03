import { Song, Album, Artist, Playlist, LibraryItem } from '../types';
import { mockSongs, mockPlaylists } from '../data/mockData';
import { supabase } from '../supabaseClient';

// --- FAVORITOS (SUPABASE) ---

export const toggleSongLikeStatus = async (songId: string, userId: string): Promise<boolean> => {
  const { data: existing, error: fetchError } = await supabase
    .from('liked_songs')
    .select('*')
    .eq('user_id', userId)
    .eq('song_id', songId)
    .single();

  if (fetchError && fetchError.code !== 'PGRST116') throw fetchError;

  if (existing) {
    const { error: deleteError } = await supabase
      .from('liked_songs')
      .delete()
      .eq('user_id', userId)
      .eq('song_id', songId);
    if (deleteError) throw deleteError;
    return false;
  } else {
    const { error: insertError } = await supabase
      .from('liked_songs')
      .insert([{ user_id: userId, song_id: songId }]);
    if (insertError) throw insertError;
    return true;
  }
};

export const getLikedSongs = async (userId: string): Promise<any[]> => {
  const { data: likedRows, error } = await supabase
    .from('liked_songs')
    .select('song_id')
    .eq('user_id', userId);

  if (error) throw error;
  if (!likedRows || likedRows.length === 0) return [];

  const songIds = likedRows.map(row => row.song_id);

  const { data: songs, error: songsError } = await supabase
    .from('songs')
    .select(`
      *,
      album:album_id (
        cover_url,
        title
      ),
      artist:artist_id (
        name
      )
    `)
    .in('id', songIds);

  if (songsError) throw songsError;
  return songs;
};

// --- MOCKS Y RECOMENDACIONES (SOLO PARA DEMO) ---

export const getRecentlyPlayed = (limit: number = 20): Song[] => {
  return [...mockSongs]
    .sort((a, b) => {
      const dateA = new Date(a.addedAt || 0);
      const dateB = new Date(b.addedAt || 0);
      return dateB.getTime() - dateA.getTime();
    })
    .slice(0, limit);
};

// Ahora getRecommendations requiere userId
export const getRecommendations = async (userId: string): Promise<{
  songs: Song[];
  albums: Album[];
  playlists: Playlist[];
}> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  const recentSongs = getRecentlyPlayed(5);
  const likedSongs = await getLikedSongs(userId); // <-- Corrige aquí

  if (recentSongs.length === 0 && likedSongs.length === 0) {
    return {
      songs: mockSongs.slice(0, 5),
      albums: [],
      playlists: mockPlaylists.filter(p => p.isPublic).slice(0, 3)
    };
  }

  const allSongs = [...recentSongs, ...likedSongs];
  const genres = Array.from(new Set(allSongs.map(song => song.genre).filter(Boolean))) as string[];

  if (genres.length === 0) {
    return {
      songs: mockSongs.slice(0, 5),
      albums: [],
      playlists: mockPlaylists.filter(p => p.isPublic).slice(0, 3)
    };
  }

  const recommendedSongs = mockSongs
    .filter(song =>
      !allSongs.some(s => s.id === song.id) &&
      song.genre && genres.includes(song.genre)
    )
    .slice(0, 5);

  const recommendedPlaylists = mockPlaylists
    .filter(playlist =>
      playlist.isPublic &&
      playlist.songs.some(song => song.genre && genres.includes(song.genre))
    )
    .slice(0, 3);

  return {
    songs: recommendedSongs.length > 0 ? recommendedSongs : mockSongs.slice(0, 5),
    albums: [],
    playlists: recommendedPlaylists.length > 0 ? recommendedPlaylists : mockPlaylists.filter(p => p.isPublic).slice(0, 3)
  };
};

// --- HISTORIAL MOCK (puedes migrar esto a Supabase si quieres) ---

let playHistory: { song: Song, playedAt: Date }[] = [];

export const getPlayHistory = async (): Promise<{ song: Song, playedAt: Date }[]> => {
  try {
    const recentlyPlayed = getRecentlyPlayed(20);
    return recentlyPlayed.map((song, index) => ({
      song,
      playedAt: new Date(Date.now() - index * 1000 * 60 * 60)
    }));
  } catch (error) {
    console.error('Error al obtener el historial de reproducción:', error);
    return [];
  }
};

export const clearPlayHistory = async (): Promise<void> => {
  try {
    playHistory = [];
  } catch (error) {
    console.error('Error al limpiar el historial de reproducción:', error);
    throw error;
  }
};

export const addToPlayHistory = (song: Song): void => {
  playHistory.push({ song, playedAt: new Date() });
};