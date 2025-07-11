import { create } from 'zustand';

const useUIStore = create((set) => ({
  isEditProfileModalOpen: false,
  setEditProfileModalOpen: (open) => set({ isEditProfileModalOpen: open }),
}));

export default useUIStore;
