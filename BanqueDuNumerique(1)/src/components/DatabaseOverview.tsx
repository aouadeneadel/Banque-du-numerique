import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { getStatistics } from '../data/mockDatabase';
import { Database, Users, Monitor, Smartphone, TrendingUp, Package, Calendar, Award } from 'lucide-react';

export function DatabaseOverview() {
  const stats = getStatistics();

  return (
    <div className="space-y-6">
      {/* Titre */}
      <div className="flex items-center gap-3">
        <Database className="w-8 h-8 text-primary" />
        <div>
          <h2 className="text-2xl font-bold text-foreground">Aperçu de la Base de Données</h2>
          <p className="text-muted-foreground">Données complètes de l'inventaire Banque du Numérique</p>
        </div>
      </div>

      {/* Statistiques principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="border-primary/20 hover:border-primary/40 transition-colors">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Appareils</CardTitle>
            <Package className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{stats.totalDevices}</div>
            <p className="text-xs text-muted-foreground">
              Inventaire complet
            </p>
          </CardContent>
        </Card>

        <Card className="border-primary/20 hover:border-primary/40 transition-colors">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ordinateurs</CardTitle>
            <Monitor className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{stats.totalPCs}</div>
            <p className="text-xs text-muted-foreground">
              {Math.round((stats.totalPCs / stats.totalDevices) * 100)}% du total
            </p>
          </CardContent>
        </Card>

        <Card className="border-primary/20 hover:border-primary/40 transition-colors">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Smartphones</CardTitle>
            <Smartphone className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{stats.totalSmartphones}</div>
            <p className="text-xs text-muted-foreground">
              {Math.round((stats.totalSmartphones / stats.totalDevices) * 100)}% du total
            </p>
          </CardContent>
        </Card>

        <Card className="border-primary/20 hover:border-primary/40 transition-colors">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Interlocuteurs</CardTitle>
            <Users className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{stats.totalInterlocuteurs}</div>
            <p className="text-xs text-muted-foreground">
              Structures partenaires
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Détails par état */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-primary" />
            Répartition par État
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {Object.entries(stats.devicesByState).map(([etat, count]) => (
              <div key={etat} className="text-center">
                <Badge 
                  variant="outline" 
                  className={`mb-2 ${
                    etat === 'Neuf' ? 'border-green-500 text-green-700' :
                    etat === 'Occasion' ? 'border-blue-500 text-blue-700' :
                    etat === 'Réparé' ? 'border-yellow-500 text-yellow-700' :
                    etat === 'En panne' ? 'border-red-500 text-red-700' :
                    'border-purple-500 text-purple-700'
                  }`}
                >
                  {etat}
                </Badge>
                <div className="text-lg font-semibold">{count}</div>
                <div className="text-xs text-muted-foreground">
                  {Math.round((count / stats.totalDevices) * 100)}%
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Top marques */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="w-5 h-5 text-primary" />
            Top Marques
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {Object.entries(stats.devicesByBrand)
              .sort(([,a], [,b]) => b - a)
              .slice(0, 8)
              .map(([marque, count]) => (
                <div key={marque} className="text-center">
                  <div className="font-semibold text-primary">{marque}</div>
                  <div className="text-sm text-muted-foreground">{count} appareils</div>
                </div>
              ))}
          </div>
        </CardContent>
      </Card>

      {/* Répartition par année */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-primary" />
            Répartition par Année
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {Object.entries(stats.devicesByYear)
              .sort(([a], [b]) => parseInt(b) - parseInt(a))
              .map(([annee, count]) => (
                <div key={annee} className="text-center">
                  <div className="font-semibold text-primary">{annee}</div>
                  <div className="text-sm text-muted-foreground">{count} appareils</div>
                  <div className="text-xs text-muted-foreground">
                    {Math.round((count / stats.totalDevices) * 100)}%
                  </div>
                </div>
              ))}
          </div>
        </CardContent>
      </Card>

      {/* Informations sur les interlocuteurs */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5 text-primary" />
            Interlocuteurs et Appareils
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{stats.devicesWithInterlocuteurs}</div>
              <div className="text-sm text-muted-foreground">Appareils avec structure</div>
              <div className="text-xs text-muted-foreground">
                {Math.round((stats.devicesWithInterlocuteurs / stats.totalDevices) * 100)}% du total
              </div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-600">{stats.devicesWithoutInterlocuteurs}</div>
              <div className="text-sm text-muted-foreground">Appareils sans structure</div>
              <div className="text-xs text-muted-foreground">
                {Math.round((stats.devicesWithoutInterlocuteurs / stats.totalDevices) * 100)}% du total
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Résumé */}
      <Card className="bg-primary/5 border-primary/20">
        <CardHeader>
          <CardTitle className="text-primary">Résumé de la Base de Données</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm">
            <p>• <strong>{stats.totalDevices} appareils</strong> sont enregistrés dans l'inventaire</p>
            <p>• <strong>{stats.totalDonateurs} donateurs</strong> contribuent à la banque numérique</p>
            <p>• Répartition: <strong>{stats.totalPCs} ordinateurs</strong> et <strong>{stats.totalSmartphones} smartphones</strong></p>
            <p>• <strong>{stats.devicesWithDonators} appareils</strong> ont un donateur identifié</p>
            <p>• Les appareils couvrent les années <strong>{Math.min(...Object.keys(stats.devicesByYear).map(Number))} à {Math.max(...Object.keys(stats.devicesByYear).map(Number))}</strong></p>
            <p>• Principales marques: <strong>{Object.entries(stats.devicesByBrand).sort(([,a], [,b]) => b - a).slice(0, 3).map(([marque]) => marque).join(', ')}</strong></p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}