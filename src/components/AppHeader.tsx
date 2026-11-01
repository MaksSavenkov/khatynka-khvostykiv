import { Image } from 'expo-image';
import { router } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { LocationPill } from '@/components/LocationPill';
import { colors, fonts } from '@/theme';

// Верхній рядок головної й «Притулків»: фото профілю, місто, дзвіночок сповіщень
export function AppHeader() {
  return (
    <View style={styles.header}>
      {/* Фото профілю веде на сторінку профілю */}
      <Pressable
        style={({ pressed }) => [styles.avatar, pressed && { opacity: 0.7 }]}
        onPress={() => router.push('/profile')}
        hitSlop={6}
      >
        <Image
          source={require('../../assets/images/avatar.png')}
          contentFit="fill"
          style={{ position: 'absolute', left: '-25%', top: '-0.74%', width: '147.98%', height: '184.07%' }}
        />
      </Pressable>
      <LocationPill />
      {/* Дзвіночок відкриває сповіщення; сірий кружечок — скільки їх непрочитаних (поки нуль) */}
      <Pressable
        onPress={() => router.push('/notifications')}
        hitSlop={6}
        style={({ pressed }) => pressed && { opacity: 0.7 }}
      >
        <Image source={require('../../assets/images/icon-bell.svg')} style={styles.icon48} />
        <View style={styles.badge}>
          <Text style={styles.badgeText}>0</Text>
        </View>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 40,
    overflow: 'hidden',
    backgroundColor: colors.placeholder,
  },
  icon48: {
    width: 48,
    height: 48,
  },
  // Лічильник на дзвіночку там, де раніше була крапка
  badge: {
    position: 'absolute',
    top: 8,
    right: 8,
    minWidth: 16,
    height: 16,
    paddingHorizontal: 4,
    borderRadius: 8,
    backgroundColor: colors.placeholder,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeText: {
    fontFamily: fonts.medium,
    fontSize: 10,
    lineHeight: 12,
    color: colors.white,
  },
});
