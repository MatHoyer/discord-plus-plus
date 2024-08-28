import { create } from 'zustand';

export type TModalType = 'createServer';

type TModalStore = {
  type: TModalType | null;
  isOpen: boolean;
  openModal: (type: TModalType) => void;
  closeModal: () => void;
};

export const useModal = create<TModalStore>((set) => ({
  type: null,
  isOpen: false,
  openModal: (type) => set({ isOpen: true, type }),
  closeModal: () => set({ isOpen: false, type: null }),
}));
