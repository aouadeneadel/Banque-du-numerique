import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './components/ui/tabs';
import { Toaster } from './components/ui/sonner';
import { DeviceManagement } from './components/DeviceManagement';
import { Statistics } from './components/Statistics';
import { EmailSending } from './components/EmailSending';
import { DeliveryNote } from './components/DeliveryNote';
import { ExportBackup } from './components/ExportBackup';
import { Monitor, BarChart3, Mail, FileText, Database } from 'lucide-react';
import logo from './banque_du_numerique_logo.jpg';

export default function App() {
  const [activeTab, setActiveTab] = useState('gestion');
  const [backendStatus, setBackendStatus] = useState<string | null>(null);
  const [dbStatus, setDbStatus] = useState<string | null>(null);

  // Vérifie la connexion au backend (via un endpoint PHP qui répond toujours)
  useEffect(() => {
    fetch('http://localhost/BanqueDuNumerique/backend/check_backend.php')
      .then(res => {
        if (res.ok) {
          setBackendStatus('Connexion au backend réussie');
        } else {
          setBackendStatus('Erreur de connexion au backend');
        }
      })
      .catch(() => setBackendStatus('Impossible de joindre le backend'));
  }, []);

  // Vérifie la connexion à la base de données via un endpoint PHP dédié
  useEffect(() => {
    fetch('http://localhost/BanqueDuNumerique/backend/check_db.php')
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setDbStatus('Connexion à la base de données réussie');
        } else {
          setDbStatus('Erreur de connexion à la base de données');
        }
      })
      .catch(() => setDbStatus('Impossible de vérifier la base de données'));
  }, []);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            {/* Logo */}
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 rounded-lg overflow-hidden">
                <img 
                  src={logo} 
                  alt="Banque du Numérique Logo" 
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <h1 className="text-xl font-bold text-foreground">Banque du Numérique</h1>
                <p className="text-sm text-muted-foreground">Gestion PCs & Smartphones</p>
              </div>
            </div>

            {/* Title */}
            <div className="text-right">
              <h2 className="text-2xl font-bold text-primary">
                {activeTab === 'gestion' && 'Gestion des Appareils'}
                {activeTab === 'statistiques' && 'Statistiques'}
                {activeTab === 'email' && 'Envoi d\'Emails'}
                {activeTab === 'livraison' && 'Bon de Livraison'}
                {activeTab === 'export' && 'Export & Sauvegarde'}
              </h2>
            </div>
          </div>
        </div>
      </header>

      {/* Affichage du statut de connexion backend et base de données */}
      {(backendStatus || dbStatus) && (
        <div className="mb-4 text-sm text-center">
          {backendStatus && (
            <div className={backendStatus.includes('réussie') ? 'text-green-600' : 'text-red-600'}>
              {backendStatus}
            </div>
          )}
          {dbStatus && (
            <div className={dbStatus.includes('réussie') ? 'text-green-600' : 'text-red-600'}>
              {dbStatus}
            </div>
          )}
        </div>
      )}

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-5 mb-8 bg-white border border-border rounded-lg p-1">
            <TabsTrigger 
              value="gestion" 
              className="flex items-center space-x-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              <Monitor className="w-4 h-4" />
              <span className="hidden sm:inline">Gestion des Appareils</span>
            </TabsTrigger>
            <TabsTrigger 
              value="statistiques"
              className="flex items-center space-x-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              <BarChart3 className="w-4 h-4" />
              <span className="hidden sm:inline">Statistiques</span>
            </TabsTrigger>
            <TabsTrigger 
              value="email"
              className="flex items-center space-x-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              <Mail className="w-4 h-4" />
              <span className="hidden sm:inline">Envoi d'Emails</span>
            </TabsTrigger>
            <TabsTrigger 
              value="livraison"
              className="flex items-center space-x-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              <FileText className="w-4 h-4" />
              <span className="hidden sm:inline">Bon de Livraison</span>
            </TabsTrigger>
            <TabsTrigger 
              value="export"
              className="flex items-center space-x-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              <Database className="w-4 h-4" />
              <span className="hidden sm:inline">Export & Sauvegarde</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="gestion" className="mt-0">
            <DeviceManagement />
          </TabsContent>

          <TabsContent value="statistiques" className="mt-0">
            <Statistics />
          </TabsContent>

          <TabsContent value="email" className="mt-0">
            <EmailSending />
          </TabsContent>

          <TabsContent value="livraison" className="mt-0">
            <DeliveryNote />
          </TabsContent>

          <TabsContent value="export" className="mt-0">
            <ExportBackup />
          </TabsContent>
        </Tabs>
      </main>

      {/* Toast Notifications */}
      <Toaster 
        position="top-right"
        closeButton
        richColors
        duration={3000}
      />

      {/* Footer */}
      <footer className="bg-white border-t border-border mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center text-sm text-muted-foreground">
            <p>© 2024 Banque du Numérique - Système de gestion des PCs & Smartphones</p>
            <p>Version 1.0.0</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
