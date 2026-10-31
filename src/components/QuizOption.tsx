import { Image } from 'expo-image';
import { useEffect } from 'react';
import { Pressable, StyleSheet } from 'react-native';
import Animated, { interpolateColor, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';

import { colors, fonts, gentleEasing } from '@/theme';

type Props = {
  label: string;
  selected: boolean;
  onPress: () => void;
};

// Варіант відповіді: при виборі рамка й текст плавно темнішають, а кружечок м'яко «наповнюється».
// Картка не рухається й не пружинить.
export function QuizOption({ label, selected, onPress }: Props) {
  const active = useSharedValue(selected ? 1 : 0);

  useEffect(() => {
    active.set(withTiming(selected ? 1 : 0, { duration: selected ? 500 : 400, easing: gentleEasing }));
  }, [selected, active]);

  const cardStyle = useAnimatedStyle(() => ({
    borderColor: interpolateColor(active.get(), [0, 1], ['rgba(132, 148, 123, 0)', colors.optionSelected]),
  }));

  const textStyle = useAnimatedStyle(() => ({
    color: interpolateColor(active.get(), [0, 1], [colors.textSecondary, colors.text]),
  }));

  const filledStyle = useAnimatedStyle(() => ({
    opacity: active.get(),
    transform: [{ scale: 0.6 + 0.4 * active.get() }],
  }));
  // Порожнє кільце ховається під заповненим, щоб по краю не проступала темна «тінь»
  const emptyStyle = useAnimatedStyle(() => ({
    opacity: 1 - active.get(),
  }));

  return (
    <Pressable onPress={onPress}>
      <Animated.View style={[styles.card, cardStyle]}>
        <Animated.View style={styles.radio}>
          <Animated.View style={[StyleSheet.absoluteFill, emptyStyle]}>
            <Image source={require('../../assets/images/radio-off.svg')} style={StyleSheet.absoluteFill} />
          </Animated.View>
          {/* Заповнений кружечок намальований звичайним колом — без тіні, яку давала SVG-маска */}
          <Animated.View style={[styles.radioFilled, filledStyle]} />
        </Animated.View>
        <Animated.Text style={[styles.label, textStyle]}>{label}</Animated.Text>
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 12,
    paddingVertical: 22,
    borderRadius: 16,
    borderWidth: 1.5,
    backgroundColor: colors.white,
  },
  radio: {
    width: 32,
    height: 32,
  },
  // Те саме коло, що й у Figma: 26 px, зелена обвідка 2 px і світло-зелена заливка
  radioFilled: {
    position: 'absolute',
    left: 3,
    top: 3,
    width: 26,
    height: 26,
    borderRadius: 13,
    borderWidth: 2,
    borderColor: colors.optionSelected,
    backgroundColor: colors.chip,
  },
  label: {
    flex: 1,
    fontFamily: fonts.medium,
    fontSize: 18,
    lineHeight: 32,
  },
});
