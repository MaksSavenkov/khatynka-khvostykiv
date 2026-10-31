import { Image } from 'expo-image';
import { router } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { useCity } from '@/data/city';
import { colors, fonts } from '@/theme';

// «Пігулка» з обраним містом; натиск відкриває вибір міста
export function LocationPill() {
  const city = useCity();
  return (
    <Pressable
      style={({ pressed }) => [styles.location, pressed && { opacity: 0.6 }]}
      onPress={() => router.push('/city')}
    >
      <View style={styles.labelRow}>
        <Text style={styles.label}>Локація</Text>
        <Image
          source={require('../../assets/images/icon-chevron-up.svg')}
          style={[styles.icon, { transform: [{ rotate: '180deg' }] }]}
        />
      </View>
      <Text style={styles.value} numberOfLines={1} adjustsFontSizeToFit>
        {city}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  // Напівпрозора, як нижнє меню
  location: {
    width: 168,
    height: 48,
    borderRadius: 40,
    backgroundColor: colors.tabBar,
    alignItems: 'center',
    justifyContent: 'center',
  },
  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  label: {
    fontFamily: fonts.medium,
    fontSize: 12,
    color: colors.textSecondary,
  },
  value: {
    fontFamily: fonts.medium,
    fontSize: 16,
    color: colors.text,
  },
  icon: {
    width: 24,
    height: 24,
  },
});
