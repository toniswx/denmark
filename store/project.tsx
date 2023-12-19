import create from 'zustand';
import { devtools, persist, createJSONStorage } from 'zustand/middleware';
import { team } from '../types';

// Define the types for your state
interface TeamState {
  currentTeam: team | null;
  setCurrentTeam: (newTeam: team) => void;
}

// Create your store with devtools and persist middleware
const teamStore = create<TeamState>()(
  devtools(
    persist(
      (set) => ({
        currentTeam: null,
        setCurrentTeam: (newTeam) => set({ currentTeam: newTeam }),
      }),
      {
        name: 'team-storage',
        storage: createJSONStorage(() => sessionStorage)
      }
    )
  )
);

export default teamStore;
