import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  User,
  Mail,
  Calendar,
  Crown,
  Edit3,
  Save,
  X,
  Camera,
  Shield,
  Music,
  Heart,
  Clock,
  Settings,
  ArrowLeft
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useSettings } from '../contexts/SettingsContext';
import { Button } from '../components/common/Button';
import { Input } from '../components/common/Input';
import toast from 'react-hot-toast';

export const ProfilePage: React.FC = () => {
  const { user, updateProfile } = useAuth();
  const { settings } = useSettings();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    avatar: user?.avatar_url || '',
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleSave = async () => {
    if (!user) return;

    setIsLoading(true);
    try {
      await updateProfile({
        name: editData.name,
        email: editData.email,
        avatar_url: editData.avatar,
      });
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating profile:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setEditData({
      name: user?.name || '',
      email: user?.email || '',
      avatar: user?.avatar_url || '',
    });
    setIsEditing(false);
  };

  const handleAvatarChange = () => {
    // Generar un nuevo avatar aleatorio
    const seed = Math.random().toString(36).substring(7);
    const newAvatar = `https://api.dicebear.com/7.x/avataaars/svg?seed=${seed}`;
    setEditData(prev => ({ ...prev, avatar: newAvatar }));
  };

  if (!user) return null;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Back Button */}
      <div className="flex items-center justify-between mb-8">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate(-1)}
          className="text-gray-400 hover:text-white"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Volver
        </Button>
      </div>

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <h1 className="text-3xl font-bold text-white mb-2">Mi Perfil</h1>
        <p className="text-gray-400">Gestiona tu información personal y preferencias</p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Card */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="lg:col-span-2 bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-white flex items-center gap-2">
              <User className="w-5 h-5" />
              Información Personal
            </h2>
            {!isEditing ? (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsEditing(true)}
                className="text-purple-400 hover:text-purple-300"
              >
                <Edit3 className="w-4 h-4 mr-2" />
                Editar
              </Button>
            ) : (
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleCancel}
                  className="text-gray-400 hover:text-gray-300"
                >
                  <X className="w-4 h-4 mr-2" />
                  Cancelar
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={handleSave}
                  isLoading={isLoading}
                >
                  <Save className="w-4 h-4 mr-2" />
                  Guardar
                </Button>
              </div>
            )}
          </div>

          <div className="space-y-6">
            {/* Avatar Section */}
            <div className="flex items-center gap-6">
              <div className="relative">
                <img
                  src={isEditing ? editData.avatar : user.avatar_url || 'https://api.dicebear.com/7.x/avataaars/svg?seed=default'}
                  alt={user.name || 'Usuario'}
                  className="w-20 h-20 rounded-full border-2 border-gray-600"
                />
                {isEditing && (
                  <button
                    onClick={handleAvatarChange}
                    className="absolute -bottom-2 -right-2 w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center hover:bg-purple-700 transition-colors"
                  >
                    <Camera className="w-4 h-4 text-white" />
                  </button>
                )}
              </div>
              <div>
                <h3 className="text-lg font-medium text-white">{user.name}</h3>
                <p className="text-gray-400 flex items-center gap-2">
                  {user.subscription?.type === 'free' ? (
                    'Plan Gratuito'
                  ) : (
                    <>
                      <Crown className="w-4 h-4 text-yellow-500" />
                      Premium
                    </>
                  )}
                </p>
              </div>
            </div>

            {/* Form Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Nombre Completo
                </label>
                {isEditing ? (
                  <Input
                    type="text"
                    value={editData.name}
                    onChange={(e) => setEditData(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Tu nombre completo"
                    leftIcon={<User className="w-4 h-4" />}
                  />
                ) : (
                  <div className="flex items-center gap-2 p-3 bg-gray-700/50 rounded-lg">
                    <User className="w-4 h-4 text-gray-400" />
                    <span className="text-white">{user.name}</span>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Correo Electrónico
                </label>
                {isEditing ? (
                  <Input
                    type="email"
                    value={editData.email}
                    onChange={(e) => setEditData(prev => ({ ...prev, email: e.target.value }))}
                    placeholder="tu@email.com"
                    leftIcon={<Mail className="w-4 h-4" />}
                  />
                ) : (
                  <div className="flex items-center gap-2 p-3 bg-gray-700/50 rounded-lg">
                    <Mail className="w-4 h-4 text-gray-400" />
                    <span className="text-white">{user.email}</span>
                  </div>
                )}
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Miembro desde
                </label>
                <div className="flex items-center gap-2 p-3 bg-gray-700/50 rounded-lg">
                  <Calendar className="w-4 h-4 text-gray-400" />
                  <span className="text-white">
                    {new Date(user.created_at).toLocaleDateString('es-ES', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Stats & Actions Sidebar */}
        <div className="space-y-6">
          {/* Subscription Card */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-gradient-to-br from-purple-600/20 to-blue-600/20 backdrop-blur-sm rounded-xl p-6 border border-purple-500/30"
          >
            <div className="text-center">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                {user.subscription?.type === 'free' ? (
                  <Shield className="w-6 h-6 text-white" />
                ) : (
                  <Crown className="w-6 h-6 text-white" />
                )}
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">
                {user.subscription?.type === 'free' ? 'Plan Gratuito' : 'Premium'}
              </h3>
              <p className="text-gray-300 text-sm mb-4">
                {user.subscription?.type === 'free'
                  ? 'Disfruta de música con anuncios'
                  : 'Música sin límites y sin anuncios'
                }
              </p>
              {user.subscription?.type === 'free' && (
                <Button
                  variant="primary"
                  size="sm"
                  fullWidth
                  onClick={() => toast.success('¡Próximamente disponible!')}
                >
                  <Crown className="w-4 h-4 mr-2" />
                  Actualizar a Premium
                </Button>
              )}
            </div>
          </motion.div>

          {/* Quick Stats */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50"
          >
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <Music className="w-5 h-5" />
              Estadísticas
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Heart className="w-4 h-4 text-red-400" />
                  <span className="text-gray-300">Favoritas</span>
                </div>
                <span className="text-white font-medium">24</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Music className="w-4 h-4 text-blue-400" />
                  <span className="text-gray-300">Playlists</span>
                </div>
                <span className="text-white font-medium">8</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-green-400" />
                  <span className="text-gray-300">Horas escuchadas</span>
                </div>
                <span className="text-white font-medium">127h</span>
              </div>
            </div>
          </motion.div>

          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50"
          >
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <Settings className="w-5 h-5" />
              Acciones Rápidas
            </h3>
            <div className="space-y-3">
              <Button
                variant="ghost"
                size="sm"
                fullWidth
                className="justify-start text-gray-300 hover:text-white"
                onClick={() => toast.success('¡Próximamente disponible!')}
              >
                <Shield className="w-4 h-4 mr-2" />
                Privacidad
              </Button>
              <Button
                variant="ghost"
                size="sm"
                fullWidth
                className="justify-start text-gray-300 hover:text-white"
                onClick={() => toast.success('¡Próximamente disponible!')}
              >
                <Music className="w-4 h-4 mr-2" />
                Preferencias de música
              </Button>
              <Button
                variant="ghost"
                size="sm"
                fullWidth
                className="justify-start text-gray-300 hover:text-white"
                onClick={() => navigate('/settings')}
              >
                <Settings className="w-4 h-4 mr-2" />
                Configuración
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};
