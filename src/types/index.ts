// Core Types for StreamFlow Music Platform

export interface User {
  id: string;
  email: string;
  password: string;
  name: string;
  avatar?: string;
  createdAt: string;
  subscription?: Subscription;
}

export interface Subscription {
  id: string;
  type: 'free' | 'monthly' | 'annual';
  startDate: string;
  endDate?: string;
  status: 'active' | 'cancelled' | 'expired';
  userId: string;
}

export interface Song {
  id: string;
  title: string;
  artist: string;
  album?: string;
  genre: string;
  duration: number; // in seconds
  year?: number;
  fileUrl: string;
  coverUrl?: string;
  plays?: number;
  liked?: boolean;
  lyrics?: string;
  explicit?: boolean;
  bpm?: number;
  albumId?: string;
  trackNumber?: number;
  addedAt?: string;
  isInLibrary?: boolean;
}

export interface Playlist {
  id: string;
  name: string;
  description?: string;
  coverUrl?: string;
  userId: string;
  songs: Song[];
  createdAt: string;
  updatedAt: string;
  isPublic: boolean;
  totalDuration: number;
  followersCount: number;
  isFollowing?: boolean;
  tags?: string[];
  collaborative: boolean;
  collaborators?: string[];
}

export interface PlayHistory {
  id: string;
  userId: string;
  songId: string;
  song: Song;
  playedAt: string;
  duration: number; // seconds listened
  context?: {
    type: 'playlist' | 'album' | 'artist' | 'search' | 'radio';
    id?: string;
    name?: string;
  };
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface PlayerState {
  currentSong: Song | null;
  isPlaying: boolean;
  volume: number;
  currentTime: number;
  queue: Song[];
  currentIndex: number;
  shuffle: boolean;
  repeat: 'none' | 'one' | 'all';
}

export interface SearchFilters {
  query: string;
  type?: 'all' | 'songs' | 'albums' | 'artists' | 'playlists' | 'users';
  genre?: string;
  artist?: string;
  year?: number;
  sortBy: 'title' | 'artist' | 'year' | 'plays' | 'duration' | 'relevance' | 'popularity';
  sortOrder: 'asc' | 'desc';
  limit?: number;
  offset?: number;
  explicit?: boolean;
  bpm?: {
    min?: number;
    max?: number;
  };
  duration?: {
    min?: number;
    max?: number;
  };
  includeLiked?: boolean;
  includeOwned?: boolean;
}

export interface ApiResponse<T> {
  data: T;
  meta?: {
    total: number;
    page: number;
    limit: number;
    hasMore: boolean;
    query?: string;
    filters?: Partial<SearchFilters>;
  };
  error?: string;
  success: boolean;
  timestamp: string;
}

export interface Album {
  id: string;
  title: string;
  artist: string;
  artistId: string;
  coverUrl: string;
  releaseDate: string;
  genre: string;
  trackCount: number;
  duration: number;
  type: 'album' | 'single' | 'ep' | 'compilation';
  copyright: string;
  upc?: string;
  isrc?: string;
  label?: string;
  popularity: number;
  explicit: boolean;
  addedAt: string;
  isInLibrary?: boolean;
  tracks?: Song[];
}

export interface Artist {
  id: string;
  name: string;
  bio?: string;
  avatarUrl?: string;
  coverUrl?: string;
  followers: number;
  isFollowing?: boolean;
  genres: string[];
  popularity: number;
  monthlyListeners: number;
  albums: Album[];
  topTracks: Song[];
  relatedArtists: Artist[];
  isVerified: boolean;
}

export interface RecommendationSeed {
  id: string;
  type: 'artist' | 'track' | 'genre';
  href: string;
}

export interface Recommendations {
  tracks: Song[];
  seeds: RecommendationSeed[];
}

export interface LibraryItem {
  id: string;
  type: 'song' | 'album' | 'artist' | 'playlist';
  addedAt: string;
  item: Song | Album | Artist | Playlist;
}

export interface Payment {
  id: string;
  amount: number;
  currency: string;
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  date: string;
  userId: string;
  subscriptionId: string;
  paymentMethod: string;
}

export interface SearchResults {
  songs: Song[];
  albums: Album[];
  artists: Artist[];
  playlists: Playlist[];
  users: User[];
  total: number;
  query: string;
  filters: SearchFilters;
}

export interface UploadedTrack {
  id: string;
  title: string;
  file: File;
  status: 'uploading' | 'processing' | 'completed' | 'failed';
  progress: number;
  error?: string;
  metadata?: Partial<Song>;
}