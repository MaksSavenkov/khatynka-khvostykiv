import type { ImageSource } from 'expo-image';
import type { ImageStyle } from 'react-native';

// Приклади тваринок з дизайну. Пізніше замінимо на справжні дані з сервера.

export type Species = 'cat' | 'dog';
export type Sex = 'female' | 'male';

// Повна анкета тваринки (екран «Про тваринку»)
export type PetProfile = {
  id: string;
  name: string;
  species: Species;
  sex: Sex;
  age: string;
  city: string;
  shelter: string;
  photo: ImageSource;
  // Як фото розміщене у рамці (деякі фото в Figma обрізані вручну)
  photoStyle?: ImageStyle;
  // Фото для великої картки у розділі «Тварини»
  cardPhoto?: ImageSource;
  cardPhotoStyle?: ImageStyle;
  // Фото на всю ширину для сторінки тваринки
  largePhoto?: ImageSource;
  // Опис тваринки. У дизайні він є лише для Хурми, решту дописали за її зразком
  weight?: string;
  color?: string;
  health?: string[];
  story?: string;
};

export const profiles: Record<string, PetProfile> = {
  khurma: {
    id: 'khurma',
    name: 'Хурма',
    species: 'cat',
    sex: 'female',
    age: '1.5 роки',
    city: 'Львів',
    shelter: 'Домівка врятованих тварин',
    photo: require('../../assets/images/pet-khurma.png'),
    cardPhoto: require('../../assets/images/deck-khurma.png'),
    largePhoto: require('../../assets/images/detail-khurma.png'),
    weight: '3.5 кг',
    color: 'Рудий',
    health: ['Повністю вакцинована', 'Стерилізована', 'Оброблена від паразитів'],
    story:
      'Хурма — ніжна руда красуня з допитливим поглядом і чарівним характером. Шукає людину, з якою зможе ділити затишні вечори, муркотіння та маленькі радощі кожного дня. 🧡',
  },
  vuhlyk: {
    id: 'vuhlyk',
    name: 'Вуглик',
    species: 'cat',
    sex: 'female',
    age: '1 рік',
    city: 'Львів',
    shelter: 'Домівка покинутих тварин',
    photo: require('../../assets/images/pet-vuhlyk.png'),
    photoStyle: { position: 'absolute', left: '-0.05%', top: '-5.74%', width: '77.12%', height: '138.24%' },
    weight: '3 кг',
    color: 'Чорний',
    health: ['Повністю вакцинована', 'Стерилізована', 'Оброблена від паразитів'],
    story:
      'Вуглик — тиха й лагідна кицька з бурштиновими очима. Спершу трохи сором’язлива, але щойно довіриться — муркотітиме на колінах і ходитиме за тобою хвостиком. 🖤',
  },
  jack: {
    id: 'jack',
    name: 'Джек',
    species: 'dog',
    sex: 'male',
    age: '2 роки',
    city: 'Львів',
    shelter: 'Домівка врятованих тварин',
    photo: require('../../assets/images/pet-jack.png'),
    cardPhoto: require('../../assets/images/deck-jack.png'),
    cardPhotoStyle: { position: 'absolute', left: '-60.33%', top: 0, width: '163.6%', height: '100%' },
    largePhoto: require('../../assets/images/deck-jack.png'),
    weight: '18 кг',
    color: 'Рудий',
    health: ['Повністю вакцинований', 'Кастрований', 'Чипований', 'Оброблений від паразитів'],
    story:
      'Джек — веселий рудий непосида, який обожнює прогулянки в парку й гратися з м’ячиком. Дружній до людей і інших собак, швидко вчить команди. Шукає активну родину, з якою можна разом досліджувати світ. 🧡',
  },
  // Котики з колоди «Тварини» (окремий макет у Figma)
  'vuhlyk-black': {
    id: 'vuhlyk-black',
    name: 'Вуглик',
    species: 'cat',
    sex: 'male',
    age: '1 рік',
    city: 'Львів',
    shelter: 'Домівка врятованих тварин',
    photo: require('../../assets/images/deck-vuhlyk.png'),
    photoStyle: { position: 'absolute', left: 0, top: '-12.41%', width: '100%', height: '179.26%' },
    weight: '4 кг',
    color: 'Чорний',
    health: ['Повністю вакцинований', 'Кастрований', 'Оброблений від паразитів'],
    story:
      'Вуглик — пухнастий чорний котик із зеленими очима, що світяться, як два ліхтарики. Любить затишні підвіконня, теплі пледи й неквапливі ранки поруч зі своєю людиною. 🖤',
  },
  karasyk: {
    id: 'karasyk',
    name: 'Карасик',
    species: 'cat',
    sex: 'male',
    age: '3 роки',
    city: 'Львів',
    shelter: 'Домівка врятованих тварин',
    photo: require('../../assets/images/deck-karasyk.png'),
    photoStyle: { position: 'absolute', left: 0, top: '-72.1%', width: '100%', height: '204.2%' },
    cardPhotoStyle: { position: 'absolute', left: 0, top: '-19.15%', width: '100%', height: '123.8%' },
    weight: '5 кг',
    color: 'Чорно-білий',
    health: ['Повністю вакцинований', 'Кастрований', 'Оброблений від паразитів'],
    story:
      'Карасик — спокійний і розважливий котик у чорно-білому «смокінгу». Обожнює спостерігати за світом із вікна, а ввечері прийде помуркотіти поруч. Чудово підійде для тихої родини. 🤍',
  },
  // Песики з колоди «Тварини»
  emily: {
    id: 'emily',
    name: 'Емілі',
    species: 'dog',
    sex: 'female',
    age: '1.5 роки',
    city: 'Львів',
    shelter: 'Домівка врятованих тварин',
    photo: require('../../assets/images/deck-emily.png'),
    photoStyle: { position: 'absolute', left: 0, top: '-21.15%', width: '100%', height: '202.29%' },
    weight: '14 кг',
    color: 'Чорно-білий',
    health: ['Повністю вакцинована', 'Стерилізована', 'Чипована', 'Оброблена від паразитів'],
    story:
      'Емілі — розумна й енергійна дівчинка з усмішкою, що заряджає на весь день. Любить бігати, гратися з фризбі й вчити нові трюки. Шукає людину, яка поділить із нею прогулянки й пригоди. 💛',
  },
  cooper: {
    id: 'cooper',
    name: 'Купер',
    species: 'dog',
    sex: 'male',
    age: '3 роки',
    city: 'Львів',
    shelter: 'Домівка врятованих тварин',
    photo: require('../../assets/images/deck-cooper.png'),
    photoStyle: { position: 'absolute', left: 0, top: '-30.83%', width: '100%', height: '201.67%' },
    cardPhotoStyle: { position: 'absolute', left: 0, top: '-19.15%', width: '100%', height: '123.8%' },
    weight: '30 кг',
    color: 'Золотистий',
    health: ['Повністю вакцинований', 'Кастрований', 'Чипований', 'Оброблений від паразитів'],
    story:
      'Купер — добряк із золотистою шерстю й найщирішою усмішкою. Терплячий із дітьми, обожнює обійми й довгі прогулянки. Стане вірним другом і справжнім членом родини. 💛',
  },
};

// Колода у розділі «Тварини»: три котики й три песики з макета
export const deckPets: PetProfile[] = [
  profiles.khurma,
  profiles['vuhlyk-black'],
  profiles.karasyk,
  profiles.emily,
  profiles.jack,
  profiles.cooper,
];

// Картка на головній: підпис про притулок у Figma трохи різниться від картки до картки
export type Pet = {
  key: string;
  profile: PetProfile;
  location: string;
};

const HOME_LOCATION = 'м.Львів “ Домівка врятованих тварин ’’';
const homeCard = (id: string): Pet => ({ key: id, profile: profiles[id], location: HOME_LOCATION });

// Порядок — як у макеті: верхній ряд — «Вони шукають дім», нижній — «Тваринки поруч»
export const homelessPets: Pet[] = ['khurma', 'vuhlyk-black', 'karasyk', 'emily'].map(homeCard);

export const nearbyPets: Pet[] = ['jack', 'khurma', 'cooper', 'karasyk'].map(homeCard);

// Значки виду й статі — єдина палітра з карток Хурми (кішка) та Джека (собака)
export const speciesIcons: Record<Species, ImageSource> = {
  cat: require('../../assets/images/icon-cat.svg'),
  dog: require('../../assets/images/icon-dog.svg'),
};

export const sexIcons: Record<Sex, ImageSource> = {
  female: require('../../assets/images/icon-venus.svg'),
  male: require('../../assets/images/icon-mars.svg'),
};