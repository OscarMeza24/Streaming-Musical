import { supabase } from '../lib/supabase';
import { Song } from '../types';

// Interfaz temporal para las canciones con artista
interface SongWithArtist extends Omit<Song, 'artist' | 'fileUrl'> {
  artist: {
    name: string;
  };
  song_url?: string;
  fileUrl?: string;
}

// Función para convertir SongWithArtist a Song
const toSong = (song: SongWithArtist): Song => ({
  ...song,
  artist: song.artist?.name || 'Artista desconocido',
  fileUrl: song.song_url || song.fileUrl || ''
});

/**
 * Obtiene todas las canciones del catálogo.
 * También verifica cuáles de esas canciones ya le gustan al usuario actual.
 */
export const getAllSongs = async (): Promise<Song[]> => {
  try {
    console.log('🔍 Obteniendo canciones...');
    
    // 1. Primero obtener solo las canciones
    const { data: songs, error: songsError } = await supabase
      .from('songs')
      .select('*')
      .order('created_at', { ascending: false });

    if (songsError) throw songsError;
    if (!songs?.length) return [];

    // 2. Obtener IDs únicos de artistas y álbumes
    const artistIds = [...new Set(songs.map(s => s.artist_id).filter(Boolean))];
    const albumIds = [...new Set(songs.map(s => s.album_id).filter(Boolean))];

    // 3. Cargar artistas
    let artists: any[] = [];
    if (artistIds.length > 0) {
      try {
        const { data: artistsData, error } = await supabase
          .from('artists')
          .select('*')
          .in('id', artistIds);
          
        if (error) {
          console.warn('⚠️ No se pudieron cargar los artistas:', error.message);
        } else if (artistsData) {
          artists = artistsData;
          console.log(`✅ Se cargaron ${artists.length} artistas`);
        }
      } catch (error) {
        console.error('⚠️ Error al cargar artistas:', error);
      }
    }
    
    // 4. Cargar álbumes
    let albums: any[] = [];
    if (albumIds.length > 0) {
      try {
        const { data: albumsData, error } = await supabase
          .from('albums')
          .select('*')
          .in('id', albumIds);
          
        if (error) {
          console.warn('⚠️ No se pudieron cargar los álbumes:', error.message);
        } else if (albumsData) {
          albums = albumsData;
          console.log(`✅ Se cargaron ${albums.length} álbumes`);
        }
      } catch (error) {
        console.error('⚠️ Error al cargar álbumes:', error);
      }
    }

    // 5. Crear mapas para búsqueda rápida con manejo de tipos
    const artistMap = new Map<string, any>((artists || []).map(a => [a.id, a]));
    const albumMap = new Map<string, any>((albums || []).map(a => [a.id, a]));

    // 6. Combinar los datos
    return songs.map(song => {
      const artist = artistMap.get(song.artist_id);
      const album = albumMap.get(song.album_id);

      return {
        id: song.id,
        title: song.title,
        artist: artist?.name || 'Artista desconocido',
        album: album?.title || 'Álbum desconocido',
        duration_seconds: song.duration_seconds || 0,
        genre: song.genre || 'Desconocido',
        fileUrl: song.song_url || song.fileUrl || '',
        coverUrl: album?.cover_url || '',
        liked: false
      };
    });

  } catch (error) {
    console.error('❌ Error en getAllSongs:', error);
    throw error;
  }
};
