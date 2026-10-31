import { Image, type ImageSource } from 'expo-image';
import { router, useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import { StyleSheet, Text, useWindowDimensions, View, type FlatList } from 'react-native';
import Animated, {
  cancelAnimation,
  interpolateColor,
  scrollTo,
  useAnimatedReaction,
  useAnimatedRef,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  type SharedValue,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { scheduleOnRN } from 'react-native-worklets';

import { PrimaryButton } from '@/components/PrimaryButton';
import { colors, fonts, smoothEasing } from '@/theme';

type Slide = {
  title: string;
  icon: ImageSource;
  illustration: ImageSource;
};

const SLIDES: Slide[] = [
  {
    title: 'Знайди свого пухнастика',
    icon: require('../../assets/images/icon-heart.svg'),
    illustration: require('../../assets/images/onboarding-1.png'),
  },
  {
    title: 'Допоможи тим хто потребує',
    icon: require('../../assets/images/icon-heart-handshake.svg'),
    illustration: require('../../assets/images/onboarding-2.png'),
  },
  {
    title: 'Обирай за характером',
    icon: require('../../assets/images/icon-paw-print.svg'),
    illustration: require('../../assets/images/onboarding-3.png'),
  },
];

// Розміри з макета iPhone 13/14 (ширина контенту 358)
const DESIGN_CONTENT_WIDTH = 358;

// Скільки показуємо кожен слайд (разом із самим перегортанням)
const AUTOPLAY_DELAY = 3600;
// Перегортання — повільне й м'яке, без різкого старту
const SLIDE_ANIMATION = { duration: 800, easing: smoothEasing };

export default function OnboardingScreen() {
  const { width } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const listRef = useAnimatedRef<FlatList<Slide>>();
  const [index, setIndex] = useState(0);

  const scale = (width - 32) / DESIGN_CONTENT_WIDTH;

  // Поточна прокрутка — від неї плавно перетікають крапки
  const offset = useSharedValue(0);
  // Куди автопрокрутка веде список; поки true — список рухає анімація, а не палець
  const target = useSharedValue(0);
  const autoScrolling = useSharedValue(false);

  useAnimatedReaction(
    () => target.get(),
    (x) => {
      if (autoScrolling.get()) scrollTo(listRef, x, 0, false);
    },
  );

  // Поки слайд тягнуть пальцем, автопрокрутка чекає
  const [dragging, setDragging] = useState(false);

  // Слайди гортаються самі кожні кілька секунд, після останнього — знову перший.
  // Таймер працює, лише коли екран видно (не відкрита панель «Почнімо»).
  useFocusEffect(
    useCallback(() => {
      if (dragging) return;
      const timer = setTimeout(() => {
        const next = (index + 1) % SLIDES.length;
        target.set(index * width);
        autoScrolling.set(true);
        target.set(
          withTiming(next * width, SLIDE_ANIMATION, () => {
            autoScrolling.set(false);
          }),
        );
        setIndex(next);
      }, AUTOPLAY_DELAY);
      return () => clearTimeout(timer);
    }, [index, dragging, width, target, autoScrolling]),
  );

  const onScroll = useAnimatedScrollHandler({
    onScroll: (e) => {
      offset.set(e.contentOffset.x);
    },
    onBeginDrag: () => {
      // Палець має пріоритет: зупиняємо автопрокрутку
      autoScrolling.set(false);
      cancelAnimation(target);
      scheduleOnRN(setDragging, true);
    },
    onEndDrag: () => {
      scheduleOnRN(setDragging, false);
    },
    onMomentumEnd: (e) => {
      scheduleOnRN(setIndex, Math.round(e.contentOffset.x / width));
    },
  });

  // З будь-якого слайда одразу відкриваємо «Почнімо»
  const onStart = () => router.push('/sign-in');

  return (
    <View style={[styles.container, { paddingTop: insets.top + 48 * scale, paddingBottom: Math.max(insets.bottom, 16) }]}>
      <Animated.FlatList
        ref={listRef}
        data={SLIDES}
        horizontal
        pagingEnabled
        style={{ flexGrow: 0 }}
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item.title}
        onScroll={onScroll}
        scrollEventThrottle={16}
        getItemLayout={(_, i) => ({ length: width, offset: width * i, index: i })}
        renderItem={({ item }) => (
          <View style={{ width, paddingHorizontal: 16 }}>
            <View style={[styles.illustrationFrame, { height: 432 * scale }]}>
              <Image
                source={item.illustration}
                contentFit="cover"
                style={{
                  position: 'absolute',
                  left: 10 * scale,
                  top: -37 * scale,
                  width: 338 * scale,
                  height: 507 * scale,
                }}
              />
            </View>
            <View style={styles.titleRow}>
              <Image source={item.icon} style={styles.icon} />
              <Text style={styles.title}>{item.title}</Text>
            </View>
          </View>
        )}
      />

      <View style={styles.dots}>
        {SLIDES.map((slide, i) => (
          <Dot key={slide.title} index={i} offset={offset} width={width} />
        ))}
      </View>

      <View style={styles.spacer} />

      <View style={styles.footer}>
        <PrimaryButton title="Почати" onPress={onStart} />
      </View>
    </View>
  );
}

// Крапка під слайдами: розширюється й зафарбовується разом із прокруткою, без перескоків
function Dot({ index, offset, width }: { index: number; offset: SharedValue<number>; width: number }) {
  const style = useAnimatedStyle(() => {
    const active = Math.max(0, 1 - Math.abs(offset.get() / width - index));
    return {
      width: 8 + 16 * active,
      backgroundColor: interpolateColor(active, [0, 1], [colors.dotInactive, colors.primary]),
    };
  });
  return <Animated.View style={[styles.dot, style]} />;
}

const styles = StyleSheet.create({
  // Слайди знайомства на білому фоні
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  illustrationFrame: {
    width: '100%',
    overflow: 'hidden',
  },
  titleRow: {
    marginTop: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  icon: {
    width: 24,
    height: 24,
  },
  title: {
    fontFamily: fonts.medium,
    fontSize: 20,
    color: colors.text,
  },
  dots: {
    marginTop: 20,
    alignSelf: 'center',
    flexDirection: 'row',
    gap: 4,
  },
  spacer: {
    flex: 1,
  },
  dot: {
    height: 8,
    borderRadius: 12,
  },
  footer: {
    paddingHorizontal: 16,
  },
});
