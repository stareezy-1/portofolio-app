import { create } from "zustand";

export interface IUIStore {
  sidebarOpen: boolean;
  modalVisible: string | null;
  toggleSidebar: () => void;
  openModal: (id: string) => void;
  closeModal: () => void;
}

export const useUIStore = create<IUIStore>((set) => ({
  sidebarOpen: false,
  modalVisible: null,

  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),

  openModal: (id: string) => set({ modalVisible: id }),

  closeModal: () => set({ modalVisible: null }),
}));
