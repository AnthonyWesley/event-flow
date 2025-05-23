import { create } from "zustand";

type ModalStore = {
  modals: Record<string, boolean>;
  openModal: (id: string) => void;
  closeModal: (id: string) => void;
  isModalOpen: (id: string) => boolean;
};

export const useModalStore = create<ModalStore>((set, get) => ({
  modals: {},

  openModal: (id) =>
    set((state) => ({
      modals: { ...state.modals, [id]: true },
    })),
  closeModal: (id) =>
    set((state) => ({
      modals: { ...state.modals, [id]: false },
    })),
  isModalOpen: (id) => !!get().modals[id],
}));
