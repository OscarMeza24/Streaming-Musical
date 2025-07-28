import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Clock, X, Clock as HistoryIcon } from 'lucide-react';
import { Song } from '../types';
import { getPlayHistory, clearPlayHistory } from '../services/libraryService';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';
import { formatDuration } from '../utils/format';

const HistoryPage: React.FC = () => {
  const [history, setHistory] = useState<{song: Song, playedAt: Date}[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const navigate = useNavigate();

  // Cargar el historial de reproducción
  useEffect(() => {
    const loadHistory = async () => {
      try {
        setIsLoading(true);
        const playHistory = await getPlayHistory();
        setHistory(playHistory);
      } catch (error) {
        console.error('Error al cargar el historial:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadHistory();
  }, []);

  // Manejar la limpieza del historial
  const handleClearHistory = async () => {
    try {
      await clearPlayHistory();
      setHistory([]);
      setShowClearConfirm(false);
    } catch (error) {
      console.error('Error al limpiar el historial:', error);
    }
  };

  // Formatear la fecha relativa
  const formatRelativeTime = (date: Date) => {
    return formatDistanceToNow(new Date(date), { 
      addSuffix: true,
      locale: es 
    });
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 max-w-5xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center">
          <HistoryIcon className="w-8 h-8 text-purple-500 mr-3" />
          <h1 className="text-2xl font-bold text-white">Historial de reproducción</h1>
        </div>
        
        {history.length > 0 && (
          <button
            onClick={() => setShowClearConfirm(true)}
            className="text-sm text-gray-400 hover:text-white px-3 py-1.5 bg-gray-800 rounded-full flex items-center"
          >
            <X className="w-4 h-4 mr-1" />
            Limpiar historial
          </button>
        )}
      </div>

      {showClearConfirm && (
        <div className="bg-gray-800 rounded-lg p-4 mb-6 border border-gray-700">
          <h3 className="text-white font-medium mb-2">¿Eliminar todo el historial de reproducción?</h3>
          <p className="text-gray-400 text-sm mb-4">Esta acción no se puede deshacer. Se eliminarán todas las canciones de tu historial.</p>
          <div className="flex space-x-3">
            <button
              onClick={handleClearHistory}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-full text-sm font-medium transition-colors"
            >
              Eliminar todo
            </button>
            <button
              onClick={() => setShowClearConfirm(false)}
              className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-full text-sm font-medium transition-colors"
            >
              Cancelar
            </button>
          </div>
        </div>
      )}

      {history.length === 0 ? (
        <div className="text-center py-16 bg-gray-800/50 rounded-xl">
          <Clock className="w-12 h-12 mx-auto text-gray-500 mb-4" />
          <h3 className="text-lg font-medium text-white mb-2">No hay nada en tu historial de reproducción</h3>
          <p className="text-gray-400 max-w-md mx-auto">
            Las canciones que escuches aparecerán aquí para que puedas volver a encontrarlas fácilmente.
          </p>
          <button
            onClick={() => navigate('/search')}
            className="mt-6 px-6 py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-full font-medium transition-colors"
          >
            Explorar música
          </button>
        </div>
      ) : (
        <div className="bg-gray-800/50 rounded-xl overflow-hidden">
          <div className="grid grid-cols-12 gap-4 px-6 py-3 text-sm text-gray-400 border-b border-gray-700">
            <div className="col-span-1">#</div>
            <div className="col-span-5">TÍTULO</div>
            <div className="col-span-3">ÁLBUM</div>
            <div className="col-span-2">REPRODUCIDA</div>
            <div className="col-span-1 text-right">
              <Clock className="w-4 h-4 inline" />
            </div>
          </div>

          <div className="divide-y divide-gray-700/50">
            {history.map((entry, index) => (
              <div 
                key={`${entry.song.id}-${entry.playedAt}`}
                className="grid grid-cols-12 gap-4 px-6 py-3 items-center hover:bg-gray-700/30 group cursor-pointer"
                onClick={() => navigate(`/song/${entry.song.id}`)}
              >
                <div className="col-span-1 text-gray-400 text-sm">
                  <div className="group-hover:hidden">{index + 1}</div>
                  <button 
                    className="hidden group-hover:block w-full text-left pl-1 text-white"
                    onClick={(e) => {
                      e.stopPropagation();
                      // Aquí iría la lógica para reproducir la canción
                    }}
                  >
                    ▶️
                  </button>
                </div>
                <div className="col-span-5 flex items-center">
                  <img 
                    src={entry.song.coverUrl} 
                    alt={entry.song.title} 
                    className="w-10 h-10 rounded mr-3"
                  />
                  <div>
                    <div className="text-white font-medium group-hover:text-purple-400">
                      {entry.song.title}
                    </div>
                    <div className="text-sm text-gray-400">
                      {entry.song.artist}
                    </div>
                  </div>
                </div>
                <div className="col-span-3 text-sm text-gray-400 truncate">
                  {entry.song.album || 'Álbum desconocido'}
                </div>
                <div className="col-span-2 text-sm text-gray-400">
                  {formatRelativeTime(entry.playedAt)}
                </div>
                <div className="col-span-1 text-right text-sm text-gray-400">
                  {formatDuration(entry.song.duration)}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default HistoryPage;
