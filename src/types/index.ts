// Core Types for StreamFlow Music Platform

export interface User {
  id: string;
  email: string;
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
}

export interface Playlist {
  id: string;
  name: string;
  description?: string;
  coverUrl?: string;
  userId: string;
  songs: Song[];
  createdAt: string;
  isPublic: boolean;
  totalDuration: number;
}

export interface PlayHistory {
  id: string;
  userId: string;
  songId: string;
  song: Song;
  playedAt: string;
  duration: number; // seconds listened
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
  genre?: string;
  artist?: string;
  year?: number;
  sortBy: 'title' | 'artist' | 'year' | 'plays' | 'duration';
  sortOrder: 'asc' | 'desc';
}

export interface ApiResponse<T> {
  data: T;
  meta?: {
    total: number;
    page: number;
    limit: number;
    hasMore: boolean;
  };
  error?: string;
}

export interface Payment {
  id: string;
  amount: number;
  currency: string;
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  date: string;
  subscriptionId: string;
  paymentMethod: string;
}