import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Search, Menu, User, LogOut, Settings, Crown } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useTranslation } from '../../hooks/useTranslation';
import { Button } from '../common/Button';
import { Input } from '../common/Input';

interface HeaderProps {
  onMenuToggle: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onMenuToggle }) => {
  const { user, logout } = useAuth();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Cerrar dropdown al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowUserMenu(false);
      }
    };

    if (showUserMenu) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [showUserMenu]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Implement search functionality
    console.log('Search:', searchQuery);
  };

  return (
    <header className="h-16 bg-gray-900/50 backdrop-blur-lg border-b border-gray-800 px-4 lg:px-6 flex items-center justify-between relative z-50">
      {/* Left section */}
      <div className="flex items-center gap-4">
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

      {/* Center section - Search */}
      <div className="flex-1 max-w-xl mx-4">
        <form onSubmit={handleSearch}>
          <Input
            type="text"
            placeholder="Buscar canciones, artistas, álbumes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            leftIcon={<Search className="w-4 h-4" />}
            className="bg-gray-800/50 border-gray-700/50"
          />
        </form>
      </div>

      {/* Right section - User menu */}
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