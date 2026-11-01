import { Image } from 'expo-image';
import { router } from 'expo-router';
import { useMemo } from 'react';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { EmptyState } from '@/components/EmptyState';
import { LikeablePetCard } from '@/components/LikeablePetCard';
import { useFavoriteIds } from '@/data/favorites';
import { deckPets } from '@/data/pets';
import { colors, fonts } from '@/theme';

// «Обране» з профілю: просто список тваринок, яким поставили лайк
export default function FavoritesScreen() {
  const insets = useSafeAreaInsets();
  const favoriteIds = useFavoriteIds();
  const pets = useMemo(() => deckPets.filter((pet) => favoriteIds.has(pet.id)), [favoriteIds]);

  if (pets.length === 0) {
    return (
      <EmptyState
        screenTitle="Обране"
        onBack={() => router.back()}
        image={require('../../assets/images/empty-profile.png')}
        imageAspectRatio={698 / 459}
        title="Тут поки порожньо"
        text="Натисни сердечко, свайпни картку вправо або двічі тапни її в каталозі — і тваринка з'явиться тут."
        action={{ title: 'Переглянути тваринок', onPress: () => router.navigate('/animals') }}
      />
    );
  }

  return (
    <View style={styles.screen}>
      <FlatList
        data={pets}
        keyExtractor={(pet) => pet.id}
        renderItem={({ item }) => (
          <LikeablePetCard pet={item} onOpen={() => router.push({ pathname: '/pet/[id]', params: { id: item.id } })} />
        )}
        ListHeaderComponent={
          <View style={styles.titleRow}>
            <Pressable onPress={() => router.back()} hitSlop={10}>
              <Image source={require('../../assets/images/icon-back-plain.svg')} style={styles.back} />
            </Pressable>
            <Text style={styles.screenTitle}>Обране</Text>
            <Text style={styles.count}>{pets.length}</Text>
          </View>
        }
        contentContainerStyle={[styles.list, { paddingTop: insets.top + 13, paddingBottom: insets.bottom + 24 }]}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },
  list: {
    alignItems: 'center',
    gap: 16,
  },
  titleRow: {
    width: 358,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  back: {
    width: 34,
    height: 34,
  },
  screenTitle: {
    flex: 1,
    fontFamily: fonts.headingBold,
    fontSize: 28,
    color: colors.text,
  },
  count: {
    fontFamily: fonts.medium,
    fontSize: 16,
    color: colors.textSecondary,
  },
});
