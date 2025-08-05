import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import { Search, Menu, User, LogOut, Settings, Crown, Music, Disc, ListMusic, Cog, Play, ArrowLeft, X } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { usePlayer } from '../../contexts/PlayerContext';
import { useTranslation } from '../../hooks/useTranslation';
import { Button } from '../common/Button';
import { Input } from '../common/Input';
import { mockSongs } from '../../data/mockData';
import { formatDuration } from '../../utils/format';

interface HeaderProps {
  onMenuToggle: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onMenuToggle }) => {
  const { user, logout } = useAuth();
  const { play, setQueue } = usePlayer();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearchResults, setShowSearchResults] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);

  // Páginas donde se debe mostrar el botón de retroceso
  const showBackButton = location.pathname !== '/' && // No mostrar en página principal
    location.pathname !== '/auth' && // No mostrar en login/registro
    user; // Solo mostrar si el usuario está autenticado

  // Cerrar dropdowns al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowUserMenu(false);
      }
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSearchResults(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Función de búsqueda global
  const getGlobalSearchResults = () => {
    if (!searchQuery.trim()) return { songs: [], pages: [] };

    const lowerQuery = searchQuery.toLowerCase();

    // Buscar canciones
    const songs = mockSongs.filter(song =>
      song.title.toLowerCase().includes(lowerQuery) ||
      song.artist.toLowerCase().includes(lowerQuery) ||
      (song.album && song.album.toLowerCase().includes(lowerQuery)) ||
      song.genre.toLowerCase().includes(lowerQuery)
    ).slice(0, 4);

    // Buscar páginas/secciones
    const allPages = [
      { name: 'Inicio', path: '/', icon: '🏠', description: 'Página principal' },
      { name: 'Descubrir', path: '/discover', icon: '🔍', description: 'Descubre nueva música' },
      { name: 'Biblioteca', path: '/library', icon: '📚', description: 'Tu biblioteca musical' },
      { name: 'Tendencias', path: '/trending', icon: '🔥', description: 'Música en tendencia' },
      { name: 'Recomendaciones', path: '/recommendations', icon: '💎', description: 'Música recomendada para ti' },
      { name: 'Historial', path: '/history', icon: '📜', description: 'Tu historial de reproducciones' },
      { name: 'Recientes', path: '/recent', icon: '⏰', description: 'Música reciente' },
      { name: 'Configuración', path: '/settings', icon: '⚙️', description: 'Ajustes de la aplicación' },
      { name: 'Perfil', path: '/profile', icon: '👤', description: 'Tu perfil de usuario' },
      { name: 'Suscripción', path: '/subscription', icon: '👑', description: 'Gestiona tu suscripción' },
      { name: 'Privacidad', path: '/privacy', icon: '🔒', description: 'Configuración de privacidad' }
    ];

    const pages = allPages.filter(page =>
      page.name.toLowerCase().includes(lowerQuery) ||
      page.description.toLowerCase().includes(lowerQuery)
    ).slice(0, 4);

    return { songs, pages };
  };

  const searchResults = getGlobalSearchResults();
  const hasResults = searchResults.songs.length > 0 || searchResults.pages.length > 0;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setShowSearchResults(false);
    }
  };

  const handleSongClick = (song: any) => {
    console.log('Reproduciendo canción:', song.title);

    // Configurar la cola con todas las canciones y reproducir la seleccionada
    const songIndex = mockSongs.findIndex(s => s.id === song.id);
    setQueue(mockSongs, songIndex);
    play(song);

    setShowSearchResults(false);
    setSearchQuery('');

    // Mostrar notificación
    console.log(`🎵 Reproduciendo: ${song.title} - ${song.artist}`);
  };

  const handlePageClick = (page: any) => {
    navigate(page.path);
    setShowSearchResults(false);
    setSearchQuery('');
  };

  return (
    <header className="h-16 bg-gray-900/50 backdrop-blur-lg border-b border-gray-800 px-4 lg:px-6 flex items-center justify-between relative z-50">
      {/* Left section */}
      <div className="flex items-center gap-4">
        {/* Botón de retroceso - solo en páginas específicas */}
        {showBackButton && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => window.history.back()}
            className="text-gray-400 hover:text-white transition-colors"
            title="Volver atrás"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
        )}

        <Button
          variant="ghost"
          size="sm"
          onClick={onMenuToggle}
          className="lg:hidden"
        >
          <Menu className="w-5 h-5" />
        </Button>

        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">SF</span>
          </div>
          <span className="hidden sm:block text-xl font-bold text-white">StreamFlow</span>
        </div>
      </div>

      {/* Center section - Global Search (solo para usuarios autenticados) */}
      {user && (
        <div className="flex-1 max-w-xl mx-4 relative" ref={searchRef}>
          <form onSubmit={handleSearch} className="relative">
            <Input
              type="text"
              placeholder="Buscar música, páginas, ajustes..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setShowSearchResults(true);
              }}
              onFocus={() => setShowSearchResults(true)}
              leftIcon={<Search className="w-4 h-4" />}
              className="bg-gray-800/50 border-gray-700/50 pr-10"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('');
                  setShowSearchResults(false);
                }}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors p-1 rounded-full hover:bg-gray-700"
                title="Limpiar búsqueda"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </form>

          {/* Resultados de búsqueda global */}
          {showSearchResults && searchQuery.trim() && hasResults && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-gray-800 rounded-lg shadow-xl border border-gray-700 max-h-96 overflow-y-auto z-50">

              {/* Header de resultados con botón cerrar */}
              <div className="flex items-center justify-between p-3 border-b border-gray-700">
                <h3 className="text-white font-medium">
                  Resultados de búsqueda para "{searchQuery}"
                </h3>
                <button
                  onClick={() => setShowSearchResults(false)}
                  className="text-gray-400 hover:text-white transition-colors p-1 rounded-full hover:bg-gray-700"
                  title="Cerrar resultados"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Canciones */}
              {searchResults.songs.length > 0 && (
                <div className="p-3 border-b border-gray-700">
                  <h3 className="text-white font-medium mb-2 flex items-center">
                    <Music className="w-4 h-4 mr-2" />
                    Canciones
                  </h3>
                  {searchResults.songs.map((song) => (
                    <button
                      key={song.id}
                      onClick={() => handleSongClick(song)}
                      className="w-full flex items-center p-2 hover:bg-gray-700 rounded text-left group transition-all hover:scale-[1.02]"
                    >
                      <div className="relative">
                        <img
                          src={song.coverUrl}
                          alt={song.title}
                          className="w-10 h-10 rounded mr-3"
                        />
                        <div className="absolute inset-0 bg-black bg-opacity-50 rounded flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                          <Play className="w-4 h-4 text-white fill-white" />
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-white font-medium truncate group-hover:text-green-400 transition-colors">{song.title}</p>
                        <p className="text-gray-400 text-sm truncate">{song.artist}</p>
                      </div>
                      <div className="text-gray-500 text-sm">{formatDuration(song.duration)}</div>
                    </button>
                  ))}
                </div>
              )}

              {/* Páginas/Secciones */}
              {searchResults.pages.length > 0 && (
                <div className="p-3">
                  <h3 className="text-white font-medium mb-2 flex items-center">
                    <Cog className="w-4 h-4 mr-2" />
                    Páginas y Ajustes
                  </h3>
                  {searchResults.pages.map((page, index) => (
                    <button
                      key={index}
                      onClick={() => handlePageClick(page)}
                      className="w-full flex items-center p-2 hover:bg-gray-700 rounded text-left"
                    >
                      <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center mr-3">
                        <span className="text-sm">{page.icon}</span>
                      </div>
                      <div className="flex-1">
                        <p className="text-white font-medium">{page.name}</p>
                        <p className="text-gray-400 text-sm">{page.description}</p>
                      </div>
                    </button>
                  ))}
                </div>
              )}

              {/* Ver todos los resultados */}
              {searchQuery.trim() && (
                <div className="p-3 border-t border-gray-700">
                  <button
                    onClick={() => {
                      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
                      setShowSearchResults(false);
                    }}
                    className="w-full p-2 text-center text-blue-400 hover:text-blue-300 hover:bg-gray-700 rounded"
                  >
                    Ver todos los resultados para "{searchQuery}"
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Espacio en blanco cuando no hay usuario autenticado */}
      {!user && <div className="flex-1" />}      {/* Right section - User menu */}
      <div className="relative z-50" ref={dropdownRef}>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowUserMenu(!showUserMenu)}
          className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-800 transition-colors"
        >
          <img
            src={user?.avatar_url || 'https://api.dicebear.com/7.x/avataaars/svg?seed=default'}
            alt={user?.name || 'Usuario'}
            className="w-8 h-8 rounded-full"
          />
          <div className="hidden sm:block text-left">
            <p className="text-sm font-medium text-white">{user?.name}</p>
            <p className="text-xs text-gray-400 flex items-center gap-1">
              {user?.subscription?.type === 'free' ? (
                'Plan Gratuito'
              ) : (
                <>
                  <Crown className="w-3 h-3" />
                  Premium
                </>
              )}
            </p>
          </div>
        </motion.button>

        {/* User dropdown menu */}
        {showUserMenu && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="absolute right-0 top-full mt-2 w-48 bg-gray-800 rounded-lg shadow-2xl border border-gray-700 py-2 z-[9999]"
            style={{ zIndex: 9999 }}
          >
            <button
              onClick={() => {
                navigate('/profile');
                setShowUserMenu(false);
              }}
              className="w-full px-4 py-2 text-left text-sm text-gray-300 hover:text-white hover:bg-gray-700 flex items-center gap-3 transition-colors"
            >
              <User className="w-4 h-4" />
              {t('profile')}
            </button>
            <button
              onClick={() => {
                navigate('/settings');
                setShowUserMenu(false);
              }}
              className="w-full px-4 py-2 text-left text-sm text-gray-300 hover:text-white hover:bg-gray-700 flex items-center gap-3 transition-colors"
            >
              <Settings className="w-4 h-4" />
              {t('settings')}
            </button>
            {user?.subscription?.type === 'free' && (
              <button
                onClick={() => {
                  // TODO: Implementar actualización a Premium
                  setShowUserMenu(false);
                }}
                className="w-full px-4 py-2 text-left text-sm text-purple-400 hover:text-purple-300 hover:bg-gray-700 flex items-center gap-3 transition-colors"
              >
                <Crown className="w-4 h-4" />
                Actualizar a Premium
              </button>
            )}
            <hr className="my-2 border-gray-700" />
            <button
              onClick={() => {
                logout();
                setShowUserMenu(false);
              }}
              className="w-full px-4 py-2 text-left text-sm text-red-400 hover:text-red-300 hover:bg-gray-700 flex items-center gap-3 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              {t('logout')}
            </button>
          </motion.div>
        )}
      </div>
    </header>
  );
};