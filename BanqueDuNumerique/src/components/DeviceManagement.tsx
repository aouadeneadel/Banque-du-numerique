import React, { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Search, RotateCcw, Monitor, Smartphone } from 'lucide-react';

interface Device {
  id: number;
  type: 'PC' | 'Smartphone';
  modele: string;
  marque: string;
  annee: number;
  etat: string;
  numeroSerie: string;
  numeroInventaire: string;
  dateAjout: string;
}

const etats = ['Neuf', 'Occasion', 'Réparé', 'En panne', 'Livré'];

export function DeviceManagement() {
  const [devices, setDevices] = useState<Device[]>([
    { 
      id: 1, 
      type: 'PC',
      modele: 'Inspiron 15', 
      marque: 'Dell', 
      annee: 2022, 
      etat: 'Neuf', 
      numeroSerie: 'DEL001X2022', 
      numeroInventaire: 'abn-2024-001', 
      dateAjout: '2024-01-15'
    },
    { 
      id: 2, 
      type: 'PC',
      modele: 'ThinkPad X1', 
      marque: 'Lenovo', 
      annee: 2021, 
      etat: 'Occasion', 
      numeroSerie: 'LEN001Y2021', 
      numeroInventaire: 'abn-2024-002', 
      dateAjout: '2024-01-20'
    },
    { 
      id: 3, 
      type: 'Smartphone',
      modele: 'iPhone 14', 
      marque: 'Apple', 
      annee: 2023, 
      etat: 'Neuf', 
      numeroSerie: 'APP001Z2023', 
      numeroInventaire: 'abn-2024-003', 
      dateAjout: '2024-02-01'
    },
    { 
      id: 4, 
      type: 'Smartphone',
      modele: 'Galaxy S23', 
      marque: 'Samsung', 
      annee: 2023, 
      etat: 'Neuf', 
      numeroSerie: 'SAM001A2023', 
      numeroInventaire: 'abn-2024-004', 
      dateAjout: '2024-02-05'
    },
  ]);

  const [activeDeviceTab, setActiveDeviceTab] = useState<'PC' | 'Smartphone'>('PC');
  
  const [formData, setFormData] = useState({
    type: 'PC' as 'PC' | 'Smartphone',
    modele: '',
    marque: '',
    annee: '',
    etat: '',
    numeroSerie: '',
    numeroInventaire: ''
  });

  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterEtat, setFilterEtat] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.modele || !formData.marque || !formData.annee || !formData.etat || !formData.numeroSerie || !formData.numeroInventaire) return;

    const newDevice: Device = {
      id: Date.now(),
      type: formData.type,
      modele: formData.modele,
      marque: formData.marque,
      annee: parseInt(formData.annee),
      etat: formData.etat,
      numeroSerie: formData.numeroSerie,
      numeroInventaire: formData.numeroInventaire,
      dateAjout: new Date().toISOString().split('T')[0]
    };

    setDevices([...devices, newDevice]);
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      type: activeDeviceTab,
      modele: '', marque: '', annee: '', etat: '', numeroSerie: '', numeroInventaire: ''
    });
  };

  const handleModify = () => {
    if (selectedId && formData.modele && formData.marque && formData.annee && formData.etat && formData.numeroSerie && formData.numeroInventaire) {
      setDevices(devices.map(device => 
        device.id === selectedId 
          ? { 
              ...device, 
              modele: formData.modele, 
              marque: formData.marque, 
              annee: parseInt(formData.annee), 
              etat: formData.etat, 
              numeroSerie: formData.numeroSerie, 
              numeroInventaire: formData.numeroInventaire
            }
          : device
      ));
      resetForm();
      setSelectedId(null);
    }
  };

  const handleDelete = () => {
    if (selectedId) {
      setDevices(devices.filter(device => device.id !== selectedId));
      setSelectedId(null);
      resetForm();
    }
  };

  const handleRowClick = (device: Device) => {
    setSelectedId(device.id);
    setFormData({
      type: device.type,
      modele: device.modele,
      marque: device.marque,
      annee: device.annee.toString(),
      etat: device.etat,
      numeroSerie: device.numeroSerie,
      numeroInventaire: device.numeroInventaire
    });
  };

  const resetFilters = () => {
    setSearchTerm('');
    setFilterEtat('');
  };

  const filteredDevices = devices.filter(device => {
    const matchesType = device.type === activeDeviceTab;
    const matchesSearch = device.modele.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         device.marque.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         device.numeroSerie.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         device.numeroInventaire.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = !filterEtat || device.etat === filterEtat;
    return matchesType && matchesSearch && matchesFilter;
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleTabChange = (value: string) => {
    const newType = value as 'PC' | 'Smartphone';
    setActiveDeviceTab(newType);
    setFormData(prev => ({ ...prev, type: newType }));
    setSelectedId(null);
    resetForm();
  };

  return (
    <div className="space-y-6">
      {/* Device Type Tabs */}
      <Tabs value={activeDeviceTab} onValueChange={handleTabChange} className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-6 bg-white border border-border rounded-lg p-1">
          <TabsTrigger 
            value="PC" 
            className="flex items-center space-x-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
          >
            <Monitor className="w-4 h-4" />
            <span>Ordinateurs</span>
          </TabsTrigger>
          <TabsTrigger 
            value="Smartphone"
            className="flex items-center space-x-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
          >
            <Smartphone className="w-4 h-4" />
            <span>Smartphones</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="PC" className="mt-0">
          <div className="space-y-6">
            {/* Form Section */}
            <div className="bg-white p-6 rounded-lg border shadow-sm">
              <h3 className="mb-4">Gestion des Ordinateurs</h3>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="modele">Modèle</Label>
                    <Input
                      id="modele"
                      value={formData.modele}
                      onChange={(e) => handleInputChange('modele', e.target.value)}
                      placeholder="Saisir le modèle"
                    />
                  </div>
                  <div>
                    <Label htmlFor="marque">Marque</Label>
                    <Input
                      id="marque"
                      value={formData.marque}
                      onChange={(e) => handleInputChange('marque', e.target.value)}
                      placeholder="Saisir la marque"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="annee">Année</Label>
                    <Input
                      id="annee"
                      type="number"
                      value={formData.annee}
                      onChange={(e) => handleInputChange('annee', e.target.value)}
                      placeholder="2024"
                      min="2000"
                      max="2030"
                    />
                  </div>
                  <div>
                    <Label htmlFor="etat">État</Label>
                    <Select value={formData.etat} onValueChange={(value) => handleInputChange('etat', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner l'état" />
                      </SelectTrigger>
                      <SelectContent>
                        {etats.map((etat) => (
                          <SelectItem key={etat} value={etat}>{etat}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="numeroSerie">Numéro de Série</Label>
                    <Input
                      id="numeroSerie"
                      value={formData.numeroSerie}
                      onChange={(e) => handleInputChange('numeroSerie', e.target.value)}
                      placeholder="DEL001X2024"
                    />
                  </div>
                  <div>
                    <Label htmlFor="numeroInventaire">Numéro d'Inventaire</Label>
                    <Input
                      id="numeroInventaire"
                      value={formData.numeroInventaire}
                      onChange={(e) => handleInputChange('numeroInventaire', e.target.value)}
                      placeholder="abn-2024-001"
                    />
                  </div>
                </div>

                <div className="flex gap-3 pt-2">
                  <Button type="submit" className="bg-primary hover:bg-primary/90">
                    Ajouter
                  </Button>
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={handleModify}
                    disabled={!selectedId}
                    className="border-primary text-primary hover:bg-primary hover:text-white"
                  >
                    Modifier
                  </Button>
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={handleDelete}
                    disabled={!selectedId}
                    className="border-destructive text-destructive hover:bg-destructive hover:text-white"
                  >
                    Supprimer
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="Smartphone" className="mt-0">
          <div className="space-y-6">
            {/* Form Section */}
            <div className="bg-white p-6 rounded-lg border shadow-sm">
              <h3 className="mb-4">Gestion des Smartphones</h3>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="modele">Modèle</Label>
                    <Input
                      id="modele"
                      value={formData.modele}
                      onChange={(e) => handleInputChange('modele', e.target.value)}
                      placeholder="iPhone 14, Galaxy S23"
                    />
                  </div>
                  <div>
                    <Label htmlFor="marque">Marque</Label>
                    <Input
                      id="marque"
                      value={formData.marque}
                      onChange={(e) => handleInputChange('marque', e.target.value)}
                      placeholder="Apple, Samsung, Huawei"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="annee">Année</Label>
                    <Input
                      id="annee"
                      type="number"
                      value={formData.annee}
                      onChange={(e) => handleInputChange('annee', e.target.value)}
                      placeholder="2024"
                      min="2010"
                      max="2030"
                    />
                  </div>
                  <div>
                    <Label htmlFor="etat">État</Label>
                    <Select value={formData.etat} onValueChange={(value) => handleInputChange('etat', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner l'état" />
                      </SelectTrigger>
                      <SelectContent>
                        {etats.map((etat) => (
                          <SelectItem key={etat} value={etat}>{etat}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="numeroSerie">Numéro de Série</Label>
                    <Input
                      id="numeroSerie"
                      value={formData.numeroSerie}
                      onChange={(e) => handleInputChange('numeroSerie', e.target.value)}
                      placeholder="APP001Z2024"
                    />
                  </div>
                  <div>
                    <Label htmlFor="numeroInventaire">Numéro d'Inventaire</Label>
                    <Input
                      id="numeroInventaire"
                      value={formData.numeroInventaire}
                      onChange={(e) => handleInputChange('numeroInventaire', e.target.value)}
                      placeholder="abn-2024-001"
                    />
                  </div>
                </div>

                <div className="flex gap-3 pt-2">
                  <Button type="submit" className="bg-primary hover:bg-primary/90">
                    Ajouter
                  </Button>
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={handleModify}
                    disabled={!selectedId}
                    className="border-primary text-primary hover:bg-primary hover:text-white"
                  >
                    Modifier
                  </Button>
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={handleDelete}
                    disabled={!selectedId}
                    className="border-destructive text-destructive hover:bg-destructive hover:text-white"
                  >
                    Supprimer
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </TabsContent>
      </Tabs>

      {/* Search and Filter Section */}
      <div className="bg-white p-4 rounded-lg border shadow-sm">
        <div className="flex items-center gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Rechercher..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="w-48">
            <Select value={filterEtat} onValueChange={setFilterEtat}>
              <SelectTrigger>
                <SelectValue placeholder="Filtrer par état" />
              </SelectTrigger>
              <SelectContent>
                {etats.map((etat) => (
                  <SelectItem key={etat} value={etat}>{etat}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Button 
            variant="outline" 
            onClick={resetFilters}
            className="border-secondary text-secondary-foreground hover:bg-secondary"
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            Réinitialiser
          </Button>
        </div>
      </div>

      {/* Data Table */}
      <div className="bg-white rounded-lg border shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-primary hover:bg-primary">
              <TableHead className="text-primary-foreground">ID</TableHead>
              <TableHead className="text-primary-foreground">Modèle</TableHead>
              <TableHead className="text-primary-foreground">Marque</TableHead>
              <TableHead className="text-primary-foreground">Année</TableHead>
              <TableHead className="text-primary-foreground">N° Série</TableHead>
              <TableHead className="text-primary-foreground">N° Inventaire</TableHead>
              <TableHead className="text-primary-foreground">État</TableHead>
              <TableHead className="text-primary-foreground">Date Ajout</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredDevices.map((device, index) => (
              <TableRow 
                key={device.id}
                className={`cursor-pointer hover:bg-accent/50 ${selectedId === device.id ? 'bg-accent' : index % 2 === 0 ? 'bg-white' : 'bg-background'}`}
                onClick={() => handleRowClick(device)}
              >
                <TableCell>{device.id}</TableCell>
                <TableCell>{device.modele}</TableCell>
                <TableCell>{device.marque}</TableCell>
                <TableCell>{device.annee}</TableCell>
                <TableCell className="font-mono text-sm">{device.numeroSerie}</TableCell>
                <TableCell className="font-mono text-sm">{device.numeroInventaire}</TableCell>
                <TableCell>
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    device.etat === 'Neuf' ? 'bg-green-100 text-green-800' :
                    device.etat === 'Occasion' ? 'bg-blue-100 text-blue-800' :
                    device.etat === 'Réparé' ? 'bg-yellow-100 text-yellow-800' :
                    device.etat === 'En panne' ? 'bg-red-100 text-red-800' :
                    'bg-purple-100 text-purple-800'
                  }`}>
                    {device.etat}
                  </span>
                </TableCell>
                <TableCell>{new Date(device.dateAjout).toLocaleDateString('fr-FR')}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}