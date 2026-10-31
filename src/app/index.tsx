import { Image } from 'expo-image';
import { router } from 'expo-router';
import { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { colors, fonts } from '@/theme';

// Заставка: логотип і назва, через 2 секунди — знайомство із застосунком
export default function SplashScreen() {
  useEffect(() => {
    const timer = setTimeout(() => router.replace('/onboarding'), 2000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.logoFrame}>
        <Image source={require('../../assets/images/logo.png')} style={styles.logo} contentFit="cover" contentPosition="bottom" />
      </View>
      <Text style={styles.title}>Хатинка хвостиків</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
    gap: 8,
  },
  logoFrame: {
    width: 128,
    height: 128,
    padding: 4,
  },
  logo: {
    width: 120,
    height: 120,
  },
  title: {
    fontFamily: fonts.extraBold,
    fontSize: 24,
    lineHeight: 32,
    color: colors.white,
    textAlign: 'center',
  },
});
