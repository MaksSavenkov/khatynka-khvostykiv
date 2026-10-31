import { Image } from 'expo-image';
import { useEffect, useRef } from 'react';
import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { scheduleOnRN } from 'react-native-worklets';

import { colors, fonts, gentleEasing, smoothEasing } from '@/theme';

type Props = {
  onSuccess: () => void;
  onCancel: () => void;
};

// Скільки «сканується» обличчя і скільки видно галочку перед входом
const SCAN_TIME = 1400;
const DONE_TIME = 1000;

// Вікно входу з Apple через Face ID, як системне в iOS. Показуємо його, лише поки воно потрібне.
// Поки що імітація: справжній Face ID працює лише в окремій збірці, не в Expo Go.
export function FaceIdSheet({ onSuccess, onCancel }: Props) {
  const insets = useSafeAreaInsets();
  const shown = useSharedValue(0);
  const pulse = useSharedValue(1);
  // 0 — сканування, 1 — обличчя розпізнано (галочка)
  const success = useSharedValue(0);

  // Завжди найсвіжіші обробники, щоб таймери не перезапускались від нового рендера батька
  const handlers = useRef({ onSuccess, onCancel });
  useEffect(() => {
    handlers.current = { onSuccess, onCancel };
  });

  // Звичайна функція (не з анімації), яку анімація може безпечно викликати, коли закінчиться
  const report = (then: 'onSuccess' | 'onCancel') => handlers.current[then]();

  // Панель ховається вниз, а потім повідомляє, чим усе скінчилось
  const close = (then: 'onSuccess' | 'onCancel') => {
    shown.set(
      withTiming(0, { duration: 280, easing: smoothEasing }, (finished) => {
        if (finished) scheduleOnRN(report, then);
      }),
    );
  };
  const closeRef = useRef(close);
  useEffect(() => {
    closeRef.current = close;
  });

  useEffect(() => {
    shown.set(withTiming(1, { duration: 420, easing: smoothEasing }));
    // Значок Face ID м'яко «дихає», поки йде сканування
    pulse.set(
      withRepeat(
        withSequence(
          withTiming(0.9, { duration: 500, easing: gentleEasing }),
          withTiming(1, { duration: 500, easing: gentleEasing }),
        ),
        -1,
      ),
    );
    const scan = setTimeout(() => {
      pulse.set(withTiming(1, { duration: 300, easing: gentleEasing }));
      success.set(withTiming(1, { duration: 550, easing: gentleEasing }));
    }, SCAN_TIME);
    const finish = setTimeout(() => closeRef.current('onSuccess'), SCAN_TIME + DONE_TIME);
    return () => {
      clearTimeout(scan);
      clearTimeout(finish);
    };
  }, [shown, pulse, success]);

  const overlayStyle = useAnimatedStyle(() => ({ opacity: shown.get() }));
  const sheetStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: (1 - shown.get()) * 420 }],
  }));
  // Значок Face ID тихо тане й трохи зменшується, а галочка м'яко проявляється з легкого зменшення — без стрибка
  const faceStyle = useAnimatedStyle(() => ({
    opacity: 1 - success.get(),
    transform: [{ scale: pulse.get() * (1 - 0.15 * success.get()) }],
  }));
  const checkStyle = useAnimatedStyle(() => ({
    opacity: success.get(),
    transform: [{ scale: 0.75 + 0.25 * success.get() }],
  }));
  const labelDoneStyle = useAnimatedStyle(() => ({ opacity: success.get() }));

  return (
    <Modal visible transparent animationType="none" onRequestClose={() => close('onCancel')}>
      <View style={styles.container}>
        <Animated.View style={[styles.overlay, overlayStyle]}>
          <Pressable style={StyleSheet.absoluteFill} onPress={() => close('onCancel')} />
        </Animated.View>

        <Animated.View style={[styles.sheet, { paddingBottom: insets.bottom + 20 }, sheetStyle]}>
          <View style={styles.header}>
            <Image source={require('../../assets/images/icon-apple.svg')} style={styles.apple} />
            <Text style={styles.title}>Увійти з Apple</Text>
            <Pressable onPress={() => close('onCancel')} hitSlop={12} style={styles.close}>
              <Image source={require('../../assets/images/icon-x.svg')} style={styles.closeIcon} />
            </Pressable>
          </View>

          <Text style={styles.text}>
            Хатинка хвостиків отримає твоє ім&apos;я та пошту з Apple ID. Пошту можна приховати.
          </Text>

          {/* Значок Face ID і галочка лежать один на одному й плавно перетікають */}
          <View style={styles.faceId}>
            <View style={styles.faceIcon}>
              <Animated.View style={[StyleSheet.absoluteFill, faceStyle]}>
                <Image source={require('../../assets/images/icon-face-id.svg')} style={styles.faceIcon} />
              </Animated.View>
              <Animated.View style={[StyleSheet.absoluteFill, checkStyle]}>
                <Image
                  source={require('../../assets/images/icon-check.svg')}
                  tintColor="#34c759"
                  style={styles.faceIcon}
                />
              </Animated.View>
            </View>
            <View style={styles.labelBox}>
              <Animated.Text style={[styles.faceLabel, faceStyle]}>Face ID</Animated.Text>
              <Animated.Text style={[styles.faceLabel, styles.labelOver, labelDoneStyle]}>Готово</Animated.Text>
            </View>
          </View>
        </Animated.View>
      </View>
    </Modal>
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
    marginHorizontal: 8,
    marginBottom: 8,
    paddingTop: 20,
    paddingHorizontal: 20,
    borderRadius: 32,
    backgroundColor: colors.white,
    gap: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  apple: {
    width: 22,
    height: 22,
  },
  title: {
    flex: 1,
    fontFamily: fonts.headingBold,
    fontSize: 18,
    color: colors.text,
  },
  close: {
    width: 28,
    height: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeIcon: {
    width: 24,
    height: 24,
  },
  text: {
    fontFamily: fonts.regular,
    fontSize: 14,
    lineHeight: 20,
    color: colors.textSecondary,
  },
  faceId: {
    alignItems: 'center',
    gap: 8,
    paddingVertical: 16,
  },
  faceIcon: {
    width: 64,
    height: 64,
  },
  faceLabel: {
    fontFamily: fonts.medium,
    fontSize: 15,
    color: colors.text,
    textAlign: 'center',
  },
  // «Face ID» і «Готово» займають одне місце й перетікають одне в одне
  labelBox: {
    minWidth: 80,
  },
  labelOver: {
    position: 'absolute',
    left: 0,
    right: 0,
  },
});
