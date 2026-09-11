import { create } from 'zustand';

type QuizStore = {
  searchTerm: string;
  setSearchTerm: (searchTerm: string) => void;
};

export const useQuizStore = create<QuizStore>((set) => ({
  searchTerm: '',
  setSearchTerm: (searchTerm) => set({ searchTerm }),
}));