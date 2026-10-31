import { Image } from 'expo-image';
import { router } from 'expo-router';
import { useEffect, type ReactNode } from 'react';
import { Pressable, StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { scheduleOnRN } from 'react-native-worklets';

import { GoogleIcon } from '@/components/GoogleIcon';
import { PrimaryButton } from '@/components/PrimaryButton';
import { colors, fonts, smoothEasing } from '@/theme';

type Method = 'phone' | 'email' | 'apple' | 'google' | 'facebook';

// Кожен спосіб входу має свою сторінку; панель лишається під нею, тож «назад» повертає сюди
const openAuth = (method: Method) => router.push({ pathname: '/auth/[method]', params: { method } });

// Якщо панель відкрилась першою (наприклад, після перезавантаження) — повертаємо до слайдів
const goBack = () => {
  if (router.canGoBack()) {
    router.back();
  } else {
    router.replace('/onboarding');
  }
};

// Екран «Почнімо»: панель знизу поверх затемненого слайда.
// Фон плавно темнішає, а панель виїжджає знизу (і так само ховається при закритті).
export default function SignInScreen() {
  const { height } = useWindowDimensions();
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

  const overlayStyle = useAnimatedStyle(() => ({ opacity: shown.get() }));
  const sheetStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: (1 - shown.get()) * height }],
  }));

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.overlay, overlayStyle]}>
        <Pressable style={StyleSheet.absoluteFill} onPress={close} />
      </Animated.View>

      <Animated.View style={[styles.sheet, sheetStyle]}>
        <View style={styles.header}>
          <View style={styles.headerRow}>
            <View style={styles.logoCircle}>
              <Image source={require('../../assets/images/logo-small.png')} style={styles.logo} contentFit="cover" />
            </View>
            <Pressable onPress={close} hitSlop={12}>
              <Image source={require('../../assets/images/icon-x.svg')} style={styles.icon24} />
            </Pressable>
          </View>
          <View style={styles.texts}>
            <Text style={styles.title}>Почнімо</Text>
            <Text style={styles.subtitle}>
              Зареєструйся, щоб переглядати тваринок, допомагати та піклуватися про них.
            </Text>
          </View>
        </View>

        <View style={styles.actions}>
          <View style={styles.mainButtons}>
            <PrimaryButton title="Увійти за номером" variant="dark" onPress={() => openAuth('phone')} />
            <PrimaryButton title="Увійти з Email" variant="light" onPress={() => openAuth('email')} />
          </View>

          <View style={styles.alternatives}>
            <View style={styles.orRow}>
              <Image source={require('../../assets/images/line.svg')} style={styles.line} />
              <Text style={styles.orText}>Або</Text>
              <Image source={require('../../assets/images/line.svg')} style={styles.line} />
            </View>

            <View style={styles.socialRow}>
              <SocialButton onPress={() => openAuth('apple')}>
                <Image source={require('../../assets/images/icon-apple.svg')} style={styles.icon24} />
              </SocialButton>
              <SocialButton onPress={() => openAuth('google')}>
                <GoogleIcon />
              </SocialButton>
              <SocialButton onPress={() => openAuth('facebook')}>
                <Image source={require('../../assets/images/icon-facebook.svg')} style={styles.icon24} />
              </SocialButton>
            </View>
          </View>
        </View>
      </Animated.View>
    </View>
  );
}

function SocialButton({ children, onPress }: { children: ReactNode; onPress: () => void }) {
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [styles.socialButton, pressed && { opacity: 0.85 }]}>
      {children}
    </Pressable>
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
    paddingVertical: 28,
    gap: 15,
  },
  header: {
    gap: 20,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  logoCircle: {
    width: 48,
    height: 48,
    borderRadius: 40,
    backgroundColor: colors.surface,
    overflow: 'hidden',
  },
  logo: {
    position: 'absolute',
    left: 1,
    top: 0,
    width: 47,
    height: 47,
  },
  icon24: {
    width: 24,
    height: 24,
  },
  texts: {
    gap: 4,
  },
  title: {
    fontFamily: fonts.medium,
    fontSize: 20,
    color: colors.text,
  },
  subtitle: {
    fontFamily: fonts.medium,
    fontSize: 14,
    lineHeight: 18,
    color: colors.textSecondary,
  },
  actions: {
    gap: 12,
  },
  mainButtons: {
    gap: 8,
  },
  alternatives: {
    gap: 14,
    alignItems: 'center',
  },
  orRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  line: {
    width: 18,
    height: 18,
    transform: [{ rotate: '90deg' }],
  },
  orText: {
    width: 40,
    fontFamily: fonts.medium,
    fontSize: 14,
    color: colors.textMuted,
    textAlign: 'center',
  },
  socialRow: {
    flexDirection: 'row',
    gap: 8,
    alignSelf: 'stretch',
  },
  socialButton: {
    flex: 1,
    height: 48,
    borderRadius: 40,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
