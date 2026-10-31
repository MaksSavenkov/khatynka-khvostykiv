import { router } from 'expo-router';

import { EmptyState } from '@/components/EmptyState';

export default function SheltersScreen() {
  return (
    <EmptyState
      screenTitle="Притулки"
      image={require('../../../assets/images/empty-shelters.png')}
      imageAspectRatio={971 / 659}
      title="Тут ще немає притулків"
      text="Ми вже домовляємося з притулками твого міста. А поки — познайомся з тваринками, які шукають дім."
      action={{ title: 'Переглянути тваринок', onPress: () => router.navigate('/animals') }}
    />
  );
}
