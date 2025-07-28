import React from 'react';
import { motion } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';
import { 
  Home, 
  Search, 
  Library, 
  Heart, 
  Music, 
  TrendingUp,
  Clock,
  ListMusic,
  History,
  Sparkles
} from 'lucide-react';
import clsx from 'clsx';

interface MenuItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  path: string;
}

interface SidebarProps {
  isOpen: boolean;
  currentPage?: string;
}

const menuItems = [
  { id: 'home', label: 'Inicio', icon: Home, path: '/' },
  { id: 'search', label: 'Buscar', icon: Search, path: '/search' },
  { id: 'library', label: 'Tu Biblioteca', icon: Library, path: '/library' },
];

const libraryItems = [
  { id: 'liked-songs', label: 'Canciones que te gustan', icon: Heart, path: '/library?tab=liked' },
  { id: 'history', label: 'Historial de reproducción', icon: History, path: '/history' },
];

const quickLinks = [
  { id: 'recommendations', label: 'Recomendaciones', icon: Sparkles, path: '/recommendations' },
  { id: 'trending', label: 'Tendencias', icon: TrendingUp, path: '/trending' },
  { id: 'recent', label: 'Recientemente reproducidas', icon: Clock, path: '/recent' },
  { id: 'discover', label: 'Descubrir', icon: Music, path: '/discover' },
];

export const Sidebar: React.FC<SidebarProps> = ({ isOpen }) => {
  const location = useLocation();

  const handlePageChange = (event: React.MouseEvent) => {
    // Prevent default navigation since we're using React Router's Link
    event.preventDefault();
    // The actual navigation is handled by the Link component's 'to' prop
  };
  
  // Función para verificar si una ruta está activa
  const isActive = (path: string) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  // Función para renderizar enlaces de navegación
  const renderNavLink = (item: MenuItem) => {
    const Icon = item.icon;
    const active = isActive(item.path);
    
    return (
      <motion.li key={item.id} whileHover={{ x: 4 }}>
        <Link
          to={item.path}
          onClick={handlePageChange}
          className={clsx(
            'block w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors',
            active
              ? 'bg-gradient-to-r from-purple-600/20 to-blue-600/20 text-white border border-purple-500/30'
              : 'text-gray-400 hover:text-white hover:bg-gray-800'
          )}
        >
          <Icon className="w-5 h-5 flex-shrink-0" />
          <span className="font-medium">{item.label}</span>
        </Link>
      </motion.li>
    );
  };

  // Función para renderizar elementos de la biblioteca
  const renderLibraryItem = (item: MenuItem) => {
    const Icon = item.icon;
    const active = isActive(item.path);
    
    return (
      <motion.li key={item.id} whileHover={{ x: 4 }}>
        <Link
          to={item.path}
          onClick={handlePageChange}
          className={clsx(
            'block w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors',
            active
              ? 'bg-gradient-to-r from-purple-600/20 to-blue-600/20 text-white border border-purple-500/30'
              : 'text-gray-400 hover:text-white hover:bg-gray-800'
          )}
        >
          <Icon className="w-4 h-4 flex-shrink-0" />
          <span className="text-sm">{item.label}</span>
        </Link>
      </motion.li>
    );
  };

  return (
    <motion.aside
      initial={{ x: -280 }}
      animate={{ x: isOpen ? 0 : -280 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      className={clsx(
        'fixed lg:static inset-y-0 left-0 z-40',
        'w-64 bg-gray-900 border-r border-gray-800',
        'flex flex-col overflow-hidden',
        'overflow-y-auto' // Asegurar que el sidebar sea desplazable
      )}
    >
      {/* Main Navigation */}
      <div className="p-4 space-y-2">
        <ul className="space-y-1">
          {menuItems.map(renderNavLink)}
        </ul>
      </div>

      {/* Library Section */}
      <div className="px-4 pb-4 border-b border-gray-800">
        <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
          Biblioteca
        </h3>
        <ul className="space-y-1">
          {libraryItems.map(renderLibraryItem)}
        </ul>
      </div>

      {/* Quick Links */}
      <div className="flex-1 px-4 py-4">
        <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
          Descubrir
        </h3>
        <ul className="space-y-1">
          {quickLinks.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);
            
            return (
              <motion.li key={item.id} whileHover={{ x: 4 }}>
                <Link
                  to={item.path}
                  className={clsx(
                    'block w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors',
                    active
                      ? 'bg-gradient-to-r from-purple-600/20 to-blue-600/20 text-white border border-purple-500/30'
                      : 'text-gray-400 hover:text-white hover:bg-gray-800'
                  )}
                >
                  <Icon className="w-4 h-4 flex-shrink-0" />
                  <span className="text-sm">{item.label}</span>
                </Link>
              </motion.li>
            );
          })}
        </ul>

        {/* Playlists */}
        <div className="mt-6">
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
            Listas de Reproducción
          </h3>
          <div className="space-y-1">
            <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left text-gray-400 hover:text-white hover:bg-gray-800 transition-colors">
              <ListMusic className="w-4 h-4 flex-shrink-0" />
              <span className="text-sm">Mis Favoritas</span>
            </button>
            <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left text-gray-400 hover:text-white hover:bg-gray-800 transition-colors">
              <ListMusic className="w-4 h-4 flex-shrink-0" />
              <span className="text-sm">Vibras Relajantes</span>
            </button>
          </div>
        </div>
      </div>
    </motion.aside>
  );
};