import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Search, Plus, Edit, Trash2, Users, MapPin, Calendar, Phone, Mail, User, Package, Heart, Gift } from 'lucide-react';
import { mockInterlocuteurs, Interlocuteur, mockDevices } from '../data/mockDatabase';
import { toast } from 'sonner@2.0.3';

export interface DonParStructure {
  id: number;
  interlocuteurId: number;
  nomStructure: string;
  typeAppareil: 'PC' | 'Smartphone';
  quantite: number;
  dateDon: string;
  description?: string;
  numeroReference: string;
}

export function InterlocuteurManagement() {
  const [interlocuteurs, setInterlocuteurs] = useState<Interlocuteur[]>(mockInterlocuteurs);
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingInterlocuteur, setEditingInterlocuteur] = useState<Interlocuteur | null>(null);
  const [newInterlocuteur, setNewInterlocuteur] = useState<Partial<Interlocuteur>>({
    nomStructure: '',
    codePostal: '',
    ville: '',
    interlocuteur1: { nom: '', email: '', telephone: '' },
    interlocuteur2: { nom: '', email: '', telephone: '' },
    dateInitiale: '',
    dateRenouvellement: ''
  });

  // States pour les dons par structure
  const [donsParStructure, setDonsParStructure] = useState<DonParStructure[]>([
    {
      id: 1,
      interlocuteurId: 1,
      nomStructure: 'CROIX ROUGE MECS CHIRIS',
      typeAppareil: 'PC',
      quantite: 2,
      dateDon: '2024-01-15',
      description: 'Dons de PC portables Dell et Lenovo',
      numeroReference: 'DON-2024-001'
    },
    {
      id: 2,
      interlocuteurId: 1,
      nomStructure: 'CROIX ROUGE MECS CHIRIS',
      typeAppareil: 'Smartphone',
      quantite: 2,
      dateDon: '2024-01-28',
      description: 'Dons iPhone pour aide numérique',
      numeroReference: 'DON-2024-002'
    },
    {
      id: 3,
      interlocuteurId: 2,
      nomStructure: 'CENTRE SOCIAL LES OLIVIERS',
      typeAppareil: 'PC',
      quantite: 2,
      dateDon: '2024-01-20',
      description: 'Équipement pour espace numérique',
      numeroReference: 'DON-2024-003'
    },
    {
      id: 4,
      interlocuteurId: 4,
      nomStructure: 'MAISON DE QUARTIER BELLEVUE',
      typeAppareil: 'Smartphone',
      quantite: 2,
      dateDon: '2024-02-08',
      description: 'Appareils pour accompagnement social',
      numeroReference: 'DON-2024-004'
    }
  ]);

  const [isAddDonDialogOpen, setIsAddDonDialogOpen] = useState(false);
  const [newDon, setNewDon] = useState<Partial<DonParStructure>>({
    interlocuteurId: 0,
    nomStructure: '',
    typeAppareil: 'PC',
    quantite: 1,
    dateDon: new Date().toISOString().split('T')[0],
    description: '',
    numeroReference: ''
  });

  const filteredInterlocuteurs = interlocuteurs.filter(interlocuteur =>
    interlocuteur.nomStructure.toLowerCase().includes(searchTerm.toLowerCase()) ||
    interlocuteur.ville.toLowerCase().includes(searchTerm.toLowerCase()) ||
    interlocuteur.interlocuteur1.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (interlocuteur.interlocuteur2?.nom && interlocuteur.interlocuteur2.nom.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleAddInterlocuteur = () => {
    if (!newInterlocuteur.nomStructure || !newInterlocuteur.ville || !newInterlocuteur.interlocuteur1?.nom) {
      toast.error('Veuillez remplir les champs obligatoires');
      return;
    }

    const interlocuteur: Interlocuteur = {
      id: Math.max(...interlocuteurs.map(i => i.id)) + 1,
      nomStructure: newInterlocuteur.nomStructure!,
      codePostal: newInterlocuteur.codePostal!,
      ville: newInterlocuteur.ville!,
      interlocuteur1: newInterlocuteur.interlocuteur1!,
      interlocuteur2: newInterlocuteur.interlocuteur2?.nom ? newInterlocuteur.interlocuteur2 : undefined,
      dateInitiale: newInterlocuteur.dateInitiale!,
      dateRenouvellement: newInterlocuteur.dateRenouvellement,
      dateAjout: new Date().toISOString().split('T')[0]
    };

    setInterlocuteurs(prev => [...prev, interlocuteur]);
    setNewInterlocuteur({
      nomStructure: '',
      codePostal: '',
      ville: '',
      interlocuteur1: { nom: '', email: '', telephone: '' },
      interlocuteur2: { nom: '', email: '', telephone: '' },
      dateInitiale: '',
      dateRenouvellement: ''
    });
    setIsAddDialogOpen(false);
    toast.success('Interlocuteur ajouté avec succès');
  };

  const handleEditInterlocuteur = (interlocuteur: Interlocuteur) => {
    setEditingInterlocuteur(interlocuteur);
    setNewInterlocuteur({
      nomStructure: interlocuteur.nomStructure,
      codePostal: interlocuteur.codePostal,
      ville: interlocuteur.ville,
      interlocuteur1: { ...interlocuteur.interlocuteur1 },
      interlocuteur2: interlocuteur.interlocuteur2 ? { ...interlocuteur.interlocuteur2 } : { nom: '', email: '', telephone: '' },
      dateInitiale: interlocuteur.dateInitiale,
      dateRenouvellement: interlocuteur.dateRenouvellement
    });
  };

  const handleUpdateInterlocuteur = () => {
    if (!newInterlocuteur.nomStructure || !newInterlocuteur.ville || !newInterlocuteur.interlocuteur1?.nom || !editingInterlocuteur) {
      toast.error('Veuillez remplir les champs obligatoires');
      return;
    }

    const updatedInterlocuteur: Interlocuteur = {
      ...editingInterlocuteur,
      nomStructure: newInterlocuteur.nomStructure!,
      codePostal: newInterlocuteur.codePostal!,
      ville: newInterlocuteur.ville!,
      interlocuteur1: newInterlocuteur.interlocuteur1!,
      interlocuteur2: newInterlocuteur.interlocuteur2?.nom ? newInterlocuteur.interlocuteur2 : undefined,
      dateInitiale: newInterlocuteur.dateInitiale!,
      dateRenouvellement: newInterlocuteur.dateRenouvellement
    };

    setInterlocuteurs(prev => prev.map(i => i.id === editingInterlocuteur.id ? updatedInterlocuteur : i));
    setEditingInterlocuteur(null);
    setNewInterlocuteur({
      nomStructure: '',
      codePostal: '',
      ville: '',
      interlocuteur1: { nom: '', email: '', telephone: '' },
      interlocuteur2: { nom: '', email: '', telephone: '' },
      dateInitiale: '',
      dateRenouvellement: ''
    });
    toast.success('Interlocuteur modifié avec succès');
  };

  const handleDeleteInterlocuteur = (id: number) => {
    setInterlocuteurs(prev => prev.filter(i => i.id !== id));
    // Supprimer aussi les dons associés
    setDonsParStructure(prev => prev.filter(d => d.interlocuteurId !== id));
    toast.success('Interlocuteur supprimé avec succès');
  };

  // Gestion des dons par structure
  const handleAddDon = () => {
    if (!newDon.interlocuteurId || !newDon.typeAppareil || !newDon.quantite || !newDon.dateDon) {
      toast.error('Veuillez remplir tous les champs obligatoires');
      return;
    }

    const selectedInterlocuteur = interlocuteurs.find(i => i.id === newDon.interlocuteurId);
    if (!selectedInterlocuteur) {
      toast.error('Interlocuteur introuvable');
      return;
    }

    const don: DonParStructure = {
      id: Math.max(...donsParStructure.map(d => d.id), 0) + 1,
      interlocuteurId: newDon.interlocuteurId!,
      nomStructure: selectedInterlocuteur.nomStructure,
      typeAppareil: newDon.typeAppareil!,
      quantite: newDon.quantite!,
      dateDon: newDon.dateDon!,
      description: newDon.description || '',
      numeroReference: `DON-${new Date().getFullYear()}-${(Math.max(...donsParStructure.map(d => parseInt(d.numeroReference.split('-')[2])), 0) + 1).toString().padStart(3, '0')}`
    };

    setDonsParStructure(prev => [...prev, don]);
    setNewDon({
      interlocuteurId: 0,
      nomStructure: '',
      typeAppareil: 'PC',
      quantite: 1,
      dateDon: new Date().toISOString().split('T')[0],
      description: '',
      numeroReference: ''
    });
    setIsAddDonDialogOpen(false);
    toast.success('Don enregistré avec succès');
  };

  const handleDeleteDon = (id: number) => {
    setDonsParStructure(prev => prev.filter(d => d.id !== id));
    toast.success('Don supprimé avec succès');
  };

  const formatDate = (dateStr: string) => {
    if (!dateStr) return '';
    return new Date(dateStr).toLocaleDateString('fr-FR');
  };

  // Calculs statistiques pour les dons
  const totalDons = donsParStructure.length;
  const totalAppareils = donsParStructure.reduce((sum, don) => sum + don.quantite, 0);
  const donsPC = donsParStructure.filter(d => d.typeAppareil === 'PC').reduce((sum, don) => sum + don.quantite, 0);
  const donsSmartphones = donsParStructure.filter(d => d.typeAppareil === 'Smartphone').reduce((sum, don) => sum + don.quantite, 0);
  const appareilsAssignes = mockDevices.filter(d => d.interlocuteurId).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <Users className="w-6 h-6 text-primary" />
          <div>
            <h2 className="text-xl font-semibold">Gestion des Interlocuteurs</h2>
            <p className="text-sm text-muted-foreground">Nous donnons du matériel aux interlocuteurs</p>
          </div>
        </div>
      </div>

      {/* Header avec statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">Total Interlocuteurs</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{interlocuteurs.length}</div>
            <p className="text-xs text-muted-foreground mt-1">Structures partenaires</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">Total Dons</CardTitle>
            <Heart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-secondary">{totalDons}</div>
            <p className="text-xs text-muted-foreground mt-1">Opérations de don</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">Appareils Donnés</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-accent">{totalAppareils}</div>
            <p className="text-xs text-muted-foreground mt-1">{donsPC} PC • {donsSmartphones} Smartphones</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">Appareils Assignés</CardTitle>
            <Gift className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{appareilsAssignes}</div>
            <p className="text-xs text-muted-foreground mt-1">En cours d'utilisation</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">Couverture</CardTitle>
            <MapPin className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-secondary">
              {new Set(interlocuteurs.map(i => i.ville)).size}
            </div>
            <p className="text-xs text-muted-foreground mt-1">Villes couvertes</p>
          </CardContent>
        </Card>
      </div>

      {/* Section Dons par Structure */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="flex items-center space-x-2">
                <Heart className="w-5 h-5 text-primary" />
                <span>Dons par Structure</span>
              </CardTitle>
              <CardDescription>
                Suivez les dons d'appareils effectués aux différentes structures partenaires
              </CardDescription>
            </div>
            <Dialog open={isAddDonDialogOpen} onOpenChange={setIsAddDonDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" className="border-primary text-primary hover:bg-primary hover:text-white">
                  <Plus className="mr-2 h-4 w-4" />
                  Nouveau Don
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-lg">
                <DialogHeader>
                  <DialogTitle>Enregistrer un nouveau don</DialogTitle>
                  <DialogDescription>
                    Renseignez les détails du don d'appareils à la structure
                  </DialogDescription>
                </DialogHeader>
                
                <div className="grid gap-4 py-4">
                  <div>
                    <Label htmlFor="donInterlocuteur">Structure bénéficiaire *</Label>
                    <select 
                      id="donInterlocuteur"
                      className="w-full p-2 border border-border rounded-md bg-input-background"
                      value={newDon.interlocuteurId || ''}
                      onChange={(e) => setNewDon(prev => ({ ...prev, interlocuteurId: parseInt(e.target.value) }))}
                    >
                      <option value="">Sélectionner une structure...</option>
                      {interlocuteurs.map(inter => (
                        <option key={inter.id} value={inter.id}>
                          {inter.nomStructure} - {inter.ville}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="donType">Type d'appareil *</Label>
                      <select 
                        id="donType"
                        className="w-full p-2 border border-border rounded-md bg-input-background"
                        value={newDon.typeAppareil}
                        onChange={(e) => setNewDon(prev => ({ ...prev, typeAppareil: e.target.value as 'PC' | 'Smartphone' }))}
                      >
                        <option value="PC">PC</option>
                        <option value="Smartphone">Smartphone</option>
                      </select>
                    </div>
                    
                    <div>
                      <Label htmlFor="donQuantite">Quantité *</Label>
                      <Input
                        id="donQuantite"
                        type="number"
                        min="1"
                        value={newDon.quantite}
                        onChange={(e) => setNewDon(prev => ({ ...prev, quantite: parseInt(e.target.value) }))}
                      />
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="donDate">Date du don *</Label>
                    <Input
                      id="donDate"
                      type="date"
                      value={newDon.dateDon}
                      onChange={(e) => setNewDon(prev => ({ ...prev, dateDon: e.target.value }))}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="donDescription">Description</Label>
                    <Input
                      id="donDescription"
                      placeholder="Description du don..."
                      value={newDon.description}
                      onChange={(e) => setNewDon(prev => ({ ...prev, description: e.target.value }))}
                    />
                  </div>
                </div>

                <DialogFooter>
                  <Button variant="outline" onClick={() => {
                    setIsAddDonDialogOpen(false);
                    setNewDon({
                      interlocuteurId: 0,
                      nomStructure: '',
                      typeAppareil: 'PC',
                      quantite: 1,
                      dateDon: new Date().toISOString().split('T')[0],
                      description: '',
                      numeroReference: ''
                    });
                  }}>
                    Annuler
                  </Button>
                  <Button onClick={handleAddDon} className="bg-primary hover:bg-primary/90">
                    <Heart className="w-4 h-4 mr-2" />
                    Enregistrer Don
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Structure</TableHead>
                  <TableHead>Type & Quantité</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Référence</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {donsParStructure.map((don) => (
                  <TableRow key={don.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{don.nomStructure}</div>
                        {don.description && (
                          <div className="text-sm text-muted-foreground">{don.description}</div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Badge variant={don.typeAppareil === 'PC' ? 'default' : 'secondary'}>
                          {don.typeAppareil}
                        </Badge>
                        <span className="font-medium">{don.quantite} appareil{don.quantite > 1 ? 's' : ''}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="text-xs">
                        {formatDate(don.dateDon)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <code className="text-xs bg-muted px-2 py-1 rounded">{don.numeroReference}</code>
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteDon(don.id)}
                        className="text-destructive hover:bg-destructive hover:text-destructive-foreground"
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {donsParStructure.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <Heart className="w-12 h-12 mx-auto mb-4 text-muted-foreground/50" />
              <p>Aucun don enregistré</p>
              <p className="text-sm">Commencez par enregistrer votre premier don à une structure</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Recherche et actions */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Gestion des Interlocuteurs</CardTitle>
              <CardDescription>
                Gérez les structures et leurs interlocuteurs pour les mises à disposition d'appareils
              </CardDescription>
            </div>
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Nouvel Interlocuteur
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>
                    {editingInterlocuteur ? 'Modifier l\'interlocuteur' : 'Ajouter un nouvel interlocuteur'}
                  </DialogTitle>
                  <DialogDescription>
                    Renseignez les informations de la structure et de ses interlocuteurs
                  </DialogDescription>
                </DialogHeader>
                
                <div className="grid gap-4 py-4">
                  {/* Informations Structure */}
                  <div className="space-y-4">
                    <h4 className="font-medium">Informations de la structure</h4>
                    <div className="grid grid-cols-1 gap-4">
                      <div>
                        <Label htmlFor="nomStructure">Nom de la structure *</Label>
                        <Input
                          id="nomStructure"
                          value={newInterlocuteur.nomStructure}
                          onChange={(e) => setNewInterlocuteur(prev => ({ ...prev, nomStructure: e.target.value }))}
                          placeholder="Ex: CROIX ROUGE MECS CHIRIS"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="codePostal">Code postal</Label>
                          <Input
                            id="codePostal"
                            value={newInterlocuteur.codePostal}
                            onChange={(e) => setNewInterlocuteur(prev => ({ ...prev, codePostal: e.target.value }))}
                            placeholder="06250"
                          />
                        </div>
                        <div>
                          <Label htmlFor="ville">Ville *</Label>
                          <Input
                            id="ville"
                            value={newInterlocuteur.ville}
                            onChange={(e) => setNewInterlocuteur(prev => ({ ...prev, ville: e.target.value }))}
                            placeholder="MOUGINS"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  {/* Interlocuteur 1 */}
                  <div className="space-y-4">
                    <h4 className="font-medium">Interlocuteur principal *</h4>
                    <div className="grid grid-cols-1 gap-4">
                      <div>
                        <Label htmlFor="inter1Nom">Nom complet *</Label>
                        <Input
                          id="inter1Nom"
                          value={newInterlocuteur.interlocuteur1?.nom}
                          onChange={(e) => setNewInterlocuteur(prev => ({
                            ...prev,
                            interlocuteur1: { ...prev.interlocuteur1!, nom: e.target.value }
                          }))}
                          placeholder="Mme Carole ZAINI"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="inter1Email">Email</Label>
                          <Input
                            id="inter1Email"
                            type="email"
                            value={newInterlocuteur.interlocuteur1?.email}
                            onChange={(e) => setNewInterlocuteur(prev => ({
                              ...prev,
                              interlocuteur1: { ...prev.interlocuteur1!, email: e.target.value }
                            }))}
                            placeholder="carole.zaini@croixrouge.fr"
                          />
                        </div>
                        <div>
                          <Label htmlFor="inter1Tel">Téléphone</Label>
                          <Input
                            id="inter1Tel"
                            value={newInterlocuteur.interlocuteur1?.telephone}
                            onChange={(e) => setNewInterlocuteur(prev => ({
                              ...prev,
                              interlocuteur1: { ...prev.interlocuteur1!, telephone: e.target.value }
                            }))}
                            placeholder="04 93 75 12 34"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  {/* Interlocuteur 2 */}
                  <div className="space-y-4">
                    <h4 className="font-medium">Interlocuteur secondaire (optionnel)</h4>
                    <div className="grid grid-cols-1 gap-4">
                      <div>
                        <Label htmlFor="inter2Nom">Nom complet</Label>
                        <Input
                          id="inter2Nom"
                          value={newInterlocuteur.interlocuteur2?.nom}
                          onChange={(e) => setNewInterlocuteur(prev => ({
                            ...prev,
                            interlocuteur2: { ...prev.interlocuteur2!, nom: e.target.value }
                          }))}
                          placeholder="M. Pierre MARTIN"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="inter2Email">Email</Label>
                          <Input
                            id="inter2Email"
                            type="email"
                            value={newInterlocuteur.interlocuteur2?.email}
                            onChange={(e) => setNewInterlocuteur(prev => ({
                              ...prev,
                              interlocuteur2: { ...prev.interlocuteur2!, email: e.target.value }
                            }))}
                            placeholder="pierre.martin@structure.fr"
                          />
                        </div>
                        <div>
                          <Label htmlFor="inter2Tel">Téléphone</Label>
                          <Input
                            id="inter2Tel"
                            value={newInterlocuteur.interlocuteur2?.telephone}
                            onChange={(e) => setNewInterlocuteur(prev => ({
                              ...prev,
                              interlocuteur2: { ...prev.interlocuteur2!, telephone: e.target.value }
                            }))}
                            placeholder="04 93 75 12 35"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  {/* Dates */}
                  <div className="space-y-4">
                    <h4 className="font-medium">Dates importantes</h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="dateInitiale">Date initiale *</Label>
                        <Input
                          id="dateInitiale"
                          type="date"
                          value={newInterlocuteur.dateInitiale}
                          onChange={(e) => setNewInterlocuteur(prev => ({ ...prev, dateInitiale: e.target.value }))}
                        />
                      </div>
                      <div>
                        <Label htmlFor="dateRenouvellement">Date de renouvellement</Label>
                        <Input
                          id="dateRenouvellement"
                          type="date"
                          value={newInterlocuteur.dateRenouvellement}
                          onChange={(e) => setNewInterlocuteur(prev => ({ ...prev, dateRenouvellement: e.target.value }))}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <DialogFooter>
                  <Button variant="outline" onClick={() => {
                    setIsAddDialogOpen(false);
                    setEditingInterlocuteur(null);
                    setNewInterlocuteur({
                      nomStructure: '',
                      codePostal: '',
                      ville: '',
                      interlocuteur1: { nom: '', email: '', telephone: '' },
                      interlocuteur2: { nom: '', email: '', telephone: '' },
                      dateInitiale: '',
                      dateRenouvellement: ''
                    });
                  }}>
                    Annuler
                  </Button>
                  <Button 
                    onClick={editingInterlocuteur ? handleUpdateInterlocuteur : handleAddInterlocuteur} 
                    className="bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-white shadow-lg"
                  >
                    <Users className="w-4 h-4 mr-2" />
                    {editingInterlocuteur ? 'Sauvegarder les Modifications' : 'Enregistrer Interlocuteur'}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        
        <CardContent>
          <div className="flex items-center space-x-2 mb-4">
            <Search className="h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Rechercher par structure, ville ou nom d'interlocuteur..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-sm"
            />
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Structure</TableHead>
                  <TableHead>Localisation</TableHead>
                  <TableHead>Interlocuteur(s)</TableHead>
                  <TableHead>Dons Reçus</TableHead>
                  <TableHead>Dates</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredInterlocuteurs.map((interlocuteur) => (
                  <TableRow key={interlocuteur.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{interlocuteur.nomStructure}</div>
                        <div className="text-sm text-muted-foreground">
                          ID: {interlocuteur.id}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-1">
                        <MapPin className="h-3 w-3 text-muted-foreground" />
                        <span>{interlocuteur.codePostal} {interlocuteur.ville}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="flex items-center space-x-1">
                          <User className="h-3 w-3 text-muted-foreground" />
                          <span className="text-sm font-medium">{interlocuteur.interlocuteur1.nom}</span>
                        </div>
                        {interlocuteur.interlocuteur1.email && (
                          <div className="flex items-center space-x-1">
                            <Mail className="h-3 w-3 text-muted-foreground" />
                            <span className="text-xs text-muted-foreground">{interlocuteur.interlocuteur1.email}</span>
                          </div>
                        )}
                        {interlocuteur.interlocuteur1.telephone && (
                          <div className="flex items-center space-x-1">
                            <Phone className="h-3 w-3 text-muted-foreground" />
                            <span className="text-xs text-muted-foreground">{interlocuteur.interlocuteur1.telephone}</span>
                          </div>
                        )}
                        {interlocuteur.interlocuteur2 && (
                          <div className="pt-1 border-t border-muted">
                            <div className="flex items-center space-x-1">
                              <User className="h-3 w-3 text-muted-foreground" />
                              <span className="text-sm">{interlocuteur.interlocuteur2.nom}</span>
                            </div>
                            {interlocuteur.interlocuteur2.email && (
                              <div className="flex items-center space-x-1">
                                <Mail className="h-3 w-3 text-muted-foreground" />
                                <span className="text-xs text-muted-foreground">{interlocuteur.interlocuteur2.email}</span>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      {(() => {
                        const donsInterlocuteur = donsParStructure.filter(d => d.interlocuteurId === interlocuteur.id);
                        const totalAppareilsDonnes = donsInterlocuteur.reduce((sum, don) => sum + don.quantite, 0);
                        const totalPC = donsInterlocuteur.filter(d => d.typeAppareil === 'PC').reduce((sum, don) => sum + don.quantite, 0);
                        const totalSmartphones = donsInterlocuteur.filter(d => d.typeAppareil === 'Smartphone').reduce((sum, don) => sum + don.quantite, 0);
                        
                        return (
                          <div className="space-y-1">
                            {totalAppareilsDonnes > 0 ? (
                              <>
                                <div className="flex items-center space-x-1">
                                  <Heart className="h-3 w-3 text-primary" />
                                  <span className="text-sm font-medium">{totalAppareilsDonnes} appareil{totalAppareilsDonnes > 1 ? 's' : ''}</span>
                                </div>
                                <div className="flex space-x-1">
                                  {totalPC > 0 && (
                                    <Badge variant="default" className="text-xs">
                                      {totalPC} PC
                                    </Badge>
                                  )}
                                  {totalSmartphones > 0 && (
                                    <Badge variant="secondary" className="text-xs">
                                      {totalSmartphones} Mobile
                                    </Badge>
                                  )}
                                </div>
                              </>
                            ) : (
                              <div className="text-sm text-muted-foreground">
                                Aucun don enregistré
                              </div>
                            )}
                          </div>
                        );
                      })()}
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="text-sm">
                          <Badge variant="outline" className="text-xs">
                            Initiale: {formatDate(interlocuteur.dateInitiale)}
                          </Badge>
                        </div>
                        {interlocuteur.dateRenouvellement && (
                          <div className="text-sm">
                            <Badge variant="secondary" className="text-xs">
                              Renouvellement: {formatDate(interlocuteur.dateRenouvellement)}
                            </Badge>
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            handleEditInterlocuteur(interlocuteur);
                            setIsAddDialogOpen(true);
                          }}
                          className="hover:bg-primary hover:text-white"
                        >
                          <Edit className="h-3 w-3" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeleteInterlocuteur(interlocuteur.id)}
                          className="text-destructive hover:bg-destructive hover:text-destructive-foreground"
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {filteredInterlocuteurs.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              {searchTerm ? 'Aucun interlocuteur trouvé pour cette recherche' : 'Aucun interlocuteur enregistré'}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}