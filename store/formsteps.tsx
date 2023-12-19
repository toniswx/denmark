import create from 'zustand';
import { devtools } from 'zustand/middleware';

interface MultiStepFormState {
  currentStep: number;
  formData: {
    teamName: string | undefined,
    teamId:string | undefined
    // ... add more fields as needed
  };
  setFormData: (data: Partial<MultiStepFormState['formData']>) => void;
  nextStep: () => void;
  prevStep: () => void;
  resetForm: () => void;
}

const multiStepFormStore = create<MultiStepFormState>()(
  devtools((set) => ({
    currentStep: 0,
    formData: {
      teamName: undefined,
      teamId:undefined,
    },
    setFormData: (data) => set({formData : {
        teamName:data.teamName,
        teamId:data.teamId
    }}),
    nextStep: () => set((state) => ({ currentStep: state.currentStep + 1})),
    prevStep: () => set((state) => ({ currentStep: state.currentStep - 1 })),
    resetForm: () => set({ currentStep: 0, formData: { teamName: undefined,teamId:undefined } }),
  }))
);

export default multiStepFormStore;