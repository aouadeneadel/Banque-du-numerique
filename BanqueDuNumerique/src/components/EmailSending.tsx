import React, { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Mail, Send, Settings, CheckCircle, Monitor, Smartphone } from 'lucide-react';
import { toast } from 'sonner';

interface Device {
  id: number;
  type: 'PC' | 'Smartphone';
  modele: string;
  marque: string;
  etat: string;
  numeroSerie: string;
  numeroInventaire: string;
}

export function EmailSending() {
  // Charger les appareils depuis le backend PHP au montage
  React.useEffect(() => {
    fetch('http://localhost:4000/get_devices.php')
      .then(res => res.json())
      .then(data => {
        // Adapter les champs de la base à Device
        const mapped = data.map((item: any) => ({
          id: item.id,
          type: item.type === 'PC' || item.type === 'Smartphone' ? item.type : (item.type && item.type.toLowerCase().includes('phone') ? 'Smartphone' : 'PC'),
          modele: item.modele || '',
          marque: item.marque || '',
          etat: item.etat || '',
          numeroSerie: item.numeroSerie || '',
          numeroInventaire: item.numeroInventaire || ''
        }));
        setAvailableDevices(mapped);
      })
      .catch(() => toast.error('Erreur lors du chargement des appareils'));
  }, []);
  const [smtpConfig, setSMTPConfig] = useState({
    serveur: 'smtp.gmail.com', // Configuration automatique
    port: '587', // Port standard sécurisé
    email: '',
    motdepasse: ''
  });

  const [recipient, setRecipient] = useState('');
  const [selectedDevice, setSelectedDevice] = useState<Device | null>(null);
  const [isConfigured, setIsConfigured] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [activeTab, setActiveTab] = useState<'PC' | 'Smartphone'>('PC');

  // Les appareils seront chargés depuis la base de données
  const [availableDevices, setAvailableDevices] = useState<Device[]>([]);

  const handleConfigSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (smtpConfig.email && smtpConfig.motdepasse) {
      setIsConfigured(true);
      toast.success('Configuration email sauvegardée avec succès');
    } else {
      toast.error('Veuillez remplir votre email et mot de passe');
    }
  };

  const handleSendEmail = async () => {
    if (!selectedDevice || !recipient) {
      toast.error('Veuillez sélectionner un appareil et saisir un destinataire');
      return;
    }

    if (!isConfigured) {
      toast.error('Veuillez configurer votre email d\'abord');
      return;
    }

    setIsSending(true);
    try {
      const res = await fetch('http://localhost:4000/send_email.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to: recipient,
          subject: `${selectedDevice.type === 'PC' ? 'PC' : 'Smartphone'} ${selectedDevice.marque} ${selectedDevice.modele} prêt pour livraison`,
          message: `Bonjour,\n\nVotre ${selectedDevice.type === 'PC' ? 'ordinateur' : 'smartphone'} est prêt pour livraison.\nModèle: ${selectedDevice.modele}\nMarque: ${selectedDevice.marque}\nNuméro de série: ${selectedDevice.numeroSerie}\nNuméro d'inventaire: ${selectedDevice.numeroInventaire}\nÉtat: ${selectedDevice.etat}\n\nCordialement,\nL'équipe Banque du Numérique`
        })
      });
      const data = await res.json();
      if (data.success) {
        toast.success(`Email envoyé avec succès à ${recipient}`);
        setRecipient('');
        setSelectedDevice(null);
      } else {
        toast.error(data.error || 'Erreur lors de l\'envoi de l\'email');
      }
    } catch (e) {
      toast.error('Erreur lors de l\'envoi de l\'email');
    }
    setIsSending(false);
  };

  const handleSMTPChange = (field: string, value: string) => {
    setSMTPConfig(prev => ({ ...prev, [field]: value }));
    if (isConfigured) setIsConfigured(false);
  };

  const filteredDevices = availableDevices.filter(device => device.type === activeTab);

  const renderDeviceDetails = (device: Device) => {
    return (
      <div className="space-y-2">
        <p><strong>ID:</strong> {device.id}</p>
        <p><strong>Type:</strong> {device.type === 'PC' ? 'Ordinateur' : 'Smartphone'}</p>
        <p><strong>Modèle:</strong> {device.modele}</p>
        <p><strong>Marque:</strong> {device.marque}</p>
        <p><strong>N° Série:</strong> <span className="font-mono text-sm">{device.numeroSerie}</span></p>
        <p><strong>N° Inventaire:</strong> <span className="font-mono text-sm">{device.numeroInventaire}</span></p>
        <p><strong>État:</strong> 
          <span className={`ml-2 px-2 py-1 rounded-full text-xs ${
            device.etat === 'Livré' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
          }`}>
            {device.etat}
          </span>
        </p>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-3">
        <Mail className="w-8 h-8 text-primary" />
        <h2 className="text-2xl font-semibold text-foreground">Envoi d'Emails - Appareils Prêts pour Livraison</h2>
      </div>

      {/* SMTP Configuration */}
      <Card className="border-l-4 border-l-primary">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Settings className="w-5 h-5" />
            <span>Configuration Email</span>
            {isConfigured && <CheckCircle className="w-5 h-5 text-green-500" />}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-4 p-3 bg-muted/30 rounded-lg">
            <p className="text-sm text-muted-foreground">
              <strong>Configuration automatique :</strong> Gmail SMTP (smtp.gmail.com:587)
            </p>
          </div>
          
          <form onSubmit={handleConfigSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="email">Email Expéditeur</Label>
                <Input
                  id="email"
                  type="email"
                  value={smtpConfig.email}
                  onChange={(e) => handleSMTPChange('email', e.target.value)}
                  placeholder="votre-email@gmail.com"
                />
              </div>
              <div>
                <Label htmlFor="motdepasse">Mot de passe d'application</Label>
                <Input
                  id="motdepasse"
                  type="password"
                  value={smtpConfig.motdepasse}
                  onChange={(e) => handleSMTPChange('motdepasse', e.target.value)}
                  placeholder="••••••••••••••••"
                />
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <p className="text-sm text-blue-800">
                <strong>Conseil :</strong> Utilisez un mot de passe d'application Gmail pour une sécurité optimale.
              </p>
            </div>

            <Button 
              type="submit" 
              className="bg-secondary hover:bg-secondary/90 text-secondary-foreground"
            >
              <Settings className="w-4 h-4 mr-2" />
              Sauvegarder Configuration
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Email Sending Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recipient & Device Selection */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Destinataire</CardTitle>
            </CardHeader>
            <CardContent>
              <div>
                <Label htmlFor="destinataire">Email Destinataire</Label>
                <Input
                  id="destinataire"
                  type="email"
                  value={recipient}
                  onChange={(e) => setRecipient(e.target.value)}
                  placeholder="client@exemple.com"
                />
              </div>
            </CardContent>
          </Card>

          {selectedDevice && (
            <Card className="border-l-4 border-l-green-500">
              <CardHeader>
                <CardTitle className="text-green-700 flex items-center space-x-2">
                  {selectedDevice.type === 'PC' ? <Monitor className="w-5 h-5" /> : <Smartphone className="w-5 h-5" />}
                  <span>{selectedDevice.type === 'PC' ? 'PC' : 'Smartphone'} Sélectionné</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {renderDeviceDetails(selectedDevice)}
              </CardContent>
            </Card>
          )}
        </div>

        {/* Device Selection Table */}
        <Card>
          <CardHeader>
            <CardTitle>Sélectionner un Appareil</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={(value: string) => setActiveTab(value as 'PC' | 'Smartphone')} className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-4 bg-white border border-border rounded-lg p-1">
                <TabsTrigger 
                  value="PC" 
                  className="flex items-center space-x-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                >
                  <Monitor className="w-4 h-4" />
                  <span>PCs</span>
                </TabsTrigger>
                <TabsTrigger 
                  value="Smartphone"
                  className="flex items-center space-x-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                >
                  <Smartphone className="w-4 h-4" />
                  <span>Smartphones</span>
                </TabsTrigger>
              </TabsList>

              <div className="max-h-64 overflow-y-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>Modèle</TableHead>
                      <TableHead>Marque</TableHead>
                      <TableHead>N° Série</TableHead>
                      <TableHead>État</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredDevices.map((device) => (
                      <TableRow 
                        key={device.id}
                        className={`cursor-pointer hover:bg-accent/50 ${selectedDevice?.id === device.id ? 'bg-accent' : ''}`}
                        onClick={() => setSelectedDevice(device)}
                      >
                        <TableCell>{device.id}</TableCell>
                        <TableCell>{device.modele}</TableCell>
                        <TableCell>{device.marque}</TableCell>
                        <TableCell className="font-mono text-sm">{device.numeroSerie}</TableCell>
                        <TableCell>
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            device.etat === 'Livré' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {device.etat}
                          </span>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </Tabs>
          </CardContent>
        </Card>
      </div>

      {/* Send Email Button */}
      <div className="flex justify-center pt-4">
        <Button 
          onClick={handleSendEmail}
          disabled={!selectedDevice || !recipient || !isConfigured || isSending}
          className="bg-primary hover:bg-primary/90 px-8 py-3 text-lg"
        >
          <Send className={`w-5 h-5 mr-2 ${isSending ? 'animate-pulse' : ''}`} />
          {isSending ? 'Envoi en cours...' : 'Envoyer Email'}
        </Button>
      </div>

      {/* Email Preview */}
      {selectedDevice && recipient && (
        <Card className="border-dashed border-2 border-muted">
          <CardHeader>
            <CardTitle className="text-muted-foreground">Aperçu de l'email</CardTitle>
          </CardHeader>
          <CardContent className="bg-muted/30 rounded-lg p-4">
            <div className="space-y-2 text-sm">
              <p><strong>À:</strong> {recipient}</p>
              <p><strong>Sujet:</strong> {selectedDevice.type === 'PC' ? 'PC' : 'Smartphone'} {selectedDevice.marque} {selectedDevice.modele} prêt pour livraison</p>
              <p><strong>Message:</strong></p>
              <div className="bg-white p-3 rounded border-l-4 border-l-primary mt-2">
                <p>Bonjour,</p>
                <p className="mt-2">Nous avons le plaisir de vous informer que votre {selectedDevice.type === 'PC' ? 'ordinateur' : 'smartphone'} est maintenant prêt pour la livraison.</p>
                <p className="mt-2"><strong>Détails de l'appareil:</strong></p>
                <ul className="list-disc list-inside mt-1 space-y-1">
                  <li>Type: {selectedDevice.type === 'PC' ? 'Ordinateur' : 'Smartphone'}</li>
                  <li>Modèle: {selectedDevice.modele}</li>
                  <li>Marque: {selectedDevice.marque}</li>
                  <li>Numéro de série: {selectedDevice.numeroSerie}</li>
                  <li>Numéro d'inventaire: {selectedDevice.numeroInventaire}</li>
                  <li>État: {selectedDevice.etat}</li>
                  <li>ID: {selectedDevice.id}</li>
                </ul>
                <p className="mt-2">Cordialement,<br/>L'équipe Banque du Numérique</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}