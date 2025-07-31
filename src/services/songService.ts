import { supabase } from '../lib/supabase';
import { Song } from '../types';

/**
 * Obtiene todas las canciones del catálogo.
 * También verifica cuáles de esas canciones ya le gustan al usuario actual.
 */
export const getAllSongs = async (): Promise<Song[]> => {
  const { data: { user } } = await supabase.auth.getUser();

  // 1. Obtener todas las canciones del catálogo
  const { data: songsData, error: songsError } = await supabase
    .from('songs')
    .select('*, fileUrl:song_url, artists(name)');

  if (songsError) {
    console.error('Error al obtener las canciones:', songsError);
    throw songsError;
  }

  if (!songsData) {
    return [];
  }

  // Si el usuario no está logueado, devolver las canciones sin el estado de "me gusta"
  if (!user) {
    return songsData.map(song => ({
      ...(song as any),
      artist: song.artists.name,
      liked: false,
    }));
  }

  // 2. Obtener los IDs de las canciones que le gustan al usuario
  const { data: likedSongsData, error: likedSongsError } = await supabase
    .from('liked_songs')
    .select('song_id')
    .eq('user_id', user.id);

  if (likedSongsError) {
    console.error('Error al verificar las canciones que te gustan:', likedSongsError);
    // Devolver las canciones igualmente, aunque no se pueda verificar el "me gusta"
    return songsData.map(song => ({ ...song, artist: song.artists.name, liked: false } as any));
  }

  const likedSongIds = new Set(likedSongsData.map(item => item.song_id));

  // 3. Combinar la información
  return songsData.map(song => ({
    ...(song as any),
    artist: song.artists.name,
    liked: likedSongIds.has(song.id),
  }));
};
