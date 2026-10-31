import { router } from 'expo-router';

import { EmptyState } from '@/components/EmptyState';

// Сповіщення відкриваються з дзвіночка на головній. Поки їх немає — порожній екран.
export default function NotificationsScreen() {
  return (
    <EmptyState
      screenTitle="Сповіщення"
      onBack={() => router.back()}
      image={require('../../assets/images/empty-notifications.png')}
      imageAspectRatio={702 / 462}
      title="Тут поки тихо"
      text="Ми повідомимо, коли притулок відповість на заявку чи з'являться нові тваринки поруч."    />
  );
}
