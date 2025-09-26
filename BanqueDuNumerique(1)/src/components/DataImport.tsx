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
import { Upload, FileText, Filter, Search, Download, CheckCircle, AlertTriangle, X, Eye, Save } from 'lucide-react';
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

export function DataImport() {
  const [importedData, setImportedData] = useState<ImportedData[]>([]);
  const [filteredData, setFilteredData] = useState<ImportedData[]>([]);
  const [isImporting, setIsImporting] = useState(false);
  const [importProgress, setImportProgress] = useState(0);
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
      // Simulation du processus d'importation
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
        },
        {
          id: '3',
          type: 'PC',
          data: {
            marque: 'Lenovo',
            modele: 'ThinkPad X1'
          },
          status: 'error',
          errors: ['Numéro de série manquant'],
          warnings: ['État non spécifié']
        },
        {
          id: '4',
          type: 'Interlocuteur',
          data: {
            nomStructure: 'Association Aide Numérique',
            ville: 'Nice',
            codePostal: '06000',
            interlocuteur1: {
              nom: 'Marie Dupont',
              email: 'marie.dupont@aide-numerique.fr',
              telephone: '04.93.12.34.56'
            }
          },
          status: 'valid',
          errors: [],
          warnings: []
        },
        {
          id: '5',
          type: 'Interlocuteur',
          data: {
            nomStructure: 'Centre Social Liberté',
            ville: 'Cannes'
          },
          status: 'error',
          errors: ['Interlocuteur principal manquant'],
          warnings: []
        }
      ];

      // Validation des données
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
      setActiveTab('preview');
      toast.success(`${validatedData.length} enregistrements importés avec succès`);
    } catch (error) {
      toast.error('Erreur lors de l\'importation du fichier');
    } finally {
      setIsImporting(false);
      setImportProgress(0);
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
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Upload className="w-8 h-8 text-primary" />
          <h2 className="text-2xl font-semibold text-foreground">Importation et Filtrage de Données</h2>
        </div>
        {importedData.length > 0 && (
          <div className="flex space-x-2">
            <Button variant="outline" className="border-primary text-primary hover:bg-primary hover:text-white">
              <Download className="w-4 h-4 mr-2" />
              Exporter Données Filtrées
            </Button>
            <Button className="bg-primary hover:bg-primary/90">
              <Save className="w-4 h-4 mr-2" />
              Intégrer à la Base
            </Button>
          </div>
        )}
      </div>

      {/* Statistiques */}
      {importedData.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm">Total</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total}</div>
              <p className="text-xs text-muted-foreground">enregistrements importés</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm">Valides</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{stats.valid}</div>
              <p className="text-xs text-muted-foreground">prêts à intégrer</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm">Avertissements</CardTitle>
              <AlertTriangle className="h-4 w-4 text-yellow-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">{stats.warning}</div>
              <p className="text-xs text-muted-foreground">nécessitent attention</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm">Erreurs</CardTitle>
              <X className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{stats.error}</div>
              <p className="text-xs text-muted-foreground">doivent être corrigés</p>
            </CardContent>
          </Card>
        </div>
      )}

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-6 bg-white border border-border rounded-lg p-1">
          <TabsTrigger 
            value="import" 
            className="flex items-center space-x-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
          >
            <Upload className="w-4 h-4" />
            <span>Importation</span>
          </TabsTrigger>
          <TabsTrigger 
            value="preview"
            className="flex items-center space-x-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            disabled={importedData.length === 0}
          >
            <Eye className="w-4 h-4" />
            <span>Aperçu</span>
          </TabsTrigger>
          <TabsTrigger 
            value="filter"
            className="flex items-center space-x-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            disabled={importedData.length === 0}
          >
            <Filter className="w-4 h-4" />
            <span>Filtrage</span>
          </TabsTrigger>
        </TabsList>

        {/* Onglet Importation */}
        <TabsContent value="import" className="mt-0">
          <Card>
            <CardHeader>
              <CardTitle>Importer des Données</CardTitle>
              <CardDescription>
                Importez des fichiers CSV, JSON ou Excel contenant des données d'appareils ou d'interlocuteurs
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Zone de téléchargement */}
              <div 
                className="border-2 border-dashed border-border rounded-lg p-8 text-center cursor-pointer hover:border-primary transition-colors"
                onClick={() => fileInputRef.current?.click()}
              >
                <Upload className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-lg font-medium">Glissez-déposez votre fichier ici</p>
                <p className="text-sm text-muted-foreground mb-4">ou cliquez pour sélectionner un fichier</p>
                <Button variant="outline">
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

              {/* Formats supportés */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="border-l-4 border-l-primary">
                  <CardContent className="p-4">
                    <h4 className="font-medium mb-2">Fichiers CSV</h4>
                    <p className="text-sm text-muted-foreground">Format texte avec séparateurs virgules</p>
                  </CardContent>
                </Card>
                <Card className="border-l-4 border-l-secondary">
                  <CardContent className="p-4">
                    <h4 className="font-medium mb-2">Fichiers JSON</h4>
                    <p className="text-sm text-muted-foreground">Format de données structurées</p>
                  </CardContent>
                </Card>
                <Card className="border-l-4 border-l-accent">
                  <CardContent className="p-4">
                    <h4 className="font-medium mb-2">Fichiers Excel</h4>
                    <p className="text-sm text-muted-foreground">Feuilles de calcul .xlsx et .xls</p>
                  </CardContent>
                </Card>
              </div>

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
            </CardContent>
          </Card>
        </TabsContent>

        {/* Onglet Aperçu */}
        <TabsContent value="preview" className="mt-0">
          <Card>
            <CardHeader>
              <CardTitle>Aperçu des Données Importées</CardTitle>
              <CardDescription>
                Vérifiez les données importées avant intégration dans la base de données
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="max-h-96 overflow-y-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Type</TableHead>
                      <TableHead>Données</TableHead>
                      <TableHead>Statut</TableHead>
                      <TableHead>Problèmes</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {importedData.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell>
                          <Badge variant="outline">{item.type}</Badge>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            {Object.entries(item.data).slice(0, 3).map(([key, value]) => (
                              <div key={key} className="text-sm">
                                <span className="font-medium">{key}:</span> {String(value)}
                              </div>
                            ))}
                            {Object.keys(item.data).length > 3 && (
                              <div className="text-xs text-muted-foreground">
                                +{Object.keys(item.data).length - 3} autres champs
                              </div>
                            )}
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
                        <TableCell>
                          <div className="space-y-1">
                            {item.errors?.map((error, index) => (
                              <div key={index} className="text-xs text-red-600 flex items-center space-x-1">
                                <X className="w-3 h-3" />
                                <span>{error}</span>
                              </div>
                            ))}
                            {item.warnings?.map((warning, index) => (
                              <div key={index} className="text-xs text-yellow-600 flex items-center space-x-1">
                                <AlertTriangle className="w-3 h-3" />
                                <span>{warning}</span>
                              </div>
                            ))}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Onglet Filtrage */}
        <TabsContent value="filter" className="mt-0">
          <div className="space-y-6">
            {/* Filtres */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Filter className="w-5 h-5" />
                  <span>Filtres de Données</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <Label htmlFor="typeFilter">Type</Label>
                    <Select value={filters.type} onValueChange={(value: any) => setFilters(prev => ({ ...prev, type: value }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Tous les types" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Tous">Tous</SelectItem>
                        <SelectItem value="PC">PC</SelectItem>
                        <SelectItem value="Smartphone">Smartphone</SelectItem>
                        <SelectItem value="Interlocuteur">Interlocuteur</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="statusFilter">Statut</Label>
                    <Select value={filters.status} onValueChange={(value: any) => setFilters(prev => ({ ...prev, status: value }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Tous les statuts" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Tous">Tous</SelectItem>
                        <SelectItem value="valid">Valides</SelectItem>
                        <SelectItem value="warning">Avertissements</SelectItem>
                        <SelectItem value="error">Erreurs</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="md:col-span-2">
                    <Label htmlFor="searchTerm">Recherche</Label>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        id="searchTerm"
                        placeholder="Rechercher dans les données..."
                        value={filters.searchTerm}
                        onChange={(e) => setFilters(prev => ({ ...prev, searchTerm: e.target.value }))}
                        className="pl-10"
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Résultats filtrés */}
            <Card>
              <CardHeader>
                <CardTitle>Résultats Filtrés ({filteredData.length} enregistrements)</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="max-h-96 overflow-y-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Type</TableHead>
                        <TableHead>Données Principales</TableHead>
                        <TableHead>Statut</TableHead>
                        <TableHead>Actions</TableHead>
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
                              {item.type === 'PC' || item.type === 'Smartphone' ? (
                                <>
                                  <div><strong>Marque:</strong> {item.data.marque}</div>
                                  <div><strong>Modèle:</strong> {item.data.modele}</div>
                                  <div><strong>N° Série:</strong> {item.data.numeroSerie}</div>
                                </>
                              ) : (
                                <>
                                  <div><strong>Structure:</strong> {item.data.nomStructure}</div>
                                  <div><strong>Ville:</strong> {item.data.ville}</div>
                                  <div><strong>Contact:</strong> {item.data.interlocuteur1?.nom}</div>
                                </>
                              )}
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
                          <TableCell>
                            <div className="flex space-x-2">
                              <Button variant="ghost" size="sm">
                                <Eye className="w-4 h-4" />
                              </Button>
                              {item.status === 'error' && (
                                <Button variant="ghost" size="sm" className="text-red-600">
                                  Corriger
                                </Button>
                              )}
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
        </TabsContent>
      </Tabs>
    </div>
  );
}