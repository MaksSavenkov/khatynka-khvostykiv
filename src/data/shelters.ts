import type { ImageSource } from 'expo-image';

// Справжні притулки: для блоку «Притулки яким ми довіряємо» на головній і для вкладки «Притулки»
export type Shelter = {
  id: string;
  name: string;
  city: string;
  // До якого міста з «Локації» належить притулок (Сіріус під Києвом — показуємо в Києві)
  forCity: string;
  address?: string;
  // Що шукати в «Картах», щоб знайти саме цей притулок
  mapQuery: string;
  about: string;
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
    forCity: 'Львів',
    address: 'вул. Олекси Довбуша, 24, парк «Знесіння»',
    mapQuery: 'Домівка врятованих тварин, вулиця Олекси Довбуша, 24, Львів',
    about: 'Притулок і реабілітаційний центр, де дбають про понад тисячу врятованих тварин.',
    logo: require('../../assets/images/shelter-domivka.webp'),
    logoAspectRatio: 900 / 393,
  },
  {
    id: 'happy-paw',
    name: 'Happy Paw',
    city: 'Київ',
    forCity: 'Київ',
    // Публічної адреси притулку фонду немає — шукаємо за назвою в Києві
    mapQuery: 'Happy Paw, Київ',
    about: 'Благодійний фонд із власним притулком, що допомагає понад 200 притулкам по всій Україні.',
    logo: require('../../assets/images/shelter-happypaw.png'),
    logoAspectRatio: 195 / 89,
  },
  {
    id: 'sirius',
    name: 'Сіріус',
    city: 'Київщина',
    forCity: 'Київ',
    address: 'с. Федорівка, вул. Миру, 2',
    mapQuery: 'Притулок Сіріус, вулиця Миру, 2, Федорівка, Київська область',
    about: 'Найбільший притулок в Україні — тут живуть тисячі собак і котів, які чекають на дім.',
    // Фото профілю з їхнього Instagram (@sirius.shelter)
    logo: require('../../assets/images/shelter-sirius.jpg'),
    logoAspectRatio: 1,
  },
];
