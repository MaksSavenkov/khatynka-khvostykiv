import type { ImageSource } from 'expo-image';

// Справжні притулки для блоку «Притулки яким ми довіряємо» на головній
export type Shelter = {
  id: string;
  name: string;
  city: string;
  // Логотип з сайту притулку; якщо його немає — показуємо значок з першою літерою
  logo?: ImageSource;
  // Співвідношення сторін логотипа (ширина / висота)
  logoAspectRatio?: number;
};

export const SHELTERS: Shelter[] = [
  {
    id: 'domivka',
    name: 'Домівка врятованих тварин',
    city: 'Львів',
    logo: require('../../assets/images/shelter-domivka.webp'),
    logoAspectRatio: 900 / 393,
  },
  {
    id: 'happy-paw',
    name: 'Happy Paw',
    city: 'Київ',
    logo: require('../../assets/images/shelter-happypaw.png'),
    logoAspectRatio: 195 / 89,
  },
  {
    id: 'sirius',
    name: 'Сіріус',
    city: 'Київщина',
    // Фото профілю з їхнього Instagram (@sirius.shelter)
    logo: require('../../assets/images/shelter-sirius.jpg'),
    logoAspectRatio: 1,
  },
];
