import React, { useState } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { PlayerProvider } from './contexts/PlayerContext';
import { Header } from './components/layout/Header';
import { Sidebar } from './components/layout/Sidebar';
import { MusicPlayer } from './components/player/MusicPlayer';
import { HomePage } from './pages/HomePage';
import { AuthPage } from './pages/AuthPage';

const AppContent: React.FC = () => {
  const { isAuthenticated, isLoading } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState('home');

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl flex items-center justify-center mx-auto mb-4 animate-pulse">
            <span className="text-white font-bold text-2xl">SF</span>
          </div>
          <p className="text-gray-400">Cargando StreamFlow Music...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <AuthPage />;
  }

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <HomePage />;
      case 'search':
        return <div className="text-white">Página de Búsqueda - Próximamente</div>;
      case 'library':
        return <div className="text-white">Página de Biblioteca - Próximamente</div>;
      default:
        return <HomePage />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Layout Container */}
      <div className="flex h-screen">
        {/* Sidebar */}
        <Sidebar
          isOpen={sidebarOpen}
          currentPage={currentPage}
          onPageChange={setCurrentPage}
        />

        {/* Main Content */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Header */}
          <Header onMenuToggle={() => setSidebarOpen(!sidebarOpen)} />

          {/* Page Content */}
          <main className="flex-1 overflow-y-auto p-4 lg:p-6 pb-32">
            <div className="max-w-screen-2xl mx-auto">
              {renderPage()}
            </div>
          </main>
        </div>
      </div>

      {/* Music Player */}
      <MusicPlayer />

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <PlayerProvider>
          <AppContent />
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 3000,
              style: {
                background: '#1f2937',
                color: '#fff',
                border: '1px solid #374151',
              },
              success: {
                iconTheme: {
                  primary: '#8b5cf6',
                  secondary: '#fff',
                },
              },
            }}
          />
        </PlayerProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;