import { useSyncExternalStore } from 'react';

// Міста України для «Локації» на головній: обласні центри за абеткою
export const CITIES = [
  'Вінниця',
  'Дніпро',
  'Житомир',
  'Запоріжжя',
  'Івано-Франківськ',
  'Київ',
  'Кропивницький',
  'Луцьк',
  'Львів',
  'Миколаїв',
  'Одеса',
  'Полтава',
  'Рівне',
  'Суми',
  'Тернопіль',
  'Ужгород',
  'Харків',
  'Херсон',
  'Хмельницький',
  'Черкаси',
  'Чернівці',
  'Чернігів',
];

// Обране місто. Поки що живе лише в пам'яті й скидається на Львів після перезапуску додатка.
let city = 'Львів';
const listeners = new Set<() => void>();

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function setCity(next: string) {
  city = next;
  listeners.forEach((listener) => listener());
}

export function useCity() {
  return useSyncExternalStore(subscribe, () => city);
}
