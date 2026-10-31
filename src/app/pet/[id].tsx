import { Image, type ImageSource } from 'expo-image';
import { router, useLocalSearchParams } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useState, type ReactNode } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { HeartButton } from '@/components/HeartButton';
import { PrimaryButton } from '@/components/PrimaryButton';
import { profiles, sexIcons, speciesIcons } from '@/data/pets';
import { colors, fonts } from '@/theme';

// Поки що онлайн-опікунство нікуди не веде
const notReadyYet = () => {};

// У Figma фото займає весь екран, крім нижніх 137 px, а панель заходить на нього на 50 px
const PHOTO_BOTTOM_GAP = 137;
const SHEET_OVERLAP = 50;

export default function PetScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const pet = profiles[id];
  const insets = useSafeAreaInsets();
  const { height } = useWindowDimensions();
  // Висота рядка з ім'ям і значками (уточнюється після першого показу)
  const [nameRowHeight, setNameRowHeight] = useState(55);

  if (!pet) {
    return (
      <View style={[styles.screen, styles.center]}>
        <Text style={styles.text}>Тваринку не знайдено</Text>
      </View>
    );
  }

  const photoHeight = height - PHOTO_BOTTOM_GAP;
  const footerHeight = 16 + 48 + 13 + 48 + insets.bottom;
  // Над кнопками внизу одразу видно «ручку», ім'я та значки; локація ховається під кнопками.
  // Верхній відступ блока (16) + ручка (5) + проміжок (16) + рядок з ім'ям + трохи повітря (6)
  const peekHeight = 16 + 5 + 16 + nameRowHeight + 6;
  const sheetTop = Math.min(photoHeight - SHEET_OVERLAP, height - footerHeight - peekHeight);

  return (
    <View style={styles.screen}>
      <StatusBar style="light" />

      <View style={[styles.photo, { height: photoHeight }]}>
        <Image source={pet.largePhoto ?? pet.photo} contentFit="cover" style={StyleSheet.absoluteFill} />
      </View>

      <ScrollView contentContainerStyle={{ paddingTop: sheetTop }} showsVerticalScrollIndicator={false}>
        {/* Сірий фон панелі тягнеться до самого низу: відступ під кнопки — всередині панелі */}
        <View style={[styles.sheet, { minHeight: height - sheetTop, paddingBottom: footerHeight + 12 }]}>
          {/* Сірий «хвіст» під панеллю — щоб при відтягуванні вгору не проглядало фото */}
          <View style={[styles.sheetTail, { height }]} />
          <View style={[styles.section, styles.headerSection]}>
            <View style={styles.handle} />
            <View style={styles.headerTexts}>
              <View style={styles.nameRow} onLayout={(e) => setNameRowHeight(e.nativeEvent.layout.height)}>
                <Text style={styles.name}>{pet.name}</Text>
                <View style={styles.badges}>
                  <Image source={speciesIcons[pet.species]} style={styles.icon28} />
                  <Image source={sexIcons[pet.sex]} style={styles.icon28} />
                </View>
              </View>
              <View style={styles.locationRow}>
                <Image source={require('../../../assets/images/icon-map-pin.svg')} style={styles.icon24} />
                <Text style={[styles.text, styles.flex]}>
                  м. {pet.city} Притулок “ {pet.shelter} ’’
                </Text>
              </View>
            </View>
          </View>

          {(pet.weight || pet.color) && (
            <Section title="Про тваринку" gap={14}>
              <View style={styles.facts}>
                {pet.weight && <Fact icon={require('../../../assets/images/icon-scale.svg')} text={pet.weight} />}
                <Fact icon={require('../../../assets/images/icon-calendar.svg')} text={pet.age} />
                {pet.color && <Fact icon={require('../../../assets/images/icon-palette.svg')} text={pet.color} />}
              </View>
            </Section>
          )}

          {pet.health && (
            <Section title="Здоров’я" gap={8}>
              <View style={styles.healthList}>
                {pet.health.map((item) => (
                  <View key={item} style={styles.healthRow}>
                    <Image source={require('../../../assets/images/icon-check.svg')} style={styles.icon24} />
                    <Text style={styles.healthText}>{item}</Text>
                  </View>
                ))}
              </View>
            </Section>
          )}

          {pet.story && (
            <Section title="Історія тваринки" gap={9}>
              <Text style={styles.story}>{pet.story}</Text>
            </Section>
          )}
        </View>
      </ScrollView>

      <View style={[styles.topButtons, { top: insets.top + 23 }]}>
        <Pressable onPress={() => router.back()} hitSlop={8}>
          <Image source={require('../../../assets/images/icon-back.svg')} style={styles.icon34} />
        </Pressable>
        <HeartButton petId={pet.id} icon={require('../../../assets/images/icon-heart-detail.svg')} />
      </View>

      <View style={[styles.footer, { paddingBottom: insets.bottom }]}>
        <Pressable style={({ pressed }) => [styles.outlineButton, pressed && { opacity: 0.85 }]} onPress={notReadyYet}>
          <Text style={styles.outlineButtonText}>Стати онлайн опікуном</Text>
        </Pressable>
        <PrimaryButton
          title="Подати заявку на усиновлення"
          onPress={() => router.push({ pathname: '/adopt/[id]', params: { id: pet.id } })}
        />
      </View>
    </View>
  );
}

function Section({ title, gap, children }: { title: string; gap: number; children: ReactNode }) {
  return (
    <View style={[styles.section, { gap }]}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {children}
    </View>
  );
}

function Fact({ icon, text }: { icon: ImageSource; text: string }) {
  return (
    <View style={styles.fact}>
      <Image source={icon} style={styles.icon24} />
      <Text style={styles.text}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.detailBackground,
  },
  center: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  flex: {
    flex: 1,
  },
  photo: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: colors.photoPlaceholder,
  },
  sheet: {
    backgroundColor: colors.detailBackground,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    gap: 12,
  },
  sheetTail: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: '100%',
    backgroundColor: colors.detailBackground,
  },
  section: {
    padding: 16,
    borderRadius: 16,
    backgroundColor: colors.white,
  },
  headerSection: {
    alignItems: 'center',
    gap: 16,
  },
  handle: {
    width: 80,
    height: 5,
    borderRadius: 20,
    backgroundColor: colors.handle,
  },
  headerTexts: {
    alignSelf: 'stretch',
    gap: 8,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  name: {
    fontFamily: fonts.headingSemiBold,
    fontSize: 40,
    color: colors.text,
  },
  badges: {
    flexDirection: 'row',
    gap: 8,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  sectionTitle: {
    fontFamily: fonts.medium,
    fontSize: 20,
    color: colors.text,
  },
  text: {
    fontFamily: fonts.regular,
    fontSize: 16,
    color: colors.text,
  },
  facts: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 36,
  },
  fact: {
    width: 95,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  healthList: {
    gap: 4,
  },
  healthRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  healthText: {
    fontFamily: fonts.regular,
    fontSize: 16,
    lineHeight: 20,
    color: colors.healthText,
  },
  story: {
    fontFamily: fonts.regular,
    fontSize: 16,
    lineHeight: 20,
    color: colors.textSecondary,
  },
  topButtons: {
    position: 'absolute',
    left: 16,
    right: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  footer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    paddingTop: 16,
    paddingHorizontal: 16,
    gap: 13,
    borderRadius: 16,
    backgroundColor: colors.white,
  },
  outlineButton: {
    height: 48,
    borderRadius: 40,
    borderWidth: 1.5,
    borderColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.white,
  },
  outlineButtonText: {
    fontFamily: fonts.medium,
    fontSize: 18,
    color: colors.primary,
  },
  icon24: {
    width: 24,
    height: 24,
  },
  icon28: {
    width: 28,
    height: 28,
  },
  icon34: {
    width: 34,
    height: 34,
  },
});
