import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Music, Play, Heart, MoreHorizontal, Shuffle, Radio, Compass, Zap, Moon, Target, PartyPopper, Volume2, SkipForward, Pause } from 'lucide-react';
import { Button } from '../components/common/Button';
import { usePlayer } from '../contexts/PlayerContext';
import { mockSongs } from '../data/mockData';

// Mock data para descubrimiento
const featuredPlaylists = [
  {
    id: '1',
    title: 'Chill Vibes',
    description: 'Música relajante para cualquier momento',
    coverUrl: 'https://images.pexels.com/photos/1105666/pexels-photo-1105666.jpeg?auto=compress&cs=tinysrgb&w=300',
    songCount: 25,
    duration: '1h 32m'
  },
  {
    id: '2',
    title: 'Workout Hits',
    description: 'Energía para tus entrenamientos',
    coverUrl: 'https://images.pexels.com/photos/1763075/pexels-photo-1763075.jpeg?auto=compress&cs=tinysrgb&w=300',
    songCount: 40,
    duration: '2h 15m'
  },
  {
    id: '3',
    title: 'Indie Discoveries',
    description: 'Nuevos talentos independientes',
    coverUrl: 'https://images.pexels.com/photos/1540406/pexels-photo-1540406.jpeg?auto=compress&cs=tinysrgb&w=300',
    songCount: 30,
    duration: '1h 45m'
  }
];

const newReleases = [
  {
    id: '1',
    title: 'Midnight Rain',
    artist: 'Taylor Swift',
    album: 'Midnights',
    duration: 175,
    coverUrl: 'https://images.pexels.com/photos/1699161/pexels-photo-1699161.jpeg?auto=compress&cs=tinysrgb&w=300',
    releaseDate: '2024-01-10'
  },
  {
    id: '2',
    title: 'Unholy',
    artist: 'Sam Smith ft. Kim Petras',
    album: 'Gloria',
    duration: 156,
    coverUrl: 'https://images.pexels.com/photos/1644888/pexels-photo-1644888.jpeg?auto=compress&cs=tinysrgb&w=300',
    releaseDate: '2024-01-08'
  },
  {
    id: '3',
    title: 'Calm Down',
    artist: 'Rema & Selena Gomez',
    album: 'Rave & Roses',
    duration: 239,
    coverUrl: 'https://images.pexels.com/photos/1105666/pexels-photo-1105666.jpeg?auto=compress&cs=tinysrgb&w=300',
    releaseDate: '2024-01-05'
  }
];

const genres = [
  { name: 'Pop', color: 'from-pink-500 to-rose-500' },
  { name: 'Rock', color: 'from-red-500 to-orange-500' },
  { name: 'Hip-Hop', color: 'from-purple-500 to-indigo-500' },
  { name: 'Electrónica', color: 'from-blue-500 to-cyan-500' },
  { name: 'Jazz', color: 'from-yellow-500 to-amber-500' },
  { name: 'Classical', color: 'from-green-500 to-emerald-500' },
  { name: 'Synthwave', color: 'from-purple-500 to-pink-500' },
  { name: 'Ambiental', color: 'from-teal-500 to-blue-500' },
  { name: 'Naturaleza', color: 'from-green-600 to-lime-500' },
  { name: 'Psytrance', color: 'from-violet-500 to-purple-600' },
  { name: 'Acústico', color: 'from-amber-500 to-orange-500' }
];

// Función para obtener la cantidad real de canciones por género
const getGenreCount = (genreName: string) => {
  return mockSongs.filter(song => song.genre === genreName).length;
};

const formatDuration = (seconds: number) => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};

export const DiscoverPage: React.FC = () => {
  const { play, setQueue, isPlaying } = usePlayer();
  const navigate = useNavigate();

  // Estado para Radio Personalizada
  const [showRadio, setShowRadio] = useState(false);
  const [radioStations, setRadioStations] = useState<any[]>([]);
  const [currentStation, setCurrentStation] = useState<any>(null);
  const [isLoadingRadio, setIsLoadingRadio] = useState(false);

  // Estado para Explorar Géneros
  const [showGenres, setShowGenres] = useState(false);
  const [selectedGenre, setSelectedGenre] = useState<string | null>(null);
  const [genreSongs, setGenreSongs] = useState<any[]>([]);

  // Generar estaciones de radio personalizadas
  const generateRadioStations = () => {
    const genres = ['Pop', 'Rock', 'Jazz', 'Electronic'];
    const moods = [
      { id: 'energetic', name: 'Energético', icon: '🔥', color: 'from-red-500 to-orange-500' },
      { id: 'relax', name: 'Relajante', icon: '🌙', color: 'from-blue-500 to-purple-500' },
      { id: 'focus', name: 'Concentración', icon: '🎯', color: 'from-green-500 to-teal-500' },
      { id: 'party', name: 'Fiesta', icon: '🎉', color: 'from-pink-500 to-purple-500' }
    ];

    const stations = [];

    // Estaciones por género
    genres.forEach(genre => {
      const genreSongs = mockSongs.filter(song => song.genre === genre);
      if (genreSongs.length > 0) {
        stations.push({
          id: `genre-${genre.toLowerCase()}`,
          name: `Radio ${genre}`,
          description: `Lo mejor del ${genre} para ti`,
          type: 'genre',
          songs: shuffleArray([...genreSongs]),
          coverUrl: genreSongs[0]?.coverUrl || '/default-cover.jpg'
        });
      }
    });

    // Estaciones por estado de ánimo
    moods.forEach(mood => {
      const moodSongs = shuffleArray([...mockSongs]).slice(0, 20);
      stations.push({
        id: mood.id,
        name: mood.name,
        description: `Música perfecta para estar ${mood.name.toLowerCase()}`,
        type: 'mood',
        mood: mood,
        songs: moodSongs,
        coverUrl: moodSongs[0]?.coverUrl || '/default-cover.jpg'
      });
    });

    // Estación de favoritos (simulada)
    stations.push({
      id: 'favorites',
      name: 'Tus Favoritos',
      description: 'Las canciones que más te gustan',
      type: 'favorites',
      songs: shuffleArray([...mockSongs]).slice(0, 15),
      coverUrl: mockSongs[0]?.coverUrl || '/default-cover.jpg'
    });

    return stations;
  };

  const shuffleArray = (array: any[]) => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  const loadRadioStations = async () => {
    setIsLoadingRadio(true);
    try {
      // Simular carga
      await new Promise(resolve => setTimeout(resolve, 1000));
      const stations = generateRadioStations();
      setRadioStations(stations);
    } catch (error) {
      console.error('Error cargando estaciones:', error);
    } finally {
      setIsLoadingRadio(false);
    }
  };

  const playStation = (station: any) => {
    if (station.songs.length > 0) {
      setCurrentStation(station);
      setQueue(station.songs, 0);
      play(station.songs[0]);
      console.log(`📻 Reproduciendo estación: ${station.name}`);
    }
  };

  const handleRadioClick = () => {
    if (!showRadio && radioStations.length === 0) {
      loadRadioStations();
    }
    setShowRadio(!showRadio);
  };

  const getMoodIcon = (station: any) => {
    if (station.type === 'mood' && station.mood) {
      switch (station.id) {
        case 'energetic': return <Zap className="w-6 h-6" />;
        case 'relax': return <Moon className="w-6 h-6" />;
        case 'focus': return <Target className="w-6 h-6" />;
        case 'party': return <PartyPopper className="w-6 h-6" />;
        default: return <Radio className="w-6 h-6" />;
      }
    }
    return <Radio className="w-6 h-6" />;
  };

  const getStationColor = (station: any) => {
    if (station.type === 'mood' && station.mood) {
      return station.mood.color;
    }
    switch (station.type) {
      case 'favorites': return 'from-green-500 to-blue-500';
      case 'genre': return 'from-purple-500 to-blue-500';
      default: return 'from-gray-500 to-gray-600';
    }
  };

  const skipToNextInStation = () => {
    if (currentStation && currentStation.songs.length > 1) {
      const randomNext = Math.floor(Math.random() * currentStation.songs.length);
      play(currentStation.songs[randomNext]);
      console.log('⏭️ Siguiente canción en la estación');
    }
  };

  // Funciones para Explorar Géneros
  const handleGenresClick = () => {
    setShowGenres(!showGenres);
    if (!showGenres) {
      console.log('🎵 Abriendo exploración de géneros');
    }
  };

  const selectGenre = (genreName: string) => {
    setSelectedGenre(genreName);
    const filteredSongs = mockSongs.filter(song => song.genre === genreName);
    setGenreSongs(shuffleArray([...filteredSongs]));
    console.log(`🎸 Explorando género: ${genreName} (${filteredSongs.length} canciones)`);
  };

  const playGenrePlaylist = (genre: string) => {
    const filteredSongs = mockSongs.filter(song => song.genre === genre);
    if (filteredSongs.length > 0) {
      const shuffledSongs = shuffleArray([...filteredSongs]);
      setQueue(shuffledSongs, 0);
      play(shuffledSongs[0]);
      console.log(`🎵 Reproduciendo playlist de ${genre}`);
    }
  };

  const playGenreSong = (song: any, index: number) => {
    setQueue(genreSongs, index);
    play(song);
    console.log(`🎵 Reproduciendo: ${song.title} del género ${selectedGenre}`);
  };

  const handlePlay = (song: any) => {
    const songData = {
      id: song.id,
      title: song.title,
      artist: song.artist,
      album: song.album || '',
      genre: 'Pop', // Género por defecto
      duration: song.duration,
      coverUrl: song.coverUrl,
      fileUrl: `https://www.soundjay.com/misc/sounds/bell-ringing-05.wav` // URL de ejemplo
    };
    setQueue([songData], 0);
    play(songData);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-4"
      >
        <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-teal-500 rounded-2xl flex items-center justify-center">
          <Compass className="w-8 h-8 text-white" />
        </div>
        <div>
          <h1 className="text-4xl font-bold text-white mb-2">Descubrir</h1>
          <p className="text-gray-400">Explora nueva música personalizada para ti</p>
        </div>
      </motion.div>

      {/* Quick Discovery Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-4"
      >
        <Button variant="primary" className="h-16 justify-start text-left">
          <Shuffle className="w-6 h-6 mr-4" />
          <div>
            <div className="font-semibold">Mix Aleatorio</div>
            <div className="text-sm opacity-80">Descubre música nueva</div>
          </div>
        </Button>
        <Button
          variant="ghost"
          className="h-16 justify-start text-left border border-gray-700 hover:border-purple-500 transition-all duration-300"
          onClick={handleRadioClick}
        >
          <Radio className="w-6 h-6 mr-4" />
          <div>
            <div className="font-semibold flex items-center gap-2">
              Radio Personalizada
              {isLoadingRadio && <div className="w-4 h-4 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />}
            </div>
            <div className="text-sm opacity-80">Basada en tus gustos</div>
          </div>
        </Button>
        <Button
          variant="ghost"
          className="h-16 justify-start text-left border border-gray-700 hover:border-blue-500 transition-all duration-300"
          onClick={handleGenresClick}
        >
          <Music className="w-6 h-6 mr-4" />
          <div>
            <div className="font-semibold">Explorar Géneros</div>
            <div className="text-sm opacity-80">Por categorías</div>
          </div>
        </Button>
      </motion.div>

      {/* Radio Stations */}
      {showRadio && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.3 }}
          className="mb-8 overflow-hidden"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-white flex items-center gap-2">
              <Radio className="w-6 h-6" />
              Estaciones de Radio
            </h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowRadio(false)}
              className="text-gray-400 hover:text-white"
            >
              Ocultar
            </Button>
          </div>

          {currentStation && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gradient-to-r from-purple-600/20 to-blue-600/20 rounded-lg p-6 mb-6 border border-purple-500/30"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className={`w-16 h-16 rounded-lg bg-gradient-to-br ${getStationColor(currentStation)} flex items-center justify-center`}>
                    {getMoodIcon(currentStation)}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white">Reproduciendo ahora</h3>
                    <p className="text-purple-400 font-medium">{currentStation.name}</p>
                    <p className="text-gray-400 text-sm">{currentStation.description}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => playStation(currentStation)}
                    className="text-purple-400 hover:text-purple-300"
                  >
                    <Shuffle className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-red-400 hover:text-red-300"
                  >
                    <Heart className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </motion.div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {radioStations.map((station, index) => (
              <motion.div
                key={station.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`bg-gray-800/50 rounded-lg p-4 border transition-all duration-300 cursor-pointer group hover:bg-gray-700/50 ${currentStation?.id === station.id
                  ? 'border-purple-500 bg-purple-600/20'
                  : 'border-gray-700 hover:border-purple-500/50'
                  }`}
                onClick={() => playStation(station)}
              >
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${getStationColor(station)} flex items-center justify-center text-white`}>
                    {getMoodIcon(station)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-white truncate">{station.name}</h3>
                    <p className="text-gray-400 text-sm truncate">{station.description}</p>
                    <p className="text-gray-500 text-xs">{station.songs.length} canciones</p>
                  </div>
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <Play className="w-5 h-5 text-purple-400" />
                  </div>
                </div>

                {currentStation?.id === station.id && (
                  <div className="mt-3 pt-3 border-t border-purple-500/30">
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2 text-purple-400">
                        <Volume2 className="w-4 h-4" />
                        <span>Reproduciendo</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0 text-purple-400 hover:text-purple-300"
                          onClick={(e) => {
                            e.stopPropagation();
                            console.log(isPlaying ? '⏸️ Pausa' : '▶️ Play');
                          }}
                        >
                          {isPlaying ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0 text-purple-400 hover:text-purple-300"
                          onClick={(e) => {
                            e.stopPropagation();
                            skipToNextInStation();
                          }}
                        >
                          <SkipForward className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Genre Explorer */}
      {showGenres && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.3 }}
          className="mb-8 overflow-hidden"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-white flex items-center gap-2">
              <Music className="w-6 h-6" />
              Explorar por Género
            </h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowGenres(false)}
              className="text-gray-400 hover:text-white"
            >
              Ocultar
            </Button>
          </div>

          {!selectedGenre ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {genres.map((genre, index) => (
                <motion.div
                  key={genre.name}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                  className={`bg-gradient-to-br ${genre.color} rounded-xl p-6 cursor-pointer hover:scale-105 transition-all duration-300 group`}
                  onClick={() => selectGenre(genre.name)}
                >
                  <div className="text-white font-bold text-xl mb-2">{genre.name}</div>
                  <div className="text-white/80 text-sm mb-4">
                    {getGenreCount(genre.name)} canción{getGenreCount(genre.name) !== 1 ? 'es' : ''}
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-white/70 text-xs">Explorar</span>
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                      <Play className="w-5 h-5 text-white" />
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div>
              <div className="flex items-center gap-4 mb-6">
                <Button
                  variant="ghost"
                  onClick={() => setSelectedGenre(null)}
                  className="text-blue-400 hover:text-blue-300"
                >
                  ← Volver a géneros
                </Button>
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-white">{selectedGenre}</h3>
                  <p className="text-gray-400">{genreSongs.length} canciones disponibles</p>
                </div>
                <Button
                  onClick={() => playGenrePlaylist(selectedGenre)}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-full flex items-center gap-2"
                >
                  <Play className="w-4 h-4" />
                  Reproducir todo
                </Button>
              </div>

              <div className="space-y-3">
                {genreSongs.slice(0, 10).map((song, index) => (
                  <motion.div
                    key={song.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="flex items-center gap-4 p-3 rounded-lg hover:bg-gray-700/30 transition-colors group cursor-pointer"
                    onClick={() => playGenreSong(song, index)}
                  >
                    <div className="w-8 text-blue-400 text-lg font-bold">{index + 1}</div>
                    <div className="relative">
                      <img
                        src={song.coverUrl}
                        alt={song.title}
                        className="w-14 h-14 rounded-lg object-cover"
                      />
                      <div className="absolute inset-0 bg-black bg-opacity-50 rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <Play className="w-4 h-4 text-white fill-white" />
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-white font-medium truncate">{song.title}</h4>
                      <p className="text-gray-400 text-sm truncate">{song.artist}</p>
                    </div>
                    <div className="text-gray-400 text-sm hidden md:block">
                      {song.album}
                    </div>
                    <div className="text-gray-400 text-sm w-12 text-right">
                      {formatDuration(song.duration)}
                    </div>
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button variant="ghost" size="sm">
                        <Heart className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="w-4 h-4" />
                      </Button>
                    </div>
                  </motion.div>
                ))}

                {genreSongs.length > 10 && (
                  <div className="text-center pt-4">
                    <Button
                      variant="ghost"
                      onClick={() => playGenrePlaylist(selectedGenre)}
                      className="text-blue-400 hover:text-blue-300"
                    >
                      Ver las {genreSongs.length - 10} canciones restantes
                    </Button>
                  </div>
                )}
              </div>
            </div>
          )}
        </motion.div>
      )}

      {/* Featured Playlists */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white">Playlists Destacadas</h2>
          <Button variant="ghost" size="sm">Ver todas</Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredPlaylists.map((playlist, index) => (
            <motion.div
              key={playlist.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * index }}
              className="bg-gray-800/30 rounded-xl p-4 hover:bg-gray-800/50 transition-colors group cursor-pointer"
            >
              <div className="relative mb-4">
                <img
                  src={playlist.coverUrl}
                  alt={playlist.title}
                  className="w-full aspect-square rounded-lg object-cover"
                />
                <Button
                  variant="primary"
                  size="lg"
                  className="absolute bottom-2 right-2 rounded-full w-12 h-12 p-0 opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                >
                  <Play className="w-5 h-5 ml-0.5" />
                </Button>
              </div>
              <h3 className="text-white font-semibold mb-1">{playlist.title}</h3>
              <p className="text-gray-400 text-sm mb-2">{playlist.description}</p>
              <div className="flex items-center gap-2 text-gray-500 text-xs">
                <span>{playlist.songCount} canciones</span>
                <span>•</span>
                <span>{playlist.duration}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* New Releases */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-gray-800/30 rounded-xl p-6"
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white">Nuevos Lanzamientos</h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/library')}
            className="hover:text-blue-400 transition-colors"
          >
            Ver todos
          </Button>
        </div>

        <div className="space-y-3">
          {newReleases.map((song, index) => (
            <motion.div
              key={song.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 * index }}
              className="flex items-center gap-4 p-3 rounded-lg hover:bg-gray-700/30 transition-colors group"
            >
              {/* Cover */}
              <div className="relative">
                <img
                  src={song.coverUrl}
                  alt={song.title}
                  className="w-14 h-14 rounded-lg object-cover"
                />
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => handlePlay(song)}
                  className="absolute inset-0 w-full h-full rounded-lg opacity-0 group-hover:opacity-100 transition-opacity bg-black/50"
                >
                  <Play className="w-4 h-4" />
                </Button>
              </div>

              {/* Song Info */}
              <div className="flex-1 min-w-0">
                <h3 className="text-white font-medium truncate">{song.title}</h3>
                <p className="text-gray-400 text-sm truncate">{song.artist}</p>
              </div>

              {/* Album */}
              <div className="hidden md:block text-gray-400 text-sm min-w-0 flex-1">
                <span className="truncate">{song.album}</span>
              </div>

              {/* Release Date */}
              <div className="text-gray-400 text-sm">
                {new Date(song.releaseDate).toLocaleDateString('es-ES', {
                  month: 'short',
                  day: 'numeric'
                })}
              </div>

              {/* Duration */}
              <div className="text-gray-400 text-sm w-12 text-right">
                {formatDuration(song.duration)}
              </div>

              {/* Actions */}
              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button variant="ghost" size="sm">
                  <Heart className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="sm">
                  <MoreHorizontal className="w-4 h-4" />
                </Button>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Personalized Recommendations */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="grid grid-cols-1 md:grid-cols-2 gap-6"
      >
        <div className="bg-gray-800/30 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Basado en tu Actividad</h3>
          <div className="space-y-3">
            <div className="text-gray-400 text-sm mb-4">
              Porque escuchaste mucho Pop y Rock esta semana
            </div>
            <Button variant="ghost" className="w-full justify-start">
              <Music className="w-4 h-4 mr-3" />
              Mix Pop-Rock Personalizado
            </Button>
            <Button variant="ghost" className="w-full justify-start">
              <Radio className="w-4 h-4 mr-3" />
              Radio de Artistas Similares
            </Button>
          </div>
        </div>

        <div className="bg-gray-800/30 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Tendencias en tu Área</h3>
          <div className="space-y-3">
            <div className="text-gray-400 text-sm mb-4">
              Lo más popular en tu región
            </div>
            <Button variant="ghost" className="w-full justify-start">
              <Compass className="w-4 h-4 mr-3" />
              Top Local
            </Button>
            <Button variant="ghost" className="w-full justify-start">
              <Music className="w-4 h-4 mr-3" />
              Artistas Emergentes Locales
            </Button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default DiscoverPage;
