export interface Device {
  id: number;
  type: 'PC' | 'Smartphone';
  modele: string;
  marque: string;
  annee: number;
  etat: string;
  numeroSerie: string;
  numeroInventaire: string;
  dateAjout: string;
  interlocuteurId?: number;
}

export interface Interlocuteur {
  id: number;
  nomStructure: string;
  codePostal: string;
  ville: string;
  interlocuteur1: {
    nom: string;
    email?: string;
    telephone?: string;
  };
  interlocuteur2?: {
    nom: string;
    email?: string;
    telephone?: string;
  };
  dateInitiale: string;
  dateRenouvellement?: string;
  dateAjout: string;
}

export const mockInterlocuteurs: Interlocuteur[] = [
  {
    id: 1,
    nomStructure: 'CROIX ROUGE MECS CHIRIS',
    codePostal: '06250',
    ville: 'MOUGINS',
    interlocuteur1: {
      nom: 'Mme Carole ZAINI',
      email: 'carole.zaini@croixrouge.fr',
      telephone: '04 93 75 12 34'
    },
    dateInitiale: '2023-12-01',
    dateRenouvellement: '2023-12-04',
    dateAjout: '2023-12-01'
  },
  {
    id: 2,
    nomStructure: 'CENTRE SOCIAL LES OLIVIERS',
    codePostal: '13001',
    ville: 'MARSEILLE',
    interlocuteur1: {
      nom: 'M. Pierre MARTIN',
      email: 'pierre.martin@lesoliviers.org',
      telephone: '04 91 22 33 44'
    },
    interlocuteur2: {
      nom: 'Mme Sophie BERNARD',
      email: 'sophie.bernard@lesoliviers.org'
    },
    dateInitiale: '2024-01-15',
    dateRenouvellement: '2024-01-20',
    dateAjout: '2024-01-15'
  },
  {
    id: 3,
    nomStructure: 'ASSOCIATION SOLIDARITÉ NUMÉRIQUE',
    codePostal: '69002',
    ville: 'LYON',
    interlocuteur1: {
      nom: 'Mme Marie DUBOIS',
      email: 'marie.dubois@solidarite-num.fr',
      telephone: '04 78 45 67 89'
    },
    dateInitiale: '2024-01-10',
    dateAjout: '2024-01-10'
  },
  {
    id: 4,
    nomStructure: 'MAISON DE QUARTIER BELLEVUE',
    codePostal: '33000',
    ville: 'BORDEAUX',
    interlocuteur1: {
      nom: 'M. Laurent GARCIA',
      email: 'laurent.garcia@bellevue.fr',
      telephone: '05 56 78 90 12'
    },
    interlocuteur2: {
      nom: 'Mme Camille LEROY',
      email: 'camille.leroy@bellevue.fr'
    },
    dateInitiale: '2024-02-01',
    dateRenouvellement: '2024-02-05',
    dateAjout: '2024-02-01'
  },
  {
    id: 5,
    nomStructure: 'EMMAÜS CONNECT LILLE',
    codePostal: '59000',
    ville: 'LILLE',
    interlocuteur1: {
      nom: 'M. Nicolas MOREAU',
      email: 'nicolas.moreau@emmaus-connect.org',
      telephone: '03 20 12 34 56'
    },
    dateInitiale: '2024-02-10',
    dateAjout: '2024-02-10'
  },
  {
    id: 6,
    nomStructure: 'SECOURS POPULAIRE FRANÇAIS',
    codePostal: '67000',
    ville: 'STRASBOURG',
    interlocuteur1: {
      nom: 'Mme Isabelle THOMAS',
      email: 'isabelle.thomas@spf67.org',
      telephone: '03 88 45 67 89'
    },
    interlocuteur2: {
      nom: 'M. Jean ROUX',
      email: 'jean.roux@spf67.org'
    },
    dateInitiale: '2024-02-15',
    dateRenouvellement: '2024-02-20',
    dateAjout: '2024-02-15'
  },
  {
    id: 7,
    nomStructure: 'CENTRE COMMUNAL D\'ACTION SOCIALE',
    codePostal: '31000',
    ville: 'TOULOUSE',
    interlocuteur1: {
      nom: 'Mme Anne PETIT',
      email: 'anne.petit@ccas-toulouse.fr',
      telephone: '05 61 23 45 67'
    },
    dateInitiale: '2024-02-20',
    dateAjout: '2024-02-20'
  },
  {
    id: 8,
    nomStructure: 'ESPACE PUBLIC NUMÉRIQUE',
    codePostal: '35000',
    ville: 'RENNES',
    interlocuteur1: {
      nom: 'M. François MICHEL',
      email: 'francois.michel@epn-rennes.fr',
      telephone: '02 99 87 65 43'
    },
    interlocuteur2: {
      nom: 'Mme Claire SIMON',
      email: 'claire.simon@epn-rennes.fr'
    },
    dateInitiale: '2024-03-01',
    dateRenouvellement: '2024-03-05',
    dateAjout: '2024-03-01'
  }
];

export const mockDevices: Device[] = [
  // Ordinateurs (PCs)
  {
    id: 1,
    type: 'PC',
    modele: 'Inspiron 15 3000',
    marque: 'Dell',
    annee: 2022,
    etat: 'Neuf',
    numeroSerie: 'DEL001X2022',
    numeroInventaire: 'abn-2024-001',
    dateAjout: '2024-01-15',
    interlocuteurId: 1
  },
  {
    id: 2,
    type: 'PC',
    modele: 'ThinkPad X1 Carbon',
    marque: 'Lenovo',
    annee: 2021,
    etat: 'Occasion',
    numeroSerie: 'LEN001Y2021',
    numeroInventaire: 'abn-2024-002',
    dateAjout: '2024-01-20',
    interlocuteurId: 2
  },
  {
    id: 3,
    type: 'PC',
    modele: 'MacBook Air M2',
    marque: 'Apple',
    annee: 2023,
    etat: 'Neuf',
    numeroSerie: 'APP001Z2023',
    numeroInventaire: 'abn-2024-003',
    dateAjout: '2024-01-25',
    interlocuteurId: 3
  },
  {
    id: 4,
    type: 'PC',
    modele: 'Pavilion 15',
    marque: 'HP',
    annee: 2020,
    etat: 'Réparé',
    numeroSerie: 'HPV002A2020',
    numeroInventaire: 'abn-2024-004',
    dateAjout: '2024-02-01',
    interlocuteurId: 4
  },
  {
    id: 5,
    type: 'PC',
    modele: 'Aspire 5',
    marque: 'Acer',
    annee: 2021,
    etat: 'Occasion',
    numeroSerie: 'ACR003B2021',
    numeroInventaire: 'abn-2024-005',
    dateAjout: '2024-02-05',
    interlocuteurId: 5
  },
  {
    id: 6,
    type: 'PC',
    modele: 'Surface Laptop 4',
    marque: 'Microsoft',
    annee: 2022,
    etat: 'Neuf',
    numeroSerie: 'MSF004C2022',
    numeroInventaire: 'abn-2024-006',
    dateAjout: '2024-02-10'
  },
  {
    id: 7,
    type: 'PC',
    modele: 'ZenBook 14',
    marque: 'Asus',
    annee: 2021,
    etat: 'Occasion',
    numeroSerie: 'ASU005D2021',
    numeroInventaire: 'abn-2024-007',
    dateAjout: '2024-02-12',
    interlocuteurId: 6
  },
  {
    id: 8,
    type: 'PC',
    modele: 'IdeaPad 5',
    marque: 'Lenovo',
    annee: 2020,
    etat: 'En panne',
    numeroSerie: 'LEN006E2020',
    numeroInventaire: 'abn-2024-008',
    dateAjout: '2024-02-15',
    interlocuteurId: 7
  },
  {
    id: 9,
    type: 'PC',
    modele: 'EliteBook 840',
    marque: 'HP',
    annee: 2023,
    etat: 'Neuf',
    numeroSerie: 'HPE007F2023',
    numeroInventaire: 'abn-2024-009',
    dateAjout: '2024-02-18',
    interlocuteurId: 8
  },
  {
    id: 10,
    type: 'PC',
    modele: 'Latitude 5520',
    marque: 'Dell',
    annee: 2022,
    etat: 'Livré',
    numeroSerie: 'DEL008G2022',
    numeroInventaire: 'abn-2024-010',
    dateAjout: '2024-02-20',
    interlocuteurId: 1
  },
  {
    id: 11,
    type: 'PC',
    modele: 'MacBook Pro 13"',
    marque: 'Apple',
    annee: 2021,
    etat: 'Réparé',
    numeroSerie: 'APP009H2021',
    numeroInventaire: 'abn-2024-011',
    dateAjout: '2024-02-22',
    interlocuteurId: 2
  },
  {
    id: 12,
    type: 'PC',
    modele: 'VivoBook 15',
    marque: 'Asus',
    annee: 2020,
    etat: 'Occasion',
    numeroSerie: 'ASU010I2020',
    numeroInventaire: 'abn-2024-012',
    dateAjout: '2024-02-25',
    interlocuteurId: 3
  },

  // Smartphones
  {
    id: 13,
    type: 'Smartphone',
    modele: 'iPhone 14',
    marque: 'Apple',
    annee: 2023,
    etat: 'Neuf',
    numeroSerie: 'IPH011J2023',
    numeroInventaire: 'abn-2024-013',
    dateAjout: '2024-01-28',
    interlocuteurId: 1
  },
  {
    id: 14,
    type: 'Smartphone',
    modele: 'Galaxy S23',
    marque: 'Samsung',
    annee: 2023,
    etat: 'Neuf',
    numeroSerie: 'SAM012K2023',
    numeroInventaire: 'abn-2024-014',
    dateAjout: '2024-02-02'
  },
  {
    id: 15,
    type: 'Smartphone',
    modele: 'Pixel 7',
    marque: 'Google',
    annee: 2022,
    etat: 'Occasion',
    numeroSerie: 'GOO013L2022',
    numeroInventaire: 'abn-2024-015',
    dateAjout: '2024-02-08',
    interlocuteurId: 4
  },
  {
    id: 16,
    type: 'Smartphone',
    modele: 'iPhone 13',
    marque: 'Apple',
    annee: 2022,
    etat: 'Occasion',
    numeroSerie: 'IPH014M2022',
    numeroInventaire: 'abn-2024-016',
    dateAjout: '2024-02-12',
    interlocuteurId: 5
  },
  {
    id: 17,
    type: 'Smartphone',
    modele: 'Galaxy A54',
    marque: 'Samsung',
    annee: 2023,
    etat: 'Neuf',
    numeroSerie: 'SAM015N2023',
    numeroInventaire: 'abn-2024-017',
    dateAjout: '2024-02-16',
    interlocuteurId: 6
  },
  {
    id: 18,
    type: 'Smartphone',
    modele: 'OnePlus 11',
    marque: 'OnePlus',
    annee: 2023,
    etat: 'Neuf',
    numeroSerie: 'ONP016O2023',
    numeroInventaire: 'abn-2024-018',
    dateAjout: '2024-02-18',
    interlocuteurId: 7
  },
  {
    id: 19,
    type: 'Smartphone',
    modele: 'P50 Pro',
    marque: 'Huawei',
    annee: 2021,
    etat: 'Réparé',
    numeroSerie: 'HUA017P2021',
    numeroInventaire: 'abn-2024-019',
    dateAjout: '2024-02-20',
    interlocuteurId: 8
  },
  {
    id: 20,
    type: 'Smartphone',
    modele: 'iPhone 12',
    marque: 'Apple',
    annee: 2021,
    etat: 'Livré',
    numeroSerie: 'IPH018Q2021',
    numeroInventaire: 'abn-2024-020',
    dateAjout: '2024-02-22',
    interlocuteurId: 1
  },
  {
    id: 21,
    type: 'Smartphone',
    modele: 'Galaxy S22',
    marque: 'Samsung',
    annee: 2022,
    etat: 'Occasion',
    numeroSerie: 'SAM019R2022',
    numeroInventaire: 'abn-2024-021',
    dateAjout: '2024-02-24',
    interlocuteurId: 2
  },
  {
    id: 22,
    type: 'Smartphone',
    modele: 'Redmi Note 12',
    marque: 'Xiaomi',
    annee: 2023,
    etat: 'Neuf',
    numeroSerie: 'XIA020S2023',
    numeroInventaire: 'abn-2024-022',
    dateAjout: '2024-02-26',
    interlocuteurId: 3
  },
  {
    id: 23,
    type: 'Smartphone',
    modele: 'Find X5',
    marque: 'Oppo',
    annee: 2022,
    etat: 'Occasion',
    numeroSerie: 'OPP021T2022',
    numeroInventaire: 'abn-2024-023',
    dateAjout: '2024-02-28',
    interlocuteurId: 4
  },
  {
    id: 24,
    type: 'Smartphone',
    modele: 'iPhone SE 2022',
    marque: 'Apple',
    annee: 2022,
    etat: 'Réparé',
    numeroSerie: 'IPH022U2022',
    numeroInventaire: 'abn-2024-024',
    dateAjout: '2024-03-02',
    interlocuteurId: 5
  },
  {
    id: 25,
    type: 'Smartphone',
    modele: 'Galaxy Z Flip 4',
    marque: 'Samsung',
    annee: 2022,
    etat: 'En panne',
    numeroSerie: 'SAM023V2022',
    numeroInventaire: 'abn-2024-025',
    dateAjout: '2024-03-04',
    interlocuteurId: 6
  },
  {
    id: 26,
    type: 'Smartphone',
    modele: 'Pixel 6a',
    marque: 'Google',
    annee: 2022,
    etat: 'Occasion',
    numeroSerie: 'GOO024W2022',
    numeroInventaire: 'abn-2024-026',
    dateAjout: '2024-03-06',
    interlocuteurId: 7
  },
  {
    id: 27,
    type: 'Smartphone',
    modele: '9 Pro',
    marque: 'OnePlus',
    annee: 2021,
    etat: 'Réparé',
    numeroSerie: 'ONP025X2021',
    numeroInventaire: 'abn-2024-027',
    dateAjout: '2024-03-08',
    interlocuteurId: 8
  },
  {
    id: 28,
    type: 'Smartphone',
    modele: 'iPhone 15',
    marque: 'Apple',
    annee: 2023,
    etat: 'Neuf',
    numeroSerie: 'IPH026Y2023',
    numeroInventaire: 'abn-2024-028',
    dateAjout: '2024-03-10',
    interlocuteurId: 1
  },
  {
    id: 29,
    type: 'Smartphone',
    modele: 'Galaxy S24',
    marque: 'Samsung',
    annee: 2024,
    etat: 'Neuf',
    numeroSerie: 'SAM027Z2024',
    numeroInventaire: 'abn-2024-029',
    dateAjout: '2024-03-12',
    interlocuteurId: 2
  },
  {
    id: 30,
    type: 'Smartphone',
    modele: 'Mi 13',
    marque: 'Xiaomi',
    annee: 2023,
    etat: 'Occasion',
    numeroSerie: 'XIA028A2023',
    numeroInventaire: 'abn-2024-030',
    dateAjout: '2024-03-14',
    interlocuteurId: 3
  }
];

// Données statistiques dérivées
export const getStatistics = () => {
  const totalDevices = mockDevices.length;
  const totalPCs = mockDevices.filter(d => d.type === 'PC').length;
  const totalSmartphones = mockDevices.filter(d => d.type === 'Smartphone').length;
  const totalInterlocuteurs = mockInterlocuteurs.length;

  const devicesByState = mockDevices.reduce((acc, device) => {
    acc[device.etat] = (acc[device.etat] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const devicesByBrand = mockDevices.reduce((acc, device) => {
    acc[device.marque] = (acc[device.marque] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const devicesByYear = mockDevices.reduce((acc, device) => {
    acc[device.annee] = (acc[device.annee] || 0) + 1;
    return acc;
  }, {} as Record<number, number>);

  const devicesWithInterlocuteurs = mockDevices.filter(d => d.interlocuteurId).length;
  const devicesWithoutInterlocuteurs = totalDevices - devicesWithInterlocuteurs;

  return {
    totalDevices,
    totalPCs,
    totalSmartphones,
    totalInterlocuteurs,
    devicesByState,
    devicesByBrand,
    devicesByYear,
    devicesWithInterlocuteurs,
    devicesWithoutInterlocuteurs
  };
};

// Fonction pour générer un nouveau numéro d'inventaire
export const generateInventoryNumber = (devices: Device[]): string => {
  const currentYear = new Date().getFullYear();
  const existingNumbers = devices
    .map(d => d.numeroInventaire)
    .filter(n => n.startsWith(`abn-${currentYear}-`))
    .map(n => parseInt(n.split('-')[2]))
    .filter(n => !isNaN(n));
  
  const nextNumber = existingNumbers.length > 0 ? Math.max(...existingNumbers) + 1 : 1;
  return `abn-${currentYear}-${nextNumber.toString().padStart(3, '0')}`;
};

// Fonction pour générer un numéro de série basé sur la marque et l'année
export const generateSerialNumber = (marque: string, annee: number): string => {
  const prefix = marque.substring(0, 3).toUpperCase();
  const randomNum = Math.floor(Math.random() * 999) + 1;
  const randomLetter = String.fromCharCode(65 + Math.floor(Math.random() * 26));
  return `${prefix}${randomNum.toString().padStart(3, '0')}${randomLetter}${annee}`;
};