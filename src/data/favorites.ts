import { useSyncExternalStore } from 'react';

// Вподобані тваринки. Поки що живуть лише в пам'яті й зникають після перезапуску додатка.
let favorites = new Set<string>();
const listeners = new Set<() => void>();

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function toggleFavorite(id: string) {
  favorites = new Set(favorites);
  if (favorites.has(id)) favorites.delete(id);
  else favorites.add(id);
  listeners.forEach((listener) => listener());
}

// Лише додає в обране (свайп вправо в колоді не має прибирати вже вподобану тваринку)
export function addFavorite(id: string) {
  if (favorites.has(id)) return;
  toggleFavorite(id);
}

// Усі вподобані тваринки (для категорії «Обране» в каталозі)
export function useFavoriteIds() {
  return useSyncExternalStore(subscribe, () => favorites);
}

// Чи вподобана тваринка — однаково на всіх екранах
export function useIsFavorite(id: string) {
  return useSyncExternalStore(subscribe, () => favorites.has(id));
}
