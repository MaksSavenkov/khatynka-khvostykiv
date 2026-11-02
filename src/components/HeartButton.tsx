import { Image, type ImageSource } from 'expo-image';
import { useEffect } from 'react';
import { Pressable, StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';

import { toggleFavorite, useIsFavorite } from '@/data/favorites';
import { smoothEasing } from '@/theme';

type Props = {
  petId: string;
  // Неактивне сердечко: сірий контур (у кожного екрана своя версія)
  icon: ImageSource;
  style?: StyleProp<ViewStyle>;
};

const SIZE = 34;

// Кнопка «вподобати»: насичена теракота плавно «наливається» в сердечко з центру — без стрибків
export function HeartButton({ petId, icon, style }: Props) {
  const liked = useIsFavorite(petId);
  const fill = useSharedValue(liked ? 1 : 0);

  useEffect(() => {
    fill.set(withTiming(liked ? 1 : 0, { duration: liked ? 360 : 240, easing: smoothEasing }));
  }, [liked, fill]);

  const fillStyle = useAnimatedStyle(() => ({
    opacity: fill.get(),
    transform: [{ scale: 0.6 + 0.4 * fill.get() }],
  }));

  return (
    <Pressable
      onPress={(e) => {
        // Лайк не повинен заодно відкривати картку, на якій лежить сердечко
        e.stopPropagation();
        toggleFavorite(petId);
      }}
      hitSlop={8}
      style={style}
    >
      <View style={styles.button}>
        <Image source={icon} style={styles.icon} />
        <Animated.View style={[StyleSheet.absoluteFill, fillStyle]}>
          <Image source={require('../../assets/images/icon-heart-filled.svg')} style={styles.icon} />
        </Animated.View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    width: SIZE,
    height: SIZE,
  },
  icon: {
    width: SIZE,
    height: SIZE,
  },
});
