import React, { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Search, RotateCcw } from 'lucide-react';

interface PC {
  id: number;
  modele: string;
  marque: string;
  annee: number;
  etat: string;
  numeroSerie: string;
  numeroInventaire: string;
  dateAjout: string;
}

const etats = ['Neuf', 'Occasion', 'Réparé', 'En panne', 'Livré'];

export function PCManagement() {
  const [pcs, setPcs] = useState<PC[]>([
    { id: 1, modele: 'Inspiron 15', marque: 'Dell', annee: 2022, etat: 'Neuf', numeroSerie: 'DEL001X2022', numeroInventaire: 'abn-2024-001', dateAjout: '2024-01-15' },
    { id: 2, modele: 'ThinkPad X1', marque: 'Lenovo', annee: 2021, etat: 'Occasion', numeroSerie: 'LEN001Y2021', numeroInventaire: 'abn-2024-002', dateAjout: '2024-01-20' },
    { id: 3, modele: 'MacBook Air', marque: 'Apple', annee: 2023, etat: 'Réparé', numeroSerie: 'APP001Z2023', numeroInventaire: 'abn-2024-003', dateAjout: '2024-02-01' },
  ]);

  const [formData, setFormData] = useState({
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

    const newPC: PC = {
      id: Date.now(),
      modele: formData.modele,
      marque: formData.marque,
      annee: parseInt(formData.annee),
      etat: formData.etat,
      numeroSerie: formData.numeroSerie,
      numeroInventaire: formData.numeroInventaire,
      dateAjout: new Date().toISOString().split('T')[0]
    };

    setPcs([...pcs, newPC]);
    setFormData({ modele: '', marque: '', annee: '', etat: '', numeroSerie: '', numeroInventaire: '' });
  };

  const handleModify = () => {
    if (selectedId && formData.modele && formData.marque && formData.annee && formData.etat && formData.numeroSerie && formData.numeroInventaire) {
      setPcs(pcs.map(pc => 
        pc.id === selectedId 
          ? { ...pc, modele: formData.modele, marque: formData.marque, annee: parseInt(formData.annee), etat: formData.etat, numeroSerie: formData.numeroSerie, numeroInventaire: formData.numeroInventaire }
          : pc
      ));
      setFormData({ modele: '', marque: '', annee: '', etat: '', numeroSerie: '', numeroInventaire: '' });
      setSelectedId(null);
    }
  };

  const handleDelete = () => {
    if (selectedId) {
      setPcs(pcs.filter(pc => pc.id !== selectedId));
      setSelectedId(null);
      setFormData({ modele: '', marque: '', annee: '', etat: '', numeroSerie: '', numeroInventaire: '' });
    }
  };

  const handleRowClick = (pc: PC) => {
    setSelectedId(pc.id);
    setFormData({
      modele: pc.modele,
      marque: pc.marque,
      annee: pc.annee.toString(),
      etat: pc.etat,
      numeroSerie: pc.numeroSerie,
      numeroInventaire: pc.numeroInventaire
    });
  };

  const resetFilters = () => {
    setSearchTerm('');
    setFilterEtat('');
  };

  const filteredPCs = pcs.filter(pc => {
    const matchesSearch = pc.modele.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         pc.marque.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         pc.numeroSerie.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         pc.numeroInventaire.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = !filterEtat || pc.etat === filterEtat;
    return matchesSearch && matchesFilter;
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="space-y-6">
      {/* Form Section */}
      <div className="bg-white p-6 rounded-lg border shadow-sm">
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
            {filteredPCs.map((pc, index) => (
              <TableRow 
                key={pc.id}
                className={`cursor-pointer hover:bg-accent/50 ${selectedId === pc.id ? 'bg-accent' : index % 2 === 0 ? 'bg-white' : 'bg-background'}`}
                onClick={() => handleRowClick(pc)}
              >
                <TableCell>{pc.id}</TableCell>
                <TableCell>{pc.modele}</TableCell>
                <TableCell>{pc.marque}</TableCell>
                <TableCell>{pc.annee}</TableCell>
                <TableCell className="font-mono text-sm">{pc.numeroSerie}</TableCell>
                <TableCell className="font-mono text-sm">{pc.numeroInventaire}</TableCell>
                <TableCell>
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    pc.etat === 'Neuf' ? 'bg-green-100 text-green-800' :
                    pc.etat === 'Occasion' ? 'bg-blue-100 text-blue-800' :
                    pc.etat === 'Réparé' ? 'bg-yellow-100 text-yellow-800' :
                    pc.etat === 'En panne' ? 'bg-red-100 text-red-800' :
                    'bg-purple-100 text-purple-800'
                  }`}>
                    {pc.etat}
                  </span>
                </TableCell>
                <TableCell>{new Date(pc.dateAjout).toLocaleDateString('fr-FR')}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}