import { Easing } from 'react-native-reanimated';

// Рух без «пружинки»: швидкий старт і м'яке гальмування, як у системних додатках iOS
export const smoothEasing = Easing.bezier(0.32, 0.72, 0, 1);

// Ще м'якше: повільний старт і повільне гальмування — для спокійних змін кольору й виділення
export const gentleEasing = Easing.bezier(0.45, 0, 0.25, 1);

// Кольори: глибока теракота як акцент на світло-сірому «кам'яному» фоні, білі картки.
// Оригінальна гама з Figma збережена в копії проєкту my-app-backup-before-terracotta.
export const colors = {
  primary: '#bb5230',
  background: '#efebe7',
  dotInactive: '#d9d3cd',
  surface: '#e6e1dc',
  text: '#1f1d1b',
  textSecondary: '#7d7770',
  textMuted: '#3a3633',
  placeholder: '#a49d96',
  imagePlaceholder: '#d8d2cc',
  // Зелені плашки й значки виду — оригінальні кольори з Figma
  chip: '#dce5d5',
  chipText: '#687b5c',
  tabActive: '#fbecd3',
  deckBack: '#cfc8c1',
  locationChip: '#3a3633',
  shelterText: '#8d8780',
  detailBackground: '#f3f0ed',
  photoPlaceholder: '#c9c2bb',
  handle: '#d8d2cc',
  healthText: '#2f2c29',
  progressTrack: '#e3ddd7',
  // Вибрана відповідь у Quiz — оригінальний зелений
  optionSelected: '#84947b',
  tabBar: 'rgba(255, 255, 255, 0.9)',
  white: '#ffffff',
  overlay: 'rgba(31, 29, 27, 0.3)',
};

export const fonts = {
  regular: 'Inter_400Regular',
  medium: 'Inter_500Medium',
  headingSemiBold: 'NunitoSans_600SemiBold',
  headingBold: 'NunitoSans_700Bold',
  extraBold: 'NunitoSans_800ExtraBold',
};
