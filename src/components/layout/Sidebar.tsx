import React from 'react';
import { motion } from 'framer-motion';
import { 
  Home, 
  Search, 
  Library, 
  Plus, 
  Heart, 
  Music, 
  TrendingUp,
  Clock,
  ListMusic
} from 'lucide-react';
import clsx from 'clsx';

interface SidebarProps {
  isOpen: boolean;
  currentPage: string;
  onPageChange: (page: string) => void;
}

const menuItems = [
  { id: 'home', label: 'Inicio', icon: Home },
  { id: 'search', label: 'Buscar', icon: Search },
  { id: 'library', label: 'Tu Biblioteca', icon: Library },
];

const libraryItems = [
  { id: 'create-playlist', label: 'Crear Lista de Reproducción', icon: Plus },
  { id: 'liked-songs', label: 'Canciones Favoritas', icon: Heart },
];

const quickLinks = [
  { id: 'trending', label: 'Tendencias', icon: TrendingUp },
  { id: 'recent', label: 'Reproducidas Recientemente', icon: Clock },
  { id: 'discover', label: 'Descubrir', icon: Music },
];

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, currentPage, onPageChange }) => {
  return (
    <motion.aside
      initial={{ x: -280 }}
      animate={{ x: isOpen ? 0 : -280 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      className={clsx(
        'fixed lg:static inset-y-0 left-0 z-40',
        'w-64 bg-gray-900 border-r border-gray-800',
        'flex flex-col overflow-hidden'
      )}
    >
      {/* Main Navigation */}
      <div className="p-4 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <motion.button
              key={item.id}
              whileHover={{ x: 4 }}
              onClick={() => onPageChange(item.id)}
              className={clsx(
                'w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors',
                currentPage === item.id
                  ? 'bg-gradient-to-r from-purple-600/20 to-blue-600/20 text-white border border-purple-500/30'
                  : 'text-gray-400 hover:text-white hover:bg-gray-800'
              )}
            >
              <Icon className="w-5 h-5 flex-shrink-0" />
              <span className="font-medium">{item.label}</span>
            </motion.button>
          );
        })}
      </div>

      {/* Library Section */}
      <div className="px-4 pb-4 border-b border-gray-800">
        <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
          Biblioteca
        </h3>
        <div className="space-y-1">
          {libraryItems.map((item) => {
            const Icon = item.icon;
            return (
              <motion.button
                key={item.id}
                whileHover={{ x: 4 }}
                onClick={() => onPageChange(item.id)}
                className={clsx(
                  'w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors',
                  currentPage === item.id
                    ? 'bg-gradient-to-r from-purple-600/20 to-blue-600/20 text-white border border-purple-500/30'
                    : 'text-gray-400 hover:text-white hover:bg-gray-800'
                )}
              >
                <Icon className="w-4 h-4 flex-shrink-0" />
                <span className="text-sm">{item.label}</span>
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Quick Links */}
      <div className="flex-1 px-4 py-4 overflow-y-auto">
        <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
          Enlaces Rápidos
        </h3>
        <div className="space-y-1">
          {quickLinks.map((item) => {
            const Icon = item.icon;
            return (
              <motion.button
                key={item.id}
                whileHover={{ x: 4 }}
                onClick={() => onPageChange(item.id)}
                className={clsx(
                  'w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors',
                  currentPage === item.id
                    ? 'bg-gradient-to-r from-purple-600/20 to-blue-600/20 text-white border border-purple-500/30'
                    : 'text-gray-400 hover:text-white hover:bg-gray-800'
                )}
              >
                <Icon className="w-4 h-4 flex-shrink-0" />
                <span className="text-sm">{item.label}</span>
              </motion.button>
            );
          })}
        </div>

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