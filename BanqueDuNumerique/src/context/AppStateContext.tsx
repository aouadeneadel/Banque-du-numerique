import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Interlocuteur } from '../data/mockDatabase';
import { DonParStructure } from '../components/InterlocuteurManagement';

interface AppState {
  interlocuteurs: Interlocuteur[];
  setInterlocuteurs: React.Dispatch<React.SetStateAction<Interlocuteur[]>>;
  donsParStructure: DonParStructure[];
  setDonsParStructure: React.Dispatch<React.SetStateAction<DonParStructure[]>>;
  currentUser: string | null;
  setCurrentUser: React.Dispatch<React.SetStateAction<string | null>>;
}

const AppStateContext = createContext<AppState | undefined>(undefined);

export const useAppState = () => {
  const context = useContext(AppStateContext);
  if (!context) {
    throw new Error('useAppState must be used within AppStateProvider');
  }
  return context;
};

export const AppStateProvider = ({ children }: { children: ReactNode }) => {
  const [interlocuteurs, setInterlocuteurs] = useState<Interlocuteur[]>([]);
  const [donsParStructure, setDonsParStructure] = useState<DonParStructure[]>([]);
  const [currentUser, setCurrentUser] = useState<string | null>(null);

  return (
    <AppStateContext.Provider value={{ interlocuteurs, setInterlocuteurs, donsParStructure, setDonsParStructure, currentUser, setCurrentUser }}>
      {children}
    </AppStateContext.Provider>
  );
};
