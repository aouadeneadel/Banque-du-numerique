import React, { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Progress } from './ui/progress';
import { Download, Upload, FileText, FileSpreadsheet, Database, BarChart3, Save, RefreshCcw, Monitor, Smartphone } from 'lucide-react';
import { toast } from 'sonner@2.0.3';

export function ExportBackup() {
  const [isExporting, setIsExporting] = useState(false);
  const [isBacking, setIsBacking] = useState(false);
  const [isRestoring, setIsRestoring] = useState(false);
  const [isGeneratingReport, setIsGeneratingReport] = useState(false);
  const [progress, setProgress] = useState(0);

  const simulateProgress = (setState: (value: boolean) => void, successMessage: string) => {
    setProgress(0);
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setState(false);
          toast.success(successMessage);
          return 100;
        }
        return prev + Math.random() * 15 + 5;
      });
    }, 200);
  };

  const exportToTXT = () => {
    setIsExporting(true);
    simulateProgress(setIsExporting, 'Export TXT terminé avec succès (PCs & Smartphones)');
  };

  const exportToCSV = () => {
    setIsExporting(true);
    simulateProgress(setIsExporting, 'Export CSV terminé avec succès (PCs & Smartphones)');
  };

  const createBackup = () => {
    setIsBacking(true);
    simulateProgress(setIsBacking, 'Sauvegarde créée avec succès (Tous les appareils)');
  };

  const restoreData = () => {
    setIsRestoring(true);
    simulateProgress(setIsRestoring, 'Données restaurées avec succès (PCs & Smartphones)');
  };

  const generateReport = () => {
    setIsGeneratingReport(true);
    simulateProgress(setIsGeneratingReport, 'Rapport complet généré avec succès');
  };

  const getLastBackupInfo = () => {
    const lastBackup = new Date();
    lastBackup.setDate(lastBackup.getDate() - 2);
    return lastBackup.toLocaleDateString('fr-FR');
  };

  const isAnyProcessRunning = isExporting || isBacking || isRestoring || isGeneratingReport;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-3">
        <Database className="w-8 h-8 text-primary" />
        <h2 className="text-2xl font-semibold text-foreground">Export et Sauvegarde des Données</h2>
      </div>

      {/* Progress Indicator */}
      {isAnyProcessRunning && (
        <Card className="border-l-4 border-l-primary">
          <CardContent className="pt-6">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>
                  {isExporting && 'Export en cours...'}
                  {isBacking && 'Sauvegarde en cours...'}
                  {isRestoring && 'Restauration en cours...'}
                  {isGeneratingReport && 'Génération du rapport...'}
                </span>
                <span>{Math.round(progress)}%</span>
              </div>
              <Progress value={progress} className="w-full" />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Export Section */}
      <Card className="border-l-4 border-l-secondary">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Download className="w-5 h-5 text-secondary" />
            <span>Export des Données</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">
            Exportez l'inventaire complet (PCs et smartphones) dans différents formats pour analyse ou archivage.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-background p-4 rounded-lg border">
              <div className="flex items-center space-x-3 mb-3">
                <FileText className="w-6 h-6 text-primary" />
                <div>
                  <h4 className="font-semibold">Format TXT</h4>
                  <p className="text-sm text-muted-foreground">Export simple en texte brut</p>
                </div>
              </div>
              <Button 
                onClick={exportToTXT}
                disabled={isAnyProcessRunning}
                className="w-full bg-primary hover:bg-primary/90"
              >
                <FileText className="w-4 h-4 mr-2" />
                Exporter vers TXT
              </Button>
            </div>

            <div className="bg-background p-4 rounded-lg border">
              <div className="flex items-center space-x-3 mb-3">
                <FileSpreadsheet className="w-6 h-6 text-secondary" />
                <div>
                  <h4 className="font-semibold">Format CSV</h4>
                  <p className="text-sm text-muted-foreground">Compatible Excel et tableurs</p>
                </div>
              </div>
              <Button 
                onClick={exportToCSV}
                disabled={isAnyProcessRunning}
                className="w-full bg-secondary hover:bg-secondary/90 text-secondary-foreground"
              >
                <FileSpreadsheet className="w-4 h-4 mr-2" />
                Exporter vers CSV
              </Button>
            </div>
          </div>

          <div className="bg-muted/30 p-3 rounded-lg">
            <p className="text-sm">
              <strong>Contenu exporté :</strong> Type d'appareil, ID, Modèle, Marque, Année, État, 
              Numéros série/inventaire, Date d'ajout
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 text-center">
            <div className="bg-background p-3 rounded-lg border">
              <div className="flex items-center justify-center space-x-2 mb-2">
                <Monitor className="w-5 h-5 text-primary" />
                <span className="font-medium">PCs</span>
              </div>
              <p className="text-lg font-bold text-primary">12</p>
              <p className="text-xs text-muted-foreground">Ordinateurs</p>
            </div>
            <div className="bg-background p-3 rounded-lg border">
              <div className="flex items-center justify-center space-x-2 mb-2">
                <Smartphone className="w-5 h-5 text-secondary" />
                <span className="font-medium">Smartphones</span>
              </div>
              <p className="text-lg font-bold text-secondary">8</p>
              <p className="text-xs text-muted-foreground">Téléphones</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Backup & Restore Section */}
      <Card className="border-l-4 border-l-chart-3">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Save className="w-5 h-5 text-chart-3" />
            <span>Sauvegarde et Restauration</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">
            Créez des sauvegardes complètes de la base de données (PCs & smartphones) ou restaurez des données précédentes.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-background p-4 rounded-lg border">
              <div className="flex items-center space-x-3 mb-3">
                <Save className="w-6 h-6 text-green-600" />
                <div>
                  <h4 className="font-semibold">Créer Sauvegarde</h4>
                  <p className="text-sm text-muted-foreground">Sauvegarde complète de la BDD</p>
                </div>
              </div>
              <Button 
                onClick={createBackup}
                disabled={isAnyProcessRunning}
                className="w-full bg-green-600 hover:bg-green-700 text-white"
              >
                <Save className="w-4 h-4 mr-2" />
                Créer Sauvegarde
              </Button>
            </div>

            <div className="bg-background p-4 rounded-lg border">
              <div className="flex items-center space-x-3 mb-3">
                <RefreshCcw className="w-6 h-6 text-blue-600" />
                <div>
                  <h4 className="font-semibold">Restaurer Données</h4>
                  <p className="text-sm text-muted-foreground">Restaurer depuis sauvegarde</p>
                </div>
              </div>
              <Button 
                onClick={restoreData}
                disabled={isAnyProcessRunning}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white"
              >
                <Upload className="w-4 h-4 mr-2" />
                Restaurer Données
              </Button>
            </div>
          </div>

          <div className="bg-muted/30 p-3 rounded-lg flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">Dernière sauvegarde</p>
              <p className="text-sm text-muted-foreground">{getLastBackupInfo()}</p>
            </div>
            <div className="text-right">
              <p className="text-sm font-medium">Taille</p>
              <p className="text-sm text-muted-foreground">2.8 MB</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Advanced Statistics Section */}
      <Card className="border-l-4 border-l-accent">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <BarChart3 className="w-5 h-5 text-accent" />
            <span>Statistiques Avancées</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">
            Générez un rapport détaillé avec analyses avancées et graphiques pour la direction (PCs & smartphones).
          </p>

          <div className="bg-background p-4 rounded-lg border">
            <div className="flex items-center space-x-3 mb-3">
              <BarChart3 className="w-6 h-6 text-primary" />
              <div>
                <h4 className="font-semibold">Rapport Complet</h4>
                <p className="text-sm text-muted-foreground">
                  Statistiques détaillées, tendances, analyse des coûts pour tous les appareils
                </p>
              </div>
            </div>
            <Button 
              onClick={generateReport}
              disabled={isAnyProcessRunning}
              className="w-full bg-accent hover:bg-accent/90 text-accent-foreground"
            >
              <BarChart3 className="w-4 h-4 mr-2" />
              Générer Rapport
            </Button>
          </div>

          <div className="bg-muted/30 p-3 rounded-lg">
            <p className="text-sm">
              <strong>Contenu du rapport :</strong> Graphiques détaillés par type d'appareil, évolution temporelle, 
              analyse comparative PCs/smartphones, recommandations d'achat, coûts de maintenance, tendances d'usage
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Usage Statistics */}
      <Card>
        <CardHeader>
          <CardTitle>Statistiques d'utilisation</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div className="bg-background p-3 rounded-lg border">
              <p className="text-2xl font-bold text-primary">52</p>
              <p className="text-sm text-muted-foreground">Exports TXT</p>
            </div>
            <div className="bg-background p-3 rounded-lg border">
              <p className="text-2xl font-bold text-secondary">31</p>
              <p className="text-sm text-muted-foreground">Exports CSV</p>
            </div>
            <div className="bg-background p-3 rounded-lg border">
              <p className="text-2xl font-bold text-green-600">12</p>
              <p className="text-sm text-muted-foreground">Sauvegardes</p>
            </div>
            <div className="bg-background p-3 rounded-lg border">
              <p className="text-2xl font-bold text-accent">18</p>
              <p className="text-sm text-muted-foreground">Rapports</p>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardContent className="pt-4">
                <div className="flex items-center space-x-3">
                  <Monitor className="w-8 h-8 text-primary" />
                  <div>
                    <h4 className="font-semibold">Inventaire PCs</h4>
                    <p className="text-sm text-muted-foreground">
                      12 ordinateurs • Dernière maj: aujourd'hui
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-4">
                <div className="flex items-center space-x-3">
                  <Smartphone className="w-8 h-8 text-secondary" />
                  <div>
                    <h4 className="font-semibold">Inventaire Smartphones</h4>
                    <p className="text-sm text-muted-foreground">
                      8 téléphones • Dernière maj: aujourd'hui
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}