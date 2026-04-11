import { create } from "zustand";

type FavoritesState = {
  favorites: string[];
  toggleFavorite: (chantId: string) => void;
  isFavorite: (chantId: string) => boolean;
};

export const useFavoritesStore = create<FavoritesState>((set, get) => ({
  favorites: [],
  toggleFavorite: (chantId) => {
    const current = get().favorites;
    const exists = current.includes(chantId);
    set({
      favorites: exists
        ? current.filter((id) => id !== chantId)
        : [...current, chantId],
    });
  },
  isFavorite: (chantId) => get().favorites.includes(chantId),
}));
