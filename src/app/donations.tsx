import { router } from 'expo-router';

import { EmptyState } from '@/components/EmptyState';

// «Мої донати» з профілю. Поки донатів немає — порожній екран.
export default function DonationsScreen() {
  return (
    <EmptyState
      screenTitle="Мої донати"
      onBack={() => router.back()}
      image={require('../../assets/images/help-donate.png')}
      imageAspectRatio={1536 / 1024}
      title="Ще жодного донату"
      text="Тут збережуться всі твої внески притулкам. Навіть невеликий донат допомагає нагодувати й полікувати тваринок."
      action={{ title: 'Допомогти притулкам', onPress: () => router.navigate('/home') }}
    />
  );
}
