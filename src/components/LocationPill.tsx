import { Image } from 'expo-image';
import { router } from 'expo-router';
import { Pressable, StyleSheet, Text } from 'react-native';

import { useCity } from '@/data/city';
import { colors, fonts } from '@/theme';

// «Пігулка» з обраним містом і стрілкою вниз; натиск відкриває вибір міста
export function LocationPill() {
  const city = useCity();
  return (
    <Pressable
      style={({ pressed }) => [styles.location, pressed && { opacity: 0.6 }]}
      onPress={() => router.push('/city')}
    >
      <Text style={styles.value} numberOfLines={1} adjustsFontSizeToFit>
        {city}
      </Text>
      <Image source={require('../../assets/images/icon-chevron-down-bold.svg')} style={styles.icon} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  // Напівпрозора, як нижнє меню
  location: {
    width: 168,
    height: 48,
    paddingHorizontal: 12,
    borderRadius: 40,
    backgroundColor: colors.tabBar,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    // Відступ між назвою міста й стрілкою
    gap: 5,
  },
  value: {
    flexShrink: 1,
    fontFamily: fonts.medium,
    fontSize: 16,
    color: colors.text,
  },
  icon: {
    width: 20,
    height: 20,
  },
});
