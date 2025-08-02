import { User } from '../types';
import { mockUser } from '../data/mockData';
import toast from 'react-hot-toast';

// Mock users database
const mockUsers: User[] = [
  mockUser,
  {
    id: '2',
    email: 'demo@demo.com',
    name: 'Demo User',
    password: 'demo123',
    createdAt: new Date().toISOString(),
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=demo@demo.com',
    subscription: {
      id: '2',
      type: 'monthly',
      startDate: new Date().toISOString(),
      status: 'active',
      userId: '2',
    },
  },
];

// Simulate network delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export class MockAuthService {
  private static currentUser: User | null = null;
  private static token: string | null = null;

  static async login(email: string, password: string): Promise<{ user: User; token: string }> {
    await delay(1000); // Simulate network delay

    const user = mockUsers.find(u => u.email === email && u.password === password);
    
    if (!user) {
      throw new Error('Credenciales inválidas');
    }

    this.currentUser = user;
    this.token = `mock-token-${user.id}-${Date.now()}`;
    
    // Store in localStorage for persistence
    localStorage.setItem('auth-user', JSON.stringify(user));
    localStorage.setItem('auth-token', this.token);

    return { user, token: this.token };
  }

  static async register(email: string, password: string, name: string): Promise<{ user: User; token: string }> {
    await delay(1000); // Simulate network delay

    // Check if user already exists
    if (mockUsers.find(u => u.email === email)) {
      throw new Error('El usuario ya existe');
    }

    const newUser: User = {
      id: `user-${Date.now()}`,
      email,
      password,
      name,
      createdAt: new Date().toISOString(),
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${email}`,
      subscription: {
        id: `sub-${Date.now()}`,
        type: 'free',
        startDate: new Date().toISOString(),
        status: 'active',
        userId: `user-${Date.now()}`,
      },
    };

    mockUsers.push(newUser);
    this.currentUser = newUser;
    this.token = `mock-token-${newUser.id}-${Date.now()}`;

    // Store in localStorage for persistence
    localStorage.setItem('auth-user', JSON.stringify(newUser));
    localStorage.setItem('auth-token', this.token);

    return { user: newUser, token: this.token };
  }

  static logout(): void {
    this.currentUser = null;
    this.token = null;
    localStorage.removeItem('auth-user');
    localStorage.removeItem('auth-token');
  }

  static getCurrentUser(): User | null {
    if (this.currentUser) {
      return this.currentUser;
    }

    // Try to restore from localStorage
    const storedUser = localStorage.getItem('auth-user');
    const storedToken = localStorage.getItem('auth-token');
    
    if (storedUser && storedToken) {
      this.currentUser = JSON.parse(storedUser);
      this.token = storedToken;
      return this.currentUser;
    }

    return null;
  }

  static getToken(): string | null {
    if (this.token) {
      return this.token;
    }

    return localStorage.getItem('auth-token');
  }

  static isAuthenticated(): boolean {
    return this.getCurrentUser() !== null && this.getToken() !== null;
  }

  static async updateProfile(updates: Partial<User>): Promise<User> {
    await delay(500);

    if (!this.currentUser) {
      throw new Error('No hay usuario autenticado');
    }

    // Update the user
    this.currentUser = { ...this.currentUser, ...updates };
    
    // Update in mock database
    const userIndex = mockUsers.findIndex(u => u.id === this.currentUser!.id);
    if (userIndex >= 0) {
      mockUsers[userIndex] = this.currentUser;
    }

    // Update localStorage
    localStorage.setItem('auth-user', JSON.stringify(this.currentUser));

    return this.currentUser;
  }
}