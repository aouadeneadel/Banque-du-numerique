import React, { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { FileText, Download, Printer, Calendar, MapPin, Monitor, Smartphone } from 'lucide-react';
import { toast } from 'sonner@2.0.3';

interface Device {
  id: number;
  type: 'PC' | 'Smartphone';
  modele: string;
  marque: string;
  etat: string;
  numeroSerie: string;
  numeroInventaire: string;
}

interface DeliveryNote {
  device: Device;
  recipient: {
    nom: string;
    adresse: string;
  };
  date: string;
  numeroLivraison: string;
}

export function DeliveryNote() {
  const [selectedDevice, setSelectedDevice] = useState<Device | null>(null);
  const [recipientInfo, setRecipientInfo] = useState({
    nom: '',
    adresse: ''
  });
  const [generatedNote, setGeneratedNote] = useState<DeliveryNote | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [activeTab, setActiveTab] = useState<'PC' | 'Smartphone'>('PC');

  // Mock device data - only ready for delivery
  const availableDevices: Device[] = [
    { 
      id: 1, 
      type: 'PC',
      modele: 'Inspiron 15', 
      marque: 'Dell', 
      etat: 'Livré', 
      numeroSerie: 'DEL001X2022', 
      numeroInventaire: 'abn-2024-001'
    },
    { 
      id: 2, 
      type: 'PC',
      modele: 'ThinkPad X1', 
      marque: 'Lenovo', 
      etat: 'Livré', 
      numeroSerie: 'LEN001Y2021', 
      numeroInventaire: 'abn-2024-002'
    },
    { 
      id: 3, 
      type: 'Smartphone',
      modele: 'iPhone 14', 
      marque: 'Apple', 
      etat: 'Livré', 
      numeroSerie: 'APP001Z2023', 
      numeroInventaire: 'abn-2024-003'
    },
    { 
      id: 4, 
      type: 'Smartphone',
      modele: 'Galaxy S23', 
      marque: 'Samsung', 
      etat: 'Livré', 
      numeroSerie: 'SAM001A2023', 
      numeroInventaire: 'abn-2024-004'
    },
    { 
      id: 5, 
      type: 'PC',
      modele: 'Surface Pro', 
      marque: 'Microsoft', 
      etat: 'Neuf', 
      numeroSerie: 'MSF001V2023', 
      numeroInventaire: 'abn-2024-005'
    },
  ];

  const generateDeliveryNote = () => {
    if (!selectedDevice || !recipientInfo.nom || !recipientInfo.adresse) {
      toast.error('Veuillez sélectionner un appareil et remplir les informations du destinataire');
      return;
    }

    setIsGenerating(true);

    // Simulate generation delay
    setTimeout(() => {
      const note: DeliveryNote = {
        device: selectedDevice,
        recipient: recipientInfo,
        date: new Date().toLocaleDateString('fr-FR'),
        numeroLivraison: `BDN-${Date.now().toString().slice(-6)}`
      };

      setGeneratedNote(note);
      setIsGenerating(false);
      toast.success('Bon de livraison généré avec succès');
    }, 1500);
  };

  const downloadPDF = () => {
    toast.success('Téléchargement du PDF en cours...');
    // In a real app, this would generate and download a PDF
  };

  const printNote = () => {
    window.print();
    toast.success('Impression lancée');
  };

  const resetForm = () => {
    setSelectedDevice(null);
    setRecipientInfo({ nom: '', adresse: '' });
    setGeneratedNote(null);
  };

  const filteredDevices = availableDevices.filter(device => device.type === activeTab);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <FileText className="w-8 h-8 text-primary" />
          <h2 className="text-2xl font-semibold text-foreground">Génération du Bon de Livraison</h2>
        </div>
        {generatedNote && (
          <div className="flex space-x-2">
            <Button variant="outline" onClick={downloadPDF} className="border-primary text-primary hover:bg-primary hover:text-white">
              <Download className="w-4 h-4 mr-2" />
              PDF
            </Button>
            <Button variant="outline" onClick={printNote} className="border-secondary text-secondary-foreground hover:bg-secondary">
              <Printer className="w-4 h-4 mr-2" />
              Imprimer
            </Button>
            <Button variant="outline" onClick={resetForm}>
              Nouveau
            </Button>
          </div>
        )}
      </div>

      {!generatedNote ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Device Selection */}
          <Card>
            <CardHeader>
              <CardTitle>Sélectionner un Appareil</CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'PC' | 'Smartphone')} className="w-full">
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

                <div className="max-h-80 overflow-y-auto">
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
                              device.etat === 'Livré' ? 'bg-green-100 text-green-800' :
                              device.etat === 'Neuf' ? 'bg-blue-100 text-blue-800' :
                              'bg-yellow-100 text-yellow-800'
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

          {/* Recipient Information */}
          <div className="space-y-4">
            {selectedDevice && (
              <Card className="border-l-4 border-l-green-500">
                <CardHeader>
                  <CardTitle className="text-green-700 flex items-center space-x-2">
                    {selectedDevice.type === 'PC' ? <Monitor className="w-5 h-5" /> : <Smartphone className="w-5 h-5" />}
                    <span>{selectedDevice.type === 'PC' ? 'PC' : 'Smartphone'} Sélectionné</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <p><strong>ID:</strong> {selectedDevice.id}</p>
                    <p><strong>Type:</strong> {selectedDevice.type === 'PC' ? 'Ordinateur' : 'Smartphone'}</p>
                    <p><strong>Modèle:</strong> {selectedDevice.modele}</p>
                    <p><strong>Marque:</strong> {selectedDevice.marque}</p>
                    <p><strong>N° Série:</strong> <span className="font-mono text-sm">{selectedDevice.numeroSerie}</span></p>
                    <p><strong>N° Inventaire:</strong> <span className="font-mono text-sm">{selectedDevice.numeroInventaire}</span></p>
                    <p><strong>État:</strong> 
                      <span className={`ml-2 px-2 py-1 rounded-full text-xs ${
                        selectedDevice.etat === 'Livré' ? 'bg-green-100 text-green-800' :
                        selectedDevice.etat === 'Neuf' ? 'bg-blue-100 text-blue-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {selectedDevice.etat}
                      </span>
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <MapPin className="w-5 h-5" />
                  <span>Informations Destinataire</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="nom">Nom Destinataire</Label>
                  <Input
                    id="nom"
                    value={recipientInfo.nom}
                    onChange={(e) => setRecipientInfo(prev => ({ ...prev, nom: e.target.value }))}
                    placeholder="Nom complet du destinataire"
                  />
                </div>
                <div>
                  <Label htmlFor="adresse">Adresse</Label>
                  <Textarea
                    id="adresse"
                    value={recipientInfo.adresse}
                    onChange={(e) => setRecipientInfo(prev => ({ ...prev, adresse: e.target.value }))}
                    placeholder="Adresse complète de livraison"
                    rows={3}
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      ) : (
        /* Generated Delivery Note */
        <Card className="print:shadow-none">
          <CardContent className="p-8">
            {/* Header */}
            <div className="flex justify-between items-start mb-8 border-b-2 border-primary pb-4">
              <div>
                <h1 className="text-3xl font-bold text-primary">BANQUE DU NUMÉRIQUE</h1>
                <p className="text-muted-foreground">Gestion des équipements informatiques</p>
              </div>
              <div className="text-right">
                <h2 className="text-xl font-semibold text-foreground">BON DE LIVRAISON</h2>
                <p className="text-muted-foreground">N° {generatedNote.numeroLivraison}</p>
              </div>
            </div>

            {/* Date and Info */}
            <div className="grid grid-cols-2 gap-8 mb-8">
              <div>
                <h3 className="font-semibold text-foreground mb-2 flex items-center">
                  <Calendar className="w-4 h-4 mr-2" />
                  Date de livraison
                </h3>
                <p className="text-lg">{generatedNote.date}</p>
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-2 flex items-center">
                  <MapPin className="w-4 h-4 mr-2" />
                  Destinataire
                </h3>
                <p className="font-semibold">{generatedNote.recipient.nom}</p>
                <p className="text-muted-foreground whitespace-pre-line">{generatedNote.recipient.adresse}</p>
              </div>
            </div>

            {/* Device Details */}
            <div className="mb-8">
              <h3 className="font-semibold text-foreground mb-4">Équipement livré</h3>
              <div className="border rounded-lg overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-primary hover:bg-primary">
                      <TableHead className="text-primary-foreground">Type</TableHead>
                      <TableHead className="text-primary-foreground">ID</TableHead>
                      <TableHead className="text-primary-foreground">Marque</TableHead>
                      <TableHead className="text-primary-foreground">Modèle</TableHead>
                      <TableHead className="text-primary-foreground">N° Série</TableHead>
                      <TableHead className="text-primary-foreground">N° Inventaire</TableHead>
                      <TableHead className="text-primary-foreground">État</TableHead>
                      <TableHead className="text-primary-foreground">Quantité</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell className="font-semibold">
                        <div className="flex items-center space-x-2">
                          {generatedNote.device.type === 'PC' ? <Monitor className="w-4 h-4" /> : <Smartphone className="w-4 h-4" />}
                          <span>{generatedNote.device.type === 'PC' ? 'Ordinateur' : 'Smartphone'}</span>
                        </div>
                      </TableCell>
                      <TableCell className="font-semibold">{generatedNote.device.id}</TableCell>
                      <TableCell>{generatedNote.device.marque}</TableCell>
                      <TableCell>{generatedNote.device.modele}</TableCell>
                      <TableCell className="font-mono text-sm">{generatedNote.device.numeroSerie}</TableCell>
                      <TableCell className="font-mono text-sm">{generatedNote.device.numeroInventaire}</TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          generatedNote.device.etat === 'Livré' ? 'bg-green-100 text-green-800' :
                          generatedNote.device.etat === 'Neuf' ? 'bg-blue-100 text-blue-800' :
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                          {generatedNote.device.etat}
                        </span>
                      </TableCell>
                      <TableCell className="font-semibold">1</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
            </div>

            {/* Signatures */}
            <div className="grid grid-cols-2 gap-8 mt-12">
              <div className="text-center">
                <div className="border-t border-muted-foreground pt-2 mt-16">
                  <p className="font-semibold">Signature du livreur</p>
                  <p className="text-sm text-muted-foreground">Banque du Numérique</p>
                </div>
              </div>
              <div className="text-center">
                <div className="border-t border-muted-foreground pt-2 mt-16">
                  <p className="font-semibold">Signature du destinataire</p>
                  <p className="text-sm text-muted-foreground">{generatedNote.recipient.nom}</p>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="mt-8 pt-4 border-t border-muted text-center text-sm text-muted-foreground">
              <p>Ce document certifie la livraison de l'équipement mentionné ci-dessus.</p>
              <p className="mt-1">Banque du Numérique - Service de gestion des équipements informatiques</p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Generate Button */}
      {!generatedNote && (
        <div className="flex justify-center pt-4">
          <Button 
            onClick={generateDeliveryNote}
            disabled={!selectedDevice || !recipientInfo.nom || !recipientInfo.adresse || isGenerating}
            className="bg-primary hover:bg-primary/90 px-8 py-3 text-lg"
          >
            <FileText className={`w-5 h-5 mr-2 ${isGenerating ? 'animate-pulse' : ''}`} />
            {isGenerating ? 'Génération...' : 'Générer Bon de Livraison'}
          </Button>
        </div>
      )}
    </div>
  );
}