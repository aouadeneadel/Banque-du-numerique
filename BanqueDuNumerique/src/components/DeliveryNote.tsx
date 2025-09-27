import React, { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { FileText, Upload, Download, Printer, Calendar, MapPin, Monitor, Smartphone, Plus, FileUp, Eye, Save } from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import logo from 'figma:asset/b7b032ff91a47a41bb6db4787650cada2e958077.png';

interface DeliveryOrder {
  id: number;
  numeroCommande: string;
  typeAppareil: 'PC' | 'Smartphone' | 'Tablette' | 'Autre';
  nomStructure: string;
  adresse: string;
  ville: string;
  codePostal: string;
  nomDemandeur: string;
  contactDemandeur: string;
  emailDemandeur?: string;
  infoSupplementaire?: string;
  dateCommande: string;
  statut: 'En attente' | 'Préparé' | 'Livré';
  numeroBonLivraison?: string;
}

export function DeliveryNote() {
  const [orders, setOrders] = useState<DeliveryOrder[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<DeliveryOrder | null>(null);
  const [isImporting, setIsImporting] = useState(false);
  const [nextDeliveryNumber, setNextDeliveryNumber] = useState(1001);

  // Informations de la Banque du Numérique
  const bankInfo = {
    nom: "Banque du Numérique",
    telephone: "04 93 75 00 00",
    adresse: "123 Avenue de la République",
    ville: "06000 Nice",
    email: "contact@banquedunumerique.fr"
  };

  // Simulation d'import Excel
  const handleExcelImport = () => {
    setIsImporting(true);
    
    // Simulation de données Excel importées
    setTimeout(() => {
      const mockData: DeliveryOrder[] = [
        {
          id: 1,
          numeroCommande: "CMD-2024-001",
          typeAppareil: "PC",
          nomStructure: "Croix Rouge Française - Nice",
          adresse: "15 Avenue Jean Médecin",
          ville: "Nice",
          codePostal: "06000",
          nomDemandeur: "Mme Carole ZAINI",
          contactDemandeur: "04 93 75 12 34",
          emailDemandeur: "carole.zaini@croixrouge.fr",
          infoSupplementaire: "PC pour formation informatique seniors",
          dateCommande: "2024-01-15",
          statut: "En attente"
        },
        {
          id: 2,
          numeroCommande: "CMD-2024-002",
          typeAppareil: "Smartphone",
          nomStructure: "Association Les Restos du Cœur",
          adresse: "28 Rue de la Liberté",
          ville: "Cannes",
          codePostal: "06400",
          nomDemandeur: "M. Pierre MARTIN",
          contactDemandeur: "04 93 88 45 67",
          emailDemandeur: "p.martin@restosducoeur.org",
          infoSupplementaire: "Smartphone pour personne en réinsertion",
          dateCommande: "2024-01-16",
          statut: "En attente"
        },
        {
          id: 3,
          numeroCommande: "CMD-2024-003",
          typeAppareil: "PC",
          nomStructure: "Secours Populaire Français",
          adresse: "42 Boulevard Gambetta",
          ville: "Antibes",
          codePostal: "06600",
          nomDemandeur: "Mme Sophie DURAND",
          contactDemandeur: "04 93 33 22 11",
          emailDemandeur: "s.durand@secourspopulaire.fr",
          infoSupplementaire: "PC portable pour étudiant en difficulté",
          dateCommande: "2024-01-17",
          statut: "En attente"
        }
      ];
      
      setOrders(mockData);
      setIsImporting(false);
      toast.success(`${mockData.length} commandes importées avec succès depuis Excel`);
    }, 2000);
  };

  const generateDeliveryNote = (order: DeliveryOrder) => {
    const updatedOrder = {
      ...order,
      numeroBonLivraison: `BL-${nextDeliveryNumber}`,
      statut: 'Préparé' as const
    };
    
    setOrders(prev => prev.map(o => o.id === order.id ? updatedOrder : o));
    setNextDeliveryNumber(prev => prev + 1);
    setSelectedOrder(updatedOrder);
    toast.success(`Bon de livraison ${updatedOrder.numeroBonLivraison} généré`);
  };

  const getDeviceIcon = (type: string) => {
    switch (type) {
      case 'PC': return <Monitor className="w-4 h-4" />;
      case 'Smartphone': return <Smartphone className="w-4 h-4" />;
      default: return <Monitor className="w-4 h-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Livré': return 'bg-green-100 text-green-800';
      case 'Préparé': return 'bg-blue-100 text-blue-800';
      case 'En attente': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const printDeliveryNote = () => {
    if (selectedOrder) {
      window.print();
      toast.success('Bon de livraison envoyé à l\'imprimante');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center space-x-2">
          <FileText className="w-6 h-6 text-primary" />
          <div>
            <h2 className="text-xl font-semibold">Générateur de Bons de Livraison</h2>
            <p className="text-sm text-muted-foreground">Import Excel et génération automatique</p>
          </div>
        </div>
        
        <div className="flex gap-2">
          <Button 
            onClick={handleExcelImport} 
            disabled={isImporting}
            className="bg-primary hover:bg-primary/90"
          >
            <FileUp className="w-4 h-4 mr-2" />
            {isImporting ? 'Import en cours...' : 'Importer Excel'}
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Commandes</p>
                <p className="text-2xl font-bold text-primary">{orders.length}</p>
              </div>
              <FileText className="w-6 h-6 text-primary" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">En Attente</p>
                <p className="text-2xl font-bold text-yellow-600">
                  {orders.filter(o => o.statut === 'En attente').length}
                </p>
              </div>
              <Calendar className="w-6 h-6 text-yellow-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Préparés</p>
                <p className="text-2xl font-bold text-blue-600">
                  {orders.filter(o => o.statut === 'Préparé').length}
                </p>
              </div>
              <Monitor className="w-6 h-6 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Prochain N°</p>
                <p className="text-2xl font-bold text-primary">BL-{nextDeliveryNumber}</p>
              </div>
              <Plus className="w-6 h-6 text-primary" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Liste des commandes */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <FileText className="w-5 h-5" />
              <span>Commandes Importées</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {orders.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <FileUp className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>Aucune commande importée</p>
                <p className="text-sm">Utilisez le bouton "Importer Excel" pour commencer</p>
              </div>
            ) : (
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {orders.map((order) => (
                  <div
                    key={order.id}
                    className={`p-4 rounded-lg border transition-all cursor-pointer hover:shadow-md ${
                      selectedOrder?.id === order.id ? 'bg-primary/5 border-primary' : 'bg-gray-50 hover:bg-gray-100'
                    }`}
                    onClick={() => setSelectedOrder(order)}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex items-center space-x-2">
                        {getDeviceIcon(order.typeAppareil)}
                        <span className="font-medium">{order.numeroCommande}</span>
                      </div>
                      <Badge className={getStatusColor(order.statut)}>
                        {order.statut}
                      </Badge>
                    </div>
                    
                    <div className="space-y-1 text-sm text-muted-foreground">
                      <p><strong>{order.nomStructure}</strong></p>
                      <p>{order.nomDemandeur}</p>
                      <p>{order.ville} ({order.codePostal})</p>
                      {order.numeroBonLivraison && (
                        <p className="text-primary font-medium">
                          BL: {order.numeroBonLivraison}
                        </p>
                      )}
                    </div>
                    
                    <div className="flex gap-2 mt-3">
                      {order.statut === 'En attente' && (
                        <Button
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            generateDeliveryNote(order);
                          }}
                          className="bg-primary hover:bg-primary/90"
                        >
                          <Plus className="w-3 h-3 mr-1" />
                          Générer BL
                        </Button>
                      )}
                      {order.numeroBonLivraison && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedOrder(order);
                          }}
                        >
                          <Eye className="w-3 h-3 mr-1" />
                          Voir BL
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Aperçu du bon de livraison */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle className="flex items-center space-x-2">
                <Eye className="w-5 h-5" />
                <span>Bon de Livraison</span>
              </CardTitle>
              {selectedOrder?.numeroBonLivraison && (
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" onClick={printDeliveryNote}>
                    <Printer className="w-4 h-4 mr-2" />
                    Imprimer
                  </Button>
                  <Button size="sm" variant="outline">
                    <Download className="w-4 h-4 mr-2" />
                    PDF
                  </Button>
                </div>
              )}
            </div>
          </CardHeader>
          <CardContent>
            {!selectedOrder ? (
              <div className="text-center py-8 text-muted-foreground">
                <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>Sélectionnez une commande</p>
                <p className="text-sm">pour voir l'aperçu du bon de livraison</p>
              </div>
            ) : !selectedOrder.numeroBonLivraison ? (
              <div className="text-center py-8 text-muted-foreground">
                <Plus className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>Bon de livraison non généré</p>
                <Button 
                  onClick={() => generateDeliveryNote(selectedOrder)}
                  className="mt-4 bg-primary hover:bg-primary/90"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Générer le Bon de Livraison
                </Button>
              </div>
            ) : (
              <div className="bg-white border rounded-lg p-6 shadow-sm" id="delivery-note">
                {/* En-tête avec logo */}
                <div className="flex justify-between items-start mb-6">
                  <div className="flex items-center space-x-4">
                    <img 
                      src={logo} 
                      alt="Banque du Numérique" 
                      className="h-12 w-auto"
                    />
                    <div>
                      <h3 className="font-bold text-lg">{bankInfo.nom}</h3>
                      <p className="text-sm text-gray-600">{bankInfo.adresse}</p>
                      <p className="text-sm text-gray-600">{bankInfo.ville}</p>
                      <p className="text-sm text-gray-600">Tél: {bankInfo.telephone}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <h2 className="text-xl font-bold text-primary">BON DE LIVRAISON</h2>
                    <p className="text-sm text-gray-600">Date: {new Date().toLocaleDateString('fr-FR')}</p>
                  </div>
                </div>

                <Separator className="my-4" />

                {/* Informations commande */}
                <div className="grid grid-cols-2 gap-6 mb-6">
                  <div>
                    <h4 className="font-semibold mb-2">Destinataire:</h4>
                    <div className="space-y-1 text-sm">
                      <p className="font-medium">{selectedOrder.nomStructure}</p>
                      <p>{selectedOrder.adresse}</p>
                      <p>{selectedOrder.codePostal} {selectedOrder.ville}</p>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Contact:</h4>
                    <div className="space-y-1 text-sm">
                      <p className="font-medium">{selectedOrder.nomDemandeur}</p>
                      <p>Tél: {selectedOrder.contactDemandeur}</p>
                      {selectedOrder.emailDemandeur && (
                        <p>Email: {selectedOrder.emailDemandeur}</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Détails de la commande */}
                <div className="mb-6">
                  <h4 className="font-semibold mb-3">Détails de la commande:</h4>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="font-medium">N° Commande:</span>
                        <span className="ml-2">{selectedOrder.numeroCommande}</span>
                      </div>
                      <div>
                        <span className="font-medium">Type d'appareil:</span>
                        <span className="ml-2 flex items-center">
                          {getDeviceIcon(selectedOrder.typeAppareil)}
                          <span className="ml-1">{selectedOrder.typeAppareil}</span>
                        </span>
                      </div>
                      <div className="col-span-2">
                        <span className="font-medium">Date commande:</span>
                        <span className="ml-2">
                          {new Date(selectedOrder.dateCommande).toLocaleDateString('fr-FR')}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Informations supplémentaires */}
                {selectedOrder.infoSupplementaire && (
                  <div className="mb-6">
                    <h4 className="font-semibold mb-2">Informations supplémentaires:</h4>
                    <div className="bg-blue-50 p-3 rounded-lg text-sm">
                      {selectedOrder.infoSupplementaire}
                    </div>
                  </div>
                )}

                <Separator className="my-6" />

                {/* Signatures */}
                <div className="grid grid-cols-2 gap-8 mb-8">
                  <div>
                    <p className="text-sm font-medium mb-8">Signature du livreur:</p>
                    <div className="border-t border-gray-300 pt-1">
                      <p className="text-xs text-gray-500">Nom et signature</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-medium mb-8">Signature du destinataire:</p>
                    <div className="border-t border-gray-300 pt-1">
                      <p className="text-xs text-gray-500">Nom et signature</p>
                    </div>
                  </div>
                </div>

                {/* Numéro de bon en bas - grand et gras */}
                <div className="text-center mt-8 pt-4 border-t-2 border-primary">
                  <p className="text-3xl font-bold text-primary">
                    {selectedOrder.numeroBonLivraison}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">Numéro de bon de livraison</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* CSS pour impression */}
      <style jsx>{`
        @media print {
          body * {
            visibility: hidden;
          }
          #delivery-note, #delivery-note * {
            visibility: visible;
          }
          #delivery-note {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
          }
        }
      `}</style>
    </div>
  );
}