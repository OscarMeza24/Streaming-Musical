import React, { useState, useEffect } from 'react';
import { Heart, Plus, Play, Trash2, MoreHorizontal, ListMusic, Loader } from 'lucide-react';
import toast from 'react-hot-toast';
import { Song, Playlist } from '../types';
import { MockMusicService } from '../services/mockMusicService';
import { usePlayer } from '../contexts/PlayerContext';
import { formatDuration } from '../utils/format';
import { Button } from '../components/common/Button';

// Create Playlist Modal Component
interface CreatePlaylistModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreatePlaylist: (name: string, description: string) => void;
}

const CreatePlaylistModal: React.FC<CreatePlaylistModalProps> = ({ isOpen, onClose, onCreatePlaylist }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      onCreatePlaylist(name.trim(), description.trim());
      setName('');
      setDescription('');
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-gray-800 rounded-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-semibold text-white mb-4">Crear nueva playlist</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Nombre</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-gray-700 text-white rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="Mi nueva playlist"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Descripción (opcional)</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-gray-700 text-white rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
              rows={3}
              placeholder="Describe tu playlist..."
            />
          </div>
          <div className="flex gap-3 pt-2">
            <Button
              type="button"
              variant="ghost"
              onClick={onClose}
              className="flex-1"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              variant="primary"
              className="flex-1"
            >
              Crear
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Liked Songs Component
interface LikedSongsProps {
  songs: Song[];
  onToggleLike: (songId: string) => void;
  onPlaySong: (song: Song) => void;
}

const LikedSongs: React.FC<LikedSongsProps> = ({ songs, onToggleLike, onPlaySong }) => {
  if (songs.length === 0) {
    return (
      <div className="text-center py-12">
        <Heart className="w-16 h-16 mx-auto text-gray-600 mb-4" />
        <h3 className="text-xl font-semibold text-white mb-2">Aún no tienes canciones favoritas</h3>
        <p className="text-gray-400">Usa el corazón para guardar las canciones que te gusten</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {songs.map((song, index) => (
        <div
          key={song.id}
          className="flex items-center gap-4 p-3 rounded-lg hover:bg-gray-800 transition-colors group"
        >
          {/* Play Button */}
          <button
            onClick={() => onPlaySong(song)}
            className="w-10 h-10 rounded-full bg-purple-600 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 hover:bg-purple-700 transition-all"
          >
            <Play className="w-4 h-4" />
          </button>

          {/* Index */}
          <div className="w-6 text-center text-gray-400 text-sm group-hover:opacity-0">
            {index + 1}
          </div>

          {/* Cover Image */}
          <img
            src={song.coverUrl || 'https://images.pexels.com/photos/1105666/pexels-photo-1105666.jpeg?auto=compress&cs=tinysrgb&w=100'}
            alt={song.title}
            className="w-12 h-12 rounded-lg object-cover"
          />

          {/* Song Info */}
          <div className="flex-1 min-w-0">
            <h3 className="text-white font-medium truncate">{song.title}</h3>
            <p className="text-gray-400 text-sm truncate">{song.artist}</p>
          </div>

          {/* Duration */}
          <div className="text-gray-400 text-sm">
            {formatDuration(song.duration)}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onToggleLike(song.id)}
              className="text-red-500"
            >
              <Heart className="w-4 h-4 fill-current" />
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
};

// Playlists Component
interface PlaylistsProps {
  playlists: Playlist[];
  onCreatePlaylist: () => void;
  onDeletePlaylist: (playlistId: string) => void;
}

const Playlists: React.FC<PlaylistsProps> = ({ playlists, onCreatePlaylist, onDeletePlaylist }) => {
  return (
    <div className="space-y-6">
      {/* Create Playlist Button */}
      <Button
        onClick={onCreatePlaylist}
        variant="primary"
        className="flex items-center gap-2"
      >
        <Plus className="w-4 h-4" />
        Crear nueva playlist
      </Button>

      {/* Playlists Grid */}
      {playlists.length === 0 ? (
        <div className="text-center py-12">
          <ListMusic className="w-16 h-16 mx-auto text-gray-600 mb-4" />
          <h3 className="text-xl font-semibold text-white mb-2">No tienes playlists</h3>
          <p className="text-gray-400">Crea tu primera playlist para organizar tu música</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {playlists.map((playlist) => (
            <div
              key={playlist.id}
              className="bg-gray-800 rounded-lg p-4 hover:bg-gray-750 transition-colors group"
            >
              <div className="relative">
                <img
                  src={playlist.coverUrl || 'https://images.pexels.com/photos/1105666/pexels-photo-1105666.jpeg?auto=compress&cs=tinysrgb&w=300'}
                  alt={playlist.name}
                  className="w-full aspect-square rounded-lg object-cover mb-3"
                />
                
                {/* Delete Button */}
                <button
                  onClick={() => onDeletePlaylist(playlist.id)}
                  className="absolute top-2 right-2 w-8 h-8 rounded-full bg-black/60 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 hover:bg-red-600 transition-all"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
              
              <h3 className="text-white font-medium truncate">{playlist.name}</h3>
              <p className="text-gray-400 text-sm truncate">
                {playlist.songs.length} canciones
              </p>
              {playlist.description && (
                <p className="text-gray-500 text-xs mt-1 truncate">
                  {playlist.description}
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// Main Library Page Component
const LibraryPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'liked' | 'playlists'>('liked');
  const [likedSongs, setLikedSongs] = useState<Song[]>([]);
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  
  const { play, setQueue } = usePlayer();

  // Load library data
  const loadLibraryData = async () => {
    try {
      setIsLoading(true);
      const [liked, userPlaylists] = await Promise.all([
        MockMusicService.getLikedSongs(),
        MockMusicService.getUserPlaylists()
      ]);
      setLikedSongs(liked);
      setPlaylists(userPlaylists);
    } catch (error) {
      console.error('Error loading library data:', error);
      toast.error('Error al cargar tu biblioteca');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadLibraryData();
  }, []);

  // Handle like toggle
  const handleToggleLike = async (songId: string) => {
    try {
      const newLikedState = await MockMusicService.toggleLikeSong(songId);
      
      if (!newLikedState) {
        // Remove from liked songs
        setLikedSongs(prev => prev.filter(song => song.id !== songId));
        toast.success('Eliminada de favoritos');
      }
    } catch (error) {
      toast.error('Error al actualizar favoritos');
    }
  };

  // Handle play song
  const handlePlaySong = (song: Song) => {
    if (activeTab === 'liked') {
      setQueue(likedSongs, likedSongs.findIndex(s => s.id === song.id));
    }
    play(song);
  };

  // Handle create playlist
  const handleCreatePlaylist = async (name: string, description: string) => {
    try {
      const newPlaylist = await MockMusicService.createPlaylist(name, description);
      setPlaylists(prev => [newPlaylist, ...prev]);
      toast.success('Playlist creada exitosamente');
    } catch (error) {
      toast.error('Error al crear la playlist');
    }
  };

  // Handle delete playlist
  const handleDeletePlaylist = async (playlistId: string) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar esta playlist?')) {
      try {
        await MockMusicService.deletePlaylist(playlistId);
        setPlaylists(prev => prev.filter(p => p.id !== playlistId));
        toast.success('Playlist eliminada');
      } catch (error) {
        toast.error('Error al eliminar la playlist');
      }
    }
  };

  const tabs = [
    { id: 'liked' as const, label: 'Favoritas', icon: Heart },
    { id: 'playlists' as const, label: 'Playlists', icon: ListMusic },
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader className="w-8 h-8 animate-spin text-purple-500" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Tu biblioteca</h1>
        <p className="text-gray-400">Tu música favorita y playlists</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-4 border-b border-gray-800">
        {tabs.map((tab) => {
          const IconComponent = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 border-b-2 transition-colors ${
                activeTab === tab.id
                  ? 'border-purple-500 text-white'
                  : 'border-transparent text-gray-400 hover:text-white'
              }`}
            >
              <IconComponent className="w-4 h-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Tab Content */}
      <div>
        {activeTab === 'liked' && (
          <LikedSongs
            songs={likedSongs}
            onToggleLike={handleToggleLike}
            onPlaySong={handlePlaySong}
          />
        )}
        
        {activeTab === 'playlists' && (
          <Playlists
            playlists={playlists}
            onCreatePlaylist={() => setShowCreateModal(true)}
            onDeletePlaylist={handleDeletePlaylist}
          />
        )}
      </div>

      {/* Create Playlist Modal */}
      <CreatePlaylistModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onCreatePlaylist={handleCreatePlaylist}
      />
    </div>
  );
};

export default LibraryPage;
