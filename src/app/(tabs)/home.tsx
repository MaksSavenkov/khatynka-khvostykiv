import { Image, type ImageSource } from 'expo-image';
import { router } from 'expo-router';
import { useState, type ReactNode } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View, type ImageStyle } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { LocationPill } from '@/components/LocationPill';
import { PetCard } from '@/components/PetCard';
import { PrimaryButton } from '@/components/PrimaryButton';
import { TAB_BAR_HEIGHT } from '@/components/TabBar';
import { homelessPets, nearbyPets, type Pet } from '@/data/pets';
import { SHELTERS, type Shelter } from '@/data/shelters';
import { colors, fonts } from '@/theme';

// Поки що кнопки на головній нікуди не ведуть — додамо на наступних етапах
const notReadyYet = () => {};

type HelpOption = {
  title: string;
  description: string;
  image: ImageSource;
  // Розташування малюнка в рамці 128×120, як у Figma
  imageStyle: ImageStyle;
};

const HELP_OPTIONS: HelpOption[] = [
  {
    title: 'Донат притулку',
    description: 'Кожен внесок\nзмінює життя',
    image: require('../../../assets/images/help-donate.png'),
    imageStyle: { left: -9.5, top: 10, width: 148, height: 99 },
  },
  {
    title: 'Онлайн опікун',
    description: 'Підтримай тваринку\nна відстані',
    image: require('../../../assets/images/help-guardian.png'),
    imageStyle: { left: -9.5, top: 10, width: 148, height: 99 },
  },
  {
    title: 'Потрібні речі',
    description: 'Поділися тим, що\nподарує затишок',
    image: require('../../../assets/images/help-things.png'),
    imageStyle: { left: 4, top: 19, width: 119, height: 82 },
  },
  {
    title: 'Перетримка',
    description: 'Подаруй тваринці тимчасовий дім',
    image: require('../../../assets/images/help-foster.png'),
    imageStyle: { left: -15.5, top: 6, width: 160, height: 107 },
  },
];

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  // Висота плаваючого верху — щоб контент починався під ним
  const [headerHeight, setHeaderHeight] = useState(insets.top + 61);

  return (
    <View style={styles.screen}>
      <ScrollView
        contentContainerStyle={[
          styles.content,
          { paddingTop: headerHeight + 20, paddingBottom: insets.bottom + TAB_BAR_HEIGHT + 28 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <Card style={styles.findCard}>
          <View style={styles.cardTexts}>
            <Text style={styles.cardTitle}>Знайди свого хвостика</Text>
            <Text style={styles.cardSubtitle}>Обери варіанти та знайди свого пухнастого друга.</Text>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chips}>
            <Chip icon={require('../../../assets/images/icon-footprints.svg')} label="Завжди в русі" />
            <Chip icon={require('../../../assets/images/icon-coffee.svg')} label="Повільні ранки" />
            <Chip icon={require('../../../assets/images/icon-zap.svg')} label="Готовий до хаосу" />
          </ScrollView>
          <PrimaryButton title="Підібрати тваринку" onPress={notReadyYet} />
        </Card>

        <PetSection title="Вони шукають дім" pets={homelessPets} />

        <Card style={styles.helpCard}>
          <View style={styles.cardTexts}>
            <Text style={styles.cardTitle}>Хочеш допомогти ?</Text>
            <Text style={styles.cardSubtitle}>Обирай свій спосіб подарувати тваринкам турботу і тепло.</Text>
          </View>
          <View style={styles.helpGrid}>
            {[HELP_OPTIONS.slice(0, 2), HELP_OPTIONS.slice(2)].map((row, i) => (
              <View key={i} style={styles.helpRow}>
                {row.map((option) => (
                  <HelpTile key={option.title} option={option} />
                ))}
              </View>
            ))}
          </View>
          <PrimaryButton title="Домогти притулкам" onPress={notReadyYet} />
        </Card>

        <View style={styles.shelters}>
          <Text style={[styles.sectionTitle, styles.centered]}>Притулки яким ми довіряємо</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.shelterScroll}
            contentContainerStyle={styles.shelterRow}
          >
            {SHELTERS.map((shelter) => (
              <ShelterCard key={shelter.id} shelter={shelter} />
            ))}
          </ScrollView>
        </View>

        <Card style={styles.adoptionCard}>
          <View style={styles.adoptionImageFrame}>
            <Image
              source={require('../../../assets/images/adoption-banner.png')}
              contentFit="cover"
              style={StyleSheet.absoluteFill}
            />
          </View>
          <View style={styles.cardTexts}>
            <Text style={styles.cardTitle}>Готовий до усиновлення ?</Text>
            <Text style={styles.cardSubtitle}>Дізнайся, як підготуватися до появи тваринки у своєму житті.</Text>
          </View>
          <PrimaryButton title="Дізнатися більше" onPress={notReadyYet} />
        </Card>

        <PetSection title="Тваринки поруч" pets={nearbyPets} />
      </ScrollView>

      {/* Верх висить над сторінкою, як нижнє меню: контент прокручується під ним */}
      <View
        style={[styles.floatingTop, { paddingTop: insets.top + 13 }]}
        onLayout={(e) => setHeaderHeight(e.nativeEvent.layout.height)}
        pointerEvents="box-none"
      >
        <Header />
      </View>
    </View>
  );
}

function Header() {
  return (
    <View style={styles.header}>
      {/* Фото профілю веде на сторінку профілю */}
      <Pressable
        style={({ pressed }) => [styles.avatar, pressed && { opacity: 0.7 }]}
        onPress={() => router.push('/profile')}
        hitSlop={6}
      >
        <Image
          source={require('../../../assets/images/avatar.png')}
          contentFit="fill"
          style={{
            position: 'absolute',
            left: '-25%',
            top: '-0.74%',
            width: '147.98%',
            height: '184.07%',
          }}
        />
      </Pressable>
      <LocationPill />
      {/* Дзвіночок відкриває сповіщення; сірий кружечок — скільки їх непрочитаних (поки нуль) */}
      <Pressable
        onPress={() => router.push('/notifications')}
        hitSlop={6}
        style={({ pressed }) => pressed && { opacity: 0.7 }}
      >
        <Image source={require('../../../assets/images/icon-bell.svg')} style={styles.icon48} />
        <View style={styles.badge}>
          <Text style={styles.badgeText}>0</Text>
        </View>
      </Pressable>
    </View>
  );
}

// Картка притулку: логотип, назва й місто. Без логотипа — кружечок з першою літерою.
function ShelterCard({ shelter }: { shelter: Shelter }) {
  return (
    <View style={styles.shelterCard}>
      <View style={styles.shelterLogoBox}>
        {shelter.logo ? (
          <Image
            source={shelter.logo}
            contentFit="contain"
            style={[styles.shelterLogo, { aspectRatio: shelter.logoAspectRatio }]}
          />
        ) : (
          <View style={styles.shelterMonogram}>
            <Text style={styles.shelterMonogramText}>{shelter.name[0]}</Text>
          </View>
        )}
      </View>
      <View style={styles.shelterTexts}>
        <Text style={styles.shelterName} numberOfLines={2}>
          {shelter.name}
        </Text>
        <Text style={styles.shelterCity}>{shelter.city}</Text>
      </View>
    </View>
  );
}

function Card({ children, style }: { children: ReactNode; style?: object }) {
  return <View style={[styles.card, style]}>{children}</View>;
}

function Chip({ icon, label }: { icon: ImageSource; label: string }) {
  return (
    <Pressable style={styles.chip} onPress={notReadyYet}>
      <Image source={icon} style={styles.icon24} />
      <Text style={styles.chipLabel}>{label}</Text>
    </Pressable>
  );
}

function PetSection({ title, pets }: { title: string; pets: Pet[] }) {
  return (
    <View style={styles.petSection}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>{title}</Text>
        <Pressable
          style={({ pressed }) => [styles.seeAll, pressed && { opacity: 0.6 }]}
          onPress={() => router.navigate('/animals')}
          hitSlop={8}
        >
          <Text style={styles.seeAllText}>Всі</Text>
          <Image source={require('../../../assets/images/icon-arrow-right.svg')} style={styles.icon24} />
        </Pressable>
      </View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.petList}>
        {pets.map((pet) => (
          <PetCard key={pet.key} pet={pet} />
        ))}
      </ScrollView>
    </View>
  );
}

function HelpTile({ option }: { option: HelpOption }) {
  return (
    <Pressable style={styles.helpTile} onPress={notReadyYet}>
      <View style={styles.helpImageFrame}>
        <Image source={option.image} contentFit="cover" style={[{ position: 'absolute' }, option.imageStyle]} />
      </View>
      <View style={styles.helpTexts}>
        <Text style={styles.helpTitle}>{option.title}</Text>
        <Text style={styles.helpDescription}>{option.description}</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },
  floatingTop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 16,
    gap: 20,
  },
  content: {
    gap: 28,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 40,
    overflow: 'hidden',
    backgroundColor: colors.placeholder,
  },
  icon24: {
    width: 24,
    height: 24,
  },
  icon48: {
    width: 48,
    height: 48,
  },
  // Лічильник на дзвіночку там, де раніше була крапка
  badge: {
    position: 'absolute',
    top: 8,
    right: 8,
    minWidth: 16,
    height: 16,
    paddingHorizontal: 4,
    borderRadius: 8,
    backgroundColor: colors.placeholder,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeText: {
    fontFamily: fonts.medium,
    fontSize: 10,
    lineHeight: 12,
    color: colors.white,
  },
  card: {
    marginHorizontal: 16,
    borderRadius: 20,
    backgroundColor: colors.white,
    gap: 14,
  },
  findCard: {
    padding: 12,
    overflow: 'hidden',
  },
  helpCard: {
    paddingHorizontal: 12,
    paddingVertical: 20,
  },
  adoptionCard: {
    padding: 12,
  },
  cardTexts: {
    gap: 12,
  },
  cardTitle: {
    fontFamily: fonts.headingBold,
    fontSize: 20,
    color: colors.text,
    textAlign: 'center',
  },
  cardSubtitle: {
    fontFamily: fonts.regular,
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  chips: {
    gap: 8,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    padding: 20,
    borderRadius: 16,
    backgroundColor: colors.chip,
  },
  chipLabel: {
    fontFamily: fonts.medium,
    fontSize: 16,
    color: colors.chipText,
  },
  petSection: {
    gap: 16,
  },
  sectionHeader: {
    marginLeft: 16,
    marginRight: 24,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  sectionTitle: {
    fontFamily: fonts.headingBold,
    fontSize: 20,
    color: colors.text,
  },
  centered: {
    textAlign: 'center',
  },
  seeAll: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  seeAllText: {
    fontFamily: fonts.medium,
    fontSize: 15,
    color: colors.primary,
  },
  petList: {
    paddingHorizontal: 16,
    gap: 12,
  },
  helpGrid: {
    gap: 8,
  },
  helpRow: {
    flexDirection: 'row',
    gap: 8,
  },
  helpTile: {
    flex: 1,
    height: 208,
    paddingVertical: 12,
    borderRadius: 16,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  helpImageFrame: {
    width: 128,
    height: 120,
    overflow: 'hidden',
    backgroundColor: colors.white,
  },
  helpTexts: {
    alignSelf: 'stretch',
    alignItems: 'center',
    gap: 4,
  },
  helpTitle: {
    fontFamily: fonts.headingSemiBold,
    fontSize: 16,
    color: colors.text,
    textAlign: 'center',
  },
  helpDescription: {
    fontFamily: fonts.regular,
    fontSize: 12,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  shelters: {
    gap: 16,
    alignItems: 'center',
    overflow: 'hidden',
  },
  shelterScroll: {
    alignSelf: 'stretch',
  },
  shelterRow: {
    paddingHorizontal: 16,
    gap: 12,
  },
  shelterCard: {
    width: 200,
    height: 148,
    padding: 12,
    borderRadius: 16,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  shelterLogoBox: {
    height: 56,
    alignSelf: 'stretch',
    alignItems: 'center',
    justifyContent: 'center',
  },
  shelterLogo: {
    height: 56,
    maxWidth: '100%',
  },
  shelterMonogram: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.chip,
    alignItems: 'center',
    justifyContent: 'center',
  },
  shelterMonogramText: {
    fontFamily: fonts.headingBold,
    fontSize: 26,
    color: colors.chipText,
  },
  shelterTexts: {
    alignItems: 'center',
    gap: 2,
  },
  shelterName: {
    fontFamily: fonts.medium,
    fontSize: 13,
    color: colors.text,
    textAlign: 'center',
  },
  shelterCity: {
    fontFamily: fonts.regular,
    fontSize: 12,
    color: colors.textSecondary,
  },
  adoptionImageFrame: {
    height: 220,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: colors.imagePlaceholder,
  },
});
