import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { RefreshCw, Monitor, TrendingUp, Calendar, Award, Smartphone } from 'lucide-react';
import { getStatistics } from '../data/mockDatabase';

interface StatData {
  totalPCs: number;
  totalSmartphones: number;
  totalDevices: number;
  byEtat: { etat: string; count: number; percentage: number }[];
  byMarque: { marque: string; count: number; percentage: number }[];
  averageYear: number;
  recentAdditions: number;
  deviceTypeDistribution: { type: string; count: number; percentage: number }[];
}

const COLORS = ['#F97316', '#FDBA74', '#92400E', '#FED7AA', '#EA580C'];

export function Statistics() {
  const [stats, setStats] = useState<StatData>({
    totalPCs: 0,
    totalSmartphones: 0,
    totalDevices: 0,
    byEtat: [],
    byMarque: [],
    averageYear: 2024,
    recentAdditions: 0,
    deviceTypeDistribution: []
  });

  // Calculer les statistiques à partir des données mock
  useEffect(() => {
    const data = getStatistics();
    
    const byEtat = Object.entries(data.devicesByState).map(([etat, count]) => ({
      etat,
      count,
      percentage: Math.round((count / data.totalDevices) * 100 * 10) / 10
    }));

    const byMarque = Object.entries(data.devicesByBrand)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 8)
      .map(([marque, count]) => ({
        marque,
        count,
        percentage: Math.round((count / data.totalDevices) * 100 * 10) / 10
      }));

    const averageYear = Object.entries(data.devicesByYear)
      .reduce((sum, [year, count]) => sum + (parseInt(year) * count), 0) / data.totalDevices;

    const recentAdditions = Math.floor(data.totalDevices * 0.2); // 20% des appareils ajoutés récemment

    const deviceTypeDistribution = [
      { type: 'PCs', count: data.totalPCs, percentage: Math.round((data.totalPCs / data.totalDevices) * 100 * 10) / 10 },
      { type: 'Smartphones', count: data.totalSmartphones, percentage: Math.round((data.totalSmartphones / data.totalDevices) * 100 * 10) / 10 }
    ];

    setStats({
      totalPCs: data.totalPCs,
      totalSmartphones: data.totalSmartphones,
      totalDevices: data.totalDevices,
      byEtat,
      byMarque,
      averageYear: Math.round(averageYear * 10) / 10,
      recentAdditions,
      deviceTypeDistribution
    });
  }, []);

  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('global');

  const refreshStats = () => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      // Generate slightly different stats to show refresh effect
      const newTotalPCs = stats.totalPCs + Math.floor(Math.random() * 3) - 1;
      const newTotalSmartphones = stats.totalSmartphones + Math.floor(Math.random() * 3) - 1;
      const totalDevices = Math.max(1, newTotalPCs) + Math.max(1, newTotalSmartphones);
      
      setStats({
        ...stats,
        totalPCs: Math.max(1, newTotalPCs),
        totalSmartphones: Math.max(1, newTotalSmartphones),
        totalDevices: totalDevices,
        recentAdditions: Math.floor(Math.random() * 8) + 1,
        averageYear: 2019.5 + Math.random() * 4,
        deviceTypeDistribution: [
          { type: 'PCs', count: Math.max(1, newTotalPCs), percentage: (Math.max(1, newTotalPCs) / totalDevices) * 100 },
          { type: 'Smartphones', count: Math.max(1, newTotalSmartphones), percentage: (Math.max(1, newTotalSmartphones) / totalDevices) * 100 }
        ]
      });
      setIsLoading(false);
    }, 1000);
  };

  const chartData = stats.byEtat.map(item => ({
    name: item.etat,
    value: item.count,
    percentage: item.percentage
  }));

  const barChartData = stats.byMarque.map(item => ({
    name: item.marque,
    count: item.count,
    percentage: item.percentage
  }));

  const deviceTypeChartData = stats.deviceTypeDistribution.map(item => ({
    name: item.type,
    value: item.count,
    percentage: item.percentage
  }));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold text-foreground">Statistiques Détaillées</h2>
        <Button 
          onClick={refreshStats} 
          disabled={isLoading}
          className="bg-primary hover:bg-primary/90"
        >
          <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
          Rafraîchir
        </Button>
      </div>

      {/* Key Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <Card className="border-l-4 border-l-primary">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Appareils</CardTitle>
            <Monitor className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{stats.totalDevices}</div>
            <p className="text-xs text-muted-foreground">
              Unités en inventaire
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-chart-1">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">PCs</CardTitle>
            <Monitor className="h-4 w-4 text-chart-1" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-chart-1">{stats.totalPCs}</div>
            <p className="text-xs text-muted-foreground">
              Ordinateurs
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-chart-2">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Smartphones</CardTitle>
            <Smartphone className="h-4 w-4 text-chart-2" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-chart-2">{stats.totalSmartphones}</div>
            <p className="text-xs text-muted-foreground">
              Téléphones
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-secondary">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Année Moyenne</CardTitle>
            <Calendar className="h-4 w-4 text-secondary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-secondary">{stats.averageYear.toFixed(1)}</div>
            <p className="text-xs text-muted-foreground">
              Âge moyen du parc
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-accent">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ajouts Récents</CardTitle>
            <TrendingUp className="h-4 w-4 text-accent" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-accent">{stats.recentAdditions}</div>
            <p className="text-xs text-muted-foreground">
              Cette semaine
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Statistics Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-6 bg-white border border-border rounded-lg p-1">
          <TabsTrigger 
            value="global" 
            className="flex items-center space-x-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
          >
            <Award className="w-4 h-4" />
            <span>Vue Globale</span>
          </TabsTrigger>
          <TabsTrigger 
            value="pcs"
            className="flex items-center space-x-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
          >
            <Monitor className="w-4 h-4" />
            <span>Ordinateurs</span>
          </TabsTrigger>
          <TabsTrigger 
            value="smartphones"
            className="flex items-center space-x-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
          >
            <Smartphone className="w-4 h-4" />
            <span>Smartphones</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="global" className="mt-0">
          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            {/* Device Type Distribution */}
            <Card>
              <CardHeader>
                <CardTitle>Répartition par Type</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie
                      data={deviceTypeChartData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percentage }) => `${name} ${percentage.toFixed(1)}%`}
                      outerRadius={70}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {deviceTypeChartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* État Distribution */}
            <Card>
              <CardHeader>
                <CardTitle>Répartition par État</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie
                      data={chartData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percentage }) => `${name} ${percentage.toFixed(1)}%`}
                      outerRadius={70}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Marque Distribution */}
            <Card>
              <CardHeader>
                <CardTitle>Répartition par Marque</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={barChartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip formatter={(value, name) => [value, 'Nombre']} />
                    <Bar dataKey="count" fill="#F97316" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="pcs" className="mt-0">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Statistiques PCs</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center p-6 bg-background rounded-lg">
                  <Monitor className="h-12 w-12 text-primary mx-auto mb-2" />
                  <h3 className="text-2xl font-bold text-primary">{stats.totalPCs}</h3>
                  <p className="text-muted-foreground">Ordinateurs en inventaire</p>
                </div>
                <div className="space-y-2">
                  <p><strong>Marques principales:</strong> Dell, Lenovo, HP, Microsoft</p>
                  <p><strong>États courants:</strong> Majoritairement neufs et occasions</p>
                  <p><strong>Âge moyen:</strong> {(new Date().getFullYear() - stats.averageYear).toFixed(1)} ans</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Tendances PCs</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <TrendingUp className="h-8 w-8 text-green-600 mx-auto mb-2" />
                    <p className="text-green-700">Parc en croissance</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="p-3 bg-background rounded">
                      <p className="font-medium">Modèles populaires</p>
                      <p className="text-muted-foreground">ThinkPad, Inspiron</p>
                    </div>
                    <div className="p-3 bg-background rounded">
                      <p className="font-medium">Besoins maintenance</p>
                      <p className="text-muted-foreground">{Math.round(stats.totalPCs * 0.15)} unités</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="smartphones" className="mt-0">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Statistiques Smartphones</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center p-6 bg-background rounded-lg">
                  <Smartphone className="h-12 w-12 text-secondary mx-auto mb-2" />
                  <h3 className="text-2xl font-bold text-secondary">{stats.totalSmartphones}</h3>
                  <p className="text-muted-foreground">Smartphones en inventaire</p>
                </div>
                <div className="space-y-2">
                  <p><strong>Marques principales:</strong> Apple, Samsung, Huawei</p>
                  <p><strong>Modèles récents:</strong> iPhone 14, Galaxy S23</p>
                  <p><strong>États courants:</strong> Principalement neufs</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Tendances Smartphones</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <Smartphone className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                    <p className="text-blue-700">Renouvellement rapide</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="p-3 bg-background rounded">
                      <p className="font-medium">Tendance actuelle</p>
                      <p className="text-muted-foreground">Modèles 2023-2024</p>
                    </div>
                    <div className="p-3 bg-background rounded">
                      <p className="font-medium">Cycle de vie</p>
                      <p className="text-muted-foreground">~24 mois</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Detailed Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Par État</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {stats.byEtat.map((item, index) => (
              <div key={item.etat} className="flex items-center justify-between p-3 bg-background rounded-lg">
                <div className="flex items-center space-x-3">
                  <div 
                    className="w-4 h-4 rounded-full" 
                    style={{ backgroundColor: COLORS[index % COLORS.length] }}
                  />
                  <span className="font-medium">{item.etat}</span>
                </div>
                <div className="text-right">
                  <span className="font-semibold">{item.count}</span>
                  <span className="text-muted-foreground ml-2">({item.percentage.toFixed(1)}%)</span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Par Marque</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {stats.byMarque.map((item, index) => (
              <div key={item.marque} className="flex items-center justify-between p-3 bg-background rounded-lg">
                <div className="flex items-center space-x-3">
                  <div 
                    className="w-4 h-4 rounded-full" 
                    style={{ backgroundColor: COLORS[index % COLORS.length] }}
                  />
                  <span className="font-medium">{item.marque}</span>
                </div>
                <div className="text-right">
                  <span className="font-semibold">{item.count}</span>
                  <span className="text-muted-foreground ml-2">({item.percentage.toFixed(1)}%)</span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}