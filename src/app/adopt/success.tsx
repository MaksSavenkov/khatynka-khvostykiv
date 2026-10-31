import { router } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';
import Animated, { FadeInDown, Keyframe } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { PrimaryButton } from '@/components/PrimaryButton';
import { WinkingCat } from '@/components/WinkingCat';
import { colors, fonts, gentleEasing } from '@/theme';

// Котик спокійно проявляється й ледь помітно збільшується — без пружинки
const catEntering = new Keyframe({
  0: { opacity: 0, transform: [{ scale: 0.92 }] },
  100: { opacity: 1, transform: [{ scale: 1 }], easing: gentleEasing },
}).duration(700);

// Екран після подачі заявки
export default function AdoptionSuccessScreen() {
  const insets = useSafeAreaInsets();

  const goHome = () => {
    // Закриваємо сторінку тваринки й повертаємось на головну вкладку
    router.dismissAll();
    router.navigate('/home');
  };

  return (
    <View style={[styles.screen, { paddingTop: insets.top + 72, paddingBottom: insets.bottom }]}>
      <Animated.View entering={catEntering} style={styles.illustration}>
        <WinkingCat size={358} />
      </Animated.View>

      <Animated.View entering={FadeInDown.delay(250).duration(600).easing(gentleEasing)} style={styles.texts}>
        <Text style={styles.title}>Заявку на усиновлення успішно подано!</Text>
        <Text style={styles.subtitle}>Очікуй на повідомлення від притулку найближчім часом.</Text>
      </Animated.View>

      <View style={styles.spacer} />

      <View style={styles.footer}>
        <PrimaryButton title="На головну" onPress={goHome} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },
  illustration: {
    alignSelf: 'center',
    width: 358,
    height: 358,
  },
  texts: {
    marginTop: 31,
    marginHorizontal: 16,
    paddingHorizontal: 16,
    paddingVertical: 20,
    gap: 15,
  },
  title: {
    fontFamily: fonts.headingBold,
    fontSize: 28,
    lineHeight: 32,
    color: colors.text,
    textAlign: 'center',
  },
  subtitle: {
    fontFamily: fonts.regular,
    fontSize: 20,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  spacer: {
    flex: 1,
  },
  footer: {
    marginHorizontal: 16,
  },
});
