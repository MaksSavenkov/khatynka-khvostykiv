import { Image } from 'expo-image';
import { router } from 'expo-router';
import { Linking, Platform, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { EmptyState } from '@/components/EmptyState';
import { AppHeader } from '@/components/AppHeader';
import { TAB_BAR_HEIGHT } from '@/components/TabBar';
import { useCity } from '@/data/city';
import { SHELTERS, type Shelter } from '@/data/shelters';
import { colors, fonts, gentleEasing } from '@/theme';

// Поява карток одна за одною — м'яко, без стрибків
const appear = (index: number) =>
  FadeInDown.delay(80 * index)
    .duration(450)
    .easing(gentleEasing);

// Притулки обраного міста; якщо в місті ще немає притулків — порожній екран
export default function SheltersScreen() {
  const insets = useSafeAreaInsets();
  const city = useCity();
  const shelters = SHELTERS.filter((s) => s.forCity === city);

  if (shelters.length === 0) {
    return (
      <EmptyState
        header={<AppHeader />}
        image={require('../../../assets/images/empty-shelters.png')}
        imageAspectRatio={971 / 659}
        title={`У місті ${city} ще немає притулків`}
        text="Ми вже домовляємося з притулками твого міста. А поки можна обрати інше місто або познайомитися з тваринками."
        action={{ title: 'Змінити місто', onPress: () => router.push('/city') }}
      />
    );
  }

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={[
        styles.content,
        { paddingTop: insets.top + 13, paddingBottom: insets.bottom + TAB_BAR_HEIGHT + 28 },
      ]}
      showsVerticalScrollIndicator={false}
    >
      {/* Той самий верхній рядок, що й на головній: профіль, місто, сповіщення */}
      <AppHeader />

      {/* key — щоб при зміні міста картки знову м'яко з'являлися */}
      {shelters.map((shelter, i) => (
        <Animated.View key={`${city}-${shelter.id}`} entering={appear(i)}>
          <ShelterCard shelter={shelter} />
        </Animated.View>
      ))}
    </ScrollView>
  );
}

// Відкриває справжню карту з притулком: «Карти» на iPhone, Google Maps на Android і в браузері
function openInMaps(shelter: Shelter) {
  const q = encodeURIComponent(shelter.mapQuery);
  const url = Platform.select({
    ios: `http://maps.apple.com/?q=${q}`,
    android: `geo:0,0?q=${q}`,
    default: `https://www.google.com/maps/search/?api=1&query=${q}`,
  });
  Linking.openURL(url);
}

// Натиск на картку відкриває притулок на карті
function ShelterCard({ shelter }: { shelter: Shelter }) {
  return (
    <Pressable onPress={() => openInMaps(shelter)} style={({ pressed }) => [styles.card, pressed && { opacity: 0.9 }]}>
      <View style={styles.logoBox}>
        {shelter.logo && (
          <Image
            source={shelter.logo}
            contentFit="contain"
            style={[styles.logo, { aspectRatio: shelter.logoAspectRatio }]}
          />
        )}
      </View>

      <View style={styles.texts}>
        <Text style={styles.name}>{shelter.name}</Text>
        <View style={styles.placeRow}>
          <Image source={require('../../../assets/images/pi-pin.svg')} style={styles.pin} />
          <Text style={styles.place}>
            {shelter.city}
            {shelter.address ? `, ${shelter.address}` : ''}
          </Text>
        </View>
        <Text style={styles.about}>{shelter.about}</Text>
        <Text style={styles.mapLink}>Показати на карті →</Text>
      </View>

      <Pressable
        onPress={() => router.navigate('/animals')}
        style={({ pressed }) => [styles.button, pressed && { opacity: 0.85 }]}
      >
        <Text style={styles.buttonText}>Тваринки притулку</Text>
      </Pressable>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    paddingHorizontal: 16,
    gap: 16,
  },
  card: {
    padding: 16,
    gap: 14,
    borderRadius: 20,
    backgroundColor: colors.white,
  },
  logoBox: {
    height: 96,
    borderRadius: 16,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    height: 72,
    maxWidth: '85%',
  },
  texts: {
    gap: 6,
  },
  name: {
    fontFamily: fonts.headingBold,
    fontSize: 20,
    color: colors.text,
  },
  placeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  pin: {
    width: 16,
    height: 16,
    opacity: 0.6,
  },
  place: {
    flex: 1,
    fontFamily: fonts.regular,
    fontSize: 14,
    color: colors.textSecondary,
  },
  about: {
    fontFamily: fonts.regular,
    fontSize: 15,
    lineHeight: 21,
    color: colors.healthText,
  },
  mapLink: {
    marginTop: 2,
    fontFamily: fonts.medium,
    fontSize: 14,
    color: colors.primary,
  },
  button: {
    height: 44,
    borderRadius: 40,
    borderWidth: 1.5,
    borderColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    fontFamily: fonts.medium,
    fontSize: 16,
    color: colors.primary,
  },
});
