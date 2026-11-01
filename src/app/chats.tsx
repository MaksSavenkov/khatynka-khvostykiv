import { router } from 'expo-router';

import { EmptyState } from '@/components/EmptyState';

// «Мої чати» з профілю: тут буде листування з притулками. Поки чатів немає — порожній екран.
export default function ChatsScreen() {
  return (
    <EmptyState
      screenTitle="Мої чати"
      onBack={() => router.back()}
      image={require('../../assets/images/help-guardian.png')}
      imageAspectRatio={1280 / 853}
      title="Поки немає повідомлень"
      text="Коли подаси заявку на усиновлення, тут з'явиться чат з притулком, щоб домовитися про знайомство."
      action={{ title: 'Переглянути тваринок', onPress: () => router.navigate('/animals') }}
    />
  );
}
