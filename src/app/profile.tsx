import { router } from 'expo-router';

import { EmptyState } from '@/components/EmptyState';

// Профіль відкривається з фото профілю на головній — як окрема сторінка, так само як «Сповіщення»:
// назад стрілкою або звичним свайпом від лівого краю
export default function ProfileScreen() {
  return (
    <EmptyState
      screenTitle="Профіль"
      onBack={() => router.back()}
      image={require('../../assets/images/empty-profile.png')}
      imageAspectRatio={698 / 459}
      title="Упс, ви ще не створили профіль"
      text="Створи профіль, щоб зберігати улюблених тваринок і подавати заявки на усиновлення."
      action={{ title: 'Створити профіль', onPress: () => router.push('/sign-in') }}
    />
  );
}
