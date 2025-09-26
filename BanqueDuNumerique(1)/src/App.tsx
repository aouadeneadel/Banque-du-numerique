import React, { useState } from 'react';
import { Toaster } from './components/ui/sonner';
import { DeviceManagement } from './components/DeviceManagement';
import { Statistics } from './components/Statistics';
import { EmailSending } from './components/EmailSending';
import { DeliveryNote } from './components/DeliveryNote';
import { ImportExport } from './components/ImportExport';
import { InterlocuteurManagement } from './components/InterlocuteurManagement';
import { Solidon } from './components/Solidon';
import { LoginForm } from './components/LoginForm';
import { Monitor, BarChart3, Mail, FileText, Database, Users, LogOut, Heart } from 'lucide-react';
import { Button } from './components/ui/button';
import logo from 'figma:asset/b7b032ff91a47a41bb6db4787650cada2e958077.png';

const menuItems = [
  {
    id: 'gestion',
    title: 'Appareils',
    subtitle: 'Gestion du matériel',
    icon: Monitor,
    color: 'from-primary to-primary/80'
  },
  {
    id: 'interlocuteurs',
    title: 'Contacts',
    subtitle: 'Interlocuteurs',
    icon: Users,
    color: 'from-secondary to-secondary/80'
  },
  {
    id: 'email',
    title: 'Emails',
    subtitle: 'Communication',
    icon: Mail,
    color: 'from-accent to-accent/80'
  },
  {
    id: 'livraison',
    title: 'Livraison',
    subtitle: 'Bons de livraison',
    icon: FileText,
    color: 'from-primary/80 to-secondary'
  },
  {
    id: 'solidon',
    title: 'Solidon',
    subtitle: 'Dons solidaires',
    icon: Heart,
    color: 'from-secondary/80 to-accent'
  },
  {
    id: 'statistiques',
    title: 'Stats',
    subtitle: 'Statistiques',
    icon: BarChart3,
    color: 'from-accent/80 to-primary'
  },
  {
    id: 'import',
    title: 'Données',
    subtitle: 'Import & Export',
    icon: Database,
    color: 'from-primary/60 to-secondary/60'
  }
];

export default function App() {
  const [activeTab, setActiveTab] = useState('gestion');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState<string | null>(null);

  const handleLogin = (credentials: { username: string; password: string }) => {
    setIsAuthenticated(true);
    setCurrentUser(credentials.username);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setCurrentUser(null);
    setActiveTab('gestion');
  };

  if (!isAuthenticated) {
    return <LoginForm onLogin={handleLogin} />;
  }

  const currentMenuItem = menuItems.find(item => item.id === activeTab);

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-red-50 relative overflow-hidden">
      {/* Background Decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-rose-200/30 to-pink-200/30 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-pink-200/30 to-rose-300/30 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-1/3 left-1/3 w-64 h-64 bg-gradient-to-r from-rose-300/20 to-pink-300/20 rounded-full blur-2xl animate-pulse"></div>
      </div>

      {/* Header */}
      <header className="relative z-10 bg-gradient-to-r from-rose-500 via-pink-500 to-red-500 shadow-2xl border-b border-white/20 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center py-4 gap-3">
            {/* Logo et Info */}
            <div className="flex items-center space-x-4">
              <div className="h-14 bg-white/95 rounded-2xl px-4 py-2 shadow-xl backdrop-blur-sm">
                <img 
                  src={logo} 
                  alt="Banque du Numérique Logo" 
                  className="h-10 w-auto object-contain"
                />
              </div>
              <div className="hidden sm:block">
                <h1 className="text-xl font-bold text-white">Banque du Numérique</h1>
                <p className="text-sm text-white/80">Gestion d'inventaire PCs & Smartphones</p>
              </div>
            </div>

            {/* Current Section Title */}
            <div className="flex-1 text-center sm:mx-8">
              <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-white">
                {currentMenuItem?.title}
              </h2>
              <p className="text-sm text-white/80 hidden sm:block">{currentMenuItem?.subtitle}</p>
            </div>
            
            {/* User Info et Logout */}
            <div className="flex items-center space-x-3">
              <div className="text-right hidden md:block">
                <p className="text-xs text-white/90">Connecté en tant que</p>
                <p className="text-sm font-medium text-white">{currentUser}</p>
              </div>
              <Button
                onClick={handleLogout}
                variant="outline"
                size="sm"
                className="bg-white/10 border-white/20 text-white hover:bg-white/20 hover:text-white backdrop-blur-sm"
              >
                <LogOut className="w-4 h-4 sm:mr-2" />
                <span className="hidden sm:inline">Déconnexion</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-6">
        {/* Navigation Menu */}
        <div className="mb-8">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7 gap-3 lg:gap-4">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`group relative overflow-hidden rounded-2xl p-4 sm:p-6 transition-all duration-300 transform hover:scale-105 hover:shadow-xl ${
                    isActive 
                      ? `bg-gradient-to-br ${item.color} text-white shadow-2xl ring-2 ring-white/30` 
                      : 'bg-white/70 hover:bg-white/90 text-gray-700 shadow-lg hover:shadow-xl backdrop-blur-sm'
                  }`}
                >
                  <div className="relative z-10 flex flex-col items-center space-y-2 sm:space-y-3">
                    <div className={`p-2 sm:p-3 rounded-xl transition-all duration-300 ${
                      isActive 
                        ? 'bg-white/20 shadow-lg' 
                        : 'bg-rose-100/80 group-hover:bg-rose-200/80 group-hover:shadow-md'
                    }`}>
                      <Icon className={`w-5 h-5 sm:w-6 sm:h-6 ${isActive ? 'text-white' : 'text-rose-600'}`} />
                    </div>
                    <div className="text-center">
                      <h3 className="font-semibold text-sm sm:text-base">{item.title}</h3>
                      <p className={`text-xs hidden sm:block ${isActive ? 'text-white/80' : 'text-gray-500'}`}>
                        {item.subtitle}
                      </p>
                    </div>
                  </div>
                  
                  {/* Active indicator */}
                  {isActive && (
                    <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent rounded-2xl animate-pulse"></div>
                  )}
                  
                  {/* Hover effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 rounded-2xl"></div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Content Area */}
        <div className="bg-white/40 backdrop-blur-md rounded-3xl p-4 sm:p-6 lg:p-8 shadow-2xl border border-white/30 min-h-[60vh]">
          {activeTab === 'gestion' && <DeviceManagement />}
          {activeTab === 'interlocuteurs' && <InterlocuteurManagement />}
          {activeTab === 'email' && <EmailSending />}
          {activeTab === 'livraison' && <DeliveryNote />}
          {activeTab === 'solidon' && <Solidon />}
          {activeTab === 'statistiques' && <Statistics />}
          {activeTab === 'import' && <ImportExport />}
        </div>
      </main>

      {/* Toast Notifications */}
      <Toaster 
        position="top-right"
        closeButton
        richColors
        duration={3000}
      />

      {/* Footer */}
      <footer className="relative z-10 bg-white/20 backdrop-blur-sm border-t border-white/30 mt-8">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row justify-between items-center text-xs sm:text-sm text-gray-600 gap-2">
            <p className="text-center sm:text-left">© 2024 Banque du Numérique - Gestion d'inventaire</p>
            <p>Version 1.0.0</p>
          </div>
        </div>
      </footer>
    </div>
  );
}