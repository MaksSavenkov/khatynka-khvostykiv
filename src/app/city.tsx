import { Image } from 'expo-image';
import { router } from 'expo-router';
import { useEffect } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { scheduleOnRN } from 'react-native-worklets';

import { CITIES, setCity, useCity } from '@/data/city';
import { colors, fonts, smoothEasing } from '@/theme';

// Окрема функція, щоб анімація не «заморожувала» сам об'єкт router, передаючи його цілим
const goBack = () => router.back();

// Вибір міста: панель знизу поверх головної, як «Почнімо».
// Фон плавно темнішає, панель виїжджає знизу й так само ховається.
export default function CityScreen() {
  const { height } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const current = useCity();
  // 0 — панель схована внизу, 1 — повністю відкрита
  const shown = useSharedValue(0);

  useEffect(() => {
    shown.set(withTiming(1, { duration: 420, easing: smoothEasing }));
  }, [shown]);

  const close = () => {
    shown.set(
      withTiming(0, { duration: 280, easing: smoothEasing }, (finished) => {
        if (finished) scheduleOnRN(goBack);
      }),
    );
  };

  const choose = (city: string) => {
    setCity(city);
    close();
  };

  const overlayStyle = useAnimatedStyle(() => ({ opacity: shown.get() }));
  const sheetStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: (1 - shown.get()) * height }],
  }));

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.overlay, overlayStyle]}>
        <Pressable style={StyleSheet.absoluteFill} onPress={close} />
      </Animated.View>

      <Animated.View style={[styles.sheet, { maxHeight: height * 0.75, paddingBottom: insets.bottom + 12 }, sheetStyle]}>
        <View style={styles.headerRow}>
          <Text style={styles.title}>Обери місто</Text>
          <Pressable onPress={close} hitSlop={12}>
            <Image source={require('../../assets/images/icon-x.svg')} style={styles.icon24} />
          </Pressable>
        </View>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.list}>
          {CITIES.map((city) => {
            const selected = city === current;
            return (
              <Pressable
                key={city}
                onPress={() => choose(city)}
                style={({ pressed }) => [styles.row, selected && styles.rowSelected, pressed && styles.pressed]}
              >
                <Text style={[styles.cityName, selected && styles.cityNameSelected]}>{city}</Text>
                {selected && (
                  <Image
                    source={require('../../assets/images/icon-check.svg')}
                    tintColor={colors.primary}
                    style={styles.icon24}
                  />
                )}
              </Pressable>
            );
          })}
        </ScrollView>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  overlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: colors.overlay,
  },
  sheet: {
    marginHorizontal: 5,
    marginBottom: 8,
    backgroundColor: colors.white,
    borderRadius: 40,
    paddingHorizontal: 16,
    paddingTop: 28,
    gap: 16,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: {
    fontFamily: fonts.headingBold,
    fontSize: 20,
    color: colors.text,
  },
  icon24: {
    width: 24,
    height: 24,
  },
  list: {
    gap: 4,
  },
  row: {
    height: 52,
    paddingHorizontal: 16,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  rowSelected: {
    backgroundColor: colors.background,
  },
  pressed: {
    opacity: 0.7,
  },
  cityName: {
    fontFamily: fonts.regular,
    fontSize: 16,
    color: colors.text,
  },
  cityNameSelected: {
    fontFamily: fonts.medium,
    color: colors.primary,
  },
});
