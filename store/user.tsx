import create from "zustand";
import { devtools, persist, createJSONStorage } from "zustand/middleware";
import { user, sessionApiCall } from "../types";

// Define the types for your state
interface UserState {
  user: user | null;
  currentTeamIndex: number;
  resetUser:() => void
  setCurrentUser: (user_data: sessionApiCall<user>) => void;
  setCurrentTeamIndex: (index: number) => void;
}

// Create your store with devtools and persist middleware
const userStore = create<UserState>()(
  devtools(
    persist(
      (set) => ({
        user: null,
        currentTeamIndex: 0,
        resetUser: () => set({user:null}),
        setCurrentUser: (user_data) => {
          if (user_data.data.teams) set({ user: user_data.data });
        },
        setCurrentTeamIndex: (index: number) => {
          set({ currentTeamIndex: index });
        },
      }),
      {
        name: "user-storage",
        storage: createJSONStorage(() => sessionStorage),
      } // <==  pay attention      }
    )
  )
);


export default userStore;
