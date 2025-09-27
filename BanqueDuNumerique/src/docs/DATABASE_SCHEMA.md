# Structure de la Base de Données - Banque du Numérique

## Vue d'ensemble

Cette application de gestion d'inventaire utilise une structure de données TypeScript complète pour gérer l'inventaire des appareils informatiques (PCs et smartphones) ainsi que les informations des donateurs.

## Schéma de Base de Données

### Table: Devices (Appareils)

```typescript
interface Device {
  id: number;                    // Identifiant unique auto-généré
  type: 'PC' | 'Smartphone';     // Type d'appareil
  modele: string;               // Modèle de l'appareil
  marque: string;               // Marque/fabricant
  annee: number;                // Année de fabrication
  etat: string;                 // État de l'appareil
  numeroSerie: string;          // Numéro de série unique
  numeroInventaire: string;     // Numéro d'inventaire format "abn-YYYY-XXX"
  dateAjout: string;           // Date d'ajout à l'inventaire (format ISO)
  donateurId?: number;         // Référence optionnelle vers le donateur
}
```

#### États possibles:
- `Neuf` - Appareil neuf, jamais utilisé
- `Occasion` - Appareil d'occasion en bon état
- `Réparé` - Appareil réparé et fonctionnel
- `En panne` - Appareil nécessitant une réparation
- `Livré` - Appareil livré au bénéficiaire final

#### Format des numéros:
- **Numéro de série**: Format libre, généralement `[MARQUE][NUMERO][LETTRE][ANNEE]`
  - Exemple: `DEL001X2022` (Dell), `APP001Z2023` (Apple)
- **Numéro d'inventaire**: Format standardisé `abn-YYYY-XXX`
  - Exemple: `abn-2024-001`, `abn-2024-025`

### Table: Donateurs

```typescript
interface Donateur {
  id: number;           // Identifiant unique auto-généré
  nomComplet: string;   // Nom complet du donateur
  contact: string;      // Email ou téléphone de contact
  adresse: string;      // Adresse complète
  dateAjout: string;    // Date d'ajout du donateur (format ISO)
}
```

## Données d'Exemple

### Statistiques Actuelles
- **Total Appareils**: 30
- **Ordinateurs**: 12 (40%)
- **Smartphones**: 18 (60%)
- **Donateurs**: 8
- **Appareils avec donateur**: 24 (80%)

### Répartition par État
- Neuf: 9 appareils (30%)
- Occasion: 9 appareils (30%)
- Réparé: 6 appareils (20%)
- En panne: 3 appareils (10%)
- Livré: 3 appareils (10%)

### Principales Marques
1. **Apple**: 6 appareils (20%)
2. **Samsung**: 5 appareils (17%)
3. **Dell**: 3 appareils (10%)
4. **Lenovo**: 3 appareils (10%)
5. **HP**: 2 appareils (7%)

### Répartition par Année
- 2024: 2 appareils
- 2023: 12 appareils
- 2022: 10 appareils
- 2021: 5 appareils
- 2020: 1 appareil

## Fonctions Utilitaires

### Génération Automatique

```typescript
// Génère un nouveau numéro d'inventaire
generateInventoryNumber(devices: Device[]): string

// Génère un numéro de série basé sur la marque et l'année
generateSerialNumber(marque: string, annee: number): string

// Calcule les statistiques complètes
getStatistics(): StatisticsData
```

### Validation des Données

- **Numéro d'inventaire**: Doit respecter le format `abn-YYYY-XXX`
- **Année**: Doit être comprise entre 2000 et 2030
- **Type**: Doit être soit 'PC' soit 'Smartphone'
- **État**: Doit être l'un des 5 états prédéfinis

## Relations

- **Device.donateurId** → **Donateur.id** (relation optionnelle)
- Un donateur peut avoir plusieurs appareils associés
- Un appareil peut ne pas avoir de donateur (appareil anonyme)

## Évolutivité

La structure actuelle permet facilement d'ajouter:
- Nouveaux types d'appareils
- Nouveaux états
- Champs additionnels (garantie, lieu de stockage, etc.)
- Historique des modifications
- Système de notifications

## Sécurité des Données

- Les IDs sont générés automatiquement pour éviter les conflits
- Les données sensibles des donateurs sont limitées au minimum
- Validation côté client et possibilité d'ajouter validation serveur
- Format cohérent des numéros d'inventaire pour traçabilité

## Performance

- Index recommandés sur: `numeroInventaire`, `numeroSerie`, `donateurId`
- Filtrage optimisé par type, état, et marque
- Recherche textuelle sur modèle, marque, et numéros
- Statistiques pré-calculées pour l'affichage rapide