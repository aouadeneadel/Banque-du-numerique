import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Badge } from './ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Heart, Plus, Calendar, MapPin, Monitor, Smartphone, Edit, Trash2, Eye } from 'lucide-react';
import { toast } from 'sonner@2.0.3';

interface Device {
  id: number;
  type: 'PC' | 'Smartphone';
  marque: string;
  modele: string;
  numeroSerie: string;
  numeroInventaire: string;
}

interface Donation {
  id: number;
  structureNom: string;
  ville: string;
  codePostal: string;
  contact: string;
  email?: string;
  telephone?: string;
  materiel: Device[];
  dateDon: string;
  notes?: string;
  statut: 'En cours' | 'Reçu' | 'Annulé';
}

export function Solidon() {
  const [donations, setDonations] = useState<Donation[]>([
    {
      id: 1,
      structureNom: 'Association Aide Numérique',
      ville: 'Nice',
      codePostal: '06000',
      contact: 'Marie Dupont',
      email: 'marie@aide-numerique.fr',
      telephone: '04.93.12.34.56',
      materiel: [
        {
          id: 1,
          type: 'PC',
          marque: 'Dell',
          modele: 'Inspiron 15',
          numeroSerie: 'DEL001X2023',
          numeroInventaire: 'abn-2024-001'
        },
        {
          id: 2,
          type: 'Smartphone',
          marque: 'Samsung',
          modele: 'Galaxy A54',
          numeroSerie: 'SAM001A2023',
          numeroInventaire: 'abn-2024-002'
        }
      ],
      dateDon: '2024-01-15',
      notes: 'Matériel reçu de la structure partenaire',
      statut: 'Reçu'
    },
    {
      id: 2,
      structureNom: 'Centre Social Liberté',
      ville: 'Cannes',
      codePostal: '06400',
      contact: 'Pierre Martin',
      email: 'p.martin@centre-liberte.fr',
      materiel: [
        {
          id: 3,
          type: 'PC',
          marque: 'Lenovo',
          modele: 'ThinkPad E15',
          numeroSerie: 'LEN002Y2023',
          numeroInventaire: 'abn-2024-003'
        }
      ],
      dateDon: '2024-01-20',
      statut: 'En cours'
    }
  ]);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingDonation, setEditingDonation] = useState<Donation | null>(null);
  const [newDonation, setNewDonation] = useState<Partial<Donation>>({
    structureNom: '',
    ville: '',
    codePostal: '',
    contact: '',
    email: '',
    telephone: '',
    materiel: [],
    dateDon: new Date().toISOString().split('T')[0],
    notes: '',
    statut: 'En cours'
  });

  const availableDevices: Device[] = [
    { id: 4, type: 'PC', marque: 'HP', modele: 'Pavilion', numeroSerie: 'HP001Z2023', numeroInventaire: 'abn-2024-004' },
    { id: 5, type: 'Smartphone', marque: 'Apple', modele: 'iPhone 12', numeroSerie: 'APP001X2023', numeroInventaire: 'abn-2024-005' },
    { id: 6, type: 'PC', marque: 'Asus', modele: 'VivoBook', numeroSerie: 'ASU001V2023', numeroInventaire: 'abn-2024-006' },
  ];

  const handleSaveDonation = () => {
    if (!newDonation.structureNom || !newDonation.ville || !newDonation.contact) {
      toast.error('Veuillez remplir tous les champs obligatoires');
      return;
    }

    if (editingDonation) {
      setDonations(prev => prev.map(donation => 
        donation.id === editingDonation.id 
          ? { ...newDonation, id: editingDonation.id } as Donation
          : donation
      ));
      toast.success('Réception de matériel modifiée avec succès');
    } else {
      const newId = Math.max(...donations.map(d => d.id), 0) + 1;
      setDonations(prev => [...prev, { ...newDonation, id: newId } as Donation]);
      toast.success('Nouvelle réception de matériel enregistrée avec succès');
    }

    setIsDialogOpen(false);
    setEditingDonation(null);
    setNewDonation({
      structureNom: '',
      ville: '',
      codePostal: '',
      contact: '',
      email: '',
      telephone: '',
      materiel: [],
      dateDon: new Date().toISOString().split('T')[0],
      notes: '',
      statut: 'En cours'
    });
  };

  const handleEdit = (donation: Donation) => {
    setEditingDonation(donation);
    setNewDonation(donation);
    setIsDialogOpen(true);
  };

  const handleDelete = (id: number) => {
    setDonations(prev => prev.filter(donation => donation.id !== id));
    toast.success('Réception supprimée avec succès');
  };

  const addDeviceToDonation = (device: Device) => {
    if (!newDonation.materiel?.find(d => d.id === device.id)) {
      setNewDonation(prev => ({
        ...prev,
        materiel: [...(prev.materiel || []), device]
      }));
    }
  };

  const removeDeviceFromDonation = (deviceId: number) => {
    setNewDonation(prev => ({
      ...prev,
      materiel: prev.materiel?.filter(d => d.id !== deviceId) || []
    }));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Reçu': return 'bg-green-100 text-green-800';
      case 'En cours': return 'bg-primary/10 text-primary';
      case 'Annulé': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStats = () => {
    const total = donations.length;
    const recu = donations.filter(d => d.statut === 'Reçu').length;
    const enCours = donations.filter(d => d.statut === 'En cours').length;
    const totalMateriel = donations.reduce((acc, d) => acc + d.materiel.length, 0);

    return { total, recu, enCours, totalMateriel };
  };

  const stats = getStats();

  return (
    <div className="space-y-4 p-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center space-x-2">
          <Heart className="w-6 h-6 text-primary" />
          <div>
            <h2 className="text-xl font-semibold">Solidon - Réception de Matériel</h2>
            <p className="text-sm text-muted-foreground">Les structures nous donnent du matériel</p>
          </div>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="w-full sm:w-auto">
              <Plus className="w-4 h-4 mr-2" />
              Nouveau Don
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingDonation ? 'Modifier le Don' : 'Nouveau Don'}</DialogTitle>
              <DialogDescription>
                Enregistrez les informations du don de matériel à une structure
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="structureNom">Nom de la Structure *</Label>
                  <Input
                    id="structureNom"
                    value={newDonation.structureNom}
                    onChange={(e) => setNewDonation(prev => ({ ...prev, structureNom: e.target.value }))}
                    placeholder="Association, école, centre..."
                  />
                </div>
                <div>
                  <Label htmlFor="contact">Contact Principal *</Label>
                  <Input
                    id="contact"
                    value={newDonation.contact}
                    onChange={(e) => setNewDonation(prev => ({ ...prev, contact: e.target.value }))}
                    placeholder="Nom du responsable"
                  />
                </div>
                <div>
                  <Label htmlFor="ville">Ville *</Label>
                  <Input
                    id="ville"
                    value={newDonation.ville}
                    onChange={(e) => setNewDonation(prev => ({ ...prev, ville: e.target.value }))}
                    placeholder="Ville"
                  />
                </div>
                <div>
                  <Label htmlFor="codePostal">Code Postal</Label>
                  <Input
                    id="codePostal"
                    value={newDonation.codePostal}
                    onChange={(e) => setNewDonation(prev => ({ ...prev, codePostal: e.target.value }))}
                    placeholder="06000"
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={newDonation.email}
                    onChange={(e) => setNewDonation(prev => ({ ...prev, email: e.target.value }))}
                    placeholder="contact@structure.fr"
                  />
                </div>
                <div>
                  <Label htmlFor="telephone">Téléphone</Label>
                  <Input
                    id="telephone"
                    value={newDonation.telephone}
                    onChange={(e) => setNewDonation(prev => ({ ...prev, telephone: e.target.value }))}
                    placeholder="04.93.12.34.56"
                  />
                </div>
                <div>
                  <Label htmlFor="dateDon">Date du Don</Label>
                  <Input
                    id="dateDon"
                    type="date"
                    value={newDonation.dateDon}
                    onChange={(e) => setNewDonation(prev => ({ ...prev, dateDon: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="statut">Statut</Label>
                  <Select value={newDonation.statut} onValueChange={(value: any) => setNewDonation(prev => ({ ...prev, statut: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="En cours">En cours</SelectItem>
                      <SelectItem value="Reçu">Reçu</SelectItem>
                      <SelectItem value="Annulé">Annulé</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                  id="notes"
                  value={newDonation.notes}
                  onChange={(e) => setNewDonation(prev => ({ ...prev, notes: e.target.value }))}
                  placeholder="Informations complémentaires..."
                  rows={3}
                />
              </div>

              {/* Matériel */}
              <div className="space-y-3">
                <Label>Matériel à donner</Label>
                <div className="grid grid-cols-1 gap-2 max-h-40 overflow-y-auto">
                  {availableDevices.map(device => (
                    <div key={device.id} className="flex items-center justify-between p-2 border rounded">
                      <div className="flex items-center space-x-2">
                        {device.type === 'PC' ? <Monitor className="w-4 h-4" /> : <Smartphone className="w-4 h-4" />}
                        <span className="text-sm">{device.marque} {device.modele}</span>
                        <Badge variant="outline" className="text-xs">{device.numeroInventaire}</Badge>
                      </div>
                      <Button
                        type="button"
                        size="sm"
                        variant={newDonation.materiel?.find(d => d.id === device.id) ? "destructive" : "outline"}
                        onClick={() => {
                          if (newDonation.materiel?.find(d => d.id === device.id)) {
                            removeDeviceFromDonation(device.id);
                          } else {
                            addDeviceToDonation(device);
                          }
                        }}
                      >
                        {newDonation.materiel?.find(d => d.id === device.id) ? 'Retirer' : 'Ajouter'}
                      </Button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-end space-x-2 pt-4">
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Annuler
                </Button>
                <Button onClick={handleSaveDonation} className="bg-primary hover:bg-primary/90">
                  <Plus className="w-4 h-4 mr-2" />
                  {editingDonation ? 'Sauvegarder Modifications' : 'Enregistrer Don'}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Dons</p>
                <p className="text-xl font-bold text-primary">{stats.total}</p>
              </div>
              <Heart className="w-6 h-6 text-primary" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Reçus</p>
                <p className="text-xl font-bold text-green-600">{stats.recu}</p>
              </div>
              <Calendar className="w-6 h-6 text-green-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">En Cours</p>
                <p className="text-xl font-bold text-primary">{stats.enCours}</p>
              </div>
              <MapPin className="w-6 h-6 text-primary" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Matériel</p>
                <p className="text-xl font-bold text-secondary">{stats.totalMateriel}</p>
              </div>
              <Monitor className="w-6 h-6 text-secondary" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Liste des dons */}
      <Card>
        <CardHeader>
          <CardTitle>Historique des Dons</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Structure</TableHead>
                  <TableHead className="hidden sm:table-cell">Contact</TableHead>
                  <TableHead className="hidden md:table-cell">Ville</TableHead>
                  <TableHead>Matériel</TableHead>
                  <TableHead className="hidden lg:table-cell">Date</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {donations.map((donation) => (
                  <TableRow key={donation.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium">{donation.structureNom}</p>
                        <p className="text-sm text-muted-foreground sm:hidden">{donation.contact}</p>
                        <p className="text-sm text-muted-foreground md:hidden">{donation.ville}</p>
                      </div>
                    </TableCell>
                    <TableCell className="hidden sm:table-cell">{donation.contact}</TableCell>
                    <TableCell className="hidden md:table-cell">{donation.ville}</TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {donation.materiel.slice(0, 2).map(device => (
                          <Badge key={device.id} variant="outline" className="text-xs">
                            {device.type === 'PC' ? <Monitor className="w-3 h-3 mr-1" /> : <Smartphone className="w-3 h-3 mr-1" />}
                            {device.marque}
                          </Badge>
                        ))}
                        {donation.materiel.length > 2 && (
                          <Badge variant="outline" className="text-xs">
                            +{donation.materiel.length - 2}
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="hidden lg:table-cell">
                      {new Date(donation.dateDon).toLocaleDateString('fr-FR')}
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(donation.statut)}>
                        {donation.statut}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-1">
                        <Button variant="ghost" size="sm" onClick={() => handleEdit(donation)}>
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => handleDelete(donation.id)}>
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}