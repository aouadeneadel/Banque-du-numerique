import React, { useState, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Progress } from './ui/progress';
import { Upload, Download, Search, Filter, CheckCircle, AlertTriangle, X, Save, FileText, Database, HardDrive } from 'lucide-react';
import { toast } from 'sonner@2.0.3';

interface ImportedData {
  id: string;
  type: 'PC' | 'Smartphone' | 'Interlocuteur';
  data: Record<string, any>;
  status: 'valid' | 'warning' | 'error';
  errors?: string[];
  warnings?: string[];
}

interface FilterOptions {
  type: 'PC' | 'Smartphone' | 'Interlocuteur' | 'Tous';
  status: 'valid' | 'warning' | 'error' | 'Tous';
  searchTerm: string;
}

export function ImportExport() {
  const [importedData, setImportedData] = useState<ImportedData[]>([]);
  const [filteredData, setFilteredData] = useState<ImportedData[]>([]);
  const [isImporting, setIsImporting] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [importProgress, setImportProgress] = useState(0);
  const [exportProgress, setExportProgress] = useState(0);
  const [activeTab, setActiveTab] = useState('import');
  const [filters, setFilters] = useState<FilterOptions>({
    type: 'Tous',
    status: 'Tous',
    searchTerm: ''
  });
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Fonction de validation des données
  const validateData = (data: any, type: string): { status: 'valid' | 'warning' | 'error'; errors: string[]; warnings: string[] } => {
    const errors: string[] = [];
    const warnings: string[] = [];

    if (type === 'PC' || type === 'Smartphone') {
      if (!data.marque) errors.push('Marque manquante');
      if (!data.modele) errors.push('Modèle manquant');
      if (!data.numeroSerie) errors.push('Numéro de série manquant');
      if (!data.numeroInventaire) warnings.push('Numéro d\'inventaire recommandé');
      if (!data.etat) warnings.push('État non spécifié');
    }

    if (type === 'Interlocuteur') {
      if (!data.nomStructure) errors.push('Nom de structure manquant');
      if (!data.ville) errors.push('Ville manquante');
      if (!data.interlocuteur1?.nom) errors.push('Interlocuteur principal manquant');
      if (!data.interlocuteur1?.email) warnings.push('Email de l\'interlocuteur principal recommandé');
    }

    const status = errors.length > 0 ? 'error' : warnings.length > 0 ? 'warning' : 'valid';
    return { status, errors, warnings };
  };

  // Simulation d'importation de fichier
  const handleFileImport = async (file: File) => {
    setIsImporting(true);
    setImportProgress(0);

    try {
      for (let i = 0; i <= 100; i += 10) {
        setImportProgress(i);
        await new Promise(resolve => setTimeout(resolve, 200));
      }

      // Données d'exemple pour la démonstration
      const mockImportedData: ImportedData[] = [
        {
          id: '1',
          type: 'PC',
          data: {
            marque: 'Dell',
            modele: 'Inspiron 15',
            numeroSerie: 'DEL001X2023',
            numeroInventaire: 'abn-2024-010',
            etat: 'Neuf',
            dateAchat: '2024-01-15'
          },
          status: 'valid',
          errors: [],
          warnings: []
        },
        {
          id: '2',
          type: 'Smartphone',
          data: {
            marque: 'Apple',
            modele: 'iPhone 15',
            numeroSerie: 'APP001Z2024',
            etat: 'Neuf'
          },
          status: 'warning',
          errors: [],
          warnings: ['Numéro d\'inventaire recommandé']
        }
      ];

      const validatedData = mockImportedData.map(item => {
        const validation = validateData(item.data, item.type);
        return {
          ...item,
          status: validation.status,
          errors: validation.errors,
          warnings: validation.warnings
        };
      });

      setImportedData(validatedData);
      setFilteredData(validatedData);
      toast.success(`${validatedData.length} enregistrements importés avec succès`);
    } catch (error) {
      toast.error('Erreur lors de l\'importation du fichier');
    } finally {
      setIsImporting(false);
      setImportProgress(0);
    }
  };

  // Simulation d'export
  const handleExport = async (format: string) => {
    setIsExporting(true);
    setExportProgress(0);

    try {
      for (let i = 0; i <= 100; i += 20) {
        setExportProgress(i);
        await new Promise(resolve => setTimeout(resolve, 300));
      }

      toast.success(`Export ${format.toUpperCase()} terminé avec succès`);
    } catch (error) {
      toast.error('Erreur lors de l\'export');
    } finally {
      setIsExporting(false);
      setExportProgress(0);
    }
  };

  // Filtrage des données
  const applyFilters = () => {
    let filtered = [...importedData];

    if (filters.type !== 'Tous') {
      filtered = filtered.filter(item => item.type === filters.type);
    }

    if (filters.status !== 'Tous') {
      filtered = filtered.filter(item => item.status === filters.status);
    }

    if (filters.searchTerm) {
      filtered = filtered.filter(item =>
        Object.values(item.data).some(value =>
          String(value).toLowerCase().includes(filters.searchTerm.toLowerCase())
        )
      );
    }

    setFilteredData(filtered);
  };

  React.useEffect(() => {
    applyFilters();
  }, [filters, importedData]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'valid': return 'bg-green-100 text-green-800';
      case 'warning': return 'bg-yellow-100 text-yellow-800';
      case 'error': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'valid': return <CheckCircle className="w-4 h-4" />;
      case 'warning': return <AlertTriangle className="w-4 h-4" />;
      case 'error': return <X className="w-4 h-4" />;
      default: return null;
    }
  };

  const getStats = () => {
    const total = importedData.length;
    const valid = importedData.filter(item => item.status === 'valid').length;
    const warning = importedData.filter(item => item.status === 'warning').length;
    const error = importedData.filter(item => item.status === 'error').length;

    return { total, valid, warning, error };
  };

  const stats = getStats();

  return (
    <div className="space-y-4 p-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center space-x-2">
          <Database className="w-6 h-6 text-primary" />
          <h2 className="text-xl font-semibold">Import & Export de Données</h2>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-4 bg-white border border-border rounded-lg p-1">
          <TabsTrigger 
            value="import" 
            className="flex items-center space-x-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
          >
            <Upload className="w-4 h-4" />
            <span>Importation</span>
          </TabsTrigger>
          <TabsTrigger 
            value="export"
            className="flex items-center space-x-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
          >
            <Download className="w-4 h-4" />
            <span>Export & Sauvegarde</span>
          </TabsTrigger>
        </TabsList>

        {/* Onglet Importation */}
        <TabsContent value="import" className="mt-0 space-y-4">
          {/* Statistiques */}
          {importedData.length > 0 && (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Total</p>
                      <p className="text-xl font-bold">{stats.total}</p>
                    </div>
                    <FileText className="w-6 h-6 text-muted-foreground" />
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Valides</p>
                      <p className="text-xl font-bold text-green-600">{stats.valid}</p>
                    </div>
                    <CheckCircle className="w-6 h-6 text-green-600" />
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Avertissements</p>
                      <p className="text-xl font-bold text-yellow-600">{stats.warning}</p>
                    </div>
                    <AlertTriangle className="w-6 h-6 text-yellow-600" />
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Erreurs</p>
                      <p className="text-xl font-bold text-red-600">{stats.error}</p>
                    </div>
                    <X className="w-6 h-6 text-red-600" />
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          <Card>
            <CardHeader>
              <CardTitle>Importer des Données</CardTitle>
              <CardDescription>
                Importez des fichiers CSV, JSON ou Excel
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Zone de téléchargement */}
              <div 
                className="border-2 border-dashed border-border rounded-lg p-6 text-center cursor-pointer hover:border-primary transition-colors"
                onClick={() => fileInputRef.current?.click()}
              >
                <Upload className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
                <p className="font-medium">Glissez-déposez votre fichier ici</p>
                <p className="text-sm text-muted-foreground mb-3">ou cliquez pour sélectionner</p>
                <Button variant="outline" size="sm">
                  Sélectionner un Fichier
                </Button>
              </div>

              <input
                ref={fileInputRef}
                type="file"
                accept=".csv,.json,.xlsx,.xls"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    handleFileImport(file);
                  }
                }}
              />

              {/* Progress d'importation */}
              {isImporting && (
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Importation en cours...</span>
                    <span>{importProgress}%</span>
                  </div>
                  <Progress value={importProgress} className="w-full" />
                </div>
              )}

              {/* Filtres et données importées */}
              {importedData.length > 0 && (
                <div className="space-y-4">
                  <Separator />
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <Select value={filters.type} onValueChange={(value: any) => setFilters(prev => ({ ...prev, type: value }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Tous">Tous</SelectItem>
                        <SelectItem value="PC">PC</SelectItem>
                        <SelectItem value="Smartphone">Smartphone</SelectItem>
                        <SelectItem value="Interlocuteur">Interlocuteur</SelectItem>
                      </SelectContent>
                    </Select>
                    <Select value={filters.status} onValueChange={(value: any) => setFilters(prev => ({ ...prev, status: value }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Statut" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Tous">Tous</SelectItem>
                        <SelectItem value="valid">Valides</SelectItem>
                        <SelectItem value="warning">Avertissements</SelectItem>
                        <SelectItem value="error">Erreurs</SelectItem>
                      </SelectContent>
                    </Select>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        placeholder="Rechercher..."
                        value={filters.searchTerm}
                        onChange={(e) => setFilters(prev => ({ ...prev, searchTerm: e.target.value }))}
                        className="pl-10"
                      />
                    </div>
                  </div>

                  <div className="max-h-64 overflow-y-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Type</TableHead>
                          <TableHead>Données</TableHead>
                          <TableHead>Statut</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredData.map((item) => (
                          <TableRow key={item.id}>
                            <TableCell>
                              <Badge variant="outline">{item.type}</Badge>
                            </TableCell>
                            <TableCell>
                              <div className="space-y-1">
                                {Object.entries(item.data).slice(0, 2).map(([key, value]) => (
                                  <div key={key} className="text-sm">
                                    <span className="font-medium">{key}:</span> {String(value)}
                                  </div>
                                ))}
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center space-x-2">
                                {getStatusIcon(item.status)}
                                <Badge className={getStatusColor(item.status)}>
                                  {item.status === 'valid' ? 'Valide' : 
                                   item.status === 'warning' ? 'Avertissement' : 'Erreur'}
                                </Badge>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>

                  <div className="flex justify-end space-x-2">
                    <Button variant="outline">
                      <Download className="w-4 h-4 mr-2" />
                      Exporter Données Filtrées
                    </Button>
                    <Button>
                      <Save className="w-4 h-4 mr-2" />
                      Intégrer à la Base
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Onglet Export & Sauvegarde */}
        <TabsContent value="export" className="mt-0 space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Export de données */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Download className="w-5 h-5" />
                  <span>Export de Données</span>
                </CardTitle>
                <CardDescription>
                  Exportez vos données dans différents formats
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 gap-3">
                  <Button 
                    onClick={() => handleExport('csv')} 
                    variant="outline" 
                    className="justify-start"
                    disabled={isExporting}
                  >
                    <FileText className="w-4 h-4 mr-2" />
                    Exporter en CSV
                  </Button>
                  <Button 
                    onClick={() => handleExport('excel')} 
                    variant="outline" 
                    className="justify-start"
                    disabled={isExporting}
                  >
                    <FileText className="w-4 h-4 mr-2" />
                    Exporter en Excel
                  </Button>
                  <Button 
                    onClick={() => handleExport('json')} 
                    variant="outline" 
                    className="justify-start"
                    disabled={isExporting}
                  >
                    <FileText className="w-4 h-4 mr-2" />
                    Exporter en JSON
                  </Button>
                </div>

                {isExporting && (
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Export en cours...</span>
                      <span>{exportProgress}%</span>
                    </div>
                    <Progress value={exportProgress} className="w-full" />
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Sauvegarde */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <HardDrive className="w-5 h-5" />
                  <span>Sauvegarde</span>
                </CardTitle>
                <CardDescription>
                  Créez des sauvegardes complètes de votre système
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 gap-3">
                  <Button 
                    onClick={() => handleExport('backup')} 
                    className="justify-start"
                    disabled={isExporting}
                  >
                    <HardDrive className="w-4 h-4 mr-2" />
                    Sauvegarde Complète
                  </Button>
                  <Button 
                    onClick={() => handleExport('incremental')} 
                    variant="outline" 
                    className="justify-start"
                    disabled={isExporting}
                  >
                    <Database className="w-4 h-4 mr-2" />
                    Sauvegarde Incrémentale
                  </Button>
                </div>

                <div className="space-y-2 text-sm text-muted-foreground">
                  <p>• Sauvegarde complète : Tous les appareils et interlocuteurs</p>
                  <p>• Sauvegarde incrémentale : Modifications récentes uniquement</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Statistiques d'export */}
          <Card>
            <CardHeader>
              <CardTitle>Historique des Exports</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between items-center p-2 bg-muted rounded">
                  <span className="text-sm">Dernière sauvegarde complète</span>
                  <span className="text-sm text-muted-foreground">Il y a 2 jours</span>
                </div>
                <div className="flex justify-between items-center p-2 bg-muted rounded">
                  <span className="text-sm">Export CSV des appareils</span>
                  <span className="text-sm text-muted-foreground">Il y a 1 semaine</span>
                </div>
                <div className="flex justify-between items-center p-2 bg-muted rounded">
                  <span className="text-sm">Export Excel des interlocuteurs</span>
                  <span className="text-sm text-muted-foreground">Il y a 2 semaines</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}