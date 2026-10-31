import { Image } from 'expo-image';
import type { ReactNode } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { HeartButton } from '@/components/HeartButton';
import { sexIcons, speciesIcons, type PetProfile } from '@/data/pets';
import { colors, fonts } from '@/theme';

type Props = {
  pet: PetProfile;
  // Без onPress картка не реагує на дотик сама — тоді дотики обробляє обгортка (наприклад, подвійний тап)
  onPress?: () => void;
  // Щось поверх фото, наприклад сердечко після подвійного тапу
  photoOverlay?: ReactNode;
};

// Велика картка тваринки у розділі «Тварини»
export function PetDeckCard({ pet, onPress, photoOverlay }: Props) {
  return (
    <Pressable style={styles.card} onPress={onPress} disabled={!onPress}>
      <View style={styles.photoFrame}>
        <Image
          source={pet.cardPhoto ?? pet.photo}
          contentFit="cover"
          style={pet.cardPhotoStyle ?? StyleSheet.absoluteFill}
        />
        <HeartButton petId={pet.id} icon={require('../../assets/images/icon-heart-deck.svg')} style={styles.heart} />
        <View style={styles.overlay}>
          <View style={styles.locationChip}>
            <Image source={require('../../assets/images/icon-map-pin-white.svg')} style={styles.icon24} />
            <Text style={styles.locationText}>{pet.city}</Text>
          </View>
          <Text style={styles.name}>{pet.name}</Text>
        </View>
        {photoOverlay}
      </View>
      <View style={styles.info}>
        <View style={styles.tags}>
          <View style={styles.ageChip}>
            <Text style={styles.ageText}>{pet.age}</Text>
          </View>
          <Image source={speciesIcons[pet.species]} style={styles.icon28} />
          <Image source={sexIcons[pet.sex]} style={styles.icon28} />
        </View>
        <Text style={styles.shelter}>Притулок “ {pet.shelter} ’’</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    width: 358,
    padding: 16,
    gap: 16,
    borderRadius: 20,
    backgroundColor: colors.white,
  },
  photoFrame: {
    height: 400,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: colors.placeholder,
  },
  heart: {
    position: 'absolute',
    top: 15,
    right: 20,
  },
  overlay: {
    position: 'absolute',
    left: 18,
    bottom: 12,
    right: 20,
    alignItems: 'flex-start',
  },
  locationChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 20,
    backgroundColor: colors.locationChip,
  },
  locationText: {
    fontFamily: fonts.regular,
    fontSize: 16,
    color: colors.white,
  },
  name: {
    fontFamily: fonts.extraBold,
    fontSize: 48,
    color: colors.white,
  },
  info: {
    minHeight: 86,
    gap: 8,
  },
  tags: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  ageChip: {
    height: 28,
    paddingHorizontal: 8,
    borderRadius: 20,
    justifyContent: 'center',
    backgroundColor: colors.chip,
  },
  ageText: {
    fontFamily: fonts.regular,
    fontSize: 18,
    color: colors.chipText,
  },
  shelter: {
    fontFamily: fonts.regular,
    fontSize: 20,
    color: colors.shelterText,
  },
  icon24: {
    width: 24,
    height: 24,
  },
  icon28: {
    width: 28,
    height: 28,
  },
});
