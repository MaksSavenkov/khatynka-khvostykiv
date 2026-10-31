import { Image } from 'expo-image';
import { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
  Easing,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withTiming,
  type SharedValue,
} from 'react-native-reanimated';

import { gentleEasing } from '@/theme';

const SOURCE_SIZE = 1254; // розмір оригінальної картинки в пікселях

// Де в оригіналі розкрите око і де — «підморгнуте» (у пікселях картинки)
const OPEN_EYE = { x: 577, y: 440, width: 62, height: 60 };
const WINK_EYE = { x: 713, y: 484 };

// Хвіст вирізаний з малюнка окремим шаром між фоном і тулубом.
// Під тулубом хвіст продовжено його ж кольором, щоб біля спини не було видно зрізу.
const TAIL = { x: 225, y: 460, width: 320, height: 555 };
// Хвіст вигинається, а не хитається цілим: нижче цього рядка (на підлозі за спиною) він нерухомий,
// а що вище — то сильніше зсувається, найбільше кінчик
const TAIL_ROOT_Y = 1000;
const TAIL_TIP_Y = 480;
// Наскільки (у пікселях оригіналу) кінчик відхиляється в кожен бік
const TAIL_SWING = 30;
// На скільки горизонтальних смужок ріжемо хвіст, щоб він вигинався плавно
const TAIL_SLICES = 40;
// Край тулуба — лежить поверх хвоста, щоб хвіст рухався позаду котика
const BODY_EDGE = { x: 400, y: 690, width: 140, height: 360 };

type Props = {
  size: number;
};

// Котик з екрана успіху. У малюнку він уже підморгує, тож ми «відкриваємо»
// праве око копією лівого, а потім періодично його закриваємо — виходить підморгування.
// А ще котик спокійно виляє хвостиком.
export function WinkingCat({ size }: Props) {
  const scale = size / SOURCE_SIZE;
  const eyeOpen = useSharedValue(1);
  // -1 … 1: хвіст ліворуч … праворуч
  const tail = useSharedValue(0);

  useEffect(() => {
    const sway = { duration: 1400, easing: Easing.inOut(Easing.sin) };
    tail.set(withSequence(withTiming(1, { ...sway, duration: 700 }), withRepeat(withTiming(-1, sway), -1, true)));
  }, [tail]);

  useEffect(() => {
    eyeOpen.set(
      withDelay(
        1000,
        withRepeat(
          withSequence(
            withTiming(0, { duration: 280, easing: gentleEasing }), // око м'яко заплющується
            withDelay(600, withTiming(1, { duration: 380, easing: gentleEasing })), // тримаємо і плавно розплющуємо
            withDelay(2400, withTiming(1, { duration: 0 })), // пауза до наступного разу
          ),
          -1,
        ),
      ),
    );
  }, [eyeOpen]);

  const eyeStyle = useAnimatedStyle(() => {
    const open = eyeOpen.get();
    return {
      // Копія розплющеного ока поступово розчиняється, і під нею проступає справжнє «підморгнуте» —
      // без різкого перемикання
      opacity: interpolate(open, [0.05, 0.6], [0, 1], 'clamp'),
      transform: [{ scaleY: 0.35 + 0.65 * open }],
    };
  });

  return (
    <View style={{ width: size, height: size }}>
      {/* Малюнок без хвоста */}
      <Image
        source={require('../../assets/images/success-base.png')}
        contentFit="cover"
        style={StyleSheet.absoluteFill}
      />
      {Array.from({ length: TAIL_SLICES }, (_, i) => (
        <TailSlice key={i} index={i} scale={scale} tail={tail} />
      ))}
      <Image
        source={require('../../assets/images/success-front.png')}
        style={[
          styles.layer,
          {
            left: BODY_EDGE.x * scale,
            top: BODY_EDGE.y * scale,
            width: BODY_EDGE.width * scale,
            height: BODY_EDGE.height * scale,
          },
        ]}
      />
      <Animated.View
        style={[
          styles.eye,
          {
            left: WINK_EYE.x * scale,
            top: WINK_EYE.y * scale,
            width: OPEN_EYE.width * scale,
            height: OPEN_EYE.height * scale,
          },
          eyeStyle,
        ]}
      >
        <Image
          source={require('../../assets/images/adoption-success.png')}
          contentFit="cover"
          style={{
            position: 'absolute',
            left: -OPEN_EYE.x * scale,
            top: -OPEN_EYE.y * scale,
            width: size,
            height: size,
          }}
        />
      </Animated.View>
    </View>
  );
}

// Одна горизонтальна смужка хвоста: показує свою частину малюнка й зсувається вбік
// тим сильніше, чим вище вона від основи
function TailSlice({ index, scale, tail }: { index: number; scale: number; tail: SharedValue<number> }) {
  const sliceHeight = TAIL.height / TAIL_SLICES;
  const top = index * sliceHeight;
  const middle = TAIL.y + top + sliceHeight / 2;
  const lift = Math.min(Math.max((TAIL_ROOT_Y - middle) / (TAIL_ROOT_Y - TAIL_TIP_Y), 0), 1);
  const reach = TAIL_SWING * Math.pow(lift, 1.6) * scale;

  const style = useAnimatedStyle(() => ({ transform: [{ translateX: reach * tail.get() }] }));

  return (
    <Animated.View
      style={[
        styles.slice,
        {
          left: TAIL.x * scale,
          top: (TAIL.y + top) * scale,
          width: TAIL.width * scale,
          // +0.5, щоб між сусідніми смужками не просвічувала тонка лінія
          height: sliceHeight * scale + 0.5,
        },
        style,
      ]}
    >
      <Image
        source={require('../../assets/images/success-tail.png')}
        style={{ position: 'absolute', left: 0, top: -top * scale, width: TAIL.width * scale, height: TAIL.height * scale }}
      />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  slice: {
    position: 'absolute',
    overflow: 'hidden',
  },
  layer: {
    position: 'absolute',
  },
  eye: {
    position: 'absolute',
    overflow: 'hidden',
    borderRadius: 999,
  },
});
