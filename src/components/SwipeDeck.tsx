import { Image } from 'expo-image';
import { useState } from 'react';
import { StyleSheet, useWindowDimensions, View } from 'react-native';
import { GestureDetector, usePanGesture } from 'react-native-gesture-handler';
import Animated, {
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSequence,
  withSpring,
  withTiming,
  type SharedValue,
} from 'react-native-reanimated';
import { scheduleOnRN } from 'react-native-worklets';

import { PetDeckCard } from '@/components/PetDeckCard';
import { addFavorite } from '@/data/favorites';
import type { PetProfile } from '@/data/pets';
import { colors, gentleEasing } from '@/theme';

// На скільки пікселів треба потягнути картку (або як швидко кинути), щоб перегорнути її
const SWIPE_DISTANCE = 110;
const SWIPE_VELOCITY = 800;

type Props = {
  pets: PetProfile[];
  onOpen: (pet: PetProfile) => void;
};

// Місце картки в колоді відносно верхньої: 0 — верхня, 1 — наступна, count - 1 — попередня
function offsetOf(cardIndex: number, position: number, count: number) {
  'worklet';
  return (((cardIndex - position) % count) + count) % count;
}

// Колода карток: свайп вліво — просто наступна тваринка,
// вправо — тваринка додається в обране (з'являється сердечко) і теж показується наступна.
// Усі картки створюються один раз і лише міняються місцями, тож фото не перезавантажуються
// і нічого не блимає. Яка картка зверху, вирішується прямо в анімації, в тому ж кадрі,
// що й повернення картки на місце.
export function SwipeDeck({ pets, onOpen }: Props) {
  const { width } = useWindowDimensions();
  const count = pets.length;
  const canSwipe = count > 1;

  // Номер верхньої картки (може рости без кінця — рахуємо по колу)
  const position = useSharedValue(0);
  // Куди зараз тягнуть верхню картку (від'ємне — вліво)
  const translateX = useSharedValue(0);
  // Велике сердечко над колодою після свайпу вправо
  const heartOpacity = useSharedValue(0);
  const heartScale = useSharedValue(0.7);
  // Те саме для React: лише верхню картку можна натиснути
  const [top, setTop] = useState(0);

  const likePet = (index: number) => addFavorite(pets[index].id);

  const pan = usePanGesture({
    enabled: canSwipe,
    activeOffsetX: [-10, 10],
    failOffsetY: [-15, 15],
    onUpdate: (e) => {
      'worklet';
      translateX.set(e.translationX);
    },
    onDeactivate: (e) => {
      'worklet';
      const flung = Math.abs(e.translationX) > SWIPE_DISTANCE || Math.abs(e.velocityX) > SWIPE_VELOCITY;
      if (!flung) {
        translateX.set(withSpring(0, { damping: 18, stiffness: 180 }));
        return;
      }
      const direction = Math.sign(e.velocityX || e.translationX) || -1;
      if (direction > 0) {
        // Вподобали: додаємо в обране й м'яко показуємо велике сердечко, без пружинки
        scheduleOnRN(likePet, offsetOf(position.get(), 0, count));
        heartScale.set(0.7);
        heartScale.set(withTiming(1.1, { duration: 700, easing: gentleEasing }));
        heartOpacity.set(
          withSequence(
            withTiming(1, { duration: 220, easing: gentleEasing }),
            withDelay(260, withTiming(0, { duration: 320, easing: gentleEasing })),
          ),
        );
      }
      translateX.set(
        withTiming(direction * width * 1.5, { duration: 260 }, (finished) => {
          if (!finished) return;
          // В обидва боки показуємо наступну тваринку
          const next = position.get() + 1;
          position.set(next);
          translateX.set(0);
          scheduleOnRN(setTop, next);
        }),
      );
    },
  });

  const heartStyle = useAnimatedStyle(() => ({
    opacity: heartOpacity.get(),
    transform: [{ scale: heartScale.get() }],
  }));

  return (
    <GestureDetector gesture={pan}>
      <View style={styles.deck}>
        <View style={styles.backCard} />
        {pets.map((pet, i) => (
          <DeckCard
            key={pet.id}
            pet={pet}
            cardIndex={i}
            count={count}
            position={position}
            translateX={translateX}
            isTop={offsetOf(i, top, count) === 0}
            onOpen={onOpen}
          />
        ))}
        <Animated.View style={[styles.bigHeart, heartStyle]} pointerEvents="none">
          <Image source={require('../../assets/images/icon-heart-filled.svg')} style={styles.bigHeartIcon} />
        </Animated.View>
      </View>
    </GestureDetector>
  );
}

type DeckCardProps = {
  pet: PetProfile;
  cardIndex: number;
  count: number;
  position: SharedValue<number>;
  translateX: SharedValue<number>;
  isTop: boolean;
  onOpen: (pet: PetProfile) => void;
};

function DeckCard({ pet, cardIndex, count, position, translateX, isTop, onOpen }: DeckCardProps) {
  const { width } = useWindowDimensions();

  const style = useAnimatedStyle(() => {
    const offset = offsetOf(cardIndex, position.get(), count);
    const x = translateX.get();

    if (offset === 0) {
      return {
        zIndex: 3,
        opacity: 1,
        transform: [
          { translateX: x },
          { rotate: `${interpolate(x, [-width, 0, width], [-13, -1, 11])}deg` },
          { scale: 1 },
        ],
      };
    }

    // Під верхньою видно наступну (свайп у будь-який бік веде до неї).
    // Вона поступово «підіймається»: випрямляється й збільшується.
    const visible = offset === 1;
    const progress = Math.min(Math.abs(x) / SWIPE_DISTANCE, 1);
    return {
      zIndex: visible ? 2 : 1,
      opacity: visible ? 1 : 0,
      transform: [
        { translateX: 0 },
        { rotate: `${interpolate(progress, [0, 1], [2, -1])}deg` },
        { scale: interpolate(progress, [0, 1], [0.95, 1]) },
      ],
    };
  });

  // Поки верхню картку тягнуть вправо, на ній проступає сердечко — підказка «вподобати»
  const hintStyle = useAnimatedStyle(() => {
    const isTopNow = offsetOf(cardIndex, position.get(), count) === 0;
    const x = translateX.get();
    return {
      opacity: isTopNow ? interpolate(x, [0, SWIPE_DISTANCE], [0, 1], 'clamp') : 0,
      transform: [{ scale: interpolate(x, [0, SWIPE_DISTANCE], [0.8, 1], 'clamp') }],
    };
  });

  return (
    <Animated.View style={[styles.layer, style]} pointerEvents={isTop ? 'auto' : 'none'}>
      <PetDeckCard pet={pet} onPress={() => onOpen(pet)} />
      <Animated.View style={[styles.hint, hintStyle]} pointerEvents="none">
        <Image source={require('../../assets/images/icon-heart-filled.svg')} style={styles.hintIcon} />
      </Animated.View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  deck: {
    alignItems: 'center',
    height: 534,
  },
  layer: {
    position: 'absolute',
    top: 0,
  },
  // Підказка на картці: біле коло з сердечком у лівому верхньому куті
  hint: {
    position: 'absolute',
    top: 20,
    left: 20,
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  hintIcon: {
    width: 56,
    height: 56,
  },
  // Велике сердечко по центру колоди після свайпу вправо
  bigHeart: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bigHeartIcon: {
    width: 150,
    height: 150,
  },
  backCard: {
    position: 'absolute',
    top: 0,
    width: 358,
    height: 534,
    borderRadius: 20,
    backgroundColor: colors.deckBack,
    transform: [{ rotate: '-2.5deg' }],
  },
});
