import { Image } from 'expo-image';
import { router, useLocalSearchParams } from 'expo-router';
import { useMemo } from 'react';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { LikeablePetCard } from '@/components/LikeablePetCard';
import { deckPets } from '@/data/pets';
import { matchPets, TRAITS, type Trait } from '@/data/traits';
import { colors, fonts } from '@/theme';

// Результат підбору: список тваринок, що підходять під обрані риси
export default function MatchScreen() {
  const insets = useSafeAreaInsets();
  const { traits = '' } = useLocalSearchParams<{ traits?: string }>();
  const selected = useMemo(() => traits.split(',').filter(Boolean) as Trait[], [traits]);
  const pets = useMemo(() => matchPets(deckPets, selected), [selected]);
  const labels = TRAITS.filter((t) => selected.includes(t.key)).map((t) => t.label);

  return (
    <View style={styles.screen}>
      <FlatList
        data={pets}
        keyExtractor={(pet) => pet.id}
        renderItem={({ item }) => (
          <LikeablePetCard pet={item} onOpen={() => router.push({ pathname: '/pet/[id]', params: { id: item.id } })} />
        )}
        ListHeaderComponent={
          <View style={styles.header}>
            <View style={styles.titleRow}>
              <Pressable onPress={() => router.back()} hitSlop={10}>
                <Image source={require('../../assets/images/icon-back-plain.svg')} style={styles.back} />
              </Pressable>
              <Text style={styles.screenTitle}>Підібрано для тебе</Text>
            </View>
            <View style={styles.tags}>
              {labels.map((label) => (
                <View key={label} style={styles.tag}>
                  <Text style={styles.tagText}>{label}</Text>
                </View>
              ))}
            </View>
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
  header: {
    width: 358,
    gap: 12,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  back: {
    width: 34,
    height: 34,
  },
  screenTitle: {
    fontFamily: fonts.headingBold,
    fontSize: 26,
    color: colors.text,
  },
  tags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  tag: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 14,
    backgroundColor: colors.chip,
  },
  tagText: {
    fontFamily: fonts.medium,
    fontSize: 13,
    color: colors.chipText,
  },
});
