import { Image } from 'expo-image';
import { router } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { HeartButton } from '@/components/HeartButton';
import { sexIcons, speciesIcons, type Pet } from '@/data/pets';
import { colors, fonts } from '@/theme';

// Картка тваринки для горизонтальних списків на головній
export function PetCard({ pet }: { pet: Pet }) {
  const { profile } = pet;

  return (
    <Pressable style={styles.card} onPress={() => router.push({ pathname: '/pet/[id]', params: { id: profile.id } })}>
      <View style={styles.top}>
        <View style={styles.photoFrame}>
          <Image
            source={profile.photo}
            contentFit={profile.photoStyle ? 'fill' : 'cover'}
            style={profile.photoStyle ?? StyleSheet.absoluteFill}
          />
          <HeartButton
            petId={profile.id}
            icon={require('../../assets/images/icon-heart-card.svg')}
            style={styles.heart}
          />
        </View>
        <View style={styles.nameRow}>
          <Text style={styles.name}>{profile.name}</Text>
          <View style={styles.badges}>
            <Image source={speciesIcons[profile.species]} style={styles.badge} />
            <Image source={sexIcons[profile.sex]} style={styles.badge} />
          </View>
        </View>
      </View>
      <View style={styles.info}>
        <Text style={styles.age}>{profile.age}</Text>
        <Text style={styles.location}>{pet.location}</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    width: 258,
    height: 320,
    padding: 8,
    borderRadius: 20,
    backgroundColor: colors.white,
    gap: 12,
  },
  top: {
    gap: 6,
  },
  photoFrame: {
    height: 180,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: colors.placeholder,
  },
  heart: {
    position: 'absolute',
    top: 6,
    right: 9,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  name: {
    fontFamily: fonts.headingSemiBold,
    fontSize: 24,
    color: colors.text,
  },
  badges: {
    flexDirection: 'row',
    gap: 8,
  },
  badge: {
    width: 28,
    height: 28,
  },
  info: {
    paddingVertical: 4,
    gap: 4,
  },
  age: {
    fontFamily: fonts.regular,
    fontSize: 18,
    color: colors.textSecondary,
  },
  location: {
    fontFamily: fonts.regular,
    fontSize: 16,
    color: colors.textSecondary,
  },
});
