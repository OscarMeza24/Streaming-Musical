import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Play } from 'lucide-react';
import { usePlayer } from '../contexts/PlayerContext';
import { mockSongs } from '../data/mockData';
import { formatDuration } from '../utils/format';

const SearchPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [query, setQuery] = useState(searchParams.get('q') || '');
  const { play, setQueue } = usePlayer();

  // Actualizar query cuando cambien los parámetros de URL
  useEffect(() => {
    const urlQuery = searchParams.get('q');
    if (urlQuery) {
      setQuery(urlQuery);
    }
  }, [searchParams]);

  // Obtener resultados
  const getResults = () => {
    if (!query.trim()) return [];

    const lowerQuery = query.toLowerCase();
    return mockSongs.filter(song =>
      song.title.toLowerCase().includes(lowerQuery) ||
      song.artist.toLowerCase().includes(lowerQuery) ||
      (song.album && song.album.toLowerCase().includes(lowerQuery)) ||
      song.genre.toLowerCase().includes(lowerQuery)
    );
  };

  const results = getResults();

  // Función para reproducir canción
  const handlePlaySong = (song: any, index: number) => {
    console.log('Reproduciendo desde búsqueda:', song.title);

    // Configurar la cola con los resultados de búsqueda
    setQueue(results, index);
    play(song);

    console.log(`🎵 Reproduciendo: ${song.title} - ${song.artist}`);
  };

  return (
    <div className="flex-1 bg-gray-900 text-white p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Resultados de Búsqueda</h1>

        {query ? (
          <>
            <div className="mb-6">
              <p className="text-gray-400">
                Mostrando resultados para: <span className="text-white font-medium">"{query}"</span>
              </p>
              <p className="text-gray-500 text-sm">
                {results.length} canción{results.length !== 1 ? 'es' : ''} encontrada{results.length !== 1 ? 's' : ''}
              </p>
            </div>

            {results.length === 0 ? (
              <div className="text-center py-20">
                <h3 className="text-xl text-white mb-3">❌ Sin resultados para "{query}"</h3>
                <p className="text-gray-400">Prueba con otros términos de búsqueda</p>
              </div>
            ) : (
              <div>
                <h3 className="text-2xl font-bold text-white mb-6">🎵 Canciones ({results.length})</h3>
                <div className="space-y-3">
                  {results.map((song, index) => (
                    <div
                      key={song.id}
                      onClick={() => handlePlaySong(song, index)}
                      className="flex items-center p-4 bg-gray-800 hover:bg-gray-700 rounded-lg cursor-pointer transition-all hover:scale-[1.02] group border border-gray-700"
                    >
                      <div className="w-8 text-green-400 text-lg font-bold mr-4">{index + 1}</div>
                      <div className="relative">
                        <img
                          src={song.coverUrl}
                          alt={song.title}
                          className="w-16 h-16 rounded-lg mr-4 border border-gray-600"
                        />
                        <div className="absolute inset-0 bg-black bg-opacity-50 rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity mr-4">
                          <Play className="w-6 h-6 text-white fill-white" />
                        </div>
                      </div>
                      <div className="flex-1">
                        <h4 className="text-white font-bold text-lg group-hover:text-green-400 transition-colors">{song.title}</h4>
                        <p className="text-green-400 text-base">{song.artist}</p>
                        <p className="text-gray-400 text-sm">{song.genre}</p>
                      </div>
                      <div className="text-gray-400 text-base mr-8">{song.album}</div>
                      <div className="text-gray-300 text-base font-mono">{formatDuration(song.duration)}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-20">
            <h2 className="text-2xl font-bold text-white mb-6">🎵 Buscar en StreamFlow</h2>
            <p className="text-gray-400 mb-8">Usa el buscador global en la parte superior para encontrar música, páginas y ajustes</p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 max-w-2xl mx-auto">
              {['Don', 'Luna', 'Rock', 'Jazz', 'Electrónica', 'Tigres', 'Alma', 'move'].map((tag) => (
                <button
                  key={tag}
                  onClick={() => setQuery(tag)}
                  className="p-4 bg-green-600 hover:bg-green-500 text-white rounded-lg text-lg font-medium transition-colors"
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchPage;