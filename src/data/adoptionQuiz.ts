import type { ImageSource } from 'expo-image';
import type { ImageStyle } from 'react-native';

// Питання анкети на усиновлення з дизайну
export type QuizQuestion = {
  title: string;
  options: string[];
  illustration: ImageSource;
  // Розташування малюнка в рамці 358×234, як у Figma
  illustrationStyle: ImageStyle;
};

export const adoptionQuiz: QuizQuestion[] = [
  {
    title: 'Чи був у тебе досвід із тваринами?',
    options: ['Так, у мене вже були тваринки', 'Так, зараз маю тваринку', 'Ні, це буде перший досвід'],
    illustration: require('../../assets/images/quiz-1.png'),
    illustrationStyle: { left: -10, top: -12 },
  },
  {
    title: 'Скільки часу тваринка буде сама вдома?',
    options: ['До 4 годин на день', '4-8 годин на день', 'Понад 8 годин на день'],
    illustration: require('../../assets/images/quiz-2.png'),
    illustrationStyle: { left: 11, top: -11 },
  },
  {
    title: 'Наразі яке в тебе житло?',
    options: ['Власна квартира / будинок', 'Орендую житло', 'Живу з родиною'],
    illustration: require('../../assets/images/quiz-3.png'),
    illustrationStyle: { left: -6, top: 8 },
  },
  {
    title: 'Чи облаштований дім до появи тваринки?',
    options: ['Так, облаштував / облаштувала', 'Ще облаштовую простір', 'Потрібна порада'],
    illustration: require('../../assets/images/quiz-4.png'),
    illustrationStyle: { left: 12, top: 5 },
  },
];
