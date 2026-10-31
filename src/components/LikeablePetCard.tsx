import { Image } from 'expo-image';
import { StyleSheet } from 'react-native';
import { GestureDetector, useExclusiveGestures, useTapGesture } from 'react-native-gesture-handler';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSequence,
  withTiming,
} from 'react-native-reanimated';

import { PetDeckCard } from '@/components/PetDeckCard';
import { addFavorite } from '@/data/favorites';
import type { PetProfile } from '@/data/pets';
import { gentleEasing } from '@/theme';

type Props = {
  pet: PetProfile;
  onOpen: () => void;
};

// Картка у списку «Тварин»: один тап відкриває тваринку, подвійний — додає в обране
// і на фото м'яко спалахує велике сердечко (без пружинки), як в Instagram.
export function LikeablePetCard({ pet, onOpen }: Props) {
  const heartOpacity = useSharedValue(0);
  const heartScale = useSharedValue(0.7);

  const like = () => {
    addFavorite(pet.id);
    heartScale.set(0.7);
    heartScale.set(withTiming(1.1, { duration: 700, easing: gentleEasing }));
    heartOpacity.set(
      withSequence(
        withTiming(1, { duration: 220, easing: gentleEasing }),
        withDelay(260, withTiming(0, { duration: 320, easing: gentleEasing })),
      ),
    );
  };

  const doubleTap = useTapGesture({ numberOfTaps: 2, runOnJS: true, onActivate: like });
  // Одинарний тап спрацьовує, лише якщо другого тапу не було
  const singleTap = useTapGesture({ runOnJS: true, onActivate: onOpen });
  const taps = useExclusiveGestures(doubleTap, singleTap);

  const heartStyle = useAnimatedStyle(() => ({
    opacity: heartOpacity.get(),
    transform: [{ scale: heartScale.get() }],
  }));

  return (
    <GestureDetector gesture={taps}>
      <Animated.View>
        <PetDeckCard
          pet={pet}
          photoOverlay={
            <Animated.View style={[styles.heart, heartStyle]} pointerEvents="none">
              <Image source={require('../../assets/images/icon-heart-filled.svg')} style={styles.heartIcon} />
            </Animated.View>
          }
        />
      </Animated.View>
    </GestureDetector>
  );
}

const styles = StyleSheet.create({
  heart: {
    ...StyleSheet.absoluteFill,
    alignItems: 'center',
    justifyContent: 'center',
  },
  heartIcon: {
    width: 140,
    height: 140,
  },
});
